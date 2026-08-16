/* ProjectArk event tracking: GA4 gtag + optional Cloudflare Zaraz.
   Cloudflare Web Analytics (beacon.min.js) has no custom-event API;
   if Zaraz is enabled later, the same events are sent via zaraz.track. */
(function () {
  'use strict';

  function track(name, params) {
    var payload = params || {};
    try {
      if (typeof gtag === 'function') {
        gtag('event', name, payload);
      }
    } catch (e) {}
    try {
      if (typeof zaraz === 'object' && typeof zaraz.track === 'function') {
        zaraz.track(name, payload);
      }
    } catch (e) {}
  }

  document.addEventListener('click', function (event) {
    var node = event.target;
    if (!node || typeof node.closest !== 'function') {
      return;
    }
    var link = node.closest('a[href]');
    if (!link) {
      return;
    }
    var eventName = link.getAttribute('data-event');
    if (!eventName) {
      return;
    }
    var params = {
      page: window.location.pathname || '/'
    };
    if (eventName === 'download') {
      params.download_channel = link.getAttribute('data-download') || 'unknown';
    } else if (eventName === 'runtime_download') {
      params.runtime_file = link.getAttribute('data-runtime') || 'unknown';
    } else if (eventName === 'contact') {
      params.contact_channel = link.getAttribute('data-contact') || 'unknown';
    }
    track(eventName, params);
  }, true);
})();
