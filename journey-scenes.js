/* Deterministic illustration renderers. The shared controller owns playback. */
(function () {
  'use strict';

  window.VidyaHomeScenes = window.VidyaHomeScenes || {};

  window.VidyaHomeScenes.engineering = function (svg) {
    var loads = svg.querySelector('[data-eng-loads]');
    var flow = svg.querySelector('[data-eng-flow]');
    var markerA = svg.querySelector('[data-eng-marker-a]');
    var markerB = svg.querySelector('[data-eng-marker-b]');
    var corners = [[60, 177], [242, 104], [541, 146], [358, 219], [60, 177]];
    var lengths = [];
    var perimeter = 0;
    for (var i = 0; i < corners.length - 1; i += 1) {
      var length = Math.hypot(corners[i + 1][0] - corners[i][0], corners[i + 1][1] - corners[i][1]);
      lengths.push(length);
      perimeter += length;
    }

    function moveMarker(marker, phase) {
      if (!marker) return;
      var distance = (phase % 1) * perimeter;
      for (var j = 0; j < lengths.length; j += 1) {
        if (distance <= lengths[j] || j === lengths.length - 1) {
          var amount = distance / lengths[j];
          var x = corners[j][0] + (corners[j + 1][0] - corners[j][0]) * amount;
          var y = corners[j][1] + (corners[j + 1][1] - corners[j][1]) * amount;
          marker.setAttribute('transform', 'translate(' + x.toFixed(3) + ' ' + y.toFixed(3) + ')');
          return;
        }
        distance -= lengths[j];
      }
    }

    return function render(timeSeconds) {
      var seconds = Number.isFinite(timeSeconds) ? Math.max(0, timeSeconds) : 0;
      var phase = (seconds % 12) / 12;
      if (loads) loads.setAttribute('transform', 'translate(0 ' + (Math.sin(seconds * Math.PI / 3) * 6).toFixed(3) + ')');
      if (flow) flow.setAttribute('stroke-dashoffset', (-phase * 100).toFixed(3));
      moveMarker(markerA, phase);
      moveMarker(markerB, phase + 0.5);
    };
  };

  window.VidyaHomeScenes.travel = function (svg) {
    var globe = svg.querySelector('[data-voyage-globe]');
    var plane = svg.querySelector('[data-voyage-plane]');
    var cloud = svg.querySelector('[data-voyage-cloud]');
    var turn = -18 * Math.PI / 180;
    var turnCos = Math.cos(turn);
    var turnSin = Math.sin(turn);

    return function render(timeSeconds) {
      var seconds = Number.isFinite(timeSeconds) ? Math.max(0, timeSeconds) : 0;
      var theta = (seconds % 28) / 28 * Math.PI * 2 - Math.PI * 3 / 4;
      var x = 281 * Math.cos(theta);
      var y = 195 * Math.sin(theta);
      var dx = -281 * Math.sin(theta);
      var dy = 195 * Math.cos(theta);
      var rotatedX = x * turnCos - y * turnSin;
      var rotatedY = x * turnSin + y * turnCos;
      var angle = Math.atan2(dx * turnSin + dy * turnCos, dx * turnCos - dy * turnSin) * 180 / Math.PI;
      if (plane) plane.setAttribute('transform', 'translate(' + (350 + rotatedX).toFixed(3) + ' ' + (265 + rotatedY).toFixed(3) + ') rotate(' + angle.toFixed(3) + ')');
      if (globe) globe.setAttribute('transform', 'rotate(' + (Math.sin(seconds * Math.PI / 14) * 3).toFixed(3) + ' 350 265)');
      if (cloud) cloud.setAttribute('transform', 'translate(' + (Math.sin(seconds * Math.PI / 10) * 9).toFixed(3) + ' 0)');
    };
  };
}());
