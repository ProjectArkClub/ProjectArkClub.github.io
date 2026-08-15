/* ProjectArk 首页 Hero 互动点阵 —— 借鉴 DeepSeek 官网 hero 背景(2026-08 分析落地)
   - 90px 网格点 + 弹簧回位 + 鼠标斥力 + 近邻连线
   - 30fps 节流 / DPR≤2 / 离屏暂停 / 静止自动停帧 */
(function () {
  'use strict';

  var canvas = document.querySelector('.hero-field');
  if (!canvas || !canvas.getContext) return;
  /* 注:不再因 touch/粗指针退出——远程桌面(如向日葵)常报告 coarse pointer,
     会导致点阵完全不渲染;触屏设备只是不跟手,图案照常显示(DS 同策略) */

  var ctx = canvas.getContext('2d');
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var SPACING = 90, RADIUS = 150, FRAME = 1000 / 30;
  var W = 0, H = 0, cols = 0;
  var points = [], mouse = { x: -9999, y: -9999 };
  var running = false, raf = 0, last = 0, rto = 0;

  function rebuild() {
    W = canvas.clientWidth; H = canvas.clientHeight;
    if (!W || !H) return;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cols = Math.ceil(W / SPACING) + 1;
    var rows = Math.ceil(H / SPACING) + 1;
    var ox = (W - (cols - 1) * SPACING) / 2;
    var oy = 68;   /* 导航下侧"第二行"的位置：窗口顶 8px → 导航胶囊(8~60) → 8px → y=68；
                      上一行(y=-22)在屏幕外，只贡献穿过导航区域的竖线 */
    points = [];
    /* r=-1 为屏幕外的"第一行"：其横线与点均在屏幕外不可见，
       但它与下一行(导航下侧的"第二行")之间的竖线穿过导航区域 —— 对齐 DS 网格视觉 */
    for (var r = -1; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        var x = ox + c * SPACING, y = oy + r * SPACING;
        points.push({ rx: x, ry: y, x: x, y: y, vx: 0, vy: 0 });
      }
    }
  }

  function line(a, b) {
    var dx = b.x - a.x, dy = b.y - a.y;
    var d = Math.sqrt(dx * dx + dy * dy);
    if (d < 20) return;                     /* 间距过小断开(点挤在一起时不连线) */
    var ux = dx / d, uy = dy / d;
    ctx.beginPath();
    ctx.moveTo(a.x + 10 * ux, a.y + 10 * uy);   /* 端点各内缩 10px,不压住圆点 */
    ctx.lineTo(b.x - 10 * ux, b.y - 10 * uy);
    ctx.stroke();
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    /* 近邻连线(仅上下左右邻居) */
    ctx.strokeStyle = 'rgba(79, 157, 255, 0.12)';
    ctx.lineWidth = 0.5;
    for (var i = 0; i < points.length; i++) {
      var c = i % cols;
      if (c < cols - 1) line(points[i], points[i + 1]);
      if (i + cols < points.length) line(points[i], points[i + cols]);
    }

    /* 点:离鼠标越近越大越亮 */
    ctx.fillStyle = 'rgba(79, 157, 255, 0.35)';
    for (var i = 0; i < points.length; i++) {
      var p = points[i];
      var dx = p.x - mouse.x, dy = p.y - mouse.y;
      var d = Math.sqrt(dx * dx + dy * dy);
      var l = Math.max(0, 1 - d / RADIUS);
      ctx.globalAlpha = 0.22 + 0.38 * l;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.8 + 2.2 * l, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function tick(t) {
    if (!running) return;
    if (t - last < FRAME) { raf = requestAnimationFrame(tick); return; }  /* 30fps 节流 */
    last = t;

    var speed = 0;

    /* 斥力 + 弹簧回位 + 阻尼 */
    for (var i = 0; i < points.length; i++) {
      var p = points[i];
      var dx = p.x - mouse.x, dy = p.y - mouse.y;
      var d = Math.sqrt(dx * dx + dy * dy);
      if (d < RADIUS && d > 0.1) {
        var f = (1 - d / RADIUS) * 30 * 0.1;
        p.vx += (dx / d) * f;
        p.vy += (dy / d) * f;
      }
      p.vx += 0.05 * (p.rx - p.x);
      p.vy += 0.05 * (p.ry - p.y);
      p.vx *= 0.85;
      p.vy *= 0.85;
      p.x += p.vx;
      p.y += p.vy;
      speed = Math.max(speed, Math.abs(p.vx) + Math.abs(p.vy));
    }

    draw();

    if (speed < 0.01) { running = false; return; }   /* 静止自动停帧 */
    raf = requestAnimationFrame(tick);
  }

  function wake() {
    if (!running) { running = true; last = 0; raf = requestAnimationFrame(tick); }
  }

  window.addEventListener('mousemove', function (e) {
    var r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
    wake();
  }, { passive: true });

  window.addEventListener('resize', function () {
    clearTimeout(rto);
    rto = setTimeout(function () { rebuild(); wake(); }, 150);   /* 150ms 防抖重建网格 */
  }, { passive: true });

  /* IO 离屏暂停已停用（远程桌面环境可能误报非交叉导致不渲染；之后按需恢复） */
  rebuild();
  wake();
})();
