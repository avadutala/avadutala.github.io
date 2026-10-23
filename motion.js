/* One quiet clock for the website's illustrations. No media or network requests. */
(() => {
  'use strict';

  const registry = window.VidyaHomeScenes || {};
  const buttons = Array.from(document.querySelectorAll('[data-motion-toggle]'));
  const status = document.getElementById('motion-status');
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const storageKey = 'vidya-motion';
  function rememberedChoice() {
    try {
      return window.localStorage.getItem(storageKey) || window.localStorage.getItem('vidya-home-motion');
    } catch (_) { return null; /* Local-file previews can restrict storage. */ }
  }
  const remembered = rememberedChoice();

  // A reduced-motion preference always starts this visit with still illustrations.
  // A visitor may deliberately press Play for this visit.
  let playing = !preference.matches && remembered !== 'paused';
  let frame = null;
  let lastTime = null;
  let printing = false;

  const scenes = Array.from(document.querySelectorAll('[data-motion-scene]')).flatMap(svg => {
    const create = registry[svg.dataset.motionScene];
    if (typeof create !== 'function') return [];
    try {
      const render = create(svg);
      if (typeof render !== 'function') return [];
      render(0);
      const bounds = svg.getBoundingClientRect();
      return [{ svg, render, seconds: 0, visible: bounds.bottom > 0 && bounds.top < window.innerHeight }];
    } catch (_) {
      // An unavailable illustration renderer leaves its complete static SVG intact.
      return [];
    }
  });

  if (!scenes.length || !buttons.length) return;

  function canRun() {
    return playing && !document.hidden && !printing && scenes.some(scene => scene.visible);
  }

  function updateControls(announce = false) {
    document.documentElement.dataset.motion = playing ? 'playing' : 'paused';
    buttons.forEach(button => {
      button.hidden = false;
      button.dataset.motionState = playing ? 'playing' : 'paused';
      button.querySelector('[data-motion-label]').textContent = playing ? 'Pause motion' : 'Play motion';
      button.title = playing ? 'Pause all illustrations on this page' : 'Play all illustrations on this page';
    });
    if (announce && status) status.textContent = playing ? 'Page animations playing.' : 'Page animations paused.';
  }

  function tick(timestamp) {
    frame = null;
    if (!canRun()) { lastTime = null; return; }
    // Use elapsed time, not frame counts; a returning tab never jumps forward.
    const seconds = lastTime === null ? 0 : Math.min((timestamp - lastTime) / 1000, 0.08);
    lastTime = timestamp;
    scenes.forEach(scene => {
      if (!scene.visible) return;
      scene.seconds += seconds;
      scene.render(scene.seconds);
    });
    frame = window.requestAnimationFrame(tick);
  }

  function syncClock() {
    if (canRun()) {
      if (frame === null) { lastTime = null; frame = window.requestAnimationFrame(tick); }
    } else {
      if (frame !== null) window.cancelAnimationFrame(frame);
      frame = null;
      lastTime = null;
    }
  }

  buttons.forEach(button => button.addEventListener('click', () => {
    playing = !playing;
    try { window.localStorage.setItem(storageKey, playing ? 'playing' : 'paused'); } catch (_) { /* Keep the control working without storage. */ }
    updateControls(true);
    syncClock();
  }));

  if ('IntersectionObserver' in window) {
    const byElement = new Map(scenes.map(scene => [scene.svg, scene]));
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { byElement.get(entry.target).visible = entry.isIntersecting; });
      syncClock();
    }, { threshold: 0 });
    scenes.forEach(scene => observer.observe(scene.svg));
  } else {
    // Older browsers keep the same controls and time-based movement.
    scenes.forEach(scene => { scene.visible = true; });
  }

  document.addEventListener('visibilitychange', syncClock);
  window.addEventListener('pagehide', () => { if (frame !== null) window.cancelAnimationFrame(frame); frame = null; lastTime = null; });
  window.addEventListener('pageshow', event => {
    // A browser's Back button may restore this document without rerunning scripts.
    // Honor a choice made on another page since this one was last visible.
    if (event.persisted) {
      const saved = rememberedChoice();
      if (preference.matches) playing = false;
      else if (saved !== null) playing = saved !== 'paused';
      updateControls(true);
    }
    syncClock();
  });
  window.addEventListener('beforeprint', () => { printing = true; syncClock(); });
  window.addEventListener('afterprint', () => { printing = false; syncClock(); });
  const changePreference = event => {
    if (event.matches) {
      playing = false;
      updateControls(true);
      syncClock();
    }
  };
  if (typeof preference.addEventListener === 'function') preference.addEventListener('change', changePreference);
  else if (typeof preference.addListener === 'function') preference.addListener(changePreference);

  updateControls();
  syncClock();
})();
