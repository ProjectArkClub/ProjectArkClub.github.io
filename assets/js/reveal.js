/* ProjectArk 站点动效：滚动显现 + 导航加深 + 卡片光晕 + 窄屏抽屉 */
(function () {
  // 0. 特性检测:CSS.registerProperty 可用才启用"旋转渐变边框"(DeepSeek rotating-border 同款)
  if (window.CSS && typeof CSS.registerProperty === 'function') {
    try {
      CSS.registerProperty({ name: '--border-angle', syntax: '<angle>', inherits: false, initialValue: '0deg' });
      document.documentElement.classList.add('css-property');
    } catch (e) { /* 不支持则静默跳过,旋转边框不启用 */ }
  }

  // 1. 导航滚动加深
  var topbar = document.querySelector('.topbar');
  if (topbar) {
    function onNav() { topbar.classList.toggle('scrolled', window.scrollY > 8); }
    window.addEventListener('scroll', onNav, { passive: true });
    onNav();
  }

  // 2. 滚动显现（reveal）：卡片/截图/侧栏错峰淡入（hero 由 CSS rise-in 入场，不再参与）
  //    实现为滚动/缩放时的 rect 检查 + load 后兜底定时，不依赖 IntersectionObserver
  //    （Tauri WebView2 等环境曾出现 IO 不触发导致内容永久 opacity:0 的问题）
  var targets = document.querySelectorAll('.feature, .shot, .dl-card, .fix-card, .cta-inner, .cta-dots-wrap, .nf-inner');
  if (targets.length) {
    var pendingReveals = [];
    targets.forEach(function (el, i) {
      el.classList.add('reveal');
      el.style.setProperty('--d', Math.min(i % 6 * 60, 300) + 'ms');
      pendingReveals.push(el);
    });
    function checkReveals() {
      var vh = window.innerHeight || 800;
      pendingReveals = pendingReveals.filter(function (el) {
        if (el.classList.contains('in')) return false;
        var r = el.getBoundingClientRect();
        var margin = Math.max(30, r.height * 0.15);
        if (r.top < vh - margin && r.bottom > 0) {
          el.classList.add('in');
          return false;
        }
        return true;
      });
    }
    window.addEventListener('scroll', checkReveals, { passive: true });
    window.addEventListener('resize', checkReveals, { passive: true });
    window.addEventListener('load', checkReveals, { passive: true });
    window.addEventListener('pageshow', checkReveals, { passive: true });
    checkReveals();
    /* 兜底:某些环境滚动事件不可靠,2s/5s 后再补两次(仅对已进入视口的元素生效) */
    setTimeout(checkReveals, 2000);
    setTimeout(checkReveals, 5000);
  }

  // 3. 卡片光晕跟随鼠标（reasonix doc-card 效果）
  document.querySelectorAll('.feature').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  // 4. 窄屏侧栏抽屉（汉堡/遮罩/Escape/选中关闭）
  var sideBtn = document.querySelector('.sidebar-toggle');
  var sidePanel = document.querySelector('.toc-side');
  if (sideBtn && sidePanel) {
    // 注入抽屉顶部导航条（品牌 + 关闭钮）
    var head = document.createElement('div');
    head.className = 'drawer-head';
    head.innerHTML = '<span class="drawer-brand">数码宝贝助手</span>' +
      '<button class="drawer-close" aria-label="关闭目录">&times;</button>';
    sidePanel.insertBefore(head, sidePanel.firstChild);

    var backdrop = document.createElement('div');
    backdrop.className = 'sidebar-backdrop';
    document.body.appendChild(backdrop);
    function openSide() { sidePanel.classList.add('open'); backdrop.classList.add('show'); }
    function closeSide() { sidePanel.classList.remove('open'); backdrop.classList.remove('show'); }
    sideBtn.addEventListener('click', openSide);
    backdrop.addEventListener('click', closeSide);
    head.querySelector('.drawer-close').addEventListener('click', closeSide);
    sidePanel.addEventListener('click', function (e) { if (e.target.closest('a')) closeSide(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeSide(); });
  }

  // 5. 窄屏导航自适应：链接区换行则隐藏品牌（隐藏后链接区 nowrap + 横向滚动兜底）
  var navLinks = document.querySelector('.nav-links');
  function fitNav() {
    if (!topbar || !navLinks) return;
    // 先恢复品牌可见再检测:判定基于"品牌可见"的真实换行状态,任何时机重测结论一致
    topbar.classList.remove('hide-brand');
    var as = navLinks.querySelectorAll('a');
    var wrapped = as.length > 1 &&
      Math.round(as[0].getBoundingClientRect().top) !==
      Math.round(as[as.length - 1].getBoundingClientRect().top);
    topbar.classList.toggle('hide-brand', wrapped);
  }
  window.addEventListener('resize', fitNav, { passive: true });
  fitNav();

  // 6. 导航当前页高亮（DeepSeek 同款 active 指示，按 pathname 判定）
  var path = window.location.pathname.replace(/\/+$/, '') || '/';
  document.querySelectorAll('.nav-links a').forEach(function (a) {
    var href = (a.getAttribute('href') || '/').replace(/\/+$/, '') || '/';
    if (path === href || (href !== '/' && path.indexOf(href) === 0)) a.classList.add('active');
  });
})();
