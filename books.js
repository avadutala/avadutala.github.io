/* Optional, local-only browsing for the reading shelf. */
(function () {
  'use strict';
  var shelf = document.getElementById('book-shelf');
  if (!shelf) return;
  var cards = Array.from(shelf.querySelectorAll('[data-book]'));
  var search = document.getElementById('book-search');
  var filters = Array.from(document.querySelectorAll('[data-book-filter]'));
  var viewButtons = Array.from(document.querySelectorAll('[data-book-view]'));
  var result = document.getElementById('book-results');
  var empty = document.getElementById('book-empty');
  var selectedTheme = 'All books';
  var dialog = document.getElementById('book-reader');
  var collection = [];
  var position = 0;
  var trigger = null;

  function normalize(value) { return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }
  function update() {
    var query = normalize(search.value.trim());
    var visible = 0;
    cards.forEach(function (card) {
      var matchesTheme = selectedTheme === 'All books' || card.dataset.themes.split('|').includes(selectedTheme);
      var matchesQuery = !query || normalize(card.textContent).includes(query);
      card.hidden = !(matchesTheme && matchesQuery);
      if (!card.hidden) visible += 1;
    });
    filters.forEach(function (button) { button.setAttribute('aria-pressed', String(button.dataset.bookFilter === selectedTheme)); });
    result.textContent = visible === cards.length ? 'Showing all ' + cards.length + ' works' : 'Showing ' + visible + ' of ' + cards.length + ' works';
    empty.hidden = visible !== 0;
  }
  filters.forEach(function (button) { button.addEventListener('click', function () { selectedTheme = button.dataset.bookFilter; update(); }); });
  search.addEventListener('input', update);
  document.querySelector('[data-book-reset]').addEventListener('click', function () { selectedTheme = 'All books'; search.value = ''; update(); search.focus(); });
  viewButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      shelf.classList.toggle('is-notes', button.dataset.bookView === 'notes');
      viewButtons.forEach(function (view) { view.setAttribute('aria-pressed', String(view === button)); });
    });
  });
  document.getElementById('book-sort').addEventListener('change', function (event) {
    var sorted = cards.slice();
    if (event.target.value === 'title') sorted.sort(function (a,b) { return a.dataset.title.localeCompare(b.dataset.title); });
    else if (event.target.value === 'author') sorted.sort(function (a,b) { return a.dataset.author.localeCompare(b.dataset.author) || a.dataset.title.localeCompare(b.dataset.title); });
    else sorted.sort(function (a,b) { return Number(a.dataset.order) - Number(b.dataset.order); });
    sorted.forEach(function (card) { shelf.appendChild(card); });
  });
  function populate(card) {
    var cover = card.querySelector('.book-cover > img');
    var readerCover = document.getElementById('book-reader-image');
    readerCover.src = cover.getAttribute('src'); readerCover.alt = cover.alt;
    document.getElementById('book-reader-title').textContent = card.dataset.title;
    document.getElementById('book-reader-author').textContent = card.dataset.author;
    document.getElementById('book-reader-theme').textContent = card.querySelector('.book-category').textContent;
    document.getElementById('book-reader-summary').textContent = card.querySelector('.book-summary').textContent;
    document.getElementById('book-reader-question').textContent = card.querySelector('.book-question p').textContent;
    var topics = document.getElementById('book-reader-topics');
    topics.replaceChildren();
    card.querySelectorAll('.book-topics li').forEach(function (item) { var li = document.createElement('li'); li.textContent = item.textContent; topics.appendChild(li); });
    var personal = card.querySelector('.book-personal-note p');
    document.getElementById('book-reader-personal').hidden = !personal;
    document.getElementById('book-reader-note').textContent = personal ? personal.textContent : '';
    var source = card.querySelector('.book-source');
    var readerSource = document.getElementById('book-reader-source');
    readerSource.href = source.getAttribute('href'); readerSource.textContent = source.textContent; readerSource.setAttribute('aria-label', source.getAttribute('aria-label'));
    document.getElementById('book-reader-position').textContent = String(position+1).padStart(2,'0') + ' / ' + String(collection.length).padStart(2,'0');
    dialog.querySelector('[data-book-prev]').disabled = collection.length < 2;
    dialog.querySelector('[data-book-next]').disabled = collection.length < 2;
  }
  function openBook(slug, button) {
    var card = document.getElementById('book-' + slug);
    if (!card) return;
    collection = Array.from(shelf.querySelectorAll('[data-book]')).filter(function (entry) { return !entry.hidden; });
    if (!collection.includes(card)) collection = Array.from(shelf.querySelectorAll('[data-book]'));
    position = collection.indexOf(card); trigger = button;
    populate(card);
    if (!dialog.open) dialog.showModal();
    document.body.classList.add('book-reader-open');
    dialog.scrollTop = 0;
  }
  function move(step) {
    if (!collection.length) return;
    position = (position + step + collection.length) % collection.length;
    populate(collection[position]);
    dialog.scrollTop = 0;
  }
  if (dialog && typeof dialog.showModal === 'function') {
    document.documentElement.classList.add('has-book-reader');
    document.querySelectorAll('[data-open-book]').forEach(function (button) {
      button.hidden = false;
      button.addEventListener('click', function () { openBook(button.dataset.openBook, button); });
    });
    dialog.querySelector('[data-book-prev]').addEventListener('click', function () { move(-1); });
    dialog.querySelector('[data-book-next]').addEventListener('click', function () { move(1); });
    dialog.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); move(event.key === 'ArrowLeft' ? -1 : 1); }
    });
    dialog.addEventListener('click', function (event) {
      if (event.target !== dialog) return;
      var bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
    });
    dialog.addEventListener('close', function () { document.body.classList.remove('book-reader-open'); if (trigger && document.contains(trigger)) trigger.focus({preventScroll:true}); });
  }
  document.querySelector('.book-tools').hidden = false;
  update();
}());
