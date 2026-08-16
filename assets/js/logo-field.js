/* logo-field.js — hero 背景粒子 Logo（DS harness HeroDigitileR3F 源码级 2D 移植）
   逐项对齐 DS 实现：
   - 60×60 采样：亮度>0.2 且有相邻不透明像素（噪声过滤），opacity=亮度，edge=透明邻居占比
   - 组装入场：散落位置 → 目标 2.5s 三次缓动（cubic ease-out）
   - 怠速：哈希抖动(edge 加权) + 慢漂移 + 尾部泳动波 + 中心圆波 + 整体缓转/浮动
   - 鼠标：半径 4.9 世界单位、三次衰减 force、逐粒子噪声角旋转(±5rad)、强度仅鼠标活动时激活
   - 光：X 随鼠标横移、Y 固定，shadeMin .28 → shadeMax 2.79
   - 滚动散开：uScatter=1.6×min(1,1.5E)，边缘先散，整体缩放×(1-0.5E)
   - 渲染：AdditiveBlending、shimmer、glow、按亮度定 opacity、随机粗细 */
(function () {
  'use strict';

  var canvas = document.querySelector('.hero-logo-field');
  if (!canvas || !canvas.getContext) return;
  /* 注:不再因 touch/粗指针退出——远程桌面(如向日葵)常报告 coarse pointer,
     会导致 logo 完全不渲染;触屏设备只是不跟手,图案照常显示(DS 同策略) */

  var ctx = canvas.getContext('2d');
  var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  var FRAME = 1000 / 30;
  var T = 60, WU = 0.18;            /* DS 原值：60px 采样、0.18 世界换算 */
  var MOUSE_R = 4.9, MOUSE_STR = 0.8, MOUSE_DISTORT = 5;
  var LIGHT = { x: 4.5, y: 5.5, z: 3, range: 14, shadeMin: 0.48, shadeMax: 2.79 };   /* shadeMin 0.48:按双方底色差补偿暗态可见度(DS 0.28 + 底色差) */
  var LOOSE = 1;

  var W = 0, H = 0, S = 0, U = 0, CX = 0, CY = 0;
  var parts = [];
  var mouseRef = { x: 0, y: 0 };     /* 归一化 -1..1 */
  var mouseCur = { x: 0, y: 0 };     /* 像素缓动 */
  var strength = 0, active = false;
  var t0 = performance.now();
  var running = false, raf = 0, last = 0;
  var img = new Image();
  img.onload = function () { sample(); wake(); };
  img.src = '/resource/arch1.webp';   /* WebP(128px, from PNG good frame): avoid broken 256px ICO frame */

  function smooth(a, b, x) {
    var t = Math.max(0, Math.min(1, (x - a) / (b - a)));
    return t * t * (3 - 2 * t);
  }

  /* DS pixelize：60×60 亮度图，含相邻像素的亮部成粒子 */
  function sample() {
    var c = document.createElement('canvas');
    c.width = T; c.height = T;
    var o = c.getContext('2d');
    /* 透明底:alpha 采样要求画布不铺色,否则 alpha 全 255 无法区分线稿 */
    var r = Math.min(T / img.width, T / img.height), w = img.width * r, h = img.height * r;
    o.drawImage(img, (T - w) / 2, (T - h) / 2, w, h);
    var d = o.getImageData(0, 0, T, T).data;
    var alp = new Float32Array(T * T);
    for (var i = 0; i < T * T; i++) {
      alp[i] = d[4 * i + 3] / 255;   /* alpha 采样:黑/白/任意色线稿都成立(DS 用亮度因其线稿为白色) */
    }
    function hasN(x, y) {
      for (var a = -2; a <= 2; a++) for (var b = -2; b <= 2; b++) {
        if (a === 0 && b === 0) continue;
        var xx = x + b, yy = y + a;
        if (xx >= 0 && yy >= 0 && xx < T && yy < T && alp[yy * T + xx] > 0.35) return true;
      }
      return false;
    }
    var half = T / 2;
    for (var y = 0; y < T; y++) for (var x = 0; x < T; x++) {
      var a = alp[y * T + x];
      if (a > 0.35 && hasN(x, y)) {
        var edge = 0;
        for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          var xx = x + dx, yy = y + dy;
          if (xx < 0 || yy < 0 || xx >= T || yy >= T || alp[yy * T + xx] <= 0.35) edge++;
        }
        var th = Math.random() * 6.283, ph = Math.acos(2 * Math.random() - 1), rr = 3 * (0.4 + 0.6 * Math.random());
        parts.push({
          tx: (x - half) * WU, ty: (half - y) * WU,
          sx: Math.sin(ph) * Math.cos(th) * rr, sy: Math.sin(ph) * Math.sin(th) * rr, sz: Math.cos(ph) * rr * 0.5,
          op: 1, edge: edge / 8,   /* op=1:不透明度线对齐 DS 白线稿(均匀不透明度) */
          hx: Math.random() - 0.5, hy: Math.random() - 0.5, hz: Math.random() - 0.5,
          rnd: 0.5 + 0.5 * Math.random(), idx: parts.length
        });
      }
    }
  }

  function resize() {
    var w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    if (w !== W || h !== H) {
      W = w; H = h;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    S = Math.min(h * 0.42, 520);
    U = S / 10.8;                       /* 世界单位 → 屏幕 px */
    CX = w / 2;
    CY = h * 0.66;
  }

  function draw(elapsed) {
    resize();
    var E = Math.min(1, window.scrollY / window.innerHeight);
    var L = Math.max(0, Math.min(1, (elapsed - 0.3) / 2.5));
    var D = 1 - Math.pow(1 - L, 3);                    /* 组装 cubic ease-out */
    var asm = smooth(0, 1, D);
    var uScatter = 1.6 * Math.min(1, 1.5 * E);
    var rotZ = elapsed * ((1 - D) * 0.3) + 0.04 * Math.sin(0.25 * elapsed);
    var bobY = 0.15 * Math.sin(0.4 * elapsed);
    var grpScale = (0.75 + 0.25 * D) * (1 - 0.5 * E);
    var P = D * Math.max(0, 1 - 1.5 * E);

    /* 鼠标强度仅在活动时激活，缓动开关；像素坐标以画布中心为锚（静止=中心） */
    strength += ((active ? MOUSE_STR : 0) - strength) * 0.9;
    var I = CX + mouseRef.x * W * 0.5, J = H * (1 - mouseRef.y) * 0.5;   /* 还原真实屏幕坐标(此前 CY−H/2 常量偏下 145px) */
    mouseCur.x = I; mouseCur.y = J;   /* 取消延迟:交互位置即时跟随鼠标(不再缓动) */
    var cosR = Math.cos(rotZ), sinR = Math.sin(rotZ);
    var pw = (mouseCur.x - CX) / U, ph = (CY - mouseCur.y) / U - bobY;   /* 屏幕→世界,先扣上下浮动 */
    var wmx = (pw * cosR + ph * sinR) / grpScale;     /* 正确逆旋转变换(此前误用正向公式,中心偏移±15px) */
    var wmy = (-pw * sinR + ph * cosR) / grpScale;
    var lightX = LIGHT.x + ((mouseCur.x - CX) / 400) * 8.4 * 1.05;   /* DS 固定 800px 盒的每像素速率(0.021 世界/px),与 logo 自身尺寸无关 */

    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter';

    for (var i = 0; i < parts.length; i++) {
      var p = parts[i];
      var cx = (1 - asm) * p.sx + asm * p.tx;
      var cy = (1 - asm) * p.sy + asm * p.ty;
      var x = cx, y = cy, z = 0;
      var ew = 0.25 + 0.75 * p.edge;

      /* 怠速：哈希静偏移 + 空间低频漂移 + 尾部泳动波（空间相位:相邻粒子同相,整片长波缓涌） */
      x += p.hx * 0.032 * LOOSE * ew + Math.sin(elapsed * 0.5 + p.tx * 1.4 + p.ty * 1.1) * 0.04 * LOOSE;
      y += p.hy * 0.032 * LOOSE * ew + Math.cos(elapsed * 0.42 + p.tx * 1.1 + p.ty * 1.4) * 0.04 * LOOSE;
      z += p.hz * 0.032 * LOOSE * ew + Math.sin(elapsed * 0.36 + p.tx * 0.9 + p.ty * 0.8) * 0.05 * LOOSE;
      var tail = smooth(0.5, 4.5, Math.abs(p.tx)) * LOOSE * asm;   /* 波幅向左右两侧渐强:波浪形排布(DS 尾波语义) */
      y += Math.sin(elapsed * 1.1 - p.tx * 0.7) * 0.1 * tail;

      /* 滚动散开：边缘粒子先散 */
      if (uScatter > 0.001) {
        var disperse = uScatter * (0.5 + 0.5 * p.edge);
        x += (p.sx - cx) * disperse;
        y += (p.sy - cy) * disperse;
        z += Math.sin(elapsed * 0.6 + p.idx * 0.3) * disperse * 0.6;
      }

      /* 中心圆形波 */
      if (asm > 0.95) {
        var wdist = Math.sqrt(cx * cx + cy * cy);
        var wfade = smooth(0, 3, wdist);
        z += Math.sin(wdist * 3 - elapsed * 1.5) * 0.06 * (asm - 0.95) * 20 * wfade;
      }

      /* 鼠标炸开：三次衰减 + 噪声角旋转推挤 + Z 散开 */
      if (asm > 0.8) {
        var me = (asm - 0.8) * 5;
        var dx = cx - wmx, dy = cy - wmy;
        var md = Math.sqrt(dx * dx + dy * dy);
        if (md < MOUSE_R && md > 0.001) {
          var t3 = 1 - md / MOUSE_R;
          var force = t3 * t3 * t3 * me * strength;
          var ang = Math.atan2(dy, dx) + Math.sin(p.idx * 0.37 + elapsed * 0.5) * MOUSE_DISTORT;
          x += Math.cos(ang) * force * 2;
          y += Math.sin(ang) * force * 2;
          z += Math.sin(p.idx * 1.7 + elapsed) * force * 0.8;
        }
      }

      /* 散开态个体漂浮 */
      if (asm < 0.9) {
        var sc = smooth(0.9, 0, asm);
        x += Math.sin(elapsed * 0.5 + p.idx * 0.1) * 0.2 * sc;
        y += Math.cos(elapsed * 0.4 + p.idx * 0.07) * 0.2 * sc;
        z += Math.sin(elapsed * 0.3 + p.idx * 0.13) * 0.15 * sc;
      }

      /* 光照：DS 三维光点模型 (4.5,5.5,3)，圆形柔和衰减（放弃竖带） */
      var ldx = x - lightX, ldy = y - LIGHT.y;
      var lightDist = Math.sqrt(ldx * ldx + ldy * ldy + LIGHT.z * LIGHT.z);
      var lit = Math.max(0, 1 - lightDist / LIGHT.range);
      var vLight = LIGHT.shadeMin + (LIGHT.shadeMax - LIGHT.shadeMin) * lit * lit;

      /* 组变换 → 屏幕 */
      var px = (x * cosR - y * sinR) * grpScale;
      var py = (x * sinR + y * cosR) * grpScale + bobY;
      var sx = CX + px * U, sy = CY - py * U;

      /* 片元：glow + shimmer + 光照（DS 原值） */
      var wd = Math.sqrt(cx * cx + cy * cy);
      var glow = smooth(8, 0, wd) * 0.3 * asm;
      var baseAlpha = 0.45 + 0.3 * asm;
      var shimmer = Math.sin(elapsed * 1.5 + cx * 5 + cy * 3) * 0.1 + 0.9;
      var alpha = p.op * (baseAlpha + glow) * shimmer * Math.min(vLight, 1);
      if (alpha <= 0.004) continue;
      var warm = Math.max(0, Math.min(1, vLight - 1));   /* DS 暖色偏移：亮部偏暖 */
      var r = Math.min(255, Math.round((0.75 * P + 0.2 * glow) * 255 * vLight * (1 + 0.07 * warm)));
      var g = Math.min(255, Math.round((0.8 * P + 0.3 * glow) * 255 * vLight * (1 + 0.02 * warm)));
      var b = Math.min(255, Math.round((0.9 * P + 0.5 * glow) * 255 * vLight * (1 - 0.06 * warm)));
      var size = 0.045 * U * p.rnd * (0.75 + 0.4 * lit) * (1 + z * 0.06);   /* 光照处粒子更大:大小渐变 */
      ctx.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + Math.min(1, alpha).toFixed(3) + ')';
      ctx.beginPath();
      ctx.arc(sx, sy, Math.max(0.6, size), 0, 6.283);
      ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
  }

  function tick(t) {
    if (!running) return;
    if (t - last < FRAME) { raf = requestAnimationFrame(tick); return; }
    last = t;
    if (!parts.length) { raf = requestAnimationFrame(tick); return; }
    draw((t - t0) / 1000);
    raf = requestAnimationFrame(tick);
  }

  function wake() {
    if (!running) { running = true; last = 0; raf = requestAnimationFrame(tick); }
  }

  window.addEventListener('mousemove', function (e) {
    var r = canvas.getBoundingClientRect();
    mouseRef.x = (e.clientX - r.left) / r.width * 2 - 1;
    mouseRef.y = -((e.clientY - r.top) / r.height * 2 - 1);
    active = true;
    wake();
  }, { passive: true });
  window.addEventListener('mouseleave', function () { active = false; });
  document.addEventListener('visibilitychange', function () { if (document.hidden) active = false; });
  window.addEventListener('resize', function () { wake(); }, { passive: true });

  /* IO 离屏暂停已停用（远程桌面环境可能误报非交叉导致不渲染；动画常开，之后按需恢复） */
  resize();
  wake();
})();
