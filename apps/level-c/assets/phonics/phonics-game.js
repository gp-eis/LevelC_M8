import {
  getWeekNumber,
  phonicsSets,
  shuffle,
  weekFocus,
} from "./word-data.js?deploy=20260929-level-ac-reading-13";

const app = document.querySelector("#game-app");
const gameType = document.body.dataset.game;
const week = getWeekNumber();
const phonicsWords = phonicsSets[week];
const focus = weekFocus[week];
const focusTeams = [...new Set(phonicsWords.map((word) => word.team))];
const phonemeAudio = {
  ar: "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/phonics-arcade/assets/audio/level-c/ar.mp3?asset=299413dd3677",
  or: "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/phonics-arcade/assets/audio/level-c/or.mp3?asset=6a2fa9979878",
  er: "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/phonics-arcade/assets/audio/level-c/er-ir.mp3?asset=4eb22a023590",
  ir: "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/phonics-arcade/assets/audio/level-c/er-ir.mp3?asset=4eb22a023590",
};
const iconRoot = "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/assets/ui/game-list/phonics";
const titles = {
  missing: [`${iconRoot}/missing-vowel-team.png`, "What's Missing?"],
  pop: [`${iconRoot}/listen-pop.png`, "Look and Pop"],
  train: [`${iconRoot}/vowel-team-train.png`, "Vowel Team Train"],
};

function pictureMarkup(item, className = "phonics-word-image") {
  return `<img class="${className}" src="${item.image}" alt="${item.word}">`;
}

let speechSequence = 0;
function speak(text) {
  if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) return;
  speechSequence += 1;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.82;
  utterance.pitch = 1.08;
  const voices = window.speechSynthesis.getVoices();
  utterance.voice = voices.find((voice) => /Samantha|Ava|Jenny|Aria|Zira|Google US English/i.test(voice.name) && /^en[-_]US$/i.test(voice.lang))
    || voices.find((voice) => /^en[-_]US$/i.test(voice.lang))
    || null;
  window.speechSynthesis.speak(utterance);
}

function playPhoneme(team) {
  const source = phonemeAudio[team];
  if (!source) return;
  const audio = new Audio(source);
  audio.volume = .98;
  audio.play().catch(() => {});
}

if (app && titles[gameType]) {
  const [icon, title] = titles[gameType];
  app.innerHTML = `
    <header class="play-header">
      <h1><img class="phonics-activity-title-icon" src="${icon}" alt="">${title}</h1>
      <p>Week ${week} phonics · <strong>${focus.teams}</strong> · ${focus.words}</p>
    </header>
    <section id="play-area"></section>`;

  const playArea = app.querySelector("#play-area");
  let deck = [];
  let round = 0;
  let score = 0;
  let locked = false;

  function start() {
    deck = shuffle(phonicsWords);
    round = 0;
    score = 0;
    render();
  }

  function render() {
    locked = false;
    const item = deck[round];
    playArea.innerHTML = `
      <div class="game-toolbar">
        <span class="score-chip">Word: <b>${round + 1}</b>/${deck.length}</span>
        <span class="score-chip">Score: <b id="score">${score}</b></span>
        <button class="game-button orange" id="new-game" type="button">🔄 New Game</button>
      </div>
      <section class="game-board">
        <div class="phonics-instruction-row">
          <h2 id="prompt" class="game-prompt"></h2>
          <button id="instruction-audio" class="phonics-audio-button" type="button" aria-label="Listen to the instruction">🔊</button>
        </div>
        <div id="phonics-stage"></div>
        <p id="game-feedback" class="game-feedback" aria-live="polite"></p>
        <div class="launch-row"><button id="next-round" class="game-button green" type="button" hidden>Next →</button></div>
      </section>`;
    playArea.querySelector("#new-game").addEventListener("click", start);
    playArea.querySelector("#next-round").addEventListener("click", next);
    playArea.querySelector("#instruction-audio").addEventListener("click", () => {
      speak(playArea.querySelector("#prompt").textContent);
    });
    if (gameType === "missing") renderMissing(item);
    else if (gameType === "pop") renderPop(item);
    else renderTrain(item);
  }

  function feedback(message, state = "") {
    const node = playArea.querySelector("#game-feedback");
    node.textContent = message;
    node.className = `game-feedback ${state}`.trim();
  }

  function finish(button, item, update) {
    if (locked) return;
    locked = true;
    button.classList.add("is-correct");
    playArea.querySelectorAll("#phonics-stage button").forEach((control) => {
      control.disabled = true;
    });
    if (update) update();
    score += 1;
    playArea.querySelector("#score").textContent = String(score);
    feedback(`Correct! ${item.word}. ${item.sentence}`, "good");
    const nextButton = playArea.querySelector("#next-round");
    nextButton.textContent = round === deck.length - 1 ? "Finish 🏆" : "Next →";
    nextButton.hidden = false;
  }

  function wrong(button) {
    button.classList.add("is-wrong");
    feedback("Good try. Look closely and choose again.", "try");
    setTimeout(() => button.classList.remove("is-wrong"), 420);
  }

  function teamButtons(item, update) {
    const stage = playArea.querySelector("#phonics-stage");
    const grid = document.createElement("div");
    grid.className = "team-grid";
    shuffle(focusTeams).forEach((team) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "team-choice";
      button.textContent = team;
      button.setAttribute("aria-label", `Choose ${team.split("").join(" ")}`);
      button.addEventListener("click", () => {
        playPhoneme(team);
        if (team === item.team) finish(button, item, update);
        else wrong(button);
      });
      grid.append(button);
    });
    stage.append(grid);
  }

  function renderMissing(item) {
    playArea.querySelector("#prompt").textContent = "Choose the missing letter team.";
    const stage = playArea.querySelector("#phonics-stage");
    stage.innerHTML = `
      <button class="phonics-picture phonics-picture-button" type="button" aria-label="Hear the word ${item.word}">${pictureMarkup(item)}<span class="picture-audio-badge" aria-hidden="true">🔊</span></button>
      <div class="word-builder" aria-label="Complete ${item.word}">
        <span>${item.before}</span><span id="word-gap" class="word-gap">?</span><span>${item.after}</span>
      </div>`;
    stage.querySelector(".phonics-picture-button").addEventListener("click", () => speak(item.word));
    teamButtons(item, () => {
      playArea.querySelector("#word-gap").textContent = item.team;
    });
    feedback(`Complete the word “${item.word}.”`);
  }

  function renderPop(item) {
    playArea.querySelector("#prompt").textContent = `Find and pop “${item.word}.”`;
    const stage = playArea.querySelector("#phonics-stage");
    stage.innerHTML = '<div class="pop-grid" id="pop-grid"></div>';
    const grid = stage.querySelector("#pop-grid");
    shuffle(phonicsWords).forEach((word) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "pop-bubble";
      button.innerHTML = `${pictureMarkup(word, "pop-word-image")}<strong>${word.word}</strong>`;
      button.addEventListener("click", () =>
        word.id === item.id ? finish(button, item) : wrong(button),
      );
      grid.append(button);
    });
    feedback("Look at each picture and word, then choose the match.");
  }

  function renderTrain(item) {
    playArea.querySelector("#prompt").textContent = "Load the correct letter team onto the train.";
    const stage = playArea.querySelector("#phonics-stage");
    stage.innerHTML = `
      <div class="phonics-train-scene" aria-label="Complete ${item.word}">
        <button class="phonics-train-picture-button" type="button" aria-label="Hear the word ${item.word}">${pictureMarkup(item, "phonics-train-picture")}<span class="picture-audio-badge" aria-hidden="true">🔊</span></button>
        <div class="phonics-train-word"><span>${item.before}</span><b id="train-gap">?</b><span>${item.after}</span></div>
      </div>`;
    stage.querySelector(".phonics-train-picture-button").addEventListener("click", () => speak(item.word));
    teamButtons(item, () => {
      playArea.querySelector("#train-gap").textContent = item.team;
    });
    feedback(`Choose the letter team that completes “${item.word}.”`);
  }

  function next() {
    if (round === deck.length - 1) {
      playArea.innerHTML = `
        <section class="game-board">
          <div class="complete-panel">
            <span>🌟🚂🌟</span>
            <h2>Fantastic Phonics!</h2>
            <p>You completed all four <strong>${focus.teams}</strong> word rounds.</p>
            <button class="game-button green" id="again" type="button">Play Again</button>
          </div>
        </section>`;
      playArea.querySelector("#again").addEventListener("click", start);
      return;
    }
    round += 1;
    render();
  }

  start();
}
