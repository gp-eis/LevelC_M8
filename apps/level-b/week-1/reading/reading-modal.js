const questions = Array.from({ length: 4 }, (_, index) => ({
  number: index + 1,
  question: `Question ${index + 1} will be added from the supplied Month 8 reading video.`,
  imageLabel: `Question ${index + 1} picture slot`,
  answers: [`Answer choice A for Question ${index + 1}`, `Answer choice B for Question ${index + 1}`]
}));

const modal = document.querySelector('#reading-modal');
const dialog = modal.querySelector('.reading-dialog');
const openButton = document.querySelector('#reading-activity-open');
const closeButton = document.querySelector('#reading-close');
const game = document.querySelector('#reading-game');
const complete = document.querySelector('#reading-complete');
const questionImageSlot = document.querySelector('#reading-question-image-slot');
const questionText = document.querySelector('#reading-question-text');
const answers = document.querySelector('#reading-answers');
const feedback = document.querySelector('#reading-feedback');
const progressLabel = document.querySelector('#reading-progress-label');
const progressDots = document.querySelector('#reading-progress-dots');
const nextSlot = document.querySelector('#reading-placeholder-next');
let index = 0;
let lastFocus;

function render() {
  game.hidden = false;
  complete.hidden = true;
  const item = questions[index];
  progressLabel.textContent = `Question Slot ${item.number} of ${questions.length}`;
  progressDots.innerHTML = questions.map((_, dot) => `<span class="reading-dot${dot < index ? ' is-done' : ''}${dot === index ? ' is-current' : ''}"></span>`).join('');
  questionImageSlot.textContent = item.imageLabel;
  questionImageSlot.setAttribute('aria-label', `${item.imageLabel}; image not supplied`);
  questionText.textContent = item.question;
  answers.innerHTML = item.answers.map((label, answerIndex) => `<div class="reading-answer is-placeholder" aria-label="${label}; content not supplied"><div class="reading-answer-image-slot" aria-hidden="true">Picture ${answerIndex === 0 ? 'A' : 'B'}</div><span>${label}</span></div>`).join('');
  feedback.textContent = 'No answer is marked correct until the Month 8 video and questions are supplied.';
  feedback.className = 'reading-feedback';
  nextSlot.textContent = index === questions.length - 1 ? 'Finish Slot Review ✓' : 'Next Question Slot →';
}

function advance() {
  if (index < questions.length - 1) {
    index += 1;
    render();
    nextSlot.focus({ preventScroll: true });
    return;
  }
  game.hidden = true;
  complete.hidden = false;
  document.querySelector('#reading-finish').focus({ preventScroll: true });
}

function openActivity() {
  lastFocus = document.activeElement;
  index = 0;
  render();
  modal.hidden = false;
  document.body.classList.add('reading-modal-open');
  closeButton.focus({ preventScroll: true });
}

function closeActivity() {
  modal.hidden = true;
  document.body.classList.remove('reading-modal-open');
  history.replaceState(null, '', location.pathname + location.search);
  if (lastFocus instanceof HTMLElement) lastFocus.focus({ preventScroll: true });
}

openButton.addEventListener('click', openActivity);
closeButton.addEventListener('click', closeActivity);
nextSlot.addEventListener('click', advance);
document.querySelector('#reading-again').addEventListener('click', () => { index = 0; render(); closeButton.focus({ preventScroll: true }); });
document.querySelector('#reading-finish').addEventListener('click', closeActivity);
modal.addEventListener('click', event => { if (event.target === modal) closeActivity(); });
document.addEventListener('keydown', event => {
  if (modal.hidden) return;
  if (event.key === 'Escape') { closeActivity(); return; }
  if (event.key !== 'Tab') return;
  const focusable = [...dialog.querySelectorAll('button:not([disabled])')];
  const first = focusable[0];
  const last = focusable.at(-1);
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
});

if (location.hash === '#reading-activity') openActivity();
