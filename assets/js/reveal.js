/* ProjectArk 站点动效：滚动显现 + 导航加深（借鉴 reasonix 视觉） */
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
  var targets = document.querySelectorAll('.hero, .feature, .shot, .toc-side, .dl-card, .fix-card');
  if (!targets.length) return;
  if (!('IntersectionObserver' in window) || reduce) {
    targets.forEach(function (el) { el.classList.add('in'); });
    return;
  }
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

  // 3. 卡片光晕跟随鼠标（reasonix doc-card 效果）
  document.querySelectorAll('.feature').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });
})();
