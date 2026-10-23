/* Homepage bicycle: rendering only. home-motion.js owns time, visibility and pause. */
(function () {
  'use strict';
  window.VidyaHomeScenes = window.VidyaHomeScenes || {};
  window.VidyaHomeScenes.bike = function (svg) {
    var trail = svg.querySelector('[data-bike-path]');
    var rider = svg.querySelector('[data-bike-rider]');
    var wheels = svg.querySelectorAll('[data-bike-wheel]');
    var crank = svg.querySelector('[data-bike-crank]');
    var legs = {}, shoes = {}, pedals = {};
    ['near', 'far'].forEach(function (side) {
      legs[side] = svg.querySelector('[data-bike-leg="' + side + '"]');
      shoes[side] = svg.querySelector('[data-bike-shoe="' + side + '"]');
      pedals[side] = svg.querySelector('[data-bike-pedal="' + side + '"]');
    });
    if (!trail || !rider || !crank || !legs.near || !legs.far) return function () {};

    // Native SVG geometry is sampled once. Rendering uses interpolation only.
    var length = trail.getTotalLength();
    var count = 768;
    var samples = [];
    for (var i = 0; i <= count; i++) samples.push(trail.getPointAtLength(length * i / count));
    function pointAt(distance) {
      var index = Math.max(0, Math.min(count, distance / length * count));
      var low = Math.min(count - 1, Math.floor(index));
      var mix = index - low;
      return { x: samples[low].x + (samples[low + 1].x - samples[low].x) * mix,
        y: samples[low].y + (samples[low + 1].y - samples[low].y) * mix };
    }
    function n(value) { return value.toFixed(2); }
    function legPath(ankle) {
      // Two-joint leg: the knee bends forward and the ankle stays above its pedal.
      var hip = { x: -23, y: -101 };
      var dx = ankle.x - hip.x, dy = ankle.y - hip.y;
      var distance = Math.sqrt(dx * dx + dy * dy);
      var upper = 42, lower = 43;
      var projected = (upper * upper - lower * lower + distance * distance) / (2 * distance);
      var bend = Math.sqrt(Math.max(0, upper * upper - projected * projected));
      var kneeX = hip.x + projected * dx / distance + bend * dy / distance;
      var kneeY = hip.y + projected * dy / distance - bend * dx / distance;
      return 'M-23-101L' + n(kneeX) + ' ' + n(kneeY) + ' ' + n(ankle.x) + ' ' + n(ankle.y);
    }
    var duration = 22;
    var initialPhase = 0.44;
    var scale = 1.25;
    var halfWheelbase = 59 * scale;

    return function render(timeSeconds) {
      var phase = ((timeSeconds / duration + initialPhase) % 1 + 1) % 1;
      var distance = phase * length;
      var rear = pointAt(distance - halfWheelbase);
      var front = pointAt(distance + halfWheelbase);
      var angle = Math.atan2(front.y - rear.y, front.x - rear.x) * 180 / Math.PI;
      var x = (rear.x + front.x) / 2;
      var y = (rear.y + front.y) / 2;
      rider.setAttribute('transform', 'translate(' + n(x) + ' ' + n(y) + ') rotate(' + n(angle) + ') scale(' + scale + ')');

      // Entry and exit are beyond the viewBox; a short fade makes the loop seamless.
      var opacity = Math.min(1, phase / 0.035, (1 - phase) / 0.035);
      rider.setAttribute('opacity', n(Math.max(0, opacity)));
      var wheelAngle = distance / (31 * scale) * 180 / Math.PI;
      for (var w = 0; w < wheels.length; w++) wheels[w].setAttribute('transform', 'rotate(' + n(wheelAngle % 360) + ')');

      var pedalAngle = timeSeconds * Math.PI * 1.4;
      var near = { x: -5 + 14 * Math.cos(pedalAngle), y: -34 + 14 * Math.sin(pedalAngle) };
      var far = { x: -5 - 14 * Math.cos(pedalAngle), y: -34 - 14 * Math.sin(pedalAngle) };
      crank.setAttribute('d', 'M' + n(far.x) + ' ' + n(far.y) + 'L' + n(near.x) + ' ' + n(near.y));
      [['near', near], ['far', far]].forEach(function (item) {
        var side = item[0], pedal = item[1];
        legs[side].setAttribute('d', legPath({ x: pedal.x - 2, y: pedal.y - 5 }));
        shoes[side].setAttribute('d', 'M' + n(pedal.x - 6) + ' ' + n(pedal.y - 3) + 'h16');
        pedals[side].setAttribute('d', 'M' + n(pedal.x - 5) + ' ' + n(pedal.y) + 'h10');
      });
    };
  };
}());
