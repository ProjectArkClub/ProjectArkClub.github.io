/* fluid-bg.js — DeepSeek 官网 "fluid" 模式 WebGL2 流动背景(2026-08 分析移植)
   着色器源码取自 deepseek.com 打包产物(vertex + fragment 逐行还原)
   用法:
     <canvas class="fluid-bg"
             data-fluid-colors="#0A1424,#122A4A,#1B3E75,#2D5F9E,#0D1117"
             data-fluid-speed="25"     ← 流动速度(0~100,DeepSeek join 卡为 80)
             data-fluid-scale="1.6"    ← 图案缩放
             data-fluid-grain="0"></canvas>  ← 颗粒强度(0~0.01)
   特性:30fps 节流 / DPR≤1.5 / IntersectionObserver 离屏暂停 /
         prefers-reduced-motion 或无 WebGL2 时隐藏 canvas,露出 CSS 底色兜底 */
(function () {
  'use strict';

  var VERT = [
    '#version 300 es',
    'in vec4 a_position;',
    'void main() {',
    '  gl_Position = a_position;',
    '}'
  ].join('\n');

  /* DeepSeek fluid 片段着色器:simplex 噪声 fbm 域扭曲 + curl 噪声(逐行还原) */
  var FRAG = [
    '#version 300 es',
    'precision mediump float;',
    'uniform float u_time;',
    'uniform vec2 u_resolution;',
    'uniform vec3 u_c1, u_c2, u_c3, u_c4, u_c5;',
    'uniform float u_scale;',
    'uniform float u_grain;',
    'out vec4 fragColor;',
    'vec3 mod289v3(vec3 x){return x-floor(x*(1./289.))*289.;}',
    'vec4 mod289v4(vec4 x){return x-floor(x*(1./289.))*289.;}',
    'vec4 permute(vec4 x){return mod289v4(((x*34.)+1.)*x);}',
    'vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-.85373472095314*r;}',
    'float snoise(vec3 v){',
    '  const vec2 C=vec2(1./6.,1./3.);',
    '  const vec4 D=vec4(0.,.5,1.,2.);',
    '  vec3 i=floor(v+dot(v,C.yyy));',
    '  vec3 x0=v-i+dot(i,C.xxx);',
    '  vec3 g=step(x0.yzx,x0.xyz);',
    '  vec3 l=1.-g;',
    '  vec3 i1=min(g.xyz,l.zxy);',
    '  vec3 i2=max(g.xyz,l.zxy);',
    '  vec3 x1=x0-i1+C.xxx;',
    '  vec3 x2=x0-i2+C.yyy;',
    '  vec3 x3=x0-D.yyy;',
    '  i=mod289v3(i);',
    '  vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));',
    '  float n_=.142857142857;',
    '  vec3 ns=n_*D.wyz-D.xzx;',
    '  vec4 j=p-49.*floor(p*ns.z*ns.z);',
    '  vec4 x_=floor(j*ns.z);',
    '  vec4 y_=floor(j-7.*x_);',
    '  vec4 x=x_*ns.x+ns.yyyy;',
    '  vec4 y=y_*ns.x+ns.yyyy;',
    '  vec4 h=1.-abs(x)-abs(y);',
    '  vec4 b0=vec4(x.xy,y.xy);',
    '  vec4 b1=vec4(x.zw,y.zw);',
    '  vec4 s0=floor(b0)*2.+1.;',
    '  vec4 s1=floor(b1)*2.+1.;',
    '  vec4 sh=-step(h,vec4(0.));',
    '  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;',
    '  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;',
    '  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);',
    '  vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);',
    '  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));',
    '  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;',
    '  vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);',
    '  m=m*m;',
    '  return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));',
    '}',
    'float hash(vec2 p){',
    '  vec3 p3=fract(vec3(p.xyx)*.1031);',
    '  p3+=dot(p3,p3.yzx+33.33);',
    '  return fract((p3.x+p3.y)*p3.z);',
    '}',
    'float fbm(vec3 p){',
    '  float v=0.,amp=.6;vec3 shift=vec3(100.);',
    '  for(int i=0;i<1;i++){v+=amp*snoise(p);p=p*2.+shift;amp*=.4;}',
    '  return v;',
    '}',
    'float fluidNoise(vec2 uv,float t){',
    '  float n1=fbm(vec3(uv*.6,t*.06));',
    '  float n2=fbm(vec3(uv*.6+5.2,t*.06+1.3));',
    '  vec2 w1=vec2(n1,n2)*.6;',
    '  float n3=fbm(vec3((uv+w1)*.7+1.7,t*.05+3.1));',
    '  float n4=fbm(vec3((uv+w1)*.7+9.2,t*.05+5.7));',
    '  vec2 w2=vec2(n3,n4)*.5;',
    '  return fbm(vec3((uv+w1+w2)*.5,t*.04));',
    '}',
    'vec2 curlish(vec2 uv,float t){',
    '  float eps=.02;',
    '  float n=snoise(vec3(uv*.8,t));',
    '  float nx=snoise(vec3((uv+vec2(eps,0.))*.8,t));',
    '  float ny=snoise(vec3((uv+vec2(0.,eps))*.8,t));',
    '  return vec2(-(ny-n)/eps,(nx-n)/eps)*.003;',
    '}',
    'void main(){',
    '  float aspect=u_resolution.x/u_resolution.y;',
    '  vec2 uv=gl_FragCoord.xy/u_resolution;',
    '  vec2 suv=vec2(uv.x*aspect,uv.y)*u_scale;',
    '  float t=u_time;',
    '  vec2 curl=curlish(suv,t*.04);',
    '  vec2 uvD=suv+curl*12.;',
    '  float f=fluidNoise(uvD,t);',
    '  float swirl=snoise(vec3(uvD*.8+f*1.5,t*.035))*.5+.5;',
    '  float n=f*.5+.5;',
    '  vec3 col=mix(u_c1,u_c2,smoothstep(.2,.5,n));',
    '  col=mix(col,u_c3,smoothstep(.35,.65,n+swirl*.25));',
    '  col=mix(col,u_c4,smoothstep(.6,.85,swirl)*.55);',
    '  col=mix(col,u_c5,smoothstep(.5,.8,n*swirl)*.35);',
    '  if(u_grain>0.0){',
    '    vec2 flowOffset=(uvD-suv)*u_resolution.y;',
    '    vec2 gp=floor((gl_FragCoord.xy+flowOffset)/5.0);',
    '    float gr=hash(gp)*2.-1.;',
    '    col+=gr*u_grain;',
    '  }',
    '  float vig=1.-smoothstep(.4,.78,length(uv-.5));',
    '  col=mix(col*.75,col,vig*.35+.65);',
    '  fragColor=vec4(col,1.);',
    '}'
  ].join('\n');

  function hex2rgb(h) {
    var n = h.replace('#', '');
    return [parseInt(n.slice(0, 2), 16) / 255, parseInt(n.slice(2, 4), 16) / 255, parseInt(n.slice(4, 6), 16) / 255];
  }

  function init(canvas) {
    if (!canvas || canvas.dataset.fluidInit) return;
    var staticMode = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var gl = null;
    try {
      gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: false, antialias: false, powerPreference: 'low-power' });
    } catch (e) { /* ignore */ }
    if (!gl) { canvas.style.display = 'none'; return; }   /* 无 WebGL2 → 露出 CSS 底色 */
    canvas.dataset.fluidInit = '1';

    function compile(type, src) {
      var s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error('fluid-bg shader:', gl.getShaderInfoLog(s));
        gl.deleteShader(s);
        return null;
      }
      return s;
    }
    var vs = compile(gl.VERTEX_SHADER, VERT);
    var fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) { canvas.style.display = 'none'; return; }
    var prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { canvas.style.display = 'none'; return; }
    gl.useProgram(prog);

    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(prog, 'a_position');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    var U = {};
    ['u_time', 'u_resolution', 'u_scale', 'u_grain', 'u_c1', 'u_c2', 'u_c3', 'u_c4', 'u_c5']
      .forEach(function (n) { U[n] = gl.getUniformLocation(prog, n); });

    var colors = (canvas.dataset.fluidColors || '#0A1424,#122A4A,#1B3E75,#2D5F9E,#0D1117')
      .split(',').map(hex2rgb);
    while (colors.length < 5) colors.push(colors[colors.length - 1]);
    var cfg = {
      colors: colors,
      speed: parseFloat(canvas.dataset.fluidSpeed || '25'),
      scale: parseFloat(canvas.dataset.fluidScale || '1.6'),
      grain: parseFloat(canvas.dataset.fluidGrain || '0')
    };

    var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    var W = 0, H = 0, visible = true, raf = 0, last = 0;
    var FRAME = 1000 / 30, t0 = performance.now();

    function resize() {
      var w = Math.max(1, Math.round(canvas.clientWidth * dpr));
      var h = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (w !== W || h !== H) {
        W = w; H = h;
        canvas.width = W; canvas.height = H;
        gl.viewport(0, 0, W, H);
      }
    }

    function render(t) {
      resize();
      gl.uniform1f(U.u_time, (t - t0) * 0.001 * (cfg.speed / 100));
      gl.uniform2f(U.u_resolution, W, H);
      gl.uniform1f(U.u_scale, cfg.scale);
      gl.uniform1f(U.u_grain, cfg.grain);
      for (var i = 0; i < 5; i++) gl.uniform3f(U['u_c' + (i + 1)], cfg.colors[i][0], cfg.colors[i][1], cfg.colors[i][2]);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    function frame(t) {
      if (!visible) return;
      if (t - last < FRAME) { raf = requestAnimationFrame(frame); return; }   /* 30fps 节流 */
      last = t;
      render(t);
      raf = requestAnimationFrame(frame);
    }

    /* prefers-reduced-motion：保留设计，仅渲染一帧静态画面，不做动画 */
    if (staticMode) {
      resize();
      render(t0);
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting && !visible) { visible = true; last = 0; raf = requestAnimationFrame(frame); }
      else if (!entries[0].isIntersecting) { visible = false; cancelAnimationFrame(raf); }
    }, { threshold: 0 });

    resize();
    io.observe(canvas);
    raf = requestAnimationFrame(frame);
  }

  function boot() {
    var list = document.querySelectorAll('canvas.fluid-bg');
    for (var i = 0; i < list.length; i++) init(list[i]);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
