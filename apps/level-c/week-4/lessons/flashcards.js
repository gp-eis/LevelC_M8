const readingRoot = "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/assets/literacy/week-4/reading";
const catsRoot = "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/assets/literacy/week-4/cats";
const timeRoot = "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/assets/literacy/week-2/page-04-clues";
const weekTwoFlashRoot = "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/assets/flashcards/week-2/literacy";

const decks = {
  literacy: [
    { id: "tiger", page: "Pages 26–27", phrase: "tiger sleeps", sentence: "A tiger sleeps.", image: `https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/week-4/lessons/${catsRoot}/tiger-sleeping-v2.png` },
    { id: "koala", page: "Pages 26–27", phrase: "koala sleeps on the branches", sentence: "A koala sleeps on the branches.", image: `https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/week-4/lessons/${readingRoot}/koala-landscape-v1.png` },
    { id: "hamster", page: "Pages 26–27", phrase: "hamster sleeps underground", sentence: "A hamster sleeps underground.", image: `https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/week-4/lessons/${readingRoot}/hamster-landscape-v1.png` },
    { id: "panda", page: "Pages 26–27", phrase: "panda sleeps on the forest floor", sentence: "A panda sleeps on the forest floor.", image: `https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/week-4/lessons/${readingRoot}/panda-landscape-v1.png` },
    { id: "bear", page: "Pages 26–27", phrase: "bear sleeps in dens", sentence: "A bear sleeps in dens.", image: `https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/week-4/lessons/${readingRoot}/bear-landscape-v1.png` }
  ],
  speech: [
    { id: "sunrise", page: "Speech Book • Page 14", phrase: "sunrise", sentence: "When the sun rises in the morning, it is sunrise.", image: `https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/week-4/lessons/${timeRoot}/sunrise.png` },
    { id: "sunset", page: "Speech Book • Page 14", phrase: "sunset", sentence: "When the sun sets in the evening, it is sunset.", image: `https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/week-4/lessons/${timeRoot}/evening.png` },
    { id: "midday", page: "Speech Book • Page 16", phrase: "midday", sentence: "It is midday when it is twelve o’clock in the day.", image: `https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/week-4/lessons/${weekTwoFlashRoot}/midday-v1.png` },
    { id: "midnight", page: "Speech Book • Page 16", phrase: "midnight", sentence: "It is midnight when it is twelve o’clock at night.", image: `https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/week-4/lessons/${weekTwoFlashRoot}/midnight-v1.png` }
  ]
};

const card = document.querySelector("#flashcard");
const frontImage = document.querySelector("#flashcard-front-image");
const backImage = document.querySelector("#flashcard-back-image");
const frontNote = document.querySelector("#flashcard-front-note");
const backNote = document.querySelector("#flashcard-back-note");
const phrase = document.querySelector("#flashcard-phrase");
const sentence = document.querySelector("#flashcard-sentence");
const counter = document.querySelector("#flashcards-counter");
const sourceNote = document.querySelector("#flashcards-source-note");
const help = document.querySelector("#flashcards-help");
const thumbnails = document.querySelector("#flashcards-thumbnails");
const flipButton = document.querySelector("#flashcards-flip");
const pageChip = document.querySelector("#flashcard-page-chip");
const tabs = [...document.querySelectorAll(".fc-source-tab")];
let source = "literacy";
let cards = [...decks.literacy];
let index = 0;
let flipped = false;
let voice = null;

function chooseVoice() {
  const voices = speechSynthesis?.getVoices?.() || [];
  voice = voices.find(item => /^en[-_]US$/i.test(item.lang || "") && /aria|jenny|samantha|zira|google us english/i.test(item.name)) || voices.find(item => /^en[-_]US$/i.test(item.lang || "")) || null;
}
chooseVoice();
if ("speechSynthesis" in window) speechSynthesis.addEventListener("voiceschanged", chooseVoice, { once: true });

function speak(text) {
  if (!("speechSynthesis" in window) || !text) return;
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.voice = voice;
  utterance.lang = "en-US";
  utterance.rate = .84;
  utterance.pitch = 1.06;
  speechSynthesis.speak(utterance);
}

function setFlipped(value) {
  flipped = value;
  card.classList.toggle("is-flipped", flipped);
  card.setAttribute("aria-pressed", String(flipped));
  card.setAttribute("aria-label", flipped ? "Show the flashcard picture" : "Show the flashcard words");
  flipButton.textContent = flipped ? "🖼️ Picture" : "🔄 Flip";
}

function current() { return cards[index]; }

function applyVisualNote(element, item) {
  element.textContent = item.note || "";
  element.hidden = !item.note;
  element.className = `fc-visual-note${element === backNote ? " fc-back-note" : ""}${item.noteClass ? ` ${item.noteClass}` : ""}`;
}

function renderThumbnails() {
  thumbnails.innerHTML = "";
  cards.forEach((item, cardIndex) => {
    const button = document.createElement("button");
    button.className = "fc-thumbnail";
    button.type = "button";
    button.setAttribute("aria-label", `Show ${item.phrase} flashcard`);
    button.innerHTML = `<img src="${item.image}" alt="">`;
    button.addEventListener("click", () => { index = cardIndex; render(); });
    thumbnails.append(button);
  });
}

function render() {
  const item = current();
  setFlipped(false);
  frontImage.src = item.image;
  frontImage.alt = item.phrase;
  backImage.src = item.image;
  backImage.alt = "";
  phrase.textContent = item.phrase;
  sentence.textContent = item.sentence;
  const topicLabel = item.page && !/\bpages?\b/i.test(item.page) ? item.page : "";
  pageChip.textContent = topicLabel;
  pageChip.hidden = !topicLabel;
  applyVisualNote(frontNote, item);
  applyVisualNote(backNote, item);
  counter.textContent = `Card ${index + 1} of ${cards.length}`;
  [...thumbnails.children].forEach((button, cardIndex) => button.classList.toggle("is-selected", cardIndex === index));
}

function move(offset) {
  speechSynthesis?.cancel?.();
  index = (index + offset + cards.length) % cards.length;
  render();
}

function selectSource(nextSource) {
  source = nextSource;
  cards = [...decks[source]];
  index = 0;
  document.body.dataset.flashcardSource = source;
  tabs.forEach(tab => {
    const active = tab.dataset.source === source;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-selected", String(active));
  });
  sourceNote.textContent = source === "literacy" ? "ELS K–8 Book • Week 4" : "Speech Book • Week 4";
  help.textContent = source === "literacy" ? "Flip each card to read where the animal sleeps." : "Flip each card to learn a time of day.";
  renderThumbnails();
  render();
}

function shuffle() {
  const activeId = current().id;
  for (let cursor = cards.length - 1; cursor > 0; cursor -= 1) {
    const swap = Math.floor(Math.random() * (cursor + 1));
    [cards[cursor], cards[swap]] = [cards[swap], cards[cursor]];
  }
  index = Math.max(0, cards.findIndex(item => item.id === activeId));
  renderThumbnails();
  render();
  help.textContent = "The cards have been shuffled!";
}

const returnLink = document.querySelector("#flashcards-return");
const returnValue = new URLSearchParams(location.search).get("return");
if (returnValue) {
  try {
    const target = new URL(returnValue, location.href);
    if (target.origin === location.origin && /\/level-c\/week-4\/lessons\//.test(target.pathname)) returnLink.href = target.href;
  } catch (_) { /* Keep the safe Page 2 fallback. */ }
}

card.addEventListener("click", () => setFlipped(!flipped));
card.addEventListener("keydown", event => {
  if (event.key !== "Enter" && event.key !== " ") return;
  event.preventDefault();
  setFlipped(!flipped);
});
document.querySelector("#flashcards-previous").addEventListener("click", () => move(-1));
document.querySelector("#flashcards-next").addEventListener("click", () => move(1));
flipButton.addEventListener("click", () => setFlipped(!flipped));
document.querySelector("#flashcards-listen").addEventListener("click", () => speak(current().sentence));
document.querySelector("#flashcards-shuffle").addEventListener("click", shuffle);
tabs.forEach(tab => tab.addEventListener("click", () => selectSource(tab.dataset.source)));
addEventListener("pagehide", () => speechSynthesis?.cancel?.());
selectSource("literacy");
