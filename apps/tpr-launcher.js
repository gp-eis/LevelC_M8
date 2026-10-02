function normalizeFlashcardReturn(level, week) {
  const nav = document.querySelector('gp-navigation');
  const links = nav?.querySelector('.gp-navigation__links');
  if (!links) return;
  document.body.classList.add('gp-flashcard-navigation');
  let back = document.querySelector('.literacy-tool-return, .b-return') || links.querySelector('.gp-navigation__context');
  if (!back) {
    back = document.createElement('a');
    let target = new URL(level === 'a' ? (week === '1' ? 'video.html' : `week-${week}.html`) : level === 'b' ? 'page-01.html' : `week-${week}-page-01.html`, location.href);
    try {
      const requested = new URL(new URLSearchParams(location.search).get('return') || target.href, location.href);
      const directory = target.pathname.slice(0, target.pathname.lastIndexOf('/') + 1);
      if (requested.origin === location.origin && requested.pathname.startsWith(directory) && /(?:page-\d+|video-activity)\.html$/.test(requested.pathname)) target = requested;
    } catch (_) { /* Keep the same-week opening-page fallback. */ }
    target.hash = 'lesson-focus'; back.href = target.href; back.textContent = 'Back to Page 1';
  }
  const label = back.getAttribute('aria-label') || back.textContent.replace(/^\s*←\s*/, '').trim();
  back.classList.add('gp-navigation__context', 'gp-navigation__section', 'gp-context-return');
  back.classList.remove('b-return-mobile'); back.style.margin = '0';
  back.setAttribute('aria-label', label); back.title = label;
  const icon = document.createElement('span'); icon.className = 'gp-navigation__icon'; icon.textContent = '←'; icon.setAttribute('aria-hidden', 'true');
  const text = document.createElement('span'); text.className = 'gp-navigation__label'; text.textContent = label;
  back.replaceChildren(icon, text); links.append(back);
  document.querySelectorAll('.literacy-tools, main .fc-return, main [data-tool-return], main .tool-return').forEach(item => item.remove());
  links.querySelectorAll('.gp-navigation__context').forEach(item => { if (item !== back) item.remove(); });
}

function makePanel(level, week) {
  const panel = document.createElement('section');
  panel.className = 'fc-panel fc-tpr-panel';
  panel.dataset.panel = 'tpr';
  panel.hidden = true;
  panel.setAttribute('aria-label', 'TPR video flashcards');
  panel.innerHTML = '<div class="fc-tpr-stage"><button type="button" class="fc-tpr-arrow" data-tpr-prev aria-label="Previous TPR card" hidden>‹</button><div class="fc-tpr-card"><p class="fc-tpr-empty">Your TPR video flashcards are coming soon!</p></div><button type="button" class="fc-tpr-arrow" data-tpr-next aria-label="Next TPR card" hidden>›</button></div><p class="fc-tpr-counter" data-tpr-count></p><div class="fc-tpr-thumbs" aria-label="Choose a TPR video flashcard"></div>';
  import('./tpr/clips.js?v=20261003-c-all-complete&deploy=20261003-level-c-tpr-and-lesson-tools-v11').then(({ clips }) => {
    const supplied = clips[level][week] || [];
    // Keep the EES key-sentence page after all individual action cards.
    const entries = [...supplied.filter(entry => entry.kind !== 'key-sentence'), ...supplied.filter(entry => entry.kind === 'key-sentence')];
    if (!entries.length) return;
    const card = panel.querySelector('.fc-tpr-card');
    const heading = document.createElement('h3');
    const video = document.createElement('video');
    video.controls = false;
    video.playsInline = true;
    video.preload = 'metadata';
    const screen = document.createElement('div');
    screen.className = 'fc-tpr-screen';
    screen.append(video);
    card.replaceChildren(screen, heading);
    panel.querySelectorAll('.fc-tpr-arrow').forEach(arrow => { arrow.hidden = false; });
    const playback = document.createElement('button');
    playback.type = 'button';
    playback.className = 'fc-tpr-play';
    playback.innerHTML = '<span aria-hidden="true">▶</span>';
    playback.setAttribute('aria-label', 'Play TPR clip');
    screen.append(playback);
    const updatePlayback = () => {
      playback.hidden = !video.paused && !video.ended;
      playback.setAttribute('aria-label', video.ended ? 'Replay TPR clip' : 'Play TPR clip');
    };
    const start = () => {
      if (panel.hidden) return;
      video.play().catch(() => {
        updatePlayback();
      });
    };
    playback.onclick = () => {
      if (video.ended) video.currentTime = 0;
      video.paused ? start() : video.pause();
    };
    card.onclick = event => { if (!event.target.closest('button')) playback.onclick(); };
    video.tabIndex = 0;
    video.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); playback.onclick(); }
    });
    video.addEventListener('play', updatePlayback);
    video.addEventListener('pause', updatePlayback);
    video.addEventListener('ended', updatePlayback);
    video.addEventListener('loadedmetadata', () => {
      card.style.setProperty('--tpr-ratio', String(video.videoWidth / video.videoHeight));
      panel.querySelector('.fc-tpr-stage').style.setProperty('--tpr-ratio', String(video.videoWidth / video.videoHeight));
    });
    panel.addEventListener('tpr-open', () => { video.currentTime = 0; start(); });
    let index = 0;
    const show = next => {
      index = (next + entries.length) % entries.length;
      video.pause();
      video.src = new URL(entries[index].src, new URL('./tpr/clips.js?deploy=20261003-level-c-tpr-and-lesson-tools-v11', import.meta.url)).href;
      video.setAttribute('aria-label', entries[index].word + ' TPR action');
      if (entries[index].poster) video.poster = new URL(entries[index].poster, new URL('./tpr/clips.js?deploy=20261003-level-c-tpr-and-lesson-tools-v11', import.meta.url)).href;
      else video.removeAttribute('poster');
      heading.textContent = entries[index].word;
      panel.querySelector('[data-tpr-count]').textContent = 'Card ' + (index + 1) + ' of ' + entries.length;
      panel.querySelectorAll('[data-tpr-index]').forEach(button => {
        const selected = Number(button.dataset.tprIndex) === index;
        button.classList.toggle('is-active', selected);
        button.setAttribute('aria-pressed', String(selected));
      });
      start();
    };
    entries.forEach((entry, i) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.tprIndex = i;
      button.textContent = entry.word;
      if (entry.poster) {
        const image = document.createElement('img');
        image.src = new URL(entry.poster, new URL('./tpr/clips.js?deploy=20261003-level-c-tpr-and-lesson-tools-v11', import.meta.url)).href;
        image.alt = '';
        button.prepend(image);
      }
      button.onclick = () => show(i);
      panel.querySelector('.fc-tpr-thumbs').append(button);
    });
    panel.querySelector('[data-tpr-prev]').onclick = () => show(index - 1);
    panel.querySelector('[data-tpr-next]').onclick = () => show(index + 1);
    show(0);
  });
  return panel;
}
function initialize() {
  const level = location.pathname.match(/\/level-([abc])\//)?.[1];
  const tabs = document.querySelector('.fc-tabs, .fc-source-tabs');
  if (!level || !tabs || tabs.querySelector('[data-tpr-link]')) return;
  const week = location.pathname.match(/\/week-([1-4])\//)?.[1] || location.pathname.match(/\/flashcards-week-([1-4])\.html$/)?.[1] || new URLSearchParams(location.search).get('week') || '1';
  normalizeFlashcardReturn(level, week);
  addEventListener('load', () => normalizeFlashcardReturn(level, week), { once: true });
  matchMedia('(min-width:721px)').addEventListener('change', () => normalizeFlashcardReturn(level, week));
  const button = document.createElement('button');
  button.type = 'button';
  button.dataset.tprLink = '';
  button.className = level === 'c' ? 'fc-tpr-source' : 'fc-tab';
  button.textContent = '🎬 TPR';
  tabs.append(button);
  const panel = makePanel(level, week);
  if (level === 'c') {
    const content = document.createElement('div');
    [...tabs.parentElement.children].filter(child => child !== tabs).forEach(child => content.append(child));
    tabs.after(content);
    content.after(panel);
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-selected', 'false');
    button.onclick = () => {
      tabs.querySelectorAll('.fc-source-tab').forEach(tab => {
        tab.classList.remove('is-active');
        tab.setAttribute('aria-selected', 'false');
      });
      button.classList.add('is-active');
      button.setAttribute('aria-selected', 'true');
      content.style.display = 'none';
      panel.hidden = false;
      panel.dispatchEvent(new Event('tpr-open'));
    };
    tabs.addEventListener('click', event => {
      if (!event.target.closest('.fc-source-tab')) return;
      button.classList.remove('is-active');
      button.setAttribute('aria-selected', 'false');
      content.style.display = '';
      panel.hidden = true;
      panel.querySelector('video')?.pause();
    }, true);
  } else {
    button.dataset.tab = 'tpr';
    button.setAttribute('aria-pressed', 'false');
    document.querySelector('.fc-workbench').append(panel);
    button.onclick = () => {
      tabs.querySelectorAll('[data-tab]').forEach(tab => {
        const active = tab === button;
        tab.classList.toggle('is-active', active);
        tab.setAttribute('aria-pressed', String(active));
      });
      document.querySelectorAll('[data-panel]').forEach(item => {
        item.hidden = item !== panel;
        item.classList.toggle('is-active', item === panel);
      });
      panel.dispatchEvent(new Event('tpr-open'));
    };
    tabs.addEventListener('click', event => {
      if (event.target.closest('[data-tab]') !== button) panel.querySelector('video')?.pause();
    }, true);
  }
  const style = document.createElement('link');
  style.rel = 'stylesheet';
  style.href = new URL('./tpr/launcher.css?v=20261001-floating-return-v7&deploy=20261003-level-c-tpr-and-lesson-tools-v11', import.meta.url).href;
  document.head.append(style);
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once: true });
else initialize();
