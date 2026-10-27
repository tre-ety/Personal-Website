/* Shared behaviour: mobile menu and rail highlighting. No dependencies. */
(function () {
  'use strict';

  /* Mobile menu */
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.getElementById('nav-menu');
  if (toggle && menu) {
    function setOpen(open) {
      toggle.setAttribute('aria-expanded', String(open));
      menu.classList.toggle('is-open', open);
    }
    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { setOpen(false); toggle.focus(); }
    });
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.nav') && toggle.getAttribute('aria-expanded') === 'true') setOpen(false);
    });
  }

  /* Rail: highlight the section in view */
  var links = Array.prototype.slice.call(document.querySelectorAll('.rail-link[href^="#"]'));
  if (links.length) {
    var pairs = links.map(function (a) {
      return { link: a, el: document.getElementById(a.getAttribute('href').slice(1)) };
    }).filter(function (p) { return p.el; });
    var ticking = false;
    function update() {
      ticking = false;
      var line = window.innerHeight * 0.3;
      var active = pairs[0];
      pairs.forEach(function (p) { if (p.el.getBoundingClientRect().top <= line) active = p; });
      pairs.forEach(function (p) { p.link.classList.toggle('is-active', p === active); });
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }
})();
