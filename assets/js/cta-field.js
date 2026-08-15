/* cta-field.js — 下载枢纽点阵（对齐 DS 底部区块 dots canvas：白色、静态、四边渐隐交给 CSS mask）
   DS 参数（function m, isStatic:true 用法）：
   - 间距 90px、居中网格（行列各 +1 越界一圈）
   - 线 rgba(255,255,255,.05)、lineWidth 0.5，两端各留 10px 内缩；两点距 <20px 不连线
   - 点 rgba(255,255,255,.12)、1.8px 方块；无鼠标物理（isStatic）
   - DPR ≤ 2；单帧静态绘制，resize（150ms 防抖）与 load 时重绘
   健壮性：网格尺寸在 build 内一次性算好传给 draw（避免 CSS 尚未生效时
   设置 canvas.width 改变 clientWidth 导致行列数错配——曾在 Tauri WebView 崩溃） */
(function () {
  'use strict';
  var canvas = document.querySelector('.cta-field');
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext('2d');
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var dots = [];

  function cols(w) { return Math.ceil(w / 90) + 1; }
  function rows(h) { return Math.ceil(h / 90) + 1; }

  function draw(w, h, cc, rr) {
    if (!w || !h || !dots.length) return;
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 0.5;
    var a, b, dx, dy, d, lx, ly, i, j;
    /* 横向线 */
    for (j = 0; j < rr; j++) for (i = 0; i < cc - 1; i++) {
      a = dots[j * cc + i]; b = dots[j * cc + i + 1];
      if (!a || !b) continue;
      dx = b.x - a.x; dy = b.y - a.y; d = Math.sqrt(dx * dx + dy * dy);
      if (d < 20) continue;
      lx = dx / d; ly = dy / d;
      ctx.beginPath();
      ctx.moveTo(a.x + 10 * lx, a.y + 10 * ly);
      ctx.lineTo(b.x - 10 * lx, b.y - 10 * ly);
      ctx.stroke();
    }
    /* 纵向线 */
    for (i = 0; i < cc; i++) for (j = 0; j < rr - 1; j++) {
      a = dots[j * cc + i]; b = dots[(j + 1) * cc + i];
      if (!a || !b) continue;
      dx = b.x - a.x; dy = b.y - a.y; d = Math.sqrt(dx * dx + dy * dy);
      if (d < 20) continue;
      lx = dx / d; ly = dy / d;
      ctx.beginPath();
      ctx.moveTo(a.x + 10 * lx, a.y + 10 * ly);
      ctx.lineTo(b.x - 10 * lx, b.y - 10 * ly);
      ctx.stroke();
    }
    /* 点 */
    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
    var n = 1.8;
    for (i = 0; i < dots.length; i++) {
      ctx.fillRect(dots[i].x - n, dots[i].y - n, 2 * n, 2 * n);
    }
  }

  function build() {
    var w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;   /* CSS 未生效时先跳过,load 事件后再试 */
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var cc = cols(w), rr = rows(h);
    var ox = (w - (cc - 1) * 90) / 2, oy = (h - (rr - 1) * 90) / 2;
    dots = [];
    for (var j = 0; j < rr; j++) for (var i = 0; i < cc; i++) dots.push({ x: ox + 90 * i, y: oy + 90 * j });
    draw(w, h, cc, rr);
  }

  var to = null;
  function debounce() {
    if (to) clearTimeout(to);
    to = setTimeout(build, 150);
  }
  window.addEventListener('resize', debounce, { passive: true });
  window.addEventListener('load', build, { passive: true });
  build();
})();
