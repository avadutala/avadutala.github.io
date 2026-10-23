/* Keyboard-accessible personal reflections. All five remain readable without JS. */
(() => {
  'use strict';
  const switcher = document.querySelector('[data-music-switcher]');
  if (!switcher) return;
  const buttons = Array.from(switcher.querySelectorAll('[data-music-tab]'));
  const panels = buttons.map(button => document.getElementById(button.getAttribute('aria-controls')));
  if (!buttons.length || panels.some(panel => !panel)) return;

  function choose(index, moveFocus = false) {
    buttons.forEach((button, position) => {
      const selected = position === index;
      button.setAttribute('aria-selected', String(selected));
      button.tabIndex = selected ? 0 : -1;
      panels[position].hidden = !selected;
    });
    if (moveFocus) buttons[index].focus();
  }

  switcher.setAttribute('role', 'tablist');
  switcher.setAttribute('aria-orientation', 'horizontal');
  buttons.forEach((button, index) => {
    button.setAttribute('role', 'tab');
    panels[index].setAttribute('role', 'tabpanel');
    panels[index].setAttribute('aria-labelledby', button.id);
    panels[index].tabIndex = 0;
    button.addEventListener('click', () => choose(index));
    button.addEventListener('keydown', event => {
      let next = index;
      if (event.key === 'ArrowRight') next = (index + 1) % buttons.length;
      else if (event.key === 'ArrowLeft') next = (index - 1 + buttons.length) % buttons.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = buttons.length - 1;
      else return;
      event.preventDefault();
      choose(next, true);
    });
  });
  choose(0);
  switcher.hidden = false;
})();
