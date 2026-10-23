/* Optional enhancements. Every page remains readable without JavaScript. */
(function () {
'use strict';
document.documentElement.classList.add('has-js');

document.querySelectorAll('[data-year]').forEach(function (element) {
  element.textContent = String(new Date().getFullYear());
});

var menuButton = document.querySelector('.menu-toggle');
var navigation = document.querySelector('#site-navigation');
if (menuButton && navigation) {
  function closeMenu(returnFocus) {
    navigation.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
    if (returnFocus) menuButton.focus();
  }
  menuButton.addEventListener('click', function () {
    var isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    navigation.classList.toggle('is-open', !isOpen);
    menuButton.setAttribute('aria-expanded', String(!isOpen));
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') closeMenu(true);
  });
  document.addEventListener('click', function (event) {
    if (!event.target.closest('.nav') && menuButton.getAttribute('aria-expanded') === 'true') closeMenu(false);
  });
  navigation.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () { closeMenu(false); });
  });
  var desktopMedia = window.matchMedia('(min-width: 1080px)');
  if (desktopMedia.addEventListener) desktopMedia.addEventListener('change', function () { closeMenu(false); });
}

var movieTools = document.querySelector('.movie-tools');
if (movieTools) {
  var search = document.querySelector('#movie-search');
  var filterButtons = Array.from(document.querySelectorAll('[data-filter]'));
  var films = Array.from(document.querySelectorAll('[data-film]'));
  var resultsStatus = document.querySelector('#movie-results');
  var emptyState = document.querySelector('.no-results');
  var selectedFilter = 'All films';

  function normalized(text) {
    return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
  function updateFilms() {
    var query = normalized(search.value.trim());
    var visible = 0;
    films.forEach(function (film) {
      var themeMatches = selectedFilter === 'All films' || film.dataset.categories.split('|').includes(selectedFilter);
      var queryMatches = !query || normalized(film.textContent).includes(query);
      film.hidden = !(themeMatches && queryMatches);
      if (!film.hidden) visible += 1;
    });
    filterButtons.forEach(function (button) {
      var active = button.dataset.filter === selectedFilter;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    resultsStatus.textContent = visible === films.length ? 'Showing all ' + films.length + ' films' : 'Showing ' + visible + ' of ' + films.length + ' films';
    emptyState.hidden = visible !== 0;
  }
  search.addEventListener('input', updateFilms);
  filterButtons.forEach(function (button) {
    button.addEventListener('click', function () { selectedFilter = button.dataset.filter; updateFilms(); });
  });
  document.querySelector('[data-reset-films]').addEventListener('click', function () {
    selectedFilter = 'All films';
    search.value = '';
    updateFilms();
    search.focus();
  });
  movieTools.hidden = false;
  updateFilms();
}
}());
