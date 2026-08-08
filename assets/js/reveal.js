/* ProjectArk 站点动效：滚动显现 + 导航加深 + 卡片光晕 + 窄屏抽屉 */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. 导航滚动加深
  var topbar = document.querySelector('.topbar');
  if (topbar) {
    function onNav() { topbar.classList.toggle('scrolled', window.scrollY > 8); }
    window.addEventListener('scroll', onNav, { passive: true });
    onNav();
  }

  // 2. 滚动显现（reveal）：首屏/卡片/截图/侧栏错峰淡入
  var targets = document.querySelectorAll('.hero, .feature, .shot, .dl-card, .fix-card');
  if (targets.length) {
    if (!('IntersectionObserver' in window) || reduce) {
      targets.forEach(function (el) { el.classList.add('in'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        });
      }, { threshold: 0.15 });
      targets.forEach(function (el, i) {
        el.classList.add('reveal');
        el.style.setProperty('--d', Math.min(i % 6 * 60, 300) + 'ms');
        io.observe(el);
      });
    }
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

  // 5. 窄屏导航自适应：内容放不下时隐藏品牌（品牌隐藏后链接区 nowrap + 横向滚动兜底）
  var navLinks = document.querySelector('.nav-links');
  var brand = document.querySelector('.brand');
  function fitNav() {
    if (!topbar || !navLinks || !brand) return;
    // 临时强制"品牌可见 + 单行"测量自然总宽:与品牌当前显示状态完全解耦,
    // 滚动/地址栏触发的 resize 重测结果一致,不会振荡
    var d = brand.style.display;
    var f1 = topbar.style.flexWrap, f2 = navLinks.style.flexWrap, o = navLinks.style.overflowX;
    brand.style.display = 'inline';
    topbar.style.flexWrap = navLinks.style.flexWrap = 'nowrap';
    navLinks.style.overflowX = 'visible';
    var overflow = topbar.scrollWidth > topbar.clientWidth + 1;
    brand.style.display = d;
    topbar.style.flexWrap = f1; navLinks.style.flexWrap = f2; navLinks.style.overflowX = o;
    topbar.classList.toggle('hide-brand', overflow);
  }
  window.addEventListener('resize', fitNav, { passive: true });
  fitNav();
})();
