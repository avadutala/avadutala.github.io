/* A quiet, four-shot tennis rally. The shared controller owns time and pause. */
(function () {
  'use strict';

  var registry = window.VidyaHomeScenes = window.VidyaHomeScenes || {};

  registry.tennis = function (svg) {
    var left = svg.querySelector('[data-rally-racket-left]');
    var right = svg.querySelector('[data-rally-racket-right]');
    var ball = svg.querySelector('[data-rally-ball]');
    var spin = svg.querySelector('[data-rally-spin]');
    var shadow = svg.querySelector('[data-rally-shadow]');
    var bounce = svg.querySelector('[data-rally-bounce]');
    if (!left || !right || !ball || !spin || !shadow || !bounce) {
      return function () {};
    }

    // Each 2-second flight has one bounce at 78% of its travel. The endpoints
    // are string-bed centres: left near, right far, left far, right near.
    // Court dimensions and net geometry remain those of tennis-court.svg.
    var contacts = [
      { x: 125, y: 190 }, { x: 675, y: 330 },
      { x: 125, y: 330 }, { x: 675, y: 190 }
    ];
    var period = 8;
    var flight = 2;
    var bounceAt = 0.78;
    var contactHeight = 12;
    var phaseOffset = 0.65; // Start with the ball already in a readable rally.
    function f(value) { return value.toFixed(3); }
    function mix(a, b, fraction) { return a + (b - a) * fraction; }
    function contactPulse(t, offset) {
      var distance = ((t - offset + 2) % 4 + 4) % 4 - 2;
      return Math.exp(-Math.pow(distance / 0.17, 2));
    }

    return function render(timeSeconds) {
      var elapsed = Number.isFinite(timeSeconds) ? Math.max(0, timeSeconds) : 0;
      var t = (elapsed + phaseOffset) % period;
      var leg = Math.floor(t / flight);
      var p = (t - leg * flight) / flight;
      var start = contacts[leg];
      var end = contacts[(leg + 1) % contacts.length];
      var floorX = mix(start.x, end.x, p);
      var floorY = mix(start.y + contactHeight, end.y + contactHeight, p);

      // Two gentle arcs meet the court at the bounce. Vertical screen offset
      // and shadow spread suggest height; these are illustrative, not scaled
      // ballistics. At either hit, the ball meets the racket's exact centre.
      var u;
      var height;
      if (p <= bounceAt) {
        u = p / bounceAt;
        height = contactHeight * (1 - u) + 4 * 18 * u * (1 - u);
      } else {
        u = (p - bounceAt) / (1 - bounceAt);
        height = contactHeight * u + 4 * 6 * u * (1 - u);
      }

      // Both rackets settle at the receiving lane at impact, then move gently
      // towards their next return. Rotation pivots through the string bed.
      var leftY = 260 - 70 * Math.cos(Math.PI * t / 4);
      var rightY = 260 + 70 * Math.sin(Math.PI * t / 4);
      var leftAngle = 18 - 30 * contactPulse(t, 0);
      var rightAngle = -18 + 30 * contactPulse(t, 2);
      left.setAttribute('transform', 'translate(125 ' + f(leftY) + ') rotate(' + f(leftAngle) + ')');
      right.setAttribute('transform', 'translate(675 ' + f(rightY) + ') rotate(' + f(rightAngle) + ')');

      ball.setAttribute('transform', 'translate(' + f(floorX) + ' ' + f(floorY - height) + ') scale(' + f(1 + height * 0.0044) + ')');
      spin.setAttribute('transform', 'rotate(' + f((elapsed + phaseOffset) * 140 % 360) + ')');
      shadow.setAttribute('cx', f(floorX + 2));
      shadow.setAttribute('cy', f(floorY + 2));
      shadow.setAttribute('rx', f(5.5 + height * 0.13));
      shadow.setAttribute('ry', f(2.4 + height * 0.05));
      shadow.setAttribute('opacity', f(0.25 - height * 0.004));

      var afterBounce = (p - bounceAt) / 0.14;
      if (afterBounce >= 0 && afterBounce <= 1) {
        bounce.setAttribute('cx', f(mix(start.x, end.x, bounceAt)));
        bounce.setAttribute('cy', f(mix(start.y + contactHeight, end.y + contactHeight, bounceAt)));
        bounce.setAttribute('rx', f(6 + 16 * afterBounce));
        bounce.setAttribute('ry', f(3 + 8 * afterBounce));
        bounce.setAttribute('opacity', f(0.52 * (1 - afterBounce)));
      } else {
        bounce.setAttribute('opacity', '0');
      }
    };
  };
}());
