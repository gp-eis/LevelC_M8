(() => {
  'use strict';
  const requested = new URLSearchParams(location.search).get('week');
  const week = /^[1-4]$/.test(requested || '') ? Number(requested) : 1;
  // Verified against both rendered spreads of My Phonics Book 8, October 2026.
  // Source wording is "I see the ..." for every entry, including paint.
  const vocabulary = {
    1: ['octopus', 'olive', 'omelet'],
    2: ['orange', 'otter', 'ox'],
    3: ['paint', 'pen', 'pencil'],
    4: ['penguin', 'piano', 'pig']
  };
  const upper = week <= 2 ? 'O' : 'P';
  const lowercase = week % 2 === 0;
  const target = lowercase ? upper.toLowerCase() : upper;
  const words = vocabulary[week].map(id => ({
    id, label: id[0].toUpperCase() + id.slice(1), word: lowercase ? id : id.toUpperCase(),
    suffix: lowercase ? id.slice(1) : id.slice(1).toUpperCase(), sentence: 'I see the ' + id + '.',
    image: '../assets/media/phonics/week-' + week + '/elements/' + id + '-3d-v1.png'
  }));
  window.PHONICS_WEEK = { week, upper, lower: upper.toLowerCase(), target, lowercase, words };
  window.configurePhonicsWeek = () => {
    const origin = new URLSearchParams(location.search).get('from') === 'phonics' ? 'phonics' : 'games';
    document.title = document.title.replace(/Week 1/g, 'Week ' + week);
    document.querySelectorAll('a[href]').forEach(link => {
      const url = new URL(link.getAttribute('href'), location.href);
      if (url.origin !== location.origin) return;
      if (/\/(?:phonics(?:-[a-z-]+)?|index)\.html$/.test(url.pathname) && url.pathname.includes('/games/')) {
        url.searchParams.set('week', String(week));
        if (/\/phonics(?:-[a-z-]+)?\.html$/.test(url.pathname)) url.searchParams.set('from', origin);
        link.href = url.href;
      }
    });
    document.querySelectorAll('[data-phonics-arcade]').forEach(link => {
      const url = new URL(link.href);
      url.searchParams.set('level', 'a');
      url.searchParams.set('week', String(week));
      url.searchParams.set('return', `/LevelC_M8/apps/level-a/games/phonics.html?week=${week}&from=${origin}`);
      link.href = url.href;
    });
    const nav = document.querySelector('gp-navigation');
    if (nav) {
      nav.dataset.weekHref = '../week-' + week + '.html#card-' + (origin === 'phonics' ? 'phonics' : 'games');
      nav.dataset.trail = 'Level A · Week ' + week + ' · Phonics Games';
      // The existing Phonics Games link already returns to the list.
      delete nav.dataset.previousHref;
      nav.dataset.sectionHref = 'phonics.html?week=' + week + '&from=' + origin;
    }
    const contextReturn = document.querySelector('[data-phonics-context-return]');
    if (contextReturn) {
      contextReturn.textContent = origin === 'phonics' ? '← Phonics Lesson' : '← All Games';
      contextReturn.href = origin === 'phonics'
        ? '../phonics/week-' + week + '.html'
        : week === 1 ? 'index.html' : 'week-' + week + '.html';
    }
    const subtitle = document.querySelector('.game-list-subtitle');
    if (subtitle) subtitle.textContent = 'Week ' + week + ' — pick a phonics game!';
    const hint = document.querySelector('.game-nav-card__hint');
    if (hint) hint.textContent = 'Find every ' + target + '!';
    const instruction = document.querySelector('#find-instruction');
    if (instruction) {
      instruction.textContent = 'Circle the letter: ' + target;
      document.querySelector('#target-listen').setAttribute('aria-label', 'Hear the sound of letter ' + target);
      document.querySelector('#success-title').textContent = 'You found every ' + target + '!';
    }
    const tile = document.querySelector('#letter-tile');
    if (tile) {
      tile.textContent = target;
      tile.setAttribute('aria-label', 'Drag letter ' + target);
      document.querySelector('.subtitle').textContent = 'Drag the letter ' + target + ' along the path to finish the word!';
    }
  };
  window.addEventListener('pagehide', () => {
    if ('speechSynthesis' in window) speechSynthesis.cancel();
    if (window._phonemeAudio) window._phonemeAudio.pause();
  });
})();
