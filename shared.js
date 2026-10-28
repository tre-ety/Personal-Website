/* Shared behaviour: mobile menu, rail highlighting, count-up figures, copy buttons and filter chips. No dependencies. */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var IO = 'IntersectionObserver' in window;

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

  /* Count-up figures: <span data-count="20" data-prefix="~" data-suffix="%">~20%</span>.
     The page always holds the real figure (crawlers, print and no-scroll readers see it); the count-up only
     starts as a figure below the fold edges into view, so nothing is ever left showing zero. */
  if (IO && !reduce) {
    [].forEach.call(document.querySelectorAll('[data-count]'), function (el) {
      if (el.getBoundingClientRect().top < window.innerHeight) return;
      var target = parseFloat(el.dataset.count), dec = (el.dataset.count.split('.')[1] || '').length;
      var pre = el.dataset.prefix || '', suf = el.dataset.suffix || '', final = el.textContent;
      var io = new IntersectionObserver(function (es) {
        if (!es[0].isIntersecting) return;
        io.disconnect();
        var t0 = performance.now(), done = false;
        el.textContent = pre + (0).toFixed(dec) + suf;
        /* the true figure always lands, even if animation frames are throttled (background tab, slow device) */
        setTimeout(function () { done = true; el.textContent = final; }, 1600);
        (function frame(now) {
          if (done) return;
          var p = Math.min(1, (now - t0) / 1100), e = 1 - Math.pow(1 - p, 4);
          el.textContent = p < 1 ? pre + (target * e).toFixed(dec) + suf : final;
          if (p < 1) requestAnimationFrame(frame);
        })(t0);
      }, { rootMargin: '0px 0px -12% 0px' });
      io.observe(el);
    });
  }

  /* Copy buttons: <button class="copy-btn" data-copy="text">Copy</button>. Hidden where the clipboard is unavailable. */
  [].forEach.call(document.querySelectorAll('[data-copy]'), function (btn) {
    if (!navigator.clipboard) { btn.hidden = true; return; }
    var label = btn.querySelector('span') || btn, idle = label.textContent;
    btn.addEventListener('click', function (e) {
      e.preventDefault(); e.stopPropagation();
      navigator.clipboard.writeText(btn.dataset.copy).then(function () {
        label.textContent = 'Copied'; btn.classList.add('is-copied');
      }, function () { label.textContent = 'Could not copy'; })
        .then(function () { setTimeout(function () { label.textContent = idle; btn.classList.remove('is-copied'); }, 1800); });
    });
  });

  /* Filter chips: <div class="filters" data-filter-target="#list" hidden></div> over items carrying data-tags="a b".
     Chips are built from the items' tags (labels from data-tag-labels on the container), so the markup can't drift. */
  [].forEach.call(document.querySelectorAll('.filters[data-filter-target]'), function (bar) {
    var list = document.querySelector(bar.dataset.filterTarget);
    if (!list) return;
    var items = [].slice.call(list.querySelectorAll('[data-tags]'));
    var labels = {}; (bar.dataset.tagLabels || '').split(';').forEach(function (pair) { var kv = pair.split('='); if (kv[1]) labels[kv[0].trim()] = kv[1].trim(); });
    var counts = {};
    items.forEach(function (it) { it.dataset.tags.split(' ').forEach(function (t) { if (t) counts[t] = (counts[t] || 0) + 1; }); });
    var keys = Object.keys(labels).filter(function (k) { return counts[k]; }).concat(Object.keys(counts).filter(function (k) { return !labels[k]; }));
    if (keys.length < 2) return;
    function chip(key, text, n) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'filter'; b.dataset.filter = key;
      b.setAttribute('aria-pressed', String(key === 'all'));
      b.innerHTML = text + ' <span class="n">' + n + '</span>';
      return b;
    }
    bar.appendChild(chip('all', 'All', items.length));
    keys.forEach(function (k) { bar.appendChild(chip(k, labels[k] || k, counts[k])); });
    var live = document.createElement('span'); live.className = 'filter-count'; live.setAttribute('aria-live', 'polite'); bar.appendChild(live);
    bar.hidden = false;
    bar.addEventListener('click', function (e) {
      var b = e.target.closest('.filter'); if (!b) return;
      var f = b.dataset.filter, shown = 0;
      [].forEach.call(bar.querySelectorAll('.filter'), function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      items.forEach(function (it) { var on = f === 'all' || it.dataset.tags.split(' ').indexOf(f) > -1; it.hidden = !on; if (on) shown++; });
      list.classList.toggle('is-filtered', f !== 'all');
      live.textContent = f === 'all' ? '' : 'Showing ' + shown + ' of ' + items.length;
      list.dispatchEvent(new CustomEvent('filtered', { detail: f }));
    });
  });
})();
