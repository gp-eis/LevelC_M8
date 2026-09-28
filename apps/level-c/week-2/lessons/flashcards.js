const weekOneSpeechRoot = "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/assets/flashcards/week-1/speech";
const speechRoot = "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/assets/flashcards/week-2/speech";
const literacyRoot = "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/assets/flashcards/week-2/literacy";
const moonRoot = "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/assets/literacy/week-2/page-05-choices";
const timeRoot = "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/assets/literacy/week-2/page-04-clues";

const decks = {
  literacy: [
    { id: "horse-mane", page: "Horse Parts", phrase: "beautiful mane", sentence: "The horse has a beautiful mane.", image: `https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/week-2/lessons/${weekOneSpeechRoot}/horse-mane-v1.png` },
    { id: "horse-chest", page: "Horse Parts", phrase: "wide chest", sentence: "The horse has a wide chest.", image: `https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/week-2/lessons/${weekOneSpeechRoot}/horse-chest-v1.png` },
    { id: "horse-muzzle", page: "Horse Parts", phrase: "handsome muzzle", sentence: "The horse has a handsome muzzle.", image: `https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/week-2/lessons/${weekOneSpeechRoot}/horse-muzzle-v1.png` },
    { id: "horse-hooves", page: "Horse Parts", phrase: "strong hooves", sentence: "The horse has strong hooves.", image: `https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/week-2/lessons/${weekOneSpeechRoot}/horse-hooves-v1.png` },
    { id: "bee-abdomen", page: "Bee Parts", phrase: "one abdomen", sentence: "The bee has one abdomen.", image: `https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/week-2/lessons/${speechRoot}/bee-abdomen-v2.png` },
    { id: "bee-antennae", page: "Bee Parts", phrase: "two antennae", sentence: "The bee has two antennae.", image: `https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/week-2/lessons/${speechRoot}/bee-antennae-v2.png` },
    { id: "bee-wings", page: "Bee Parts", phrase: "four wings", sentence: "The bee has four wings.", image: `https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/week-2/lessons/${speechRoot}/bee-wings-v2.png` },
    { id: "bee-eyes", page: "Bee Parts", phrase: "five eyes", sentence: "The bee has five eyes.", image: `https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/week-2/lessons/${speechRoot}/bee-eyes-v2.png` },
    { id: "bee-legs", page: "Bee Parts", phrase: "six legs", sentence: "The bee has six legs.", image: `https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/week-2/lessons/${speechRoot}/bee-legs-v2.png` },
    { id: "new-moon", page: "Moon Phases", phrase: "new moon", sentence: "That is a new moon. I see none of it.", image: `https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/week-2/lessons/${moonRoot}/new-moon-v2.png` },
    { id: "waxing-moon", page: "Moon Phases", phrase: "waxing moon", sentence: "That is a waxing moon. The bright part gets bigger.", image: `https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/week-2/lessons/${moonRoot}/waxing-moon-v2.png`, note: "BRIGHT SIDE GROWS →", noteClass: "is-waxing" },
    { id: "full-moon", page: "Moon Phases", phrase: "full moon", sentence: "That is a full moon. I see all of it.", image: `https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/week-2/lessons/${moonRoot}/full-moon-v2.png` },
    { id: "waning-moon", page: "Moon Phases", phrase: "waning moon", sentence: "That is a waning moon. The bright part gets smaller.", image: `https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/week-2/lessons/${moonRoot}/waning-moon-v2.png`, note: "← BRIGHT SIDE GETS SMALLER", noteClass: "is-waning" },
    { id: "morning", page: "Time of Day", phrase: "morning sunrise", sentence: "It is morning. The sun is rising.", image: `https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/week-2/lessons/${timeRoot}/sunrise.png` },
    { id: "midday", page: "Time of Day", phrase: "midday sunshine", sentence: "It is midday. The sun is high in the sky.", image: `https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/week-2/lessons/${literacyRoot}/midday-v1.png` },
    { id: "evening", page: "Time of Day", phrase: "evening sunset", sentence: "It is evening. The sun is setting.", image: `https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/week-2/lessons/${timeRoot}/evening.png` },
    { id: "midnight", page: "Time of Day", phrase: "midnight darkness", sentence: "It is midnight. The sky is dark and full of stars.", image: `https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/week-2/lessons/${literacyRoot}/midnight-v1.png` }
  ],
  speech: [
    { id: "speech-bee-antennae", page: "Bee Parts", phrase: "bee antennae", sentence: "The bee has antennae.", image: `https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/week-2/lessons/${speechRoot}/bee-antennae-v2.png` },
    { id: "speech-bee-wings", page: "Bee Parts", phrase: "bee wings", sentence: "The bee has wings.", image: `https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/week-2/lessons/${speechRoot}/bee-wings-v2.png` },
    { id: "speech-bee-eyes", page: "Bee Parts", phrase: "bee eyes", sentence: "The bee has eyes.", image: `https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/week-2/lessons/${speechRoot}/bee-eyes-v2.png` },
    { id: "speech-bee-abdomen", page: "Bee Parts", phrase: "bee abdomen", sentence: "The bee has an abdomen.", image: `https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/week-2/lessons/${speechRoot}/bee-abdomen-v2.png` },
    { id: "speech-bee-legs", page: "Bee Parts", phrase: "bee legs", sentence: "The bee has legs.", image: `https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/week-2/lessons/${speechRoot}/bee-legs-v2.png` },
    { id: "speech-butterfly-antennae", page: "Butterfly Parts", phrase: "butterfly antennae", sentence: "The butterfly has antennae.", image: `https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/week-2/lessons/${speechRoot}/butterfly-antennae-v1.png` },
    { id: "speech-butterfly-eyes", page: "Butterfly Parts", phrase: "butterfly eyes", sentence: "The butterfly has eyes.", image: `https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/week-2/lessons/${speechRoot}/butterfly-eyes-v1.png` },
    { id: "speech-butterfly-wings", page: "Butterfly Parts", phrase: "butterfly wings", sentence: "The butterfly has wings.", image: `https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/week-2/lessons/${speechRoot}/butterfly-wings-v1.png` },
    { id: "speech-butterfly-legs", page: "Butterfly Parts", phrase: "butterfly legs", sentence: "The butterfly has legs.", image: `https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/week-2/lessons/${speechRoot}/butterfly-legs-v1.png` },
    { id: "speech-butterfly-abdomen", page: "Butterfly Parts", phrase: "butterfly abdomen", sentence: "The butterfly has an abdomen.", image: `https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/week-2/lessons/${speechRoot}/butterfly-abdomen-v1.png` }
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
const note = document.querySelector("#flashcards-source-note");
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
  voice = voices.find(item => /^en[-_]US$/i.test(item.lang || "") && /aria|jenny|samantha|zira|google us english/i.test(item.name))
    || voices.find(item => /^en[-_]US$/i.test(item.lang || "")) || null;
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
  note.textContent = source === "literacy" ? "ELS K–8 Book • Week 2" : "Speech Book • Week 2";
  help.textContent = source === "literacy" ? "Flip each individual card to learn the word and key sentence." : "Use the pointer and close-up to find each insect part.";
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
    if (target.origin === location.origin && /\/level-c\/week-2\/lessons\//.test(target.pathname)) returnLink.href = target.href;
  } catch (_) { /* Keep the safe literacy fallback. */ }
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
