/* Page illustrations. The shared motion controller owns playback and time. */
(function () {
  'use strict';

  window.VidyaHomeScenes = window.VidyaHomeScenes || {};

  window.VidyaHomeScenes.record = function (svg) {
    var record = svg.querySelector('[data-life-record]');
    var firstNote = svg.querySelector('[data-life-note-one]');
    var secondNote = svg.querySelector('[data-life-note-two]');

    return function render(timeSeconds) {
      var seconds = Number.isFinite(timeSeconds) ? timeSeconds : 0;
      var angle = (seconds % 12) * 30;
      var breath = Math.sin(seconds * Math.PI / 4);
      if (record) record.setAttribute('transform', 'rotate(' + angle.toFixed(3) + ' 400 348)');
      if (firstNote) firstNote.setAttribute('transform', 'translate(0 ' + (-5 * breath).toFixed(3) + ')');
      if (secondNote) secondNote.setAttribute('transform', 'translate(0 ' + (4 * breath).toFixed(3) + ')');
    };
  };

  window.VidyaHomeScenes.contact = function (svg) {
    var letter = svg.querySelector('[data-contact-letter]');
    var plane = svg.querySelector('[data-contact-plane]');

    return function render(timeSeconds) {
      var seconds = Number.isFinite(timeSeconds) ? timeSeconds : 0;
      var phase = seconds * Math.PI / 5;
      var lift = -18 * (1 - Math.cos(phase));
      var drift = Math.sin(phase);
      if (letter) letter.setAttribute('transform', 'translate(0 ' + lift.toFixed(3) + ')');
      if (plane) {
        plane.setAttribute('transform', 'translate(' + (12 * drift).toFixed(3) + ' ' + (-4 * drift).toFixed(3) + ') rotate(' + (3 * drift).toFixed(3) + ' 592 77)');
      }
    };
  };
}());
