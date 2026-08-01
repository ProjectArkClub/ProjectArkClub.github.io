/* ProjectArk 教程页 TOC scrollspy：滚动时高亮当前章节 */
(function () {
  var toc = document.getElementById('toc');
  if (!toc) return;
  var links = toc.querySelectorAll('a[href^="#"]');
  var targets = [];
  links.forEach(function (a) {
    var id = a.getAttribute('href').slice(1);
    var el = document.getElementById(id);
    if (el) targets.push({ el: el, link: a });
  });
  if (!targets.length) return;

  function top(el) { return el.getBoundingClientRect().top + window.scrollY; }

  function onScroll() {
    var pos = window.scrollY + 90; // 导航栏 + 间距偏移
    var current = null;
    for (var i = 0; i < targets.length; i++) {
      if (top(targets[i].el) <= pos) current = targets[i];
      else break;
    }
    targets.forEach(function (t) { t.link.classList.toggle('active', t === current); });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();
})();
