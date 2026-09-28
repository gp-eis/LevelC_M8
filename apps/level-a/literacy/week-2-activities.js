const stage = document.querySelector('.week2-stage');
const targets = [...stage.querySelectorAll('.week2-target')];
const startLayer = stage.querySelector('.week2-start');
const startButton = startLayer.querySelector('button');
const feedback = document.querySelector('[data-feedback]');
const resetButton = document.querySelector('[data-reset]');
const completion = document.querySelector('[data-completion]');
const video = completion.querySelector('video');
const staticCelebration = completion.querySelector('[data-static-celebration]');
const lines = stage.querySelector('.week2-lines');
const kind = document.body.dataset.activity;
let active = false;
let complete = false;
let selected = null;
let matched = new Set();
let returnFocus = null;
let celebrationTimer = 0;
window.addEventListener('pagehide', () => window.clearTimeout(celebrationTimer));
const colours = { weight: '#cf438b', rope: '#d39c10', hoop: '#357ccc' };

function shuffleWordChoices() {
  if (kind !== 'word' || targets.length !== 5) return;
  const previous = [...targets];
  for (let i = targets.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [targets[i], targets[j]] = [targets[j], targets[i]];
  }
  // Even a coincidentally identical shuffle must produce a new arrangement.
  if (targets.every((target, i) => target === previous[i])) {
    targets.push(targets.shift());
  }
  // Keep the words beside the illustration; longer words receive wider pills.
  for (let row = 0; row < 2; row++) {
    const pair = targets.slice(row * 2, row * 2 + 2);
    const weights = pair.map(target => target.textContent.trim().length + 2);
    const firstWidth = 31 * weights[0] / (weights[0] + weights[1]);
    pair.forEach((target, column) => {
      target.style.left = `${column === 0 ? 62 : 64 + firstWidth}%`;
      target.style.top = `${56 + row * 13}%`;
      target.style.width = `${column === 0 ? firstWidth : 31 - firstWidth}%`;
    });
  }
  Object.assign(targets[4].style, { left: '67%', top: '82%', width: '23%' });
  // Move the existing nodes, preserving answer data and click handlers while
  // making keyboard order agree with the new visual order.
  targets.forEach(target => stage.insertBefore(target, startLayer));
}

function closeCelebration() {
  video.pause();
  completion.hidden = true;
  document.body.classList.remove('completion-open');
  (returnFocus && !returnFocus.disabled ? returnFocus : resetButton).focus({ preventScroll: true });
}
function finish() {
  if (complete) return;
  complete = true;
  targets.forEach(target => target.disabled = true);
  feedback.textContent = 'Great job!';
  returnFocus = document.activeElement;
  celebrationTimer = window.setTimeout(showCelebration, 500);
}
function showCelebration() {
  celebrationTimer = 0;
  if (!complete) return;
  completion.hidden = false;
  document.body.classList.add('completion-open');
  completion.querySelector('[data-close]').focus();
  video.hidden = false;
  staticCelebration.hidden = true;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    video.hidden = true;
    staticCelebration.hidden = false;
  } else {
    video.currentTime = 0;
    video.play().catch(() => { video.hidden = true; staticCelebration.hidden = false; });
  }
}
function reset() {
  window.clearTimeout(celebrationTimer);
  active = false;
  complete = false;
  selected = null;
  matched = new Set();
  lines?.replaceChildren();
  feedback.textContent = '';
  const answerFill = stage.querySelector('[data-answer-fill]');
  if (answerFill) answerFill.textContent = '';
  shuffleWordChoices();
  targets.forEach(target => {
    target.disabled = true;
    target.classList.remove('is-correct', 'is-selected', 'is-wrong');
    target.setAttribute('aria-pressed', 'false');
  });
  startLayer.hidden = false;
  startButton.focus({ preventScroll: true });
}
function wrong(target) {
  feedback.textContent = 'Try again.';
  target.classList.remove('is-wrong');
  void target.offsetWidth;
  target.classList.add('is-wrong');
  setTimeout(() => target.classList.remove('is-wrong'), 450);
}
function addLine(a, b) {
  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  for (const [key, value] of Object.entries({x1:a.dataset.x, y1:a.dataset.y, x2:b.dataset.x, y2:b.dataset.y, stroke:colours[a.dataset.match]})) line.setAttribute(key, value);
  lines.append(line);
}
function connect(target) {
  if (matched.has(target.dataset.match)) return;
  if (!selected || selected.dataset.side === target.dataset.side) {
    targets.forEach(item => { item.classList.remove('is-selected'); if (!item.classList.contains('is-correct')) item.setAttribute('aria-pressed', 'false'); });
    selected = target;
    target.classList.add('is-selected');
    target.setAttribute('aria-pressed', 'true');
    feedback.textContent = target.dataset.side === 'word' ? 'Choose the matching picture.' : 'Choose the matching words.';
    return;
  }
  if (selected.dataset.match !== target.dataset.match) { wrong(target); return; }
  addLine(selected, target);
  matched.add(target.dataset.match);
  [selected, target].forEach(item => { item.classList.remove('is-selected'); item.classList.add('is-correct'); item.setAttribute('aria-pressed', 'true'); item.disabled = true; });
  selected = null;
  feedback.textContent = `${matched.size} of 3 matched!`;
  if (matched.size === 3) finish();
}
targets.forEach(target => target.addEventListener('click', () => {
  if (!active || complete) return;
  if (kind === 'connect') { connect(target); return; }
  if (target.dataset.correct !== 'true') { wrong(target); return; }
  target.classList.add('is-correct');
  target.setAttribute('aria-pressed', 'true');
  target.disabled = true;
  matched.add(target.dataset.id);
  const answerFill = stage.querySelector('[data-answer-fill]');
  if (answerFill) answerFill.textContent = target.dataset.id;
  const total = targets.filter(item => item.dataset.correct === 'true').length;
  feedback.textContent = `${matched.size} of ${total}!`;
  if (matched.size === total) finish();
}));
startButton.addEventListener('click', event => {
  active = true;
  startLayer.hidden = true;
  targets.forEach(target => target.disabled = false);
  // Keyboard/assistive activation needs a focus destination; pointer starts do not.
  if (event.detail === 0) targets[0]?.focus({ preventScroll: true });
});
resetButton.addEventListener('click', reset);
completion.querySelector('[data-close]').addEventListener('click', closeCelebration);
completion.querySelector('[data-try-again]').addEventListener('click', () => { closeCelebration(); reset(); });
video.addEventListener('error', () => { video.hidden = true; staticCelebration.hidden = false; });
completion.addEventListener('keydown', event => {
  if (event.key === 'Escape') { event.preventDefault(); closeCelebration(); }
  if (event.key === 'Tab') {
    const buttons = [...completion.querySelectorAll('button')];
    const first = buttons[0], last = buttons.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
});
reset();
