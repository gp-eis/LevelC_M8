const rounds = Array.from({ length: 4 }, (_, index) => ({
  number: index + 1,
  question: `Question ${index + 1} — awaiting the supplied Month 8 reading video`,
  answerSlots: [1, 2, 3]
}));

const modal = document.querySelector("#reading-modal");
const openButton = document.querySelector("#reading-activity-open");
const closeButton = document.querySelector("#reading-modal-close");
const progressLabel = document.querySelector("#reading-progress-label");
const dots = document.querySelector("#reading-progress-dots");
const cueSlot = document.querySelector("#reading-cue-slot");
const question = document.querySelector("#reading-question");
const answers = document.querySelector("#reading-answers");
const feedback = document.querySelector("#reading-feedback");
const slotNext = document.querySelector("#reading-slot-next");
const complete = document.querySelector("#reading-complete");
const again = document.querySelector("#reading-again");
let roundIndex = 0;

function render() {
  const round = rounds[roundIndex];
  complete.hidden = true;
  answers.hidden = false;
  cueSlot.parentElement.hidden = false;
  feedback.hidden = false;
  slotNext.hidden = false;
  progressLabel.textContent = `Question ${round.number} of ${rounds.length}`;
  dots.innerHTML = rounds.map((_, index) => `<i class="${index < roundIndex ? "is-done" : index === roundIndex ? "is-current" : ""}"></i>`).join("");
  cueSlot.setAttribute("aria-label", `Question ${round.number} image awaiting supplied material`);
  cueSlot.querySelector("small").textContent = `Question ${round.number} image`;
  question.textContent = round.question;
  answers.innerHTML = round.answerSlots.map(number => `<div class="reading-modal__answer is-placeholder"><div class="reading-modal__answer-image" role="img" aria-label="Question ${round.number}, answer image ${number} awaiting supplied material"><span aria-hidden="true">🖼️</span></div><span>Answer option ${number} awaiting source</span></div>`).join("");
  feedback.textContent = "Questions, answer choices, images, and the answer key will be added only from the supplied Month 8 material.";
  feedback.className = "reading-modal__feedback";
  slotNext.textContent = roundIndex < rounds.length - 1 ? `Preview Question Slot ${round.number + 1} →` : "Finish Placeholder Preview";
}

function showComplete() {
  answers.hidden = true;
  cueSlot.parentElement.hidden = true;
  feedback.hidden = true;
  slotNext.hidden = true;
  complete.hidden = false;
  progressLabel.textContent = "4 question slots reserved";
  complete.querySelector("h3").textContent = "Four question slots are ready";
  complete.querySelector("p").textContent = "Approved Month 8 questions, answers, and images can be inserted when supplied.";
  again.textContent = "Preview Again";
  again.focus({ preventScroll: true });
}

function openActivity() {
  roundIndex = 0;
  render();
  document.body.classList.add("reading-modal-open");
  modal.showModal();
  closeButton.focus({ preventScroll: true });
}

function closeActivity() { modal.close(); }

openButton.addEventListener("click", openActivity);
closeButton.addEventListener("click", closeActivity);
slotNext.addEventListener("click", () => {
  if (roundIndex < rounds.length - 1) {
    roundIndex += 1;
    render();
    slotNext.focus({ preventScroll: true });
  } else {
    showComplete();
  }
});
again.addEventListener("click", () => { roundIndex = 0; render(); slotNext.focus({ preventScroll: true }); });
modal.addEventListener("close", () => {
  document.body.classList.remove("reading-modal-open");
  if (location.hash === "#activity") history.replaceState(null, "", location.pathname + location.search);
  openButton.focus({ preventScroll: true });
});
modal.addEventListener("click", event => { if (event.target === modal) closeActivity(); });
if (location.hash === "#activity") openActivity();
