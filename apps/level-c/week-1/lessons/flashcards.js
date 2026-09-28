const imageRoot = "../../assets/flashcards/week-1";
const reviewRoot = `${imageRoot}/review`;
const speechRoot = `${imageRoot}/speech`;

const decks = {
  literacy: [
    { id: "dog-sitting", page: "Page 2", phrase: "dog sitting", sentence: "There is a dog sitting on the grass.", image: `${imageRoot}/dog-sitting.webp` },
    { id: "cat-yawning", page: "Page 2", phrase: "cat yawning", sentence: "There is a cat yawning on the path.", image: `${imageRoot}/cat-yawning.webp` },
    { id: "squirrel-playing", page: "Page 2", phrase: "squirrel playing", sentence: "There is a squirrel playing by the tree.", image: `${imageRoot}/squirrel-playing.webp` },
    { id: "deer-walking", page: "Page 2", phrase: "deer walking", sentence: "There is a deer walking on the grass.", image: `${imageRoot}/deer-walking.webp` },
    { id: "eagle-hunting", page: "Page 2", phrase: "eagle hunting", sentence: "There is an eagle hunting in the sky.", image: `${imageRoot}/eagle-hunting.webp` },
    { id: "red-ladybug", page: "Page 3", phrase: "red ladybug", sentence: "They see a red ladybug on the flower.", image: `${reviewRoot}/red-ladybug.png` },
    { id: "brown-ant", page: "Page 3", phrase: "brown ant", sentence: "They see a brown ant on the rain boots.", image: `${reviewRoot}/brown-ant.png` },
    { id: "tall-fence", page: "Page 3", phrase: "tall fence", sentence: "They see a tall fence in the garden.", image: `${reviewRoot}/tall-fence.png` },
    { id: "green-cactus", page: "Page 3", phrase: "green cactus", sentence: "They see a green cactus by the fence.", image: `${reviewRoot}/green-cactus.png` },
    { id: "small-snail", page: "Page 3", phrase: "small snail", sentence: "They see a small snail on the fence.", image: `${reviewRoot}/small-snail.png` },
    { id: "blue-car", page: "Page 4", phrase: "blue car", sentence: "The dog is barking at the blue car.", image: `${reviewRoot}/blue-car.png` },
    { id: "purple-scooter", page: "Page 4", phrase: "purple scooter", sentence: "The dog is barking at the purple scooter.", image: `${reviewRoot}/purple-scooter.png` },
    { id: "brown-owl", page: "Page 4", phrase: "brown owl", sentence: "The dog is barking at the brown owl.", image: `${reviewRoot}/brown-owl.png` },
    { id: "white-moon", page: "Page 4", phrase: "white moon", sentence: "The dog is barking at the white moon.", image: `${reviewRoot}/white-moon.png` },
    { id: "two-spiders", page: "Page 5", phrase: "two spiders", sentence: "The two spiders are scary.", images: Array(2).fill(`${reviewRoot}/single-spider.png`) },
    { id: "one-monster", page: "Page 5", phrase: "one monster", sentence: "The one monster is scary.", image: `${reviewRoot}/one-monster.png` },
    { id: "three-ghosts", page: "Page 5", phrase: "three ghosts", sentence: "The three ghosts are scary.", images: Array(3).fill(`${reviewRoot}/white-ghost.png`) },
    { id: "four-bats", page: "Page 5", phrase: "four bats", sentence: "The four bats are scary.", images: Array(4).fill(`${reviewRoot}/single-bat.png`) }
  ],
  speech: [
    { id: "speech-horse-chest", phrase: "horse chest", sentence: "The horse has a chest.", image: `${speechRoot}/horse-chest-v1.png` },
    { id: "speech-horse-mane", phrase: "horse mane", sentence: "The horse has a mane.", image: `${speechRoot}/horse-mane-v1.png` },
    { id: "speech-horse-hooves", phrase: "horse hooves", sentence: "The horse has hooves.", image: `${speechRoot}/horse-hooves-v1.png` },
    { id: "speech-horse-muzzle", phrase: "horse muzzle", sentence: "The horse has a muzzle.", image: `${speechRoot}/horse-muzzle-v1.png` },
    { id: "speech-eagle-chest", phrase: "eagle chest", sentence: "The eagle has a chest.", image: `${speechRoot}/eagle-chest-v1.png` },
    { id: "speech-lion-mane", phrase: "lion mane", sentence: "The lion has a mane.", image: `${speechRoot}/lion-mane-v1.png` },
    { id: "speech-bear-muzzle", phrase: "bear muzzle", sentence: "The bear has a muzzle.", image: `${speechRoot}/bear-muzzle-v1.png` },
    { id: "speech-deer-hooves", phrase: "deer hooves", sentence: "The deer has hooves.", image: `${speechRoot}/deer-hooves-v1.png` }
  ]
};

const card = document.querySelector("#flashcard");
const frontImage = document.querySelector("#flashcard-front-image");
const backImage = document.querySelector("#flashcard-back-image");
const frontGroup = document.querySelector("#flashcard-front-group");
const backGroup = document.querySelector("#flashcard-back-group");
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
    || voices.find(item => /^en[-_]US$/i.test(item.lang || ""))
    || null;
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

function fillImageGroup(group, images, alt = "") {
  group.innerHTML = images.map((image, imageIndex) => `<img src="${image}" alt="${imageIndex === 0 ? alt : ""}">`).join("");
  group.dataset.count = String(images.length);
}

function renderThumbnails() {
  thumbnails.innerHTML = "";
  cards.forEach((item, cardIndex) => {
    const button = document.createElement("button");
    button.className = "fc-thumbnail";
    button.type = "button";
    button.setAttribute("aria-label", `Show flashcard ${cardIndex + 1}`);
    button.innerHTML = item.images
      ? `<span class="fc-thumbnail-group" data-count="${item.images.length}">${item.images.map(image => `<img src="${image}" alt="">`).join("")}</span>`
      : `<img src="${item.image}" alt="">`;
    button.addEventListener("click", () => { index = cardIndex; render(); });
    thumbnails.append(button);
  });
}

function render() {
  const item = current();
  setFlipped(false);
  const grouped = Boolean(item.images);
  frontImage.hidden = grouped;
  backImage.hidden = grouped;
  frontGroup.hidden = !grouped;
  backGroup.hidden = !grouped;
  if (grouped) {
    fillImageGroup(frontGroup, item.images, item.phrase || item.sentence);
    fillImageGroup(backGroup, item.images, "");
  } else {
    frontGroup.innerHTML = "";
    backGroup.innerHTML = "";
    frontImage.src = item.image;
    frontImage.alt = item.phrase || item.sentence;
    backImage.src = item.image;
    backImage.alt = "";
  }
  phrase.textContent = item.phrase || "";
  phrase.hidden = !item.phrase;
  sentence.textContent = item.sentence;
  const topicLabel = item.page && !/\bpages?\b/i.test(item.page) ? item.page : "";
  pageChip.textContent = topicLabel;
  pageChip.hidden = !topicLabel;
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
  note.textContent = source === "literacy" ? "ELS K–8 Book • Week 1" : "Speech Book • Week 1";
  help.textContent = source === "literacy" ? "Flip each card to learn the phrase and key sentence." : "Flip each card to practice the Speech Book sentence.";
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
    if (target.origin === location.origin && /\/level-c\/week-1\/lessons\//.test(target.pathname)) returnLink.href = target.href;
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
