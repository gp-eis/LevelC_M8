import { PAGE_02_MEDIA } from './page-02-media-manifest.js?v=20260903-1&deploy=20260929-level-ac-reading-13';

const State = Object.freeze({
  WAITING_START: 'WAITING_START',
  NARRATING: 'NARRATING',
  MOTION: 'MOTION',
  READY: 'READY',
  COMPLETE: 'COMPLETE'
});

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const stage = document.querySelector('#page-two-media-stage');
const startLayer = document.querySelector('#page-two-start-layer');
const startButton = document.querySelector('#page-two-start');
const narration = document.querySelector('#page-two-narration');
const motion = document.querySelector('#page-two-motion');
const wordAudio = document.querySelector('#page-two-word-audio');
const status = document.querySelector('#page-two-status');
const feedback = document.querySelector('#page-two-feedback');
const choices = [...document.querySelectorAll('.page-two-choice')];
const wordButtons = [...document.querySelectorAll('.word-audio')];
const replayButton = document.querySelector('#replay-narration');
const resetButton = document.querySelector('#reset-activity');
const recovery = document.querySelector('#media-recovery');
const recoveryMessage = document.querySelector('#media-recovery-message');
const retryButton = document.querySelector('#media-retry');
const continueButton = document.querySelector('#media-continue');
const completion = document.querySelector('#page-two-completion');
const goodJobVideo = document.querySelector('#completion-good-job');
const completionStatic = document.querySelector('#completion-static');
const completionMediaStatus = document.querySelector('#completion-media-status');
const completionClose = document.querySelector('#completion-close');
const completionAgain = document.querySelector('#completion-again');
const activityActions = document.querySelector('.page-two-actions');

let state = State.WAITING_START;
let pendingMedia = null;
let replayingNarration = false;
let activeWord = null;
let celebrationTimer = 0;
window.addEventListener('pagehide', () => window.clearTimeout(celebrationTimer));
function openCompletion() {
  completion.hidden = false;
  document.body.classList.add('completion-open');
}

function closeCompletion({ restoreFocus = true } = {}) {
  if (completion.hidden) return;
  stopCelebration();
  completion.hidden = true;
  document.body.classList.remove('completion-open');
  if (restoreFocus) resetButton.focus({ preventScroll: true });
}

function stopCelebration({ hide = false } = {}) {
  goodJobVideo.pause();
  try { goodJobVideo.currentTime = 0; } catch { /* Media may not be loaded yet. */ }
  if (hide) {
    goodJobVideo.hidden = true;
    completionStatic.hidden = true;
  }
}

function showStaticCelebration(message) {
  stopCelebration();
  goodJobVideo.hidden = true;
  completionStatic.hidden = false;
  completionMediaStatus.textContent = message;
}

async function playCelebration() {
  if (reducedMotion.matches) {
    showStaticCelebration('A static celebration is shown because reduced motion is enabled.');
    return;
  }
  completionStatic.hidden = true;
  goodJobVideo.hidden = false;
  goodJobVideo.loop = false;
  goodJobVideo.src = PAGE_02_MEDIA.goodJob;
  goodJobVideo.currentTime = 0;
  goodJobVideo.load();
  completionMediaStatus.textContent = 'Playing the good-job celebration once.';
  try {
    await goodJobVideo.play();
  } catch {
    showStaticCelebration('The celebration video could not play, so a static celebration is shown.');
  }
}

function announce(message) {
  status.textContent = message;
}

function setAnswerEnabled(enabled) {
  choices.forEach(button => { button.disabled = !enabled; });
  wordButtons.forEach(button => { button.disabled = !enabled; });
}

function setState(next) {
  state = next;
  document.body.dataset.activityState = next;
  startLayer.hidden = next !== State.WAITING_START;
  // Keep one continuous media surface from the preview through the finished
  // clue. Hiding it between phases exposed the differently framed fallback
  // still and made the characters appear to jump.
  motion.hidden = false;
  setAnswerEnabled(next === State.READY);
  replayButton.disabled = ![State.READY, State.COMPLETE].includes(next) || replayingNarration;
  resetButton.disabled = next === State.WAITING_START;
  replayButton.hidden = ![State.READY, State.COMPLETE].includes(next);
  resetButton.hidden = next === State.WAITING_START;
  activityActions.hidden = replayButton.hidden && resetButton.hidden;
  stage.classList.toggle('is-ready', next === State.READY);
  stage.classList.toggle('is-complete', next === State.COMPLETE);
}

function clearElement(media) {
  media.pause();
  media.removeAttribute('src');
  media.load();
}

function hideRecovery() {
  recovery.hidden = true;
  pendingMedia = null;
}

function restoreStillScene() {
  motion.pause();
}

function showRecovery(kind, message, extra = {}) {
  if (kind === 'motion') {
    restoreStillScene();
    motion.hidden = true;
  }
  pendingMedia = { kind, ...extra };
  recoveryMessage.textContent = message;
  recovery.hidden = false;
  retryButton.focus({ preventScroll: true });
}

async function playElement(media, source, kind, extra = {}) {
  hideRecovery();
  media.pause();
  media.src = source;
  media.currentTime = 0;
  media.load();
  try {
    await media.play();
  } catch {
    showRecovery(kind, 'The recorded media is not available yet. Retry after adding the approved file, or continue without it.', extra);
  }
}

function enterReady(message = 'The answers are ready. Choose a sport or play a word recording.') {
  restoreStillScene();
  setState(State.READY);
  announce(message);
  feedback.textContent = '';
  feedback.className = 'feedback';
  choices[0]?.focus({ preventScroll: true });
}

function beginMotion() {
  if (state !== State.NARRATING) return;
  narration.pause();
  setState(State.MOTION);
  announce('Watch and listen to the short tennis dialogue.');
  motion.muted = false;
  playElement(motion, PAGE_02_MEDIA.motion, 'motion');
}

function playNarration(isReplay = false) {
  replayingNarration = isReplay;
  replayButton.disabled = true;
  announce(isReplay ? 'Replaying the recorded narration.' : 'Listen to the recorded narration.');
  playElement(narration, PAGE_02_MEDIA.narrator, 'narration', { isReplay });
}

function beginActivity() {
  if (state !== State.WAITING_START) return;
  setState(State.NARRATING);
  playNarration(false);
}

function finishNarration() {
  if (replayingNarration) {
    replayingNarration = false;
    replayButton.disabled = ![State.READY, State.COMPLETE].includes(state);
    announce(state === State.COMPLETE ? 'Narration replay finished. The activity is complete.' : 'Narration replay finished. Choose an answer.');
    return;
  }
  beginMotion();
}

function finishMotion() {
  if (state !== State.MOTION) return;
  restoreStillScene();
  enterReady();
}

function playWord(word) {
  if (state !== State.READY) return;
  activeWord = word;
  const source = PAGE_02_MEDIA.words[word];
  announce(`Playing the recorded word: ${word}.`);
  playElement(wordAudio, source, 'word', { word });
}

function choose(button) {
  if (state !== State.READY) return;
  const correct = button.dataset.answer === 'tennis';
  if (!correct) {
    button.classList.remove('is-wrong');
    void button.offsetWidth;
    button.classList.add('is-wrong');
    feedback.textContent = 'Try again.';
    feedback.className = 'feedback try';
    window.setTimeout(() => button.classList.remove('is-wrong'), 600);
    return;
  }
  setState(State.COMPLETE);
  choices.forEach(choice => {
    const selected = choice === button;
    choice.classList.toggle('is-correct', selected);
    choice.setAttribute('aria-checked', String(selected));
    choice.disabled = true;
  });
  wordButtons.forEach(wordButton => { wordButton.disabled = true; });
  feedback.textContent = '⭐ Great job! Tennis is correct.';
  feedback.className = 'feedback good';
  announce('Activity complete. Tennis is correct.');
  celebrationTimer = window.setTimeout(() => {
    celebrationTimer = 0;
    if (state !== State.COMPLETE) return;
    openCompletion();
    void playCelebration();
    completionClose.focus({ preventScroll: true });
  }, 500);
}

function resetActivity({ focusStart = true } = {}) {
  window.clearTimeout(celebrationTimer);
  replayingNarration = false;
  activeWord = null;
  hideRecovery();
  clearElement(narration);
  motion.pause();
  motion.src = PAGE_02_MEDIA.motion;
  motion.currentTime = 0;
  motion.load();
  clearElement(wordAudio);
  stopCelebration({ hide: true });
  closeCompletion({ restoreFocus: false });
  choices.forEach(choice => {
    choice.classList.remove('is-correct', 'is-wrong');
    choice.setAttribute('aria-checked', 'false');
  });
  feedback.textContent = '';
  feedback.className = 'feedback';
  setState(State.WAITING_START);
  announce('Press Start Activity when you are ready.');
  if (focusStart) startButton.focus({ preventScroll: true });
}

function retryPendingMedia() {
  if (!pendingMedia) return;
  const request = pendingMedia;
  if (request.kind === 'narration') playNarration(Boolean(request.isReplay));
  if (request.kind === 'motion') beginMotionRetry();
  if (request.kind === 'word') playWord(request.word);
}

function beginMotionRetry() {
  setState(State.MOTION);
  announce('Retrying the short movement clue.');
  playElement(motion, PAGE_02_MEDIA.motion, 'motion');
}

function continueWithoutPendingMedia() {
  if (!pendingMedia) return;
  const request = pendingMedia;
  hideRecovery();
  if (request.kind === 'narration' && request.isReplay) {
    replayingNarration = false;
    replayButton.disabled = false;
    announce('Narration replay was skipped.');
    return;
  }
  if (request.kind === 'narration') {
    replayingNarration = false;
    beginMotion();
    return;
  }
  if (request.kind === 'motion') {
    enterReady('The movement clue was skipped. The answers are ready.');
    return;
  }
  if (request.kind === 'word') {
    activeWord = null;
    announce('That word recording was skipped. You may still choose an answer.');
  }
}

startButton.addEventListener('click', beginActivity);
replayButton.addEventListener('click', () => playNarration(true));
resetButton.addEventListener('click', () => resetActivity());
retryButton.addEventListener('click', retryPendingMedia);
continueButton.addEventListener('click', continueWithoutPendingMedia);
choices.forEach(button => button.addEventListener('click', () => choose(button)));
wordButtons.forEach(button => button.addEventListener('click', () => playWord(button.dataset.word)));
narration.addEventListener('ended', finishNarration);
narration.addEventListener('error', () => {
  if (!narration.src || (state !== State.NARRATING && !replayingNarration)) return;
  showRecovery('narration', 'The recorded narration is not available yet. Retry after adding it, or continue without narration.', { isReplay: replayingNarration });
});
motion.addEventListener('ended', finishMotion);
motion.addEventListener('error', () => {
  if (!motion.src || state !== State.MOTION) return;
  showRecovery('motion', 'The short movement clip could not play. Retry it, or continue to the answers.', {});
});
wordAudio.addEventListener('ended', () => {
  activeWord = null;
  announce('Word recording finished. Choose an answer when ready.');
});
wordAudio.addEventListener('error', () => {
  if (!wordAudio.src || state !== State.READY || !activeWord) return;
  showRecovery('word', 'That recorded word is not available yet. Retry after adding it, or continue without it.', { word: activeWord });
});
completionClose.addEventListener('click', () => {
  closeCompletion();
});
completionAgain.addEventListener('click', () => resetActivity());
document.addEventListener('keydown', event => {
  if (event.key !== 'Escape' || completion.hidden) return;
  event.preventDefault();
  closeCompletion();
});
goodJobVideo.addEventListener('ended', () => {
  completionMediaStatus.textContent = 'Celebration finished.';
});
goodJobVideo.addEventListener('error', () => {
  if (!goodJobVideo.src) return;
  showStaticCelebration('The celebration video is unavailable, so a static celebration is shown.');
});
reducedMotion.addEventListener('change', event => {
  if (event.matches && !completion.hidden) showStaticCelebration('A static celebration is shown because reduced motion is enabled.');
});

choices.forEach(choice => {
  choice.setAttribute('role', 'radio');
  choice.setAttribute('aria-checked', 'false');
});
setState(State.WAITING_START);
