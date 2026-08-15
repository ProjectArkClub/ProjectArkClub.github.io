/* cta-scene.js — 下载枢纽背景粒子（DS CtaDigitileR3F 源码级 2D 移植，chunk 574）
   逐项对齐 DS 实现：
   - 22×24 手写点阵鲸鱼 214 粒子：target (x-12)*0.18 / (12-y)*0.18，opacity .25+.55*op
   - 散落位：随机球壳 r=5*(0.5+0.5rand)（z×0.4 投影略）
   - gather：章节中心相对视口的滚动进度 r=1-sectionCenter/innerHeight，clamp 0..1，
     逐帧缓动 +2.5/s；位置 mix(scattered,target,smoothstep(gather))
   - 漂浮：floatStrength=mix(.2,.06,gather) 低频摆动；组缓转 rotZ+=.06*(1-.5*gather)*dt
   - 组浮动 position.y=.1*sin(.3t)；无鼠标交互、无光照模型
   - 片元：alpha=op*shimmer*mix(.8,1.2,gatherRaw)*fadeIn；shimmer=sin(t*1.2+op*10)*.1+.9
   - 颜色 rgba(140,153,191)（uColor .55,.6,.75）；粒子为 .05 世界单位方块
   - fadeIn 0.7/s 缓入；AdditiveBlending → canvas 'lighter'；DPR ≤ 1.5
   - 相机 z=22 fov=50 → 可视高度 2*22*tan(25°)=20.52 世界单位，U=H/20.52
   - 外层 .cta-scene：-inset-30% + mix-blend:screen + 椭圆径向 mask + translateY(-8%)（CSS） */
(function () {
  'use strict';
  var canvas = document.querySelector('.cta-logo-field');
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext('2d');

  var PATTERN = [[12,0,.204],[11,1,.188],[12,1,.306],[11,2,.161],[12,2,.224],[4,3,.239],[11,3,.325],[12,3,.322],[19,3,.216],[20,3,.2],[3,4,.192],[8,4,.216],[9,4,.153],[10,4,.188],[11,4,.188],[13,4,.231],[14,4,.275],[19,4,.2],[20,4,.294],[5,5,.263],[6,5,.161],[7,5,.216],[8,5,.153],[11,5,.204],[12,5,.216],[13,5,.161],[14,5,.173],[15,5,.188],[16,5,.267],[17,5,.22],[18,5,.208],[19,5,.184],[5,6,.365],[6,6,.263],[8,6,.157],[9,6,.196],[10,6,.192],[11,6,.22],[12,6,.263],[13,6,.176],[17,6,.353],[18,6,.208],[5,7,.18],[7,7,.208],[8,7,.306],[11,7,.196],[12,7,.169],[15,7,.294],[16,7,.365],[17,7,.176],[18,7,.373],[8,8,.169],[11,8,.18],[12,8,.224],[16,8,.255],[17,8,.173],[18,8,.2],[19,8,.278],[4,9,.204],[5,9,.196],[6,9,.294],[8,9,.196],[9,9,.216],[10,9,.224],[11,9,.188],[12,9,.231],[13,9,.184],[14,9,.322],[15,9,.216],[17,9,.318],[18,9,.176],[19,9,.337],[4,10,.318],[5,10,.259],[6,10,.227],[10,10,.243],[11,10,.247],[12,10,.286],[13,10,.333],[14,10,.247],[17,10,.173],[18,10,.243],[19,10,.314],[2,11,.173],[3,11,.275],[5,11,.204],[6,11,.286],[8,11,.2],[10,11,.212],[12,11,.208],[13,11,.322],[14,11,.173],[15,11,.196],[17,11,.161],[18,11,.341],[19,11,.247],[20,11,.329],[21,11,.22],[1,12,.294],[2,12,.188],[3,12,.259],[4,12,.208],[5,12,.278],[6,12,.294],[7,12,.169],[8,12,.2],[10,12,.2],[11,12,.157],[12,12,.216],[13,12,.271],[14,12,.188],[15,12,.302],[16,12,.173],[17,12,.31],[18,12,.361],[19,12,.263],[20,12,.424],[21,12,.247],[22,12,.306],[4,13,.255],[6,13,.184],[10,13,.153],[11,13,.275],[12,13,.278],[13,13,.318],[14,13,.227],[17,13,.165],[18,13,.29],[19,13,.329],[4,14,.247],[6,14,.224],[9,14,.165],[11,14,.212],[12,14,.376],[13,14,.176],[14,14,.192],[17,14,.314],[18,14,.169],[19,14,.349],[6,15,.176],[7,15,.188],[8,15,.153],[11,15,.169],[12,15,.227],[16,15,.282],[17,15,.153],[19,15,.176],[5,16,.271],[7,16,.365],[8,16,.345],[11,16,.204],[12,16,.271],[15,16,.271],[16,16,.329],[18,16,.384],[5,17,.259],[6,17,.349],[8,17,.259],[9,17,.184],[11,17,.278],[12,17,.337],[14,17,.176],[15,17,.333],[17,17,.341],[18,17,.212],[4,18,.157],[5,18,.29],[6,18,.243],[7,18,.231],[10,18,.212],[11,18,.263],[12,18,.263],[13,18,.224],[14,18,.173],[15,18,.157],[16,18,.18],[18,18,.208],[4,19,.173],[5,19,.2],[8,19,.196],[9,19,.157],[15,19,.176],[3,20,.224],[4,20,.157],[10,20,.192],[11,20,.353],[12,20,.392],[13,20,.196],[19,20,.173],[20,20,.165],[11,21,.267],[12,21,.251],[11,22,.282],[12,22,.255],[11,23,.216],[12,23,.212]];

  var FOV_H = 20.52;                 /* 2*22*tan(25deg) */
  var FRAME = 1000 / 30;
  var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  var W = 0, H = 0, U = 0;
  var parts = [];
  var gatherCur = 0, fadeIn = 0, rotZ = 0;
  var last = 0, raf = 0;

  for (var i = 0; i < PATTERN.length; i++) {
    var e = PATTERN[i];
    var th = Math.random() * 6.283;
    var ph = Math.acos(2 * Math.random() - 1);
    var rr = 5 * (0.5 + 0.5 * Math.random());
    parts.push({
      tx: (e[0] - 12) * 0.18,
      ty: (12 - e[1]) * 0.18,
      sx: Math.sin(ph) * Math.cos(th) * rr,
      sy: Math.sin(ph) * Math.sin(th) * rr,
      op: 0.25 + 0.55 * e[2],
      idx: i
    });
  }

  function resize() {
    var w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    W = w; H = h;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    U = H / FOV_H;
  }

  function gatherTarget() {
    var s = document.getElementById('download');   /* 我们的 cta section（DS 用自身容器中心,等价） */
    if (!s) return 1;                               /* 无下载枢纽的页面(如 404):鲸鱼保持全聚拢 */
    var r = s.getBoundingClientRect();
    var v = window.innerHeight || 1;
    return Math.max(0, Math.min(1, 1 - (r.top + 0.5 * r.height) / v));
  }

  function draw(tms) {
    resize();
    var t = tms / 1000;
    var dt = Math.min(0.1, (tms - last) / 1000) || 1 / 30;
    last = tms;
    gatherCur += (gatherTarget() - gatherCur) * Math.min(1, 2.5 * dt);
    fadeIn = Math.min(1, fadeIn + 0.7 * dt);
    rotZ += 0.06 * (1 - 0.5 * gatherCur) * dt;
    var g = Math.max(0, Math.min(1, gatherCur));
    var gs = g * g * (3 - 2 * g);                      /* smoothstep(0,1,gather) */
    var fs = 0.2 + (0.06 - 0.2) * gs;                  /* mix(0.2,0.06,gather) */
    var bobY = 0.1 * Math.sin(0.3 * t);
    var cosR = Math.cos(rotZ), sinR = Math.sin(rotZ);
    var CX = W / 2, CY = H / 2 - bobY * U;

    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter';

    for (var i = 0; i < parts.length; i++) {
      var p = parts[i];
      var cx = p.sx + (p.tx - p.sx) * gs;
      var cy = p.sy + (p.ty - p.sy) * gs;
      cx += Math.sin(t * 0.5 + p.idx * 0.1) * fs;
      cy += Math.cos(t * 0.4 + p.idx * 0.07) * fs;
      var x = cx * cosR - cy * sinR;
      var y = cx * sinR + cy * cosR;
      var shimmer = Math.sin(t * 1.2 + p.op * 10) * 0.1 + 0.9;
      var alpha = p.op * shimmer * (0.8 + 0.4 * g) * fadeIn;
      if (alpha <= 0.004) continue;
      var sz = 0.05 * U;
      ctx.fillStyle = 'rgba(140,153,191,' + Math.min(1, alpha).toFixed(3) + ')';
      ctx.fillRect(CX + x * U - sz / 2, CY - y * U - sz / 2, sz, sz);
    }
    ctx.globalCompositeOperation = 'source-over';
  }

  function tick(tms) {
    if (tms - last >= FRAME) draw(tms);
    raf = requestAnimationFrame(tick);
  }

  window.addEventListener('resize', function () { resize(); }, { passive: true });
  resize();
  last = 0;
  raf = requestAnimationFrame(tick);
})();
