import { clips } from './clips.js?deploy=20261003-level-c-tpr-and-lesson-tools-v11';
const params = new URLSearchParams(location.search);
const level = /^[abc]$/.test(params.get('level')) ? params.get('level') : 'a';
const week = /^[1-4]$/.test(params.get('week')) ? params.get('week') : '1';
const root = new URL(`https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-${level}`, import.meta.url);
const fallback = new URL(level === 'a' ? `literacy/flashcards.html?week=${week}` : `week-${week}/${level === 'b' ? 'literacy' : 'lessons'}/flashcards.html`, root);
let back = fallback;
try {
  const candidate = new URL(params.get('return') || fallback.href, location.origin);
  if (candidate.origin === location.origin && candidate.pathname.startsWith(root.pathname)) back = candidate;
} catch {}
document.title = `TPR — Level ${level.toUpperCase()} Week ${week}`;
document.querySelector('#tpr-context').textContent = `Level ${level.toUpperCase()} · Month 8 · Week ${week}`;
const nav = document.querySelector('gp-navigation');
nav.dataset.mainHref = new URL('index.html', root).href;
nav.dataset.weekHref = new URL(level === 'a' ? `week-${week}.html#card-literacy` : `week-${week}/#card-literacy`, root).href;
nav.dataset.sectionHref = back.href;
nav.dataset.previousHref = back.href;
const style = document.createElement('link');
style.rel = 'stylesheet';
style.href = new URL('assets/navigation/gp-navigation.css?deploy=20261003-level-c-tpr-and-lesson-tools-v11', root).href;
document.head.append(style);
await import(new URL('assets/navigation/gp-navigation.js?deploy=20261003-level-c-tpr-and-lesson-tools-v11', root).href);
// The shared TPR route is outside each level's literacy directory, so give
// its floating navigation an explicit return to the originating flashcards.
nav.querySelector('.gp-navigation__previous')?.remove();
let returnLink = nav.querySelector('.gp-navigation__context');
if (!returnLink) {
  returnLink = document.createElement('a');
  returnLink.className = 'gp-navigation__context';
  nav.querySelector('.gp-navigation__links').append(returnLink);
}
returnLink.href = back.href;
returnLink.setAttribute('aria-label', 'Back to Flashcards');
returnLink.title = 'Back to Flashcards';
returnLink.innerHTML = '<span aria-hidden="true">←</span><span class="gp-navigation__label">Flashcards</span>';
const entries = clips[level][week];
if (entries.length) {
  const container = document.querySelector('#tpr-clips');
  container.replaceChildren();
  container.classList.add('tpr-grid');
  for (const entry of entries) {
    const card = document.createElement('article');
    card.className = 'tpr-card';
    const heading = document.createElement('h2');
    heading.textContent = entry.word;
    const video = document.createElement('video');
    video.controls = true;
    video.playsInline = true;
    video.preload = 'metadata';
    video.src = new URL(entry.src, new URL('./clips.js?deploy=20261003-level-c-tpr-and-lesson-tools-v11', import.meta.url)).href;
    video.setAttribute('aria-label', `${entry.word} TPR action`);
    card.append(heading, video);
    container.append(card);
  }
}
