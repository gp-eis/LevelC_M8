const activity = document.body.dataset.activity;
const feedback = document.querySelector('[data-feedback]');
const resetButton = document.querySelector('.reset-static-activity');
const completion = document.querySelector('[data-completion]');
const goodJob = completion?.querySelector('[data-good-job]');
const staticCelebration = completion?.querySelector('[data-static-celebration]');
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
let complete = false;
let resetCurrentActivity = () => {};
let celebrationTimer = 0;
window.addEventListener('pagehide', () => window.clearTimeout(celebrationTimer));
function closeCelebration({ restoreFocus = true } = {}) {
  if (!completion || completion.hidden) return;
  goodJob?.pause();
  completion.hidden = true;
  document.body.classList.remove('completion-open');
  if (restoreFocus) resetButton?.focus({ preventScroll: true });
}

function showFeedback(message, kind = '') {
  feedback.textContent = message;
  feedback.className = `activity-feedback ${kind}`.trim();
}

function showCelebration() {
  if (!completion) return;
  completion.hidden = false;
  document.body.classList.add('completion-open');
  completion.querySelector('[data-close]')?.focus();
  if (reduceMotion || !goodJob) {
    if (goodJob) goodJob.hidden = true;
    if (staticCelebration) staticCelebration.hidden = false;
    return;
  }
  staticCelebration.hidden = true;
  goodJob.hidden = false;
  goodJob.currentTime = 0;
  goodJob.play().catch(() => {
    goodJob.hidden = true;
    staticCelebration.hidden = false;
  });
}

function finish(message, { delay = 500 } = {}) {
  if (complete) return;
  complete = true;
  showFeedback(`⭐ ${message}`, 'good');
  window.clearTimeout(celebrationTimer);
  celebrationTimer = window.setTimeout(showCelebration, delay);
}

function setupCompletion() {
  if (!completion) return;
  completion.querySelector('[data-close]')?.addEventListener('click', () => closeCelebration());
  completion.querySelector('[data-try-again]')?.addEventListener('click', () => {
    closeCelebration({ restoreFocus: false });
    resetCurrentActivity();
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || completion.hidden) return;
    event.preventDefault();
    closeCelebration();
  });
  goodJob?.addEventListener('error', () => {
    goodJob.hidden = true;
    staticCelebration.hidden = false;
  });
}

function setupAudio() {
  const player = document.querySelector('[data-audio-player]');
  document.querySelectorAll('[data-audio], [data-speak]').forEach(button => button.addEventListener('click', () => {
    if (button.dataset.audio && player) {
      window.speechSynthesis?.cancel();
      player.src = button.dataset.audio;
      player.currentTime = 0;
      player.play().catch(() => showFeedback('The recording could not play. Try again.', 'try'));
      return;
    }
    if (button.dataset.speak && 'speechSynthesis' in window) {
      player?.pause();
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(button.dataset.speak);
      utterance.lang = 'en-US';
      utterance.rate = 0.82;
      window.speechSynthesis.speak(utterance);
      return;
    }
    showFeedback('The recording could not play. Try again.', 'try');
  }));
}

function setupMissingLetters() {
  const tokens = [...document.querySelectorAll('.letter-token')];
  const targets = [...document.querySelectorAll('.letter-target')];
  const bank = document.querySelector('.letter-bank');
  let selected = null;
  let placed = 0;

  function scrambleTokens() {
    const previous = [...bank.children].map(token => token.dataset.letter).join('');
    let shuffled = [...tokens];
    for (let attempt = 0; attempt < 12; attempt += 1) {
      shuffled = [...tokens];
      for (let index = shuffled.length - 1; index > 0; index -= 1) {
        const swap = Math.floor(Math.random() * (index + 1));
        [shuffled[index], shuffled[swap]] = [shuffled[swap], shuffled[index]];
      }
      if (shuffled.map(token => token.dataset.letter).join('') !== previous) break;
    }
    shuffled.forEach(token => bank.append(token));
  }

  function select(token) {
    if (token.disabled || complete) return;
    selected = token;
    tokens.forEach(item => item.setAttribute('aria-pressed', String(item === token)));
    showFeedback(`Letter ${token.dataset.letter} selected. Choose a word.`);
  }

  function place(target, token) {
    if (!token || token.disabled || target.disabled || complete) {
      if (!token && !target.disabled) showFeedback('Choose a letter first.', 'try');
      return;
    }
    if (token.dataset.letter !== target.dataset.answer) {
      target.classList.remove('is-wrong');
      void target.offsetWidth;
      target.classList.add('is-wrong');
      showFeedback('Try another word.', 'try');
      setTimeout(() => target.classList.remove('is-wrong'), 600);
      return;
    }
    target.querySelector('.missing-slot').textContent = token.dataset.letter;
    target.classList.add('is-correct');
    target.disabled = true;
    token.disabled = true;
    token.setAttribute('aria-pressed', 'false');
    selected = null;
    placed += 1;
    if (placed === targets.length) finish('All four words are complete!');
    else showFeedback(`${target.dataset.target} is complete!`, 'good');
  }

  tokens.forEach(token => {
    token.addEventListener('click', () => select(token));
    token.addEventListener('dragstart', event => {
      select(token);
      event.dataTransfer.setData('text/plain', token.dataset.tokenId);
    });
  });
  targets.forEach(target => {
    target.addEventListener('click', () => place(target, selected));
    target.addEventListener('dragover', event => { event.preventDefault(); target.classList.add('is-drop-ready'); });
    target.addEventListener('dragleave', () => target.classList.remove('is-drop-ready'));
    target.addEventListener('drop', event => {
      event.preventDefault();
      target.classList.remove('is-drop-ready');
      const token = tokens.find(item => item.dataset.tokenId === event.dataTransfer.getData('text/plain'));
      place(target, token);
    });
  });
  const reset = () => {
    window.clearTimeout(celebrationTimer);
    complete = false; selected = null; placed = 0;
    tokens.forEach(token => { token.disabled = false; token.setAttribute('aria-pressed', 'false'); });
    targets.forEach(target => { target.disabled = false; target.classList.remove('is-correct', 'is-wrong', 'is-drop-ready'); target.querySelector('.missing-slot').textContent = '_'; });
    showFeedback('');
    scrambleTokens();
    bank.querySelector('.letter-token')?.focus({ preventScroll: true });
  };
  resetCurrentActivity = reset;
  resetButton.addEventListener('click', reset);
  scrambleTokens();
}

function setupSingleChoice(selector, answer, correctMessage, initialMessage) {
  const buttons = [...document.querySelectorAll(selector)];
  buttons.forEach(button => button.addEventListener('click', () => {
    if (complete) return;
    const value = button.dataset.answerChoice ?? button.dataset.number;
    if (value === answer) {
      buttons.forEach(item => item.disabled = true);
      button.classList.add('is-correct');
      button.closest('.number-choices')?.classList.add('is-complete');
      finish(correctMessage);
    } else {
      button.classList.remove('is-wrong');
      void button.offsetWidth;
      button.classList.add('is-wrong');
      showFeedback('Try again.', 'try');
      setTimeout(() => button.classList.remove('is-wrong'), 600);
    }
  }));
  const reset = () => {
    window.clearTimeout(celebrationTimer);
    complete = false;
    document.querySelector('.number-choices')?.classList.remove('is-complete');
    buttons.forEach(button => { button.disabled = false; button.classList.remove('is-correct', 'is-wrong'); });
    showFeedback(initialMessage);
    buttons[0]?.focus({ preventScroll: true });
  };
  resetCurrentActivity = reset;
  resetButton.addEventListener('click', reset);
}

function setupCounter() {
  const output = document.querySelector('[data-count-value]');
  const up = document.querySelector('[data-count-up]');
  const down = document.querySelector('[data-count-down]');
  const go = document.querySelector('[data-count-go]');
  const selector = document.querySelector('.count-selector');
  let value = 0;

  function setValue(next) {
    selector.classList.remove('is-wrong');
    value = Math.max(0, Math.min(5, next));
    output.value = String(value);
    output.textContent = String(value);
    output.setAttribute('aria-label', `Selected number: ${value}`);
    up.disabled = complete || value === 5;
    down.disabled = complete || value === 0;
  }

  up.addEventListener('click', () => { if (!complete) setValue(value + 1); });
  down.addEventListener('click', () => { if (!complete) setValue(value - 1); });
  go.addEventListener('click', () => {
    if (complete) return;
    if (value !== 3) {
      selector.classList.remove('is-wrong');
      void selector.offsetWidth;
      selector.classList.add('is-wrong');
      showFeedback('Try again.', 'try');
      return;
    }
    complete = true;
    up.disabled = true;
    down.disabled = true;
    go.disabled = true;
    selector.classList.add('is-correct');
    showFeedback('⭐ There are 3 sports teams.', 'good');
    window.clearTimeout(celebrationTimer);
    celebrationTimer = window.setTimeout(showCelebration, 500);
  });
  const reset = () => {
    window.clearTimeout(celebrationTimer);
    complete = false;
    go.disabled = false;
    selector.classList.remove('is-wrong', 'is-correct');
    setValue(0);
    showFeedback('');
    up.focus({ preventScroll: true });
  };
  resetCurrentActivity = reset;
  resetButton.addEventListener('click', reset);
  setValue(0);
}

setupCompletion();
setupAudio();
if (activity === 'missing-letters') setupMissingLetters();
if (activity === 'who-lost') setupSingleChoice('.team-target', 'away', 'The Away team lost.', '');
if (activity === 'count-teams') setupCounter();
