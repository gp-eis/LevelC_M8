const app = document.querySelector("#game-app");
const gameType = new URLSearchParams(location.search).get("game") || "memory";
const dataUrl = new URL(document.body.dataset.gameData || "./game-data.js?deploy=20260929-asset-fix-4", document.baseURI);
const { gameItems, gameMeta, shuffle } = await import(dataUrl.href);

const titles = {
  memory: ["🧠", "Memory Game"],
  wheel: ["🎡", "Spin the Wheel"],
  matching: ["🧩", "Picture Match"],
  pick: ["☝️", "Pick the Right One"]
};

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
const picture = (item, className = "regular-game-picture") => `<img class="${className}" src="${item.image}" alt="${item.label}">`;
const instruction = text => `<div class="phonics-instruction-row"><h2 class="game-prompt">${text}</h2><button class="phonics-audio-button" type="button" data-speak="${text.replaceAll('"', '&quot;')}" aria-label="Listen to the instruction">🔊</button></div>`;

if (app && titles[gameType]) {
  const [icon, title] = titles[gameType];
  app.innerHTML = `<header class="play-header"><h1>${icon} ${title}</h1><p>Week ${gameMeta.week} · ${gameMeta.review}</p></header><section id="play-area"></section>`;
  const playArea = app.querySelector("#play-area");
  playArea.addEventListener("click", event => {
    const button = event.target.closest("[data-speak]");
    if (button) speak(button.dataset.speak);
  });
  const feedback = (message, state = "") => {
    const node = playArea.querySelector("#game-feedback");
    if (node) { node.textContent = message; node.className = `game-feedback ${state}`.trim(); }
  };

  function renderMemory() {
    let first = null, locked = false, moves = 0, pairs = 0;
    playArea.innerHTML = `<div class="game-toolbar"><span class="score-chip">Moves: <b id="moves">0</b></span><span class="score-chip">Pairs: <b id="pairs">0</b>/6</span><button class="game-button orange" id="new-game" type="button">🔄 New Game</button></div><section class="game-board">${instruction("Find two matching pictures.")}<div class="memory-board" id="memory-board"></div><p id="game-feedback" class="game-feedback" aria-live="polite">Turn over two cards.</p></section>`;
    const board = playArea.querySelector("#memory-board");
    function start() {
      const active = shuffle(gameItems).slice(0, 6);
      first = null; locked = false; moves = 0; pairs = 0;
      playArea.querySelector("#moves").textContent = "0";
      playArea.querySelector("#pairs").textContent = "0";
      feedback("Turn over two cards.");
      board.innerHTML = "";
      shuffle(active.flatMap(item => [item, item])).forEach((item, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "memory-tile";
        button.dataset.id = item.id;
        button.dataset.copy = String(index);
        button.setAttribute("aria-label", "Hidden memory card");
        button.innerHTML = `<span class="tile-cover">?</span><span class="tile-answer">${picture(item, "memory-picture")}<small>${item.label}</small></span>`;
        button.addEventListener("click", () => flip(button, item));
        board.append(button);
      });
    }
    function flip(button, item) {
      if (locked || button.classList.contains("is-open") || button.classList.contains("is-matched")) return;
      button.classList.add("is-open");
      button.setAttribute("aria-label", item.label);
      speak(item.label);
      if (!first) { first = button; feedback(`You found ${item.label}. Find its match!`); return; }
      locked = true;
      moves += 1;
      playArea.querySelector("#moves").textContent = String(moves);
      if (first.dataset.id === button.dataset.id) {
        first.classList.replace("is-open", "is-matched");
        button.classList.replace("is-open", "is-matched");
        pairs += 1;
        playArea.querySelector("#pairs").textContent = String(pairs);
        first = null; locked = false;
        feedback(pairs === 6 ? `Wonderful! You found all six ${gameMeta.topic.toLowerCase()} pairs.` : `Great match! ${item.sentence}`, "good");
        return;
      }
      const previous = first;
      first = null;
      feedback("Those cards are different. Remember them and try again!", "try");
      setTimeout(() => {
        previous.classList.remove("is-open"); button.classList.remove("is-open");
        previous.setAttribute("aria-label", "Hidden memory card"); button.setAttribute("aria-label", "Hidden memory card");
        locked = false;
      }, 700);
    }
    playArea.querySelector("#new-game").addEventListener("click", start);
    start();
  }

  function renderRounds(kind) {
    let deck = [], round = 0, score = 0, locked = false;
    const isMatching = kind === "matching";
    playArea.innerHTML = `<div class="game-toolbar"><span class="score-chip">Round: <b id="round">1</b>/8</span><span class="score-chip">Score: <b id="score">0</b></span><button class="game-button orange" id="new-game" type="button">🔄 New Game</button></div><section class="game-board"><div id="round-instruction"></div><button id="round-picture" class="pick-picture phonics-picture-button" type="button" hidden></button><div id="round-choices"></div><p id="game-feedback" class="game-feedback" aria-live="polite"></p><div class="launch-row"><button id="next-round" class="game-button green" type="button" hidden>Next →</button></div></section>`;
    function start() { deck = shuffle(gameItems).slice(0, 8); round = 0; score = 0; playArea.querySelector("#score").textContent = "0"; render(); }
    function render() {
      locked = false;
      const item = deck[round];
      playArea.querySelector("#round").textContent = String(round + 1);
      playArea.querySelector("#next-round").hidden = true;
      const choices = playArea.querySelector("#round-choices");
      choices.className = isMatching ? "choice-grid" : "phrase-grid";
      choices.innerHTML = "";
      const shownPicture = playArea.querySelector("#round-picture");
      if (isMatching) {
        shownPicture.hidden = true;
        playArea.querySelector("#round-instruction").innerHTML = instruction(item.sentence);
        const options = shuffle([item, ...shuffle(gameItems.filter(other => other.id !== item.id)).slice(0, 2)]);
        options.forEach(option => addChoice(choices, option, option.id === item.id));
        feedback("Choose the picture that matches the sentence.");
      } else {
        const prompt = `Which phrase matches this ${item.group.toLowerCase()} picture?`;
        playArea.querySelector("#round-instruction").innerHTML = instruction(prompt);
        shownPicture.hidden = false;
        shownPicture.dataset.speak = item.label;
        shownPicture.setAttribute("aria-label", `Listen: ${item.label}`);
        shownPicture.innerHTML = `${picture(item, "pick-game-picture")}<span class="picture-audio-badge" aria-hidden="true">🔊</span>`;
        const wrong = shuffle(gameItems.filter(other => other.id !== item.id))[0];
        shuffle([{ item, ok: true }, { item: wrong, ok: false }]).forEach(option => addChoice(choices, option.item, option.ok));
        feedback("Pick the right phrase.");
      }
    }
    function addChoice(container, item, correct) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = isMatching ? "picture-choice" : "phrase-choice";
      button.setAttribute("aria-label", item.label);
      button.innerHTML = isMatching ? `${picture(item, "choice-picture")}<small>${item.label}</small>` : item.label;
      button.addEventListener("click", () => choose(button, correct));
      container.append(button);
    }
    function choose(button, correct) {
      if (locked) return;
      if (!correct) {
        button.classList.add("is-wrong"); feedback("Good try. Look closely and choose again.", "try");
        setTimeout(() => button.classList.remove("is-wrong"), 450); return;
      }
      locked = true; button.classList.add("is-correct");
      playArea.querySelectorAll("#round-choices button").forEach(choice => { choice.disabled = true; });
      score += 1; playArea.querySelector("#score").textContent = String(score);
      feedback(`Correct! ${deck[round].sentence}`, "good"); speak(`Correct! ${deck[round].sentence}`);
      const next = playArea.querySelector("#next-round");
      next.textContent = round === deck.length - 1 ? "Finish 🏆" : "Next →"; next.hidden = false;
    }
    playArea.querySelector("#next-round").addEventListener("click", () => {
      if (round === deck.length - 1) {
        playArea.querySelector(".game-board").innerHTML = `<div class="complete-panel"><span>🏆</span><h2>${gameMeta.completion}</h2><p>You completed all eight rounds.</p><button class="game-button green" id="again" type="button">Play Again</button></div>`;
        playArea.querySelector("#again").addEventListener("click", () => renderRounds(kind)); return;
      }
      round += 1; render();
    });
    playArea.querySelector("#new-game").addEventListener("click", start);
    start();
  }

  function renderWheel() {
    let spinning = false, wheelTurns = 0;
    const wheelItems = shuffle(gameItems).slice(0, 8);
    const bonuses = [
      { bonus: true, wheelIcon: "🔄", label: "Spin Again", sentence: "Spin again!" },
      { bonus: true, wheelIcon: "⭐", label: "Super Star", sentence: "Super Star! You are amazing!" },
      { bonus: true, wheelIcon: "💥", label: "Boom", sentence: "Boom! Try another spin!" }
    ];
    const segments = [...wheelItems, ...bonuses];
    playArea.innerHTML = `<section class="game-board">${instruction("Spin the wheel, then press Stop.")}<div class="wheel-area"><div class="wheel-wrap"><span class="wheel-pointer" aria-hidden="true">▼</span><div class="nature-wheel" id="wheel" aria-label="${gameMeta.topic} wheel"></div><span class="wheel-hub" aria-hidden="true">${gameMeta.wheelIcon}</span></div><div><div class="game-toolbar"><button class="game-button orange" id="spin" type="button">Spin</button><button class="game-button green" id="stop" type="button" hidden>Stop</button></div><div class="wheel-result" id="wheel-result"><div><span class="result-icon" aria-hidden="true">🎡</span><strong>Ready to spin!</strong><p>A learning card or a bonus will appear.</p></div></div><p id="game-feedback" class="game-feedback" aria-live="polite">Ready to spin.</p></div></div></section>`;
    const wheel = playArea.querySelector("#wheel"), spin = playArea.querySelector("#spin"), stop = playArea.querySelector("#stop"), result = playArea.querySelector("#wheel-result");
    const colors = ["#ff8a80", "#80d8ff", "#b9f6ca", "#ffd180", "#ea80fc", "#ffff8d", "#84ffff", "#ff9e80", "#56d4df", "#ffd43b", "#a56bf2"];
    const slice = 360 / segments.length;
    wheel.style.background = `conic-gradient(${colors.map((color, index) => `${color} ${index * slice}deg ${(index + 1) * slice}deg`).join(",")})`;
    segments.forEach((item, index) => {
      const angle = (index + .5) * Math.PI * 2 / segments.length;
      const label = document.createElement("span");
      label.innerHTML = `<b>${item.wheelIcon}</b>`;
      label.title = item.label; label.setAttribute("aria-hidden", "true");
      label.style.cssText = `position:absolute;left:${50 + 36 * Math.sin(angle)}%;top:${50 - 36 * Math.cos(angle)}%;transform:translate(-50%,-50%);font-size:1.7rem;text-align:center`;
      wheel.append(label);
    });
    spin.addEventListener("click", () => {
      if (spinning) return; spinning = true; wheel.classList.add("is-spinning"); spin.hidden = true; stop.hidden = false;
      result.innerHTML = '<div><span class="result-icon">🌪️</span><strong>Wheel spinning…</strong><p>Press Stop when you are ready.</p></div>';
      feedback("The wheel is spinning. Press Stop!");
    });
    stop.addEventListener("click", () => {
      if (!spinning) return; spinning = false; wheel.classList.remove("is-spinning"); stop.hidden = true; spin.hidden = false;
      const selectedIndex = Math.floor(Math.random() * segments.length), selected = segments[selectedIndex];
      wheelTurns += 3; wheel.style.transform = `rotate(${wheelTurns * 360 - (selectedIndex + .5) * slice}deg)`;
      if (selected.bonus) {
        result.innerHTML = `<div><span class="result-icon">${selected.wheelIcon}</span><strong>${selected.label}!</strong><p>${selected.sentence}</p></div>`;
        feedback(`Bonus: ${selected.label}!`, "good"); speak(selected.sentence); return;
      }
      result.innerHTML = `<button class="wheel-result-picture phonics-picture-button" type="button" data-speak="${selected.label}" aria-label="Listen: ${selected.label}">${picture(selected, "wheel-game-picture")}<span class="picture-audio-badge" aria-hidden="true">🔊</span></button><strong>${selected.label}</strong><p>${selected.sentence}</p>`;
      feedback(`${selected.label}. ${selected.sentence}`, "good"); speak(selected.sentence);
    });
  }

  if (gameType === "memory") renderMemory();
  else if (gameType === "wheel") renderWheel();
  else renderRounds(gameType);
}

addEventListener("pagehide", () => speechSynthesis?.cancel?.());
