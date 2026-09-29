import { getContent, shuffle } from "./content.js?deploy=20260929-level-c-live-refresh-11";

const params = new URLSearchParams(location.search);
const level = ["a", "b", "c"].includes(params.get("level")) ? params.get("level") : "a";
const week = Math.min(4, Math.max(1, Number(params.get("week")) || 1));
const game = ["falling", "basket", "echo"].includes(params.get("game")) ? params.get("game") : "falling";
const content = getContent(level, week);
const app = document.querySelector("#arcade");
const gameNames = { falling: "Falling Letters", basket: "Sound Basket", echo: "Echo Rhythm" };
const gameIcons = { falling: "🪂", basket: "🧺", echo: "🥁" };
const gameIconImages = {
  falling: "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/phonics-arcade/assets/falling-letters-3d-v1.png",
  basket: "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/phonics-arcade/assets/sound-basket-3d-v1.png",
  echo: "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/phonics-arcade/assets/echo-rhythm-3d-v1.png",
};
const themes = {
  a: {
    className: "theme-sports",
    label: "Month 8 Sports Sound Arena",
    shortLabel: "Sports Arena",
    scene: [
      "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-a/assets/media/games/week-1/soccer-pitch-bg-v2.png",
      "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-a/assets/media/literacy/week-2-games/gym-background.png",
      "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-a/assets/media/literacy/week-3-games/field.png",
      "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-a/assets/media/literacy/week-4-games/store-background.png",
    ][week - 1],
    guide: { ready: "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/phonics-arcade/assets/syd-ready.png", action: "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/phonics-arcade/assets/syd-catch.png", celebrate: "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/phonics-arcade/assets/syd-celebrate.png" },
  },
  b: {
    className: "theme-honey",
    label: "Month 8 Beekeeper Sound Garden",
    shortLabel: "Honey Garden",
    scene: [
      "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-b/assets/literacy/week-1/conversation-garden-3d-v2.png",
      "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-b/assets/literacy/week-2/conversation-honey-3d-v1.png",
      "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-b/assets/ui/weekly/week-3-pollination-card.png",
      "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-b/assets/ui/weekly/week-4-langstroth-hive-card.png",
    ][week - 1],
    guide: {
      ready: "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-b/assets/media/literacy/week-1-activities/bee-mascot-3d-v1.png",
      action: "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-b/assets/media/literacy/week-1-activities/bee-mascot-3d-v1.png",
      celebrate: "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-b/assets/media/literacy/week-1-activities/bee-mascot-3d-v1.png",
    },
  },
  c: {
    className: "theme-nature",
    label: "Month 8 Nature Sound Trail",
    shortLabel: "Nature Trail",
    scene: [
      "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/assets/ui/weekly/week-1-animal-parts-v4.png",
      "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/assets/ui/weekly/week-2-insect-parts-v4.png",
      "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/assets/ui/weekly/week-3-moon-phases-v4.png",
      "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/assets/ui/weekly/week-4-times-of-day-v4.png",
    ][week - 1],
    guide: {
      ready: [
        "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/assets/games/cutouts/week-1/dog.png",
        "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-b/assets/media/literacy/week-1-activities/bee-mascot-3d-v1.png",
        "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/assets/games/cutouts/week-3/owl.png",
        "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/assets/games/cutouts/week-4/tiger.png",
      ][week - 1],
      action: [
        "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/assets/games/cutouts/week-1/dog.png",
        "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-b/assets/media/literacy/week-1-activities/bee-mascot-3d-v1.png",
        "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/assets/games/cutouts/week-3/eagle.png",
        "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/assets/games/cutouts/week-4/bear.png",
      ][week - 1],
      celebrate: [
        "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/assets/games/cutouts/week-1/squirrel.png",
        "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-b/assets/media/literacy/week-1-activities/bee-mascot-3d-v1.png",
        "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/assets/games/cutouts/week-3/falcon.png",
        "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/assets/games/cutouts/week-4/panda.png",
      ][week - 1],
    },
  },
};
const theme = themes[level];
document.body.className = theme.className;
document.body.classList.toggle("game-falling", game === "falling");
document.body.style.setProperty("--scene", `url("${theme.scene}")`);
const navigation = document.querySelector("#arcade-navigation");
const mainHref = `/LevelC_M8/apps/level-${level}/index.html`;
const weekHref = level === "a" ? `/LevelC_M8/apps/level-a/week-${week}.html#games-card` : `https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-${level}/week-${week}`;
navigation.setAttribute("data-main-href", mainHref);
navigation.setAttribute("data-week-href", weekHref);
navigation.setAttribute("data-section-href", safeReturn());
navigation.setAttribute("data-trail", `${content.levelName} · Month 8 · Week ${week} · Phonics`);
const instructions = {
  falling: "Tap the falling letters or letter teams in the correct order.",
  basket: "Look at the picture and put it in the basket with the matching sound.",
  echo: "Listen to the sound pattern, then tap the sound drums in the same order.",
};
let muted = false;
let speechId = 0;
const levelCPhonemeAudio = {
  ar: "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/phonics-arcade/assets/audio/level-c/ar.mp3",
  or: "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/phonics-arcade/assets/audio/level-c/or.mp3",
  er: "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/phonics-arcade/assets/audio/level-c/er-ir.mp3",
  ir: "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/phonics-arcade/assets/audio/level-c/er-ir.mp3",
};

function recordedPhoneme(sound) {
  return level === "c" ? levelCPhonemeAudio[sound.toLowerCase()] || "" : "";
}

function safeReturn() {
  const requested = params.get("return");
  if (requested?.startsWith("/LevelC_M8/apps/")) return requested;
  if (level === "a") return `/LevelC_M8/apps/level-a/games/phonics.html?week=${week}`;
  if (level === "b") return `/LevelC_M8/apps/level-b/games/phonics.html?week=${week}`;
  return `/LevelC_M8/apps/level-c/week-${week}/games/phonics.html`;
}

function speak(text, rate = .82) {
  if (muted || !("speechSynthesis" in window)) return;
  speechId += 1;
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = rate;
  utterance.pitch = 1.08;
  const voices = speechSynthesis.getVoices();
  utterance.voice = voices.find(v => /Samantha|Ava|Jenny|Aria|Zira|Google US English/i.test(v.name) && /^en[-_]US$/i.test(v.lang))
    || voices.find(v => /^en[-_]US$/i.test(v.lang)) || null;
  speechSynthesis.speak(utterance);
}

function playSound(sound) {
  if (muted) return;
  const phonemeSource = recordedPhoneme(sound);
  if (phonemeSource) {
    const audio = new Audio(phonemeSource);
    audio.volume = .98;
    audio.play().catch(() => tone(220, .08));
    return;
  }
  if (/^[a-z]$/i.test(sound)) {
    const audio = new Audio(`https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-a/assets/audio/phonics-m7/letters/${sound.toLowerCase()}.mp3`);
    audio.volume = .95;
    audio.play().catch(() => speak(sound));
  } else speak(sound, .68);
}

function playSoundFully(sound) {
  if (muted) return Promise.resolve();
  const phonemeSource = recordedPhoneme(sound);
  if (phonemeSource) {
    const audio = new Audio(phonemeSource);
    audio.volume = .98;
    return new Promise(resolve => {
      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;
        clearTimeout(fallback);
        resolve();
      };
      const fallback = setTimeout(finish, 5000);
      audio.addEventListener("ended", finish, { once: true });
      audio.addEventListener("error", finish, { once: true });
      audio.play().catch(() => { tone(220, .08); finish(); });
    });
  }
  if (/^[a-z]$/i.test(sound)) {
    const audio = new Audio(`https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-a/assets/audio/phonics-m7/letters/${sound.toLowerCase()}.mp3`);
    audio.volume = .95;
    return new Promise(resolve => {
      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;
        clearTimeout(fallback);
        resolve();
      };
      const fallback = setTimeout(finish, 5000);
      audio.addEventListener("ended", finish, { once: true });
      audio.addEventListener("error", finish, { once: true });
      audio.play().catch(() => { speak(sound); finish(); });
    });
  }
  if (!("speechSynthesis" in window)) return Promise.resolve();
  window.speechSynthesis.cancel();
  return new Promise(resolve => {
    const utterance = new SpeechSynthesisUtterance(sound);
    utterance.lang = "en-US";
    utterance.rate = .68;
    utterance.pitch = 1.08;
    const voices = window.speechSynthesis.getVoices();
    utterance.voice = voices.find(voice => /Samantha|Ava|Jenny|Aria|Zira|Google US English/i.test(voice.name) && /^en[-_]US$/i.test(voice.lang))
      || voices.find(voice => /^en[-_]US$/i.test(voice.lang)) || null;
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      clearTimeout(fallback);
      resolve();
    };
    const fallback = setTimeout(finish, 5000);
    utterance.onend = finish;
    utterance.onerror = finish;
    window.speechSynthesis.speak(utterance);
  });
}

function tone(frequency, duration = .15) {
  if (muted) return;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  const ctx = tone.ctx || (tone.ctx = new AudioContext());
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.frequency.value = frequency;
  oscillator.type = "sine";
  gain.gain.setValueAtTime(.0001, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(.16, ctx.currentTime + .02);
  gain.gain.exponentialRampToValueAtTime(.0001, ctx.currentTime + duration);
  oscillator.connect(gain).connect(ctx.destination);
  oscillator.start(); oscillator.stop(ctx.currentTime + duration + .02);
}

function burst(x = innerWidth / 2, y = innerHeight / 2) {
  for (let index = 0; index < 20; index += 1) {
    const piece = document.createElement("i");
    const angle = Math.PI * 2 * index / 20;
    piece.className = "confetti";
    piece.style.left = `${x}px`; piece.style.top = `${y}px`;
    piece.style.background = ["#ffd752", "#12afa8", "#ff6f61", "#8266d4"][index % 4];
    piece.style.setProperty("--x", `${Math.cos(angle) * (80 + Math.random() * 90)}px`);
    piece.style.setProperty("--y", `${Math.sin(angle) * (80 + Math.random() * 90)}px`);
    document.body.append(piece); setTimeout(() => piece.remove(), 850);
  }
}

function frame(stageMarkup) {
  document.title = `${gameNames[game]} — ${content.levelName} Week ${week}`;
  app.innerHTML = `
    <div class="page game-home-anchor-container">
      <header class="game-heading center">
        <div class="page-title-with-icon">
          <img class="page-title-icon" src="${gameIconImages[game]}" alt="">
          <h1 class="big-title">${gameNames[game]}</h1>
        </div>
        <p class="subtitle">${content.levelName} · Week ${week} · ${theme.label}</p>
      </header>
      <div class="game-toolbar"><button class="pill-btn blue" id="instruction" type="button">🔊 Hear Instructions</button><button class="pill-btn green" id="mute" type="button" aria-label="Mute sound">🔈 Sound On</button></div>
      <section class="phonics-board ${game === "falling" ? "falling-board" : ""}" id="lesson-focus">
        <div class="mission"><span aria-hidden="true">${gameIcons[game]}</span><p>${instructions[game]}</p></div>
        <div class="progress" id="progress"></div>
        <section class="stage" id="stage">${stageMarkup}</section>
      </section>
    </div>`;
  document.querySelector("#instruction").addEventListener("click", () => speak(instructions[game]));
  document.querySelector("#mute").addEventListener("click", event => {
    muted = !muted; event.currentTarget.textContent = muted ? "🔇 Sound Off" : "🔈 Sound On";
    event.currentTarget.setAttribute("aria-label", muted ? "Turn sound on" : "Mute sound");
    if (muted) window.speechSynthesis?.cancel();
  });
  requestAnimationFrame(() => document.querySelector("#lesson-focus")?.scrollIntoView({ block: "start", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" }));
}

function setProgress(total, current) {
  document.querySelector("#progress").innerHTML = Array.from({ length: total }, (_, index) => `<i class="${index < current ? "done" : index === current ? "current" : ""}"></i>`).join("");
}

function feedback(text, kind = "good") {
  const target = document.querySelector("#feedback");
  if (target) { target.textContent = text; target.className = `feedback ${kind}`; }
  const bubble = document.querySelector("#speech");
  if (bubble) bubble.textContent = text;
}

function finish(message) {
  const stage = document.querySelector("#stage");
  stage.insertAdjacentHTML("beforeend", `<section class="overlay" id="finish"><div class="panel"><span class="panel-medal">🏆</span><img src="${theme.guide.celebrate}" alt="${theme.shortLabel} guide celebrating"><h2>Phonics Champion!</h2><p>${message}</p><button class="primary" id="again" type="button">Play Again</button></div></section>`);
  document.querySelector("#again").addEventListener("click", () => location.reload());
  [523, 659, 784].forEach((value, index) => setTimeout(() => tone(value, .22), index * 130));
  burst(); speak(message);
}

function renderFalling() {
  frame(`<div class="falling-layout"><div class="falling-target"><article class="picture-card"><button class="speaker" id="word-audio" type="button" aria-label="Hear the word">🔊</button><img id="word-picture" alt=""><strong id="word-label"></strong></article><div class="falling-word-panel"><div class="word-slots" id="word-slots"></div><p class="feedback" id="feedback"></p></div></div><div class="fall-zone" id="fall-zone"><button class="big-btn btn-green fall-start" id="fall-start" type="button">▶ Start</button></div></div>`);
  let rounds = shuffle(content.words);
  let round = 0, tokenIndex = 0, timer = null, running = false;
  const zone = document.querySelector("#fall-zone");

  function loadRound() {
    zone.querySelectorAll(".falling-tile").forEach(tile => tile.remove());
    tokenIndex = 0; setProgress(rounds.length, round);
    const item = rounds[round];
    document.querySelector("#word-picture").src = item.image;
    document.querySelector("#word-picture").alt = item.word;
    document.querySelector("#word-label").textContent = item.display;
    const slots = document.querySelector("#word-slots");
    slots.style.setProperty("--slot-count", item.tokens.length);
    slots.innerHTML = item.tokens.map(token => `<span>${token}</span>`).join("");
    document.querySelector("#word-audio").onclick = () => speak(item.word);
    feedback(`Build ${item.display}.`, "good");
  }

  function spawn() {
    if (!running) return;
    const item = rounds[round];
    const expected = item.tokens[tokenIndex];
    const distractors = [...new Set(content.words.flatMap(word => word.tokens).filter(token => token.toLowerCase() !== expected.toLowerCase()))];
    const token = Math.random() < .48 || !distractors.length ? expected : distractors[Math.floor(Math.random() * distractors.length)];
    const button = document.createElement("button");
    button.type = "button"; button.className = `falling-tile${token.length > 1 ? " team" : ""}`; button.textContent = token;
    button.style.left = `${3 + Math.random() * 86}%`; button.style.setProperty("--speed", `${4.9 + Math.random() * 1.8}s`);
    button.addEventListener("animationend", () => button.remove());
    button.addEventListener("click", async () => {
      if (!running || button.dataset.used === "true") return;
      button.dataset.used = "true";
      button.disabled = true;
      const currentExpected = item.tokens[tokenIndex];
      if (!currentExpected) return;
      if (token.toLowerCase() !== currentExpected.toLowerCase()) {
        const zoneRect = zone.getBoundingClientRect();
        const buttonRect = button.getBoundingClientRect();
        button.style.top = `${buttonRect.top - zoneRect.top}px`;
        button.classList.add("wrong"); tone(220); feedback("Try another letter!", "try"); setTimeout(() => button.remove(), 520); return;
      }
      button.classList.add("correct"); tone(660);
      document.querySelectorAll("#word-slots span")[tokenIndex].classList.add("filled"); tokenIndex += 1;
      const wordComplete = tokenIndex === item.tokens.length;
      feedback("Great catch!", "good"); burst(button.getBoundingClientRect().x, button.getBoundingClientRect().y); setTimeout(() => button.remove(), 300);
      if (wordComplete) {
        running = false; clearInterval(timer);
        await playSoundFully(currentExpected);
        await new Promise(resolve => setTimeout(resolve, 140));
        speak(item.word);
        setTimeout(() => { round += 1; if (round === rounds.length) finish("You caught every sound and built every word!"); else { loadRound(); running = true; timer = setInterval(spawn, 720); spawn(); } }, 1100);
      } else playSound(currentExpected);
    });
    zone.append(button);
  }

  loadRound();
  document.querySelector("#fall-start").addEventListener("click", event => {
    event.currentTarget.remove(); tone(523); speak(instructions.falling); running = true; timer = setInterval(spawn, 720); spawn();
  }, { once: true });
}

function renderBasket() {
  frame(`<div class="basket-layout"><article class="picture-card sort-card" id="sort-card" draggable="true"><button class="speaker" id="word-audio" type="button">🔊</button><img id="sort-picture" alt=""><strong id="sort-word"></strong><small>Drag me or tap a basket!</small></article><div class="basket-row" id="basket-row"></div><p class="feedback" id="feedback"></p></div>`);
  const pool = shuffle(content.basketGroups.flatMap(group => group.items.map(item => ({ ...item, group: group.id })))).slice(0, 6);
  let index = 0;
  const row = document.querySelector("#basket-row");
  row.innerHTML = content.basketGroups.map(group => `<div class="basket-wrap"><button class="speaker" data-hear="${group.id}" type="button" aria-label="Hear ${group.label}">🔊</button><div class="collected" id="collected-${group.id}"></div><button class="basket" data-group="${group.id}" type="button"><span class="basket-letter">${group.id}</span><span class="basket-name">${group.label}</span></button></div>`).join("");
  row.querySelectorAll("[data-hear]").forEach(button => button.addEventListener("click", () => playSound(button.dataset.hear)));

  function show() {
    setProgress(pool.length, index); const item = pool[index];
    document.querySelector("#sort-picture").src = item.image; document.querySelector("#sort-picture").alt = item.word;
    document.querySelector("#sort-word").textContent = item.word;
    document.querySelector("#word-audio").onclick = () => speak(item.word);
    feedback("Which sound do you hear?", "good"); speak(item.word);
  }

  function choose(group, button) {
    const item = pool[index];
    if (group !== item.group) { tone(220); playSound(item.group); feedback(`Good try. Listen for ${item.group}.`, "try"); return; }
    tone(660); burst(button.getBoundingClientRect().x + 60, button.getBoundingClientRect().y + 70);
    document.querySelector(`#collected-${group}`).insertAdjacentHTML("beforeend", `<img src="${item.image}" alt="${item.word}">`);
    feedback(`Yes! ${item.word} belongs with ${group}.`, "good");
    if (level === "c") playSound(group); else speak(`${item.word}. ${group}.`);
    index += 1;
    setTimeout(() => index === pool.length ? finish("You sorted every picture by its phonics sound!") : show(), 850);
  }
  row.querySelectorAll(".basket").forEach(button => {
    button.addEventListener("click", () => choose(button.dataset.group, button));
    button.addEventListener("dragover", event => event.preventDefault());
    button.addEventListener("drop", event => { event.preventDefault(); choose(button.dataset.group, button); });
  });
  document.querySelector("#sort-card").addEventListener("dragstart", event => event.dataTransfer.setData("text/plain", "picture"));
  show();
}

function renderEcho() {
  frame(`<div class="echo-layout"><div class="phase" id="phase">Listen first</div><div class="beats" id="beats"></div><div class="listen-row"><button class="primary" id="listen" type="button">▶ Hear Pattern</button></div><div class="sound-deck ${content.echoSounds.length === 2 ? "two" : ""}" id="sound-deck"></div><p class="feedback" id="feedback"></p></div>`);
  const deck = document.querySelector("#sound-deck");
  deck.innerHTML = content.echoSounds.map(sound => `<button class="sound-pad" data-sound="${sound}" type="button" aria-label="${sound} sound">${sound}</button>`).join("");
  let round = 0, player = [], locked = true, patterns = [];

  function createPatterns() {
    patterns = content.echoLengths.map(length => {
      const pattern = [];
      for (let index = 0; index < length; index += 1) {
        const previous = pattern.at(-1);
        const options = content.echoSounds.filter(sound => sound !== previous);
        pattern.push(options[Math.floor(Math.random() * options.length)] || content.echoSounds[0]);
      }
      return pattern;
    });
  }
  function renderRound() {
    setProgress(patterns.length, round); player = []; locked = true;
    document.querySelector("#beats").innerHTML = patterns[round].map(() => '<span class="beat">?</span>').join("");
    document.querySelector("#phase").textContent = "Listen first"; feedback("Syd will play the pattern.", "good");
  }
  const wait = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));
  async function playPattern() {
    if (!patterns[round]) return; locked = true; player = []; document.querySelector("#phase").textContent = "Listen carefully";
    const beatEls = [...document.querySelectorAll(".beat")]; beatEls.forEach(beat => { beat.textContent = "?"; beat.classList.remove("done"); });
    for (let index = 0; index < patterns[round].length; index += 1) {
      const sound = patterns[round][index]; const pad = document.querySelector(`[data-sound="${sound}"]`);
      pad.classList.add("flash"); beatEls[index].textContent = sound; beatEls[index].classList.add("done");
      await playSoundFully(sound);
      pad.classList.remove("flash");
      await wait(170);
    }
    await wait(300); beatEls.forEach(beat => { beat.textContent = "?"; beat.classList.remove("done"); });
    locked = false; document.querySelector("#phase").textContent = "Your turn!"; feedback("Echo the same pattern.", "good");
  }
  deck.querySelectorAll(".sound-pad").forEach(pad => pad.addEventListener("click", async () => {
    if (locked) return; const sound = pad.dataset.sound; playSound(sound); pad.classList.add("flash"); setTimeout(() => pad.classList.remove("flash"), 320);
    const expected = patterns[round][player.length];
    if (sound !== expected) { locked = true; tone(220); feedback("Almost! Listen one more time.", "try"); await wait(650); playPattern(); return; }
    player.push(sound); const beat = document.querySelectorAll(".beat")[player.length - 1]; beat.textContent = sound; beat.classList.add("done");
    if (player.length === patterns[round].length) { locked = true; tone(660); burst(); feedback("Perfect echo!", "good"); await wait(900); round += 1; if (round === patterns.length) finish("You echoed every phonics rhythm!"); else { renderRound(); await wait(450); playPattern(); } }
  }));
  document.querySelector("#listen").addEventListener("click", playPattern);
  createPatterns(); renderRound();
}

if (game === "falling") renderFalling();
else if (game === "basket") renderBasket();
else renderEcho();

addEventListener("pagehide", () => { window.speechSynthesis?.cancel(); });
