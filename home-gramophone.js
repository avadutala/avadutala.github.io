/* Homepage scene renderer. The shared motion controller owns time and playback. */
(function () {
  'use strict';

  window.VidyaHomeScenes = window.VidyaHomeScenes || {};

  window.VidyaHomeScenes.gramophone = function (svg) {
    var record = svg.querySelector('[data-gram-record]');
    var revolutionSeconds = 8;

    // The fixed parent applies perspective. Rotate the circular record locally,
    // before that perspective transform, keeping the horn and needle still.
    return function render(timeSeconds) {
      if (!record) return;
      var seconds = Number.isFinite(timeSeconds) ? timeSeconds : 0;
      var angle = ((seconds % revolutionSeconds) / revolutionSeconds) * 360;
      record.setAttribute('transform', 'rotate(' + angle.toFixed(3) + ')');
    };
  };
}());
