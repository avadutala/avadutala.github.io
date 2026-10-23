/* Quiet scenes for the reading room and cinema. Playback belongs to motion.js. */
(function () {
  'use strict';

  var scenes = window.VidyaHomeScenes = window.VidyaHomeScenes || {};
  var finiteTime = function (value) { return Number.isFinite(value) ? Math.max(0, value) : 0; };
  var n = function (value) { return value.toFixed(3); };

  scenes.books = function (svg) {
    var leaf = svg.querySelector('[data-reading-leaf]');
    var paper = svg.querySelector('[data-reading-paper]');
    var ink = svg.querySelector('[data-reading-ink]');
    var crease = svg.querySelector('[data-reading-crease]');

    return function render(timeSeconds) {
      if (!leaf || !paper || !ink || !crease) return;
      var phase = (finiteTime(timeSeconds) % 7.8) / 7.8;
      // The paper rests briefly on either side of the spine. A raised outer
      // edge and a changing projected width suggest a real, flexible leaf.
      var progress = Math.max(0, Math.min(1, (phase - .12) / .68));
      var eased = .5 - .5 * Math.cos(progress * Math.PI);
      var angle = eased * Math.PI;
      var width = Math.cos(angle);
      var lift = Math.sin(angle);
      var topX = 400 + 210 * width;
      var topY = 300 - 122 * lift;
      var bottomX = 400 + 235 * width;
      var bottomY = 460 - 85 * lift;
      var path = 'M400 340 C' + n(400 + 65 * width) + ' ' + n(313 - 35 * lift) + ' ' + n(topX - 55 * width) + ' ' + n(topY - 5) + ' ' + n(topX) + ' ' + n(topY) +
        ' L' + n(bottomX) + ' ' + n(bottomY) + ' C' + n(bottomX - 95 * width) + ' ' + n(bottomY - 6) + ' ' + n(400 + 70 * width) + ' ' + n(470 - 20 * lift) + ' 400 495Z';
      paper.setAttribute('d', path);
      paper.setAttribute('fill', width >= 0 ? '#FFF9E8' : '#ECE2C9');
      // Abstract printed lines follow the paper; no readable words are mirrored.
      var lines = '';
      for (var i = 0; i < 9; i += 1) {
        var fraction = (i + 1) / 11;
        var lineLength = i === 8 ? 150 : (i % 3 === 0 ? 178 : 185);
        var startX = 400 + 25 * width;
        var startY = 340 + 155 * fraction - 8 - 13 * lift;
        var endX = 400 + (lineLength + 25 * fraction) * width;
        var endY = 300 + 160 * fraction - (122 - 37 * fraction) * lift + 3;
        lines += 'M' + n(startX) + ' ' + n(startY) + ' Q' + n(400 + 105 * width) + ' ' + n((startY + endY) / 2 - 13) + ' ' + n(endX) + ' ' + n(endY);
      }
      ink.setAttribute('d', lines);
      ink.setAttribute('opacity', width >= 0 ? '.38' : '.19');
      crease.setAttribute('opacity', n(.14 + .24 * lift));
      // Reset between leaves while invisible; both fades happen while flat.
      var opacity = phase < .08 ? phase / .08 : (phase > .88 ? Math.max(0, 1 - (phase - .88) / .12) : 1);
      leaf.setAttribute('opacity', n(opacity));
    };
  };

  scenes.cinema = function (svg) {
    var front = svg.querySelector('[data-cinema-reel-front]');
    var rear = svg.querySelector('[data-cinema-reel-rear]');
    var film = svg.querySelector('[data-cinema-film]');
    var takeup = svg.querySelector('[data-cinema-takeup]');
    return function render(timeSeconds) {
      var seconds = finiteTime(timeSeconds);
      if (front) front.setAttribute('transform', 'rotate(' + n((seconds % 7.2) / 7.2 * 360) + ')');
      if (rear) rear.setAttribute('transform', 'rotate(' + n((seconds % 9.6) / 9.6 * 360) + ')');
      if (film) film.setAttribute('stroke-dashoffset', n(-(seconds * 18) % 24));
      if (takeup) takeup.setAttribute('transform', 'rotate(' + n((seconds % 3.6) / 3.6 * 360) + ')');
    };
  };
}());
