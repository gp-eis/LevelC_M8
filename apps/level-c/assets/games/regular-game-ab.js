const query = new URLSearchParams(location.search);
const mode = query.get("game") || "memory";
const { gameItems, gameMeta, shuffle } = await import(new URL(document.body.dataset.gameData || "./game-data.js?deploy=20260929-resource-fix-1", document.baseURI).href);
const app = document.querySelector("#game-app");
const iconRoot = "/LevelC_M8/apps/level-c/assets/ui/game-list";
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
const literacyItems = gameItems.filter(item => item.literacy !== false);
const memoryWheelItems = gameItems.filter(item => item.gameImage || item.image);
let voice = null;

if (mode === "wheel" && !window.SpinWheelBonus) {
  await new Promise(resolve => {
    const script = document.createElement("script");
    script.src = "/LevelC_M8/apps/level-b/games/spin-wheel-bonus.js?v=20260907-1&deploy=20260929-resource-fix-1";
    script.onload = script.onerror = resolve;
    document.head.append(script);
  });
}

function pickVoice() {
  const voices = speechSynthesis?.getVoices?.() || [];
  voice = voices.find(item => /^en[-_]US$/i.test(item.lang || "") && /aria|jenny|samantha|zira|google/i.test(item.name))
    || voices.find(item => /^en[-_]US$/i.test(item.lang || "")) || null;
}
pickVoice();
if ("speechSynthesis" in window) speechSynthesis.addEventListener("voiceschanged", pickVoice, { once: true });
function speak(text) {
  if (!("speechSynthesis" in window) || !text) return;
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US"; utterance.rate = .9; utterance.pitch = 1.04;
  if (voice) utterance.voice = voice;
  speechSynthesis.speak(utterance);
}
function tone(kind) {
  const Context = window.AudioContext || window.webkitAudioContext;
  if (!Context) return;
  const context = tone.context || (tone.context = new Context());
  if (context.state === "suspended") context.resume();
  const notes = kind === "correct" ? [523, 659, 784] : [220, 175];
  notes.forEach((frequency, index) => {
    const oscillator = context.createOscillator(), gain = context.createGain(), start = context.currentTime + index * .08;
    oscillator.type = kind === "correct" ? "sine" : "sawtooth"; oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(.0001, start); gain.gain.exponentialRampToValueAtTime(kind === "correct" ? .13 : .05, start + .012); gain.gain.exponentialRampToValueAtTime(.0001, start + .18);
    oscillator.connect(gain); gain.connect(context.destination); oscillator.start(start); oscillator.stop(start + .2);
  });
}
function navigation(pageName) {
  return `<gp-navigation data-main-href="../../index.html" data-week-href="../" data-section-href="./" data-trail="Level C · Week ${gameMeta.week} · Games · ${pageName}"></gp-navigation>`;
}
function gameImage(item, className = "", source = "image") { return `<img${className ? ` class="${className}"` : ""} src="${item[source] || item.image}" alt="${item.label}" draggable="false">`; }
function listenButton(text, label) { return `<button class="listen-btn" type="button" data-speak="${text.replaceAll('"', '&quot;')}" aria-label="${label}">🔊</button>`; }
function bindSpeech(root = document) { root.querySelectorAll("[data-speak]").forEach(button => button.addEventListener("click", event => { event.stopPropagation(); speak(button.dataset.speak); })); }

function selectMemoryItems(items, count) {
  const keyedItems = items.filter(item => item.memoryKey);
  if (!keyedItems.length) return shuffle(items).slice(0, count);

  const groups = new Map();
  keyedItems.forEach(item => {
    const group = groups.get(item.memoryKey) || [];
    group.push(item);
    groups.set(item.memoryKey, group);
  });

  const selected = shuffle([...groups.values()])
    .slice(0, count)
    .map(group => shuffle(group)[0]);
  if (selected.length < count) {
    const selectedIds = new Set(selected.map(item => item.id));
    selected.push(...shuffle(items.filter(item => !selectedIds.has(item.id))).slice(0, count - selected.length));
  }
  return shuffle(selected);
}

function renderMemory() {
  const pairCount = Math.min(5, memoryWheelItems.length);
  const pairItems = selectMemoryItems(memoryWheelItems, pairCount);
  document.body.className = "m7-game memory-game";
  document.title = `Memory Game — Level C Week ${gameMeta.week}`;
  app.outerHTML = `<div class="game-floaties" aria-hidden="true"><span>🃏</span><span>${gameMeta.wheelIcon}</span></div>
    <main class="m7-game-page">
      <header class="m7-game-header"><h1><img src="https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/assets/games/${iconRoot}/game-memory.webp" alt="">Memory Game</h1><p>Look carefully, then find the ${pairCount} matching pairs!</p></header>
      <div class="m7-actions"><button class="m7-pill blue" id="preview" type="button">👀 Look for 3 Seconds</button><button class="m7-pill orange" id="restart" type="button">🔄 New Arrangement</button></div>
      <div class="memory-board${pairCount === 5 ? " five-pairs" : ""}" id="board" aria-label="Memory card board"></div><div class="memory-status" aria-live="polite"><span>Moves: <span id="moves">0</span></span><span>Pairs: <span id="pairs">0</span> / ${pairCount}</span></div>
    </main>
    <div class="match-modal" id="match-modal" role="dialog" aria-modal="true" aria-labelledby="match-title" hidden><div class="match-card"><h2 id="match-title">Great match!</h2><img id="match-image" src="" alt=""><p id="match-sentence"></p><button class="m7-pill green" id="match-continue" type="button">✓ Continue</button></div></div>
    <div class="game-celebration" id="celebration" role="dialog" aria-modal="true" aria-labelledby="celebration-title" hidden><div id="confetti" aria-hidden="true"></div><div class="celebration-card"><div class="celebration-emoji" aria-hidden="true">🎉🏆🎉</div><h2 id="celebration-title">Yay! You found all ${pairCount} pairs!</h2><button class="m7-pill green" id="play-again" type="button">🔄 Play Again</button></div></div>`;
  const board = document.querySelector("#board"), movesNode = document.querySelector("#moves"), pairsNode = document.querySelector("#pairs"), modal = document.querySelector("#match-modal"), celebration = document.querySelector("#celebration"), preview = document.querySelector("#preview");
  let first = null, lock = false, moves = 0, matches = 0, currentItems = pairItems;
  function start() {
    currentItems = selectMemoryItems(memoryWheelItems, pairCount); first = null; lock = false; moves = 0; matches = 0;
    movesNode.textContent = "0"; pairsNode.textContent = "0"; modal.hidden = true; celebration.hidden = true;
    const deck = shuffle(currentItems.flatMap(item => [{ item, copy: "a" }, { item, copy: "b" }]));
    board.replaceChildren(...deck.map(entry => {
      const card = document.createElement("button"); card.type = "button"; card.className = "memory-card"; card.dataset.id = entry.item.id; card.dataset.label = entry.item.label; card.setAttribute("aria-label", "Hidden picture card");
      card.innerHTML = `<span class="memory-card-picture">${gameImage(entry.item, "", "gameImage")}</span>`; card.addEventListener("click", () => flip(card)); return card;
    }));
  }
  function flip(card) {
    if (lock || card.classList.contains("flipped") || card.classList.contains("matched")) return;
    card.classList.add("flipped"); speak(card.dataset.label);
    if (!first) { first = card; return; }
    movesNode.textContent = String(++moves);
    if (first.dataset.id === card.dataset.id) {
      lock = true; first.classList.add("matched"); card.classList.add("matched"); first = null; pairsNode.textContent = String(++matches);
      const item = currentItems.find(entry => entry.id === card.dataset.id);
      setTimeout(() => { document.querySelector("#match-image").src = item.gameImage || item.image; document.querySelector("#match-image").alt = item.label; document.querySelector("#match-sentence").textContent = item.sentence; modal.hidden = false; speak(item.sentence); }, reducedMotion.matches ? 0 : 350);
    } else {
      lock = true; const previous = first; first = null;
      setTimeout(() => { previous.classList.remove("flipped"); card.classList.remove("flipped"); lock = false; }, reducedMotion.matches ? 50 : 750);
    }
  }
  document.querySelector("#match-continue").addEventListener("click", () => { modal.hidden = true; if (matches === pairCount) celebration.hidden = false; else lock = false; });
  document.querySelector("#play-again").addEventListener("click", start); document.querySelector("#restart").addEventListener("click", start);
  preview.addEventListener("click", () => { if (lock) return; lock = true; preview.disabled = true; board.querySelectorAll(".memory-card:not(.matched)").forEach(card => card.classList.add("previewing")); setTimeout(() => { board.querySelectorAll(".previewing").forEach(card => card.classList.remove("previewing")); preview.disabled = false; lock = false; }, reducedMotion.matches ? 250 : 3000); });
  start();
}

function renderWheel() {
  const colors = ["#7ed957", "#b388ff", "#ffa62b", "#ff8f66", "#4fc3f7"];
  const lessonItems = shuffle(memoryWheelItems).slice(0, 5).map((item, index) => ({ ...item, color: colors[index % colors.length] }));
  const bonusItems = window.SpinWheelBonus?.createSegments?.() || [];
  const bonusGaps = shuffle(lessonItems.map((_, index) => index)).slice(0, bonusItems.length);
  const arrangedItems = lessonItems.flatMap((item, index) => {
    const bonusIndex = bonusGaps.indexOf(index);
    return bonusIndex === -1 ? [item] : [item, bonusItems[bonusIndex]];
  });
  const offset = Math.floor(Math.random() * arrangedItems.length);
  const items = [...arrangedItems.slice(offset), ...arrangedItems.slice(0, offset)];
  document.body.className = "m7-game wheel-game"; document.title = `Spin the Wheel — Level C Week ${gameMeta.week}`;
  app.outerHTML = `<div class="game-floaties" aria-hidden="true"><span>🎡</span><span>⭐</span></div><main class="m7-game-page"><header class="m7-game-header"><h1><img src="https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/assets/games/${iconRoot}/game-wheel.webp" alt="">Spin the Wheel</h1><p>Spin fast, press stop, then discover a lesson card or a fun bonus!</p></header><div class="wheel-wrap"><div class="wheel-pointer"></div><div id="wheel" aria-label="${gameMeta.topic} picture wheel"></div></div><div class="wheel-result" id="result" aria-live="polite"></div><div class="wheel-actions"><button class="m7-pill wheel-action" id="spin-btn" type="button">🎡 SPIN!</button><button class="m7-pill wheel-action stop" id="stop-btn" type="button" hidden>🛑 STOP!</button></div></main><section class="selected-area" id="selected-area" role="dialog" aria-modal="true" aria-label="Selected picture card" hidden><p class="flip-hint">👆 Click the card to flip it!</p><button class="word-card" id="word-card" type="button" aria-pressed="false"><span class="card-inner"><span class="card-face card-front"><img id="front-image" src="" alt=""></span><span class="card-face card-back"><img id="back-image" src="" alt=""><strong id="card-word"></strong><span id="card-sentence"></span></span></span></button><button class="m7-pill return" id="return-btn" type="button">🎡 Back to Wheel</button></section>`;
  const wheel = document.querySelector("#wheel"), spin = document.querySelector("#spin-btn"), stop = document.querySelector("#stop-btn"), selected = document.querySelector("#selected-area"), card = document.querySelector("#word-card"), result = document.querySelector("#result");
  const angle = 360 / items.length; let rotation = 0, current = null;
  wheel.style.background = `conic-gradient(${items.map((item, index) => `${item.color || colors[index % colors.length]} ${index * angle}deg ${(index + 1) * angle}deg`).join(",")})`;
  wheel.setAttribute("aria-label", `Wheel with ${items.map(item => item.label).join(", ")}`);
  items.forEach((item, index) => { const label = document.createElement("span"), rad = (index * angle + angle / 2) * Math.PI / 180; label.className = "wheel-label"; label.style.width = `${Math.max(16, 170 / items.length)}%`; label.style.setProperty("--label-x", `${50 + Math.sin(rad) * 30}%`); label.style.setProperty("--label-y", `${50 - Math.cos(rad) * 30}%`); label.innerHTML = gameImage(item, "", item.gameImage ? "gameImage" : "image"); wheel.append(label); });
  spin.addEventListener("click", () => { selected.hidden = true; card.classList.remove("flipped"); spin.hidden = true; stop.hidden = false; document.body.classList.add("wheel-is-spinning"); wheel.classList.add("level-c-wheel-spinning"); result.textContent = "The wheel is spinning!"; });
  stop.addEventListener("click", () => { wheel.classList.remove("level-c-wheel-spinning"); document.body.classList.remove("wheel-is-spinning"); stop.hidden = true; spin.hidden = false; current = items[Math.floor(Math.random() * items.length)]; rotation += 1080 + items.indexOf(current) * angle; wheel.style.transform = `rotate(${rotation}deg)`; if (window.SpinWheelBonus?.show?.(current, { onSpinAgain: () => spin.click(), onClose: () => spin.focus({ preventScroll: true }) })) { result.textContent = current.sentence; current = null; return; } const selectedImage = current.gameImage || current.image; document.querySelector("#front-image").src = selectedImage; document.querySelector("#front-image").alt = current.label; document.querySelector("#back-image").src = selectedImage; document.querySelector("#back-image").alt = current.label; document.querySelector("#card-word").textContent = current.label; document.querySelector("#card-sentence").textContent = current.sentence; result.textContent = `You landed on ${current.label}!`; selected.hidden = false; speak(current.label); });
  card.addEventListener("click", () => { const flipped = card.classList.toggle("flipped"); card.setAttribute("aria-pressed", String(flipped)); if (current) speak(flipped ? current.sentence : current.label); });
  document.querySelector("#return-btn").addEventListener("click", () => { selected.hidden = true; current = null; });
}

function renderPictureMatch() {
  document.body.dataset.matchGame = "picture"; document.title = `Picture Match — Level C Week ${gameMeta.week}`;
  app.outerHTML = `<div class="match-floaties" aria-hidden="true"><span>🧩</span><span>${gameMeta.wheelIcon}</span></div><main class="match-page"><header class="match-heading"><h1><img src="https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/assets/games/${iconRoot}/game-matching.webp" alt="">Picture Match</h1><p>Read the literacy key sentence, then pick the matching 3D picture!</p></header><div class="match-toolbar"><button class="match-pill match-pill--orange" id="new-round" type="button">🔄 New Round</button><span class="match-score">Correct: <span id="score">0</span></span></div><section class="match-board"><div class="picture-choices" id="choices-row"></div><div class="sentence-box"><p id="sentence-text"></p><button class="listen-btn" id="sentence-listen" type="button" aria-label="Listen to the key sentence">🔊</button></div><p class="match-live" id="game-status" role="status" aria-live="polite"></p></section></main><div class="success-modal" id="success-modal" role="dialog" aria-modal="true" aria-labelledby="success-title" hidden><div class="success-card"><h2 id="success-title">Correct! 🎉</h2><div class="success-picture-review"><img id="review-image" src="" alt=""><p id="review-sentence"></p></div><button class="match-pill match-pill--green" id="continue-btn" type="button">✓ Continue</button></div></div>`;
  const choices = document.querySelector("#choices-row"), sentence = document.querySelector("#sentence-text"), listen = document.querySelector("#sentence-listen"), status = document.querySelector("#game-status"), modal = document.querySelector("#success-modal");
  let current, lastId = "", score = 0, locked = false;
  function render(autoSpeak = false) { locked = false; modal.hidden = true; status.textContent = ""; current = shuffle(literacyItems.filter(item => item.id !== lastId))[0]; lastId = current.id; sentence.textContent = current.sentence; listen.onclick = () => speak(current.sentence); choices.replaceChildren(); shuffle([current, ...shuffle(literacyItems.filter(item => item.id !== current.id)).slice(0, 2)]).forEach(item => { const button = document.createElement("button"); button.type = "button"; button.className = "picture-choice"; button.setAttribute("aria-label", `Choose 3D picture: ${item.label}`); button.innerHTML = gameImage(item); button.addEventListener("click", () => choose(button, item)); choices.append(button); }); if (autoSpeak) speak(current.sentence); }
  function choose(button, item) { if (locked) return; locked = true; choices.querySelectorAll("button").forEach(choice => { choice.disabled = true; }); if (item.id !== current.id) { tone("wrong"); button.classList.add("wrong"); status.textContent = "Good try. Read the key sentence and choose another picture."; setTimeout(() => { button.classList.remove("wrong"); choices.querySelectorAll("button").forEach(choice => { choice.disabled = false; }); locked = false; }, reducedMotion.matches ? 50 : 600); return; } tone("correct"); button.classList.add("correct"); status.textContent = "Correct!"; document.querySelector("#score").textContent = String(++score); document.querySelector("#review-image").src = current.image; document.querySelector("#review-image").alt = current.label; document.querySelector("#review-sentence").textContent = current.sentence; modal.hidden = false; speak(current.sentence); }
  document.querySelector("#continue-btn").addEventListener("click", () => render(true)); document.querySelector("#new-round").addEventListener("click", () => render(true)); render();
}

function renderPickRight() {
  document.body.dataset.matchGame = "pick"; document.title = `Pick the Right One — Level C Week ${gameMeta.week}`;
  app.outerHTML = `<div class="match-floaties" aria-hidden="true"><span>✅</span><span>${gameMeta.wheelIcon}</span></div><main class="match-page"><header class="match-heading"><h1><img src="https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/assets/games/${iconRoot}/game-pick.webp" alt="">Pick the Right One</h1><p>Look at the 3D picture, then choose its literacy key sentence!</p></header><div class="match-toolbar"><button class="match-pill match-pill--orange" id="new-question" type="button">🔄 New Question</button></div><section class="pick-board"><div class="question-box"><div class="question-scene level-c-question-scene"><img id="question-visual" src="" alt=""><button class="level-c-picture-listen" id="picture-listen" type="button" aria-label="Listen to the picture name">🔊</button></div><p id="question-text">Which key sentence matches this picture?</p><button class="listen-btn" id="question-listen" type="button" aria-label="Listen to the question">🔊</button></div><div class="answer-choices sentence-answer-choices" id="answers-row"></div><p class="match-live" id="game-status" role="status" aria-live="polite"></p></section></main><div class="success-modal" id="success-modal" role="dialog" aria-modal="true" aria-labelledby="success-title" hidden><div class="success-card"><h2 id="success-title">Correct! 🎉</h2><div class="success-text-review"><p><strong>Picture:</strong> <span id="review-question"></span></p><p><strong>Key sentence:</strong> <span id="review-answer"></span></p></div><button class="match-pill match-pill--green" id="continue-btn" type="button">✓ Continue</button></div></div>`;
  const visual = document.querySelector("#question-visual"), answers = document.querySelector("#answers-row"), status = document.querySelector("#game-status"), modal = document.querySelector("#success-modal"), question = "Which key sentence matches this picture?";
  let current, lastId = "", locked = false;
  function render() { locked = false; modal.hidden = true; status.textContent = ""; current = shuffle(literacyItems.filter(item => item.id !== lastId))[0]; lastId = current.id; visual.src = current.questionImage || current.image; visual.alt = current.label; document.querySelector("#question-listen").onclick = () => speak(question); document.querySelector("#picture-listen").onclick = () => speak(current.label); answers.replaceChildren(); const wrong = shuffle(literacyItems.filter(item => item.id !== current.id))[0]; shuffle([current, wrong]).forEach(item => { const wrapper = document.createElement("div"); wrapper.className = "answer-option"; const button = document.createElement("button"); button.type = "button"; button.className = "answer-choice sentence-only-choice"; button.innerHTML = `<span class="answer-choice-text">${item.sentence}</span>`; button.addEventListener("click", () => choose(button, item)); const listenAnswer = document.createElement("button"); listenAnswer.type = "button"; listenAnswer.className = "listen-btn"; listenAnswer.textContent = "🔊"; listenAnswer.setAttribute("aria-label", `Listen: ${item.sentence}`); listenAnswer.addEventListener("click", () => speak(item.sentence)); wrapper.append(button, listenAnswer); answers.append(wrapper); }); }
  function choose(button, item) { if (locked) return; locked = true; answers.querySelectorAll("button").forEach(choice => { choice.disabled = true; }); if (item.id !== current.id) { tone("wrong"); button.classList.add("wrong"); status.textContent = "Good try. Look at the 3D picture and choose another key sentence."; setTimeout(() => { button.classList.remove("wrong"); answers.querySelectorAll("button").forEach(choice => { choice.disabled = false; }); locked = false; }, reducedMotion.matches ? 50 : 600); return; } tone("correct"); button.classList.add("correct"); status.textContent = "Correct!"; document.querySelector("#review-question").textContent = current.label; document.querySelector("#review-answer").textContent = current.sentence; modal.hidden = false; speak(current.sentence); }
  document.querySelector("#continue-btn").addEventListener("click", render); document.querySelector("#new-question").addEventListener("click", render); render();
}

if (mode === "memory") renderMemory();
else if (mode === "wheel") renderWheel();
else if (mode === "matching") renderPictureMatch();
else renderPickRight();

bindSpeech();
addEventListener("pagehide", () => speechSynthesis?.cancel?.());
