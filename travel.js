/* A small, offline travel atlas. Natural Earth geography is a bundled SVG. */
(function () {
  'use strict';
  var dataNode = document.getElementById('travel-data');
  if (!dataNode) return;
  var places = JSON.parse(dataNode.textContent);
  var svg = document.getElementById('world-map');
  var markerLayer = document.getElementById('map-markers');
  var viewport = document.querySelector('.atlas-viewport');
  var tooltip = document.getElementById('map-tooltip');
  var mapStatus = document.getElementById('map-status');
  var scope = 'visited';
  var region = 'world';
  var selected = 'phoenix';
  var nearby = [];
  var clusters = [];
  var NS = 'http://www.w3.org/2000/svg';
  var regions = {world: 'World', asia: 'Asia', europe: 'Europe', 'north-america': 'North America', oceania: 'Oceania', 'south-america': 'South America'};
  var views = {world: [0, 10, 1000, 480], asia: [610, 105, 295, 250], europe: [470, 60, 150, 150], 'north-america': [35, 75, 310, 240]};
  var view = views.world.slice();
  var drag = null;
  var moved = false;
  places.forEach(function (place) {
    place.x = (place.lon + 180) / 360 * 1000;
    place.y = (90 - place.lat) / 180 * 500;
  });
  function getPlace(id) { return places.find(function (p) { return p.id === id; }); }
  function filtered() {
    return places.filter(function (p) { return (scope === 'all' || p.kind === scope) && (region === 'world' || p.region === region); });
  }
  function node(name, attrs) {
    var element = document.createElementNS(NS, name);
    Object.keys(attrs || {}).forEach(function (key) { element.setAttribute(key, String(attrs[key])); });
    return element;
  }
  function hideTooltip() { tooltip.hidden = true; }
  function showTooltip(cluster, target) {
    tooltip.replaceChildren();
    var heading = document.createElement('strong');
    var copy = document.createElement('p');
    var hint = document.createElement('small');
    if (cluster.places.length === 1) {
      var place = cluster.places[0];
      heading.textContent = place.name;
      copy.textContent = place.memory;
      hint.textContent = place.kind === 'wishlist' ? 'On my wish list · select to explore' : 'A travel memory · select to explore';
    } else {
      heading.textContent = cluster.places.length + ' places in this area';
      copy.textContent = cluster.places.map(function (p) { return p.name; }).join(' · ');
      hint.textContent = 'Select this pin to choose a memory';
    }
    tooltip.append(heading, copy, hint);
    tooltip.hidden = false;
    var targetBox = target.getBoundingClientRect();
    var box = viewport.getBoundingClientRect();
    var left = targetBox.left - box.left + targetBox.width / 2 - tooltip.offsetWidth / 2;
    var top = targetBox.top - box.top - tooltip.offsetHeight - 12;
    left = Math.max(12, Math.min(box.width - tooltip.offsetWidth - 12, left));
    if (top < 12) top = targetBox.bottom - box.top + 12;
    top = Math.max(12, Math.min(box.height - tooltip.offsetHeight - 12, top));
    tooltip.style.left = left + 'px';
    tooltip.style.top = top + 'px';
  }
  function updateDetail(place, group) {
    var title = document.getElementById('detail-title');
    var memory = document.getElementById('detail-memory');
    var type = document.getElementById('detail-type');
    var link = document.getElementById('detail-link');
    var regionLabel = document.getElementById('detail-region');
    if (!place) {
      title.textContent = 'A new page awaits.';
      memory.textContent = 'There are no saved places in this view. Choose another region or explore the someday destinations.';
      regionLabel.textContent = regions[region];
      type.hidden = true; link.hidden = true;
      document.getElementById('nearby-places').hidden = true;
      return;
    }
    title.textContent = place.name;
    memory.textContent = place.memory;
    regionLabel.textContent = regions[place.region] + ' · ' + place.tag;
    type.textContent = place.kind === 'wishlist' ? 'On my wish list' : 'Visited / lived in';
    type.classList.toggle('wishlist', place.kind === 'wishlist');
    type.hidden = false; link.hidden = false;
    link.href = '#place-' + place.id;
    var buttons = document.getElementById('nearby-buttons');
    buttons.replaceChildren();
    nearby = group || [];
    nearby.forEach(function (other) {
      var button = document.createElement('button');
      button.type = 'button';
      button.textContent = other.name;
      button.setAttribute('aria-pressed', String(other.id === place.id));
      button.addEventListener('click', function () { selectPlace(other, nearby); });
      buttons.append(button);
    });
    document.getElementById('nearby-places').hidden = nearby.length < 2;
  }
  function selectPlace(place, group) {
    selected = place.id;
    updateDetail(place, group);
    document.querySelectorAll('[data-place-entry]').forEach(function (entry) {
      entry.classList.toggle('is-selected', entry.dataset.placeEntry === selected);
    });
    markerLayer.querySelectorAll('.map-pin').forEach(function (marker) {
      marker.classList.toggle('selected', marker.dataset.ids.split('|').includes(selected));
    });
    mapStatus.textContent = place.name + ' selected. ' + (place.kind === 'wishlist' ? 'A place for someday.' : 'A memory from my travels.');
  }
  function makeClusters(list) {
    var matrix = svg.getScreenCTM();
    var scale = matrix ? matrix.a : viewport.clientWidth / view[2];
    var distance = 25 / Math.max(.1, scale);
    var result = [];
    list.forEach(function (place) {
      var found = result.find(function (c) { return Math.hypot(c.x - place.x, c.y - place.y) < distance; });
      if (!found) result.push({x: place.x, y: place.y, places: [place]});
      else {
        found.places.push(place);
        found.x = found.places.reduce(function (sum, p) { return sum + p.x; }, 0) / found.places.length;
        found.y = found.places.reduce(function (sum, p) { return sum + p.y; }, 0) / found.places.length;
      }
    });
    return result;
  }
  function renderMarkers() {
    hideTooltip();
    markerLayer.replaceChildren();
    clusters = makeClusters(filtered());
    var matrix = svg.getScreenCTM();
    var scale = matrix ? matrix.a : viewport.clientWidth / view[2];
    var unit = 1 / Math.max(.1, scale);
    clusters.forEach(function (cluster) {
      var many = cluster.places.length > 1;
      var allWish = cluster.places.every(function (p) { return p.kind === 'wishlist'; });
      var mixed = !allWish && cluster.places.some(function (p) { return p.kind === 'wishlist'; });
      var marker = node('g', {transform: 'translate(' + cluster.x + ' ' + cluster.y + ')', tabindex: '0', role: 'button', 'aria-label': many ? 'Explore ' + cluster.places.length + ' places: ' + cluster.places.map(function (p) { return p.name; }).join(', ') : cluster.places[0].name + ': ' + (allWish ? 'on my wish list' : 'travel memory'), 'aria-describedby': 'map-description', class: 'map-pin' + (allWish ? ' wishlist' : '') + (mixed ? ' mixed' : '') + (cluster.places.some(function (p) { return p.id === selected; }) ? ' selected' : ''), 'data-ids': cluster.places.map(function (p) { return p.id; }).join('|')});
      marker.append(node('circle', {r: 18 * unit, class: 'pin-hit'}));
      marker.append(node('circle', {r: (many ? 16 : 12) * unit, class: 'pin-halo'}));
      marker.append(node('circle', {r: (many ? 11 : 6.5) * unit, class: 'pin-dot'}));
      if (many) {
        var count = node('text', {'font-size': 10 * unit, y: 0});
        count.textContent = String(cluster.places.length);
        marker.append(count);
      }
      function activate() {
        if (moved) return;
        var chosen = cluster.places.find(function (p) { return p.id === selected; }) || cluster.places[0];
        selectPlace(chosen, cluster.places);
        hideTooltip();
        if (window.matchMedia('(max-width: 879px)').matches) {
          document.querySelector('.place-detail').scrollIntoView({behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest'});
        }
      }
      marker.addEventListener('pointerenter', function (event) { if (event.pointerType !== 'touch' && !drag) showTooltip(cluster, marker); });
      marker.addEventListener('pointerleave', hideTooltip);
      marker.addEventListener('focus', function () { showTooltip(cluster, marker); });
      marker.addEventListener('blur', hideTooltip);
      marker.addEventListener('click', activate);
      marker.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); moved = false; activate(); }
        if (event.key === 'Escape') hideTooltip();
      });
      markerLayer.append(marker);
    });
  }
  function setView(next) {
    var width = Math.max(80, Math.min(1000, next[2]));
    var height = Math.max(55, Math.min(500, next[3]));
    var x = Math.max(-30, Math.min(1030 - width, next[0]));
    var y = Math.max(-20, Math.min(520 - height, next[1]));
    view = [x, y, width, height];
    svg.setAttribute('viewBox', view.join(' '));
    document.querySelector('[data-map-action="in"]').disabled = width <= 80;
    document.querySelector('[data-map-action="out"]').disabled = width >= 1000;
    renderMarkers();
  }
  function zoom(multiplier) {
    var width = Math.max(80, Math.min(1000, view[2] * multiplier));
    var height = width * (view[3] / view[2]);
    setView([view[0] + (view[2] - width) / 2, view[1] + (view[3] - height) / 2, width, height]);
  }
  function applyFilters(fitView) {
    var visible = filtered();
    document.querySelectorAll('[data-scope]').forEach(function (button) {
      var active = button.dataset.scope === scope;
      button.classList.toggle('is-active', active); button.setAttribute('aria-pressed', String(active));
    });
    document.querySelectorAll('[data-region-filter]').forEach(function (button) {
      var active = button.dataset.regionFilter === region;
      button.classList.toggle('is-active', active); button.setAttribute('aria-pressed', String(active));
    });
    document.querySelectorAll('[data-place-entry]').forEach(function (entry) {
      entry.hidden = !visible.some(function (p) { return p.id === entry.dataset.placeEntry; });
    });
    document.querySelector('.travel-empty').hidden = visible.length !== 0;
    document.getElementById('notebook-count').textContent = visible.length + (visible.length === 1 ? ' place' : ' places') + ' in this view';
    if (!visible.some(function (p) { return p.id === selected; })) selected = visible.length ? visible[0].id : '';
    updateDetail(getPlace(selected), []);
    if (fitView) setView(views[region].slice()); else renderMarkers();
    if (selected) selectPlace(getPlace(selected), []);
    mapStatus.textContent = visible.length + (visible.length === 1 ? ' place' : ' places') + ' to explore' + (region === 'world' ? '.' : ' in ' + regions[region] + '.');
  }
  document.querySelectorAll('[data-scope]').forEach(function (button) { button.addEventListener('click', function () { scope = button.dataset.scope; applyFilters(false); }); });
  document.querySelectorAll('[data-region-filter]').forEach(function (button) { button.addEventListener('click', function () { region = button.dataset.regionFilter; applyFilters(true); }); });
  document.querySelectorAll('[data-map-action]').forEach(function (button) {
    button.addEventListener('click', function () {
      var action = button.dataset.mapAction;
      if (action === 'reset') setView(views[region].slice());
      else zoom(action === 'in' ? 1 / 1.6 : 1.6);
    });
  });
  document.querySelector('[data-show-everything]').addEventListener('click', function () { region = 'world'; scope = 'all'; applyFilters(true); });
  document.querySelectorAll('[data-show-place]').forEach(function (button) {
    button.hidden = false;
    button.addEventListener('click', function () {
      var place = getPlace(button.dataset.showPlace);
      var width = 170, height = 120;
      setView([place.x - width / 2, place.y - height / 2, width, height]);
      var cluster = clusters.find(function (c) { return c.places.some(function (p) { return p.id === place.id; }); });
      selectPlace(place, cluster ? cluster.places : []);
      document.getElementById('travel-atlas').scrollIntoView({behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start'});
      document.getElementById('detail-title').setAttribute('tabindex', '-1');
      document.getElementById('detail-title').focus({preventScroll: true});
    });
  });
  function svgPoint(event) {
    var point = svg.createSVGPoint(); point.x = event.clientX; point.y = event.clientY;
    return point.matrixTransform(svg.getScreenCTM().inverse());
  }
  svg.addEventListener('pointerdown', function (event) {
    moved = false;
    if (event.target.closest('.map-pin')) return;
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    var point = svgPoint(event);
    drag = {id: event.pointerId, x: point.x, y: point.y, clientX: event.clientX, clientY: event.clientY, start: view.slice()};
    svg.setPointerCapture(event.pointerId);
    svg.classList.add('is-dragging'); hideTooltip();
  });
  svg.addEventListener('pointermove', function (event) {
    if (!drag || event.pointerId !== drag.id) return;
    if (Math.hypot(event.clientX - drag.clientX, event.clientY - drag.clientY) > 4) moved = true;
    var matrix = svg.getScreenCTM();
    var dx = (event.clientX - drag.clientX) / matrix.a;
    var dy = (event.clientY - drag.clientY) / matrix.d;
    setView([drag.start[0] - dx, drag.start[1] - dy, drag.start[2], drag.start[3]]);
  });
  function endDrag(event) {
    if (!drag || event.pointerId !== drag.id) return;
    if (svg.hasPointerCapture(event.pointerId)) svg.releasePointerCapture(event.pointerId);
    drag = null; svg.classList.remove('is-dragging');
  }
  svg.addEventListener('pointerup', endDrag);
  svg.addEventListener('pointercancel', endDrag);
  document.addEventListener('keydown', function (event) { if (event.key === 'Escape') hideTooltip(); });
  document.querySelector('.atlas-tools').hidden = false;
  document.querySelector('.map-controls').hidden = false;
  document.querySelector('.map-pan-hint').hidden = false;
  document.body.classList.add('travel-enhanced');
  applyFilters(true);
  if (window.ResizeObserver) new ResizeObserver(function () { renderMarkers(); }).observe(viewport);
  else window.addEventListener('resize', renderMarkers);
}());
