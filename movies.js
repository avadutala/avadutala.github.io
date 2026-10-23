(function () {
  'use strict';
  var gallery = document.querySelector('.poster-gallery');
  if (!gallery) return;
  var cards = Array.from(gallery.querySelectorAll('[data-film]'));
  var dialog = document.querySelector('#film-dialog');
  var openButtons = Array.from(document.querySelectorAll('[data-open-film]'));
  var viewButtons = Array.from(document.querySelectorAll('[data-film-view]'));
  var currentCollection = [];
  var currentIndex = 0;
  var lastTrigger = null;
  var reading = dialog.querySelector('.dialog-reading');
  var poster = document.querySelector('#film-dialog-image');
  var title = document.querySelector('#film-dialog-title');
  var reflection = document.querySelector('#film-dialog-comment');
  var categories = document.querySelector('#film-dialog-categories');
  var position = document.querySelector('#film-dialog-position');

  function populate(card) {
    var image = card.querySelector('.poster-wrap > img');
    title.textContent = card.dataset.title;
    reflection.textContent = card.querySelector('.film-reflection').textContent;
    poster.src = image.getAttribute('src');
    poster.alt = image.alt;
    categories.replaceChildren();
    card.dataset.categories.split('|').forEach(function (name) {
      var span = document.createElement('span');
      span.textContent = name;
      categories.appendChild(span);
    });
    if (card.dataset.title === 'Sakhi') {
      var favorite = document.createElement('span');
      favorite.textContent = 'My all-time favorite';
      categories.prepend(favorite);
    }
    position.textContent = String(currentIndex + 1).padStart(2, '0') + ' / ' + String(currentCollection.length).padStart(2, '0');
    dialog.querySelector('[data-film-prev]').disabled = currentCollection.length < 2;
    dialog.querySelector('[data-film-next]').disabled = currentCollection.length < 2;
  }
  function openFilm(slug, trigger) {
    var card = document.getElementById('film-' + slug);
    if (!card) return;
    currentCollection = Array.from(gallery.querySelectorAll('[data-film]')).filter(function (item) { return !item.hidden; });
    if (!currentCollection.includes(card)) currentCollection = Array.from(gallery.querySelectorAll('[data-film]'));
    currentIndex = currentCollection.indexOf(card);
    lastTrigger = trigger;
    populate(card);
    if (!dialog.open) dialog.showModal();
    document.body.classList.add('film-dialog-open');
    dialog.scrollTop = 0;
  }
  function moveFilm(step) {
    if (!currentCollection.length) return;
    currentIndex = (currentIndex + step + currentCollection.length) % currentCollection.length;
    populate(currentCollection[currentIndex]);
  }
  if (dialog && typeof dialog.showModal === 'function') {
    document.documentElement.classList.add('has-film-dialog');
    openButtons.forEach(function (button) {
      button.hidden = false;
      button.addEventListener('click', function () { openFilm(button.dataset.openFilm, button); });
    });
    dialog.querySelector('[data-film-prev]').addEventListener('click', function () { moveFilm(-1); });
    dialog.querySelector('[data-film-next]').addEventListener('click', function () { moveFilm(1); });
    dialog.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowRight') { event.preventDefault(); moveFilm(1); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); moveFilm(-1); }
    });
    dialog.addEventListener('click', function (event) {
      if (event.target === dialog) {
        var bounds = dialog.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
      }
    });
    dialog.addEventListener('close', function () {
      document.body.classList.remove('film-dialog-open');
      if (lastTrigger && document.contains(lastTrigger)) lastTrigger.focus({preventScroll: true});
    });
  }
  viewButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      var journal = button.dataset.filmView === 'journal';
      gallery.classList.toggle('is-journal', journal);
      viewButtons.forEach(function (item) { item.setAttribute('aria-pressed', String(item === button)); });
    });
  });
  document.querySelector('#film-sort').addEventListener('change', function (event) {
    var ordered = cards.slice();
    if (event.target.value === 'alphabetical') ordered.sort(function (a,b) { return a.dataset.title.localeCompare(b.dataset.title); });
    else ordered.sort(function (a,b) { return Number(a.dataset.order) - Number(b.dataset.order); });
    ordered.forEach(function (card) { gallery.appendChild(card); });
  });
}());
