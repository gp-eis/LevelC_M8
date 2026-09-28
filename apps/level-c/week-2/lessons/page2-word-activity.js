import { playCorrectSound, playWrongSound } from "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/assets/navigation/gp-sounds.js?v=20260921-1";

const app = document.querySelector("[data-word-app]");
let voice = null;
let selected = [null, null, null];
const completedWords = new Set();
const crossedRows = new Set();

const columns = [
  ["m", "e", "w"],
  ["ye", "in", "an"],
  ["e", "gs", "s"]
];
const puzzleColors = [
  ["yellow", "purple", "green"],
  ["purple", "green", "yellow"],
  ["yellow", "green", "purple"]
];
const validWords = new Set(["mane", "eyes", "wings"]);
const spellingRows = [
  { word: "mane", image: "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/assets/literacy/week-2/page-02-clues/horse-mane-v1.png", alt: "A horse's mane", choices: ["mane", "mane", "mena", "mane"] },
  { word: "chest", image: "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/assets/literacy/week-2/page-02-clues/horse-chest-v1.png", alt: "A horse's chest", choices: ["chest", "chest", "chset", "chest"] },
  { word: "wings", image: "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/assets/literacy/week-2/page-02-clues/bee-wings-v1.png", alt: "A bee's wings", choices: ["wings", "wings", "swing", "wings"] },
  { word: "legs", image: "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/assets/literacy/week-2/page-02-clues/bee-legs-v1.png", alt: "A bee's six legs", choices: ["legs", "legs", "lges", "legs"] }
];

function shuffled(items) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function chooseVoice() {
  const voices = speechSynthesis?.getVoices?.() || [];
  voice = voices.find(item => /^en[-_]US$/i.test(item.lang || "") && /aria|jenny|samantha|zira|google us english/i.test(item.name)) || voices.find(item => /^en[-_]US$/i.test(item.lang || "")) || null;
}

function speak(text) {
  if (!("speechSynthesis" in window) || !text) return;
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.voice = voice;
  utterance.lang = "en-US";
  utterance.rate = .84;
  utterance.pitch = 1.07;
  speechSynthesis.speak(utterance);
}

chooseVoice();
if ("speechSynthesis" in window) speechSynthesis.addEventListener("voiceschanged", chooseVoice, { once: true });

function completionOverlay() {
  let overlay = document.querySelector("#level-c-literacy-completion");
  if (overlay) return overlay;
  overlay = document.createElement("div");
  overlay.id = "level-c-literacy-completion";
  overlay.className = "activity-completion-overlay";
  overlay.hidden = true;
  overlay.innerHTML = `<div class="activity-completion-frame" role="dialog" aria-modal="true" aria-label="Good job"><button class="activity-completion-close" type="button" aria-label="Close">×</button><video class="activity-completion-video" playsinline preload="auto" src="https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/assets/video/shared/pow-wow-you-did-it.mp4"></video><button class="activity-completion-play" type="button" hidden>▶</button><div class="activity-completion-actions"><button class="activity-completion-retry" type="button">↻ Try Again</button></div></div>`;
  document.body.append(overlay);
  const video = overlay.querySelector("video");
  const play = overlay.querySelector(".activity-completion-play");
  const close = () => { video.pause(); overlay.hidden = true; document.documentElement.classList.remove("level-c-completion-open"); };
  overlay.querySelector(".activity-completion-close").addEventListener("click", close);
  overlay.querySelector(".activity-completion-retry").addEventListener("click", () => location.reload());
  play.addEventListener("click", () => { play.hidden = true; video.play().catch(() => { play.hidden = false; }); });
  return overlay;
}

function showCompletion() {
  const overlay = completionOverlay();
  const video = overlay.querySelector("video");
  const play = overlay.querySelector(".activity-completion-play");
  overlay.hidden = false;
  document.documentElement.classList.add("level-c-completion-open");
  video.currentTime = 0;
  play.hidden = true;
  video.play().catch(() => { play.hidden = false; });
}

if (app) {
  app.innerHTML = `<header class="sequence-heading"><h1>🐝 The Horse and the Bee</h1><p class="c-page-count">Page 2 of 5</p><div class="week-tools"><a class="pill-btn orange" href="week-song.html?return=week-2-page-02.html%23lesson-focus"><span aria-hidden="true">🎵</span><span class="tool-label">Week Song</span></a><a class="pill-btn blue" href="flashcards.html?return=week-2-page-02.html%23lesson-focus"><span aria-hidden="true">🃏</span><span class="tool-label">Flashcards</span></a><a class="pill-btn green" href="conversation.html?return=week-2-page-02.html%23lesson-focus"><span aria-hidden="true">💬</span><span class="tool-label">Conversation</span></a></div></header><nav class="c-pagination" aria-label="Literacy pages"><a href="week-2-page-01.html#lesson-focus">1</a><a aria-current="page" href="week-2-page-02.html#lesson-focus">2</a><a href="week-2-page-03.html#lesson-focus">3</a><a href="week-2-page-04.html#lesson-focus">4</a><a href="week-2-page-05.html#lesson-focus">5</a></nav><nav class="literacy-part-tabs" aria-label="Choose an activity part"><a href="?stage=1#lesson-focus" data-stage="1">Part 1</a><a href="?stage=2#lesson-focus" data-stage="2">Part 2</a><a href="?stage=3#lesson-focus" data-stage="3">Part 3</a></nav><div id="page2-stage"></div>`;
  const stage = app.querySelector("#page2-stage");
  const completedParts = new Set();
  const partTabs = [...app.querySelectorAll(".literacy-part-tabs a")];
  let currentPart = 1;

  function updatePartTabs() {
    partTabs.forEach(button => {
      const part = Number(button.dataset.stage);
      button.classList.toggle("is-current", part === currentPart);
      button.classList.toggle("is-complete", completedParts.has(part));
      button.setAttribute("aria-current", part === currentPart ? "step" : "false");
    });
  }

  function openPart(part, shouldCenter = true) {
    currentPart = Math.min(3, Math.max(1, Number(part) || 1));
    const url = new URL(location.href);
    url.searchParams.set("stage", String(currentPart));
    history.replaceState(null, "", url);
    updatePartTabs();
    if (currentPart === 1) renderPartOne();
    else if (currentPart === 2) renderWordActivities();
    else renderCrossOut();
    if (shouldCenter) centerActiveStage();
  }

  function centerActiveStage() {
    const activePanel = stage.firstElementChild;
    if (!activePanel) return;
    const focusPanel = () => {
      if (window.matchMedia("(min-width: 901px)").matches) {
        const activityTop = activePanel.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: Math.max(0, activityTop - 78), behavior: "auto" });
      } else {
        activePanel.scrollIntoView({ behavior: "auto", block: "start" });
      }
    };

    // The picture-based stages grow slightly while their images decode. Refocus
    // after that layout settles so the large Week 1 proportions stay in view
    // without compressing the title, tools, or activity itself.
    window.setTimeout(focusPanel, 80);
    const images = [...activePanel.querySelectorAll("img")];
    Promise.all(images.map(image => {
      if (image.decode) return image.decode().catch(() => undefined);
      if (image.complete) return Promise.resolve();
      return new Promise(resolve => image.addEventListener("load", resolve, { once: true }));
    })).finally(() => {
      focusPanel();
      window.setTimeout(focusPanel, 180);
    });
  }

  function renderPartOne() {
    const questions = [
      { sentence: "A bee has ___ legs.", options: ["six", "four"], correct: 0 },
      { sentence: "The horse has a wide ___.", options: ["hoof", "chest"], correct: 1 }
    ];
    let questionIndex = 0;
    const imagePath = "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/assets/literacy/week-2/page-02-horse-bee-v2-four-wings.png";
    stage.innerHTML = `<section class="sequence-card sequence-card--landscape"><div class="sequence-layout"><div class="source-pair source-pair--generated-landscape"><img src="${imagePath}" alt="A horse and a bee in a flower meadow"><div class="scene-text-grid scene-text-grid--2"><section class="scene-text-card"><strong>HORSE</strong><span>Wow! Look at that!!</span><span>Horses run!</span><span>Beautiful mane.</span><span>Strong hoof.</span><span>Wide chest.</span><span>Handsome muzzle.</span></section><section class="scene-text-card"><strong>BEE</strong><span>Amazing! The bee flies.</span><span>One abdomen.</span><span>Two antennae.</span><span>Four wings.</span><span>Five eyes.</span><span>Six legs.</span></section></div><span class="scene-badge">Part <b>1</b></span><span class="scene-zoom-hint" aria-hidden="true">🔍 Move to magnify</span><span class="scene-magnifier" aria-hidden="true"></span></div><div class="sequence-copy"><span class="tag">1. Look, read, and circle</span><h2>Question <span id="part-one-number">1</span> of 2</h2><p class="sequence-reading">Look closely at the horse and the bee. Choose the correct word.</p><button class="hear-question-btn" id="part-one-hear" type="button">🔊 Hear the question</button><p class="sequence-question" id="part-one-question"></p><div class="sequence-choices" id="part-one-choices"></div><p class="sequence-feedback" id="part-one-feedback" aria-live="polite"></p><button class="part-one-next" id="part-one-next" type="button" hidden></button></div></div></section>`;
    const frame = stage.querySelector(".source-pair");
    const magnifier = stage.querySelector(".scene-magnifier");
    const number = stage.querySelector("#part-one-number");
    const prompt = stage.querySelector("#part-one-question");
    const choices = stage.querySelector("#part-one-choices");
    const feedback = stage.querySelector("#part-one-feedback");
    const next = stage.querySelector("#part-one-next");
    magnifier.style.backgroundImage = `url("${imagePath}")`;
    const moveLens = event => {
      const rect = frame.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width, event.clientX - rect.left));
      const y = Math.max(0, Math.min(rect.height, event.clientY - rect.top));
      const zoom = 1.45;
      const size = magnifier.offsetWidth || 180;
      magnifier.style.left = `${x}px`; magnifier.style.top = `${y}px`;
      magnifier.style.backgroundSize = `${rect.width * zoom}px ${rect.height * zoom}px`;
      magnifier.style.backgroundPosition = `${size / 2 - x * zoom}px ${size / 2 - y * zoom}px`;
    };
    frame.addEventListener("pointerenter", event => { magnifier.classList.add("is-visible"); moveLens(event); });
    frame.addEventListener("pointermove", event => { if (event.pointerType !== "touch") moveLens(event); });
    frame.addEventListener("pointerleave", () => magnifier.classList.remove("is-visible"));
    function renderQuestion() {
      const current = questions[questionIndex];
      const [before, after] = current.sentence.split("___");
      number.textContent = String(questionIndex + 1);
      prompt.innerHTML = `<span class="question-number-token" style="--question-color:${questionIndex ? "#ff6464" : "#48bfa3"}">${questionIndex + 1}</span><span class="question-sentence">${before}<b class="answer-blank">_____</b>${after}</span>`;
      const blank = prompt.querySelector(".answer-blank");
      choices.innerHTML = "";
      feedback.className = "sequence-feedback";
      feedback.textContent = "Choose the correct word from the book activity.";
      next.hidden = true;
      current.options.forEach((option, optionIndex) => {
        const wrap = document.createElement("div"); wrap.className = "choice-option";
        const button = document.createElement("button"); button.className = "word-choice"; button.type = "button"; button.textContent = option;
        const listen = document.createElement("button"); listen.className = "choice-listen"; listen.type = "button"; listen.textContent = "🔊"; listen.setAttribute("aria-label", `Hear ${option}`); listen.addEventListener("click", () => speak(option));
        button.addEventListener("click", () => {
          speak(option);
          choices.querySelectorAll(".word-choice").forEach(item => item.classList.remove("is-wrong"));
          if (optionIndex !== current.correct) { playWrongSound(); button.classList.add("is-wrong"); feedback.className = "sequence-feedback is-wrong"; feedback.textContent = "Good try. Look at the picture and choose again."; return; }
          playCorrectSound(); button.classList.add("is-correct"); blank.textContent = option; blank.classList.add("is-filled"); choices.querySelectorAll("button").forEach(item => { item.disabled = true; }); feedback.className = "sequence-feedback is-correct"; feedback.textContent = "Great job!"; speak(current.sentence.replace("___", option));
          next.hidden = false; next.textContent = questionIndex === 0 ? "Next question →" : "Continue to Part 2 →";
        });
        wrap.append(button, listen); choices.append(wrap);
      });
      speak(`${questionIndex === 0 ? "Look closely at the horse and the bee. " : ""}${current.sentence.replace("___", "blank")}`);
    }
    stage.querySelector("#part-one-hear").addEventListener("click", () => speak(questions[questionIndex].sentence.replace("___", "blank")));
    next.addEventListener("click", () => { if (questionIndex === 0) { questionIndex = 1; renderQuestion(); } else { completedParts.add(1); openPart(2); } });
    renderQuestion();
    centerActiveStage();
  }

  function renderWordActivities() {
    selected = [null, null, null]; completedWords.clear();
    let pendingMatch = null;
    const shuffledColumns = columns.map((column, columnIndex) => shuffled(column.map((chunk, chunkIndex) => ({ chunk, color: puzzleColors[columnIndex][chunkIndex] }))));
    const shuffledClues = shuffled([
      { word: "mane", image: "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/assets/literacy/week-2/page-02-clues/horse-mane-v1.png", alt: "Close-up of a horse's mane" },
      { word: "wings", image: "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/assets/literacy/week-2/page-02-clues/bee-wings-v1.png", alt: "Close-up of a bee's wings" },
      { word: "eyes", image: "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/assets/literacy/week-2/page-02-clues/bee-eyes-v1.png", alt: "Close-up of a bee's eyes" }
    ]);
    stage.innerHTML = `<section class="word-book-board stage-panel"><section class="book-task match-task"><div class="book-task__heading"><span>2</span><div><h2>Match the letters to make the words.</h2><p>Build a word, then connect it to the correct picture.</p></div><button class="hear-question-btn" id="hear-match" type="button">🔊 Listen</button></div><div class="match-layout" id="match-layout"><svg class="match-picture-lines" id="match-picture-lines" aria-hidden="true"></svg><div class="chunk-board" id="chunk-board"><svg class="chunk-lines" id="chunk-lines" aria-hidden="true"></svg>${shuffledColumns.map((column, columnIndex) => `<div class="chunk-column" data-column="${columnIndex}">${column.map(item => `<button class="letter-chunk letter-chunk--${item.color}" type="button" data-chunk="${item.chunk}">${item.chunk}</button>`).join("")}</div>`).join("")}</div><aside class="match-clue-strip" aria-label="Picture clues"><span class="paper-tape" aria-hidden="true"></span>${shuffledClues.map(clue => `<figure data-word="${clue.word}" role="button" tabindex="0" aria-label="Connect the word to ${clue.alt}"><img src="${clue.image}" alt="${clue.alt}"><figcaption>${clue.word}</figcaption></figure>`).join("")}</aside></div><p class="word-build-feedback" id="word-build-feedback" aria-live="polite">Build a word, then tap its matching picture.</p></section></section>`;

  const board = app.querySelector("#chunk-board");
  const lines = app.querySelector("#chunk-lines");
  const matchLayout = app.querySelector("#match-layout");
  const pictureLines = app.querySelector("#match-picture-lines");
  const buildFeedback = app.querySelector("#word-build-feedback");

  function drawLines(buttons) {
    const boardRect = board.getBoundingClientRect();
    const points = buttons.map(button => {
      const rect = button.getBoundingClientRect();
      return { x: rect.left - boardRect.left + rect.width / 2, y: rect.top - boardRect.top + rect.height / 2 };
    });
    for (let index = 0; index < points.length - 1; index += 1) {
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", points[index].x);
      line.setAttribute("y1", points[index].y);
      line.setAttribute("x2", points[index + 1].x);
      line.setAttribute("y2", points[index + 1].y);
      lines.append(line);
    }
  }

  function clearSelection() {
    selected = [null, null, null];
    app.querySelectorAll(".letter-chunk.is-selected, .letter-chunk.is-awaiting-picture").forEach(button => button.classList.remove("is-selected", "is-awaiting-picture"));
  }

  function drawPictureLine(button, figure) {
    const layoutRect = matchLayout.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();
    const figureRect = figure.getBoundingClientRect();
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", buttonRect.left - layoutRect.left + buttonRect.width / 2);
    line.setAttribute("y1", buttonRect.top - layoutRect.top + buttonRect.height / 2);
    line.setAttribute("x2", figureRect.left - layoutRect.left + figureRect.width / 2);
    line.setAttribute("y2", figureRect.top - layoutRect.top + figureRect.height / 2);
    pictureLines.append(line);
  }

  app.querySelectorAll(".letter-chunk").forEach(button => button.addEventListener("click", () => {
    if (button.classList.contains("is-matched")) return;
    if (pendingMatch) {
      buildFeedback.textContent = `Now tap the picture for ${pendingMatch.word}.`;
      speak(`Tap the picture for ${pendingMatch.word}.`);
      return;
    }
    const column = Number(button.parentElement.dataset.column);
    app.querySelectorAll(`.chunk-column[data-column="${column}"] .letter-chunk`).forEach(item => item.classList.remove("is-selected"));
    selected[column] = button;
    button.classList.add("is-selected");
    speak(button.dataset.chunk);
    if (selected.some(item => !item)) return;
    const word = selected.map(item => item.dataset.chunk).join("");
    if (!validWords.has(word) || completedWords.has(word)) {
      playWrongSound();
      selected.forEach(item => item.classList.add("is-wrong"));
      buildFeedback.textContent = "Those pieces do not make one of the words. Try again.";
      window.setTimeout(() => { selected.forEach(item => item?.classList.remove("is-wrong")); clearSelection(); }, 650);
      return;
    }
    playCorrectSound();
    pendingMatch = { word, buttons: [...selected] };
    pendingMatch.buttons.forEach(item => item.classList.add("is-awaiting-picture"));
    app.querySelectorAll(".letter-chunk:not(.is-matched)").forEach(item => { item.disabled = true; });
    buildFeedback.textContent = `Great! You made ${word}. Now tap its matching picture.`;
    speak(`Great! You made ${word}. Now tap its matching picture.`);
  }));

  function choosePicture(figure) {
    if (figure.classList.contains("is-complete")) return;
    if (!pendingMatch) {
      buildFeedback.textContent = "Build a word first, then choose its picture.";
      speak("Build a word first, then choose its picture.");
      return;
    }
    if (figure.dataset.word !== pendingMatch.word) {
      playWrongSound();
      figure.classList.add("is-wrong-image");
      buildFeedback.textContent = `That is not the picture for ${pendingMatch.word}. Try another picture.`;
      window.setTimeout(() => figure.classList.remove("is-wrong-image"), 500);
      return;
    }
    const { word, buttons } = pendingMatch;
    completedWords.add(word);
    playCorrectSound();
    buttons.forEach(item => { item.classList.remove("is-selected", "is-awaiting-picture"); item.classList.add("is-matched"); item.disabled = true; });
    drawLines(buttons);
    const figureRect = figure.getBoundingClientRect();
    const figureCenter = { x: figureRect.left + figureRect.width / 2, y: figureRect.top + figureRect.height / 2 };
    const closestButton = buttons.reduce((closest, candidate) => {
      const closestRect = closest.getBoundingClientRect();
      const candidateRect = candidate.getBoundingClientRect();
      const closestDistance = Math.hypot(closestRect.left + closestRect.width / 2 - figureCenter.x, closestRect.top + closestRect.height / 2 - figureCenter.y);
      const candidateDistance = Math.hypot(candidateRect.left + candidateRect.width / 2 - figureCenter.x, candidateRect.top + candidateRect.height / 2 - figureCenter.y);
      return candidateDistance < closestDistance ? candidate : closest;
    });
    drawPictureLine(closestButton, figure);
    figure.classList.add("is-complete");
    pendingMatch = null;
    selected = [null, null, null];
    app.querySelectorAll(".letter-chunk:not(.is-matched)").forEach(item => { item.disabled = false; });
    buildFeedback.textContent = `Correct! ${word} is connected to its picture.`;
    speak(`Correct! ${word} is connected to its picture.`);
    if (completedWords.size === validWords.size) {
      buildFeedback.textContent = "Wonderful matching! Part 2 is complete.";
      completedParts.add(2);
      updatePartTabs();
      window.setTimeout(() => openPart(3), 1150);
    }
  }

  app.querySelectorAll(".match-clue-strip figure").forEach(figure => {
    figure.addEventListener("click", () => choosePicture(figure));
    figure.addEventListener("keydown", event => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      choosePicture(figure);
    });
  });

  app.querySelector("#hear-match").addEventListener("click", () => speak("Build the words mane, eyes, and wings. Then connect each word to the correct picture."));
  centerActiveStage();
  }

  function renderCrossOut() {
    crossedRows.clear();
    const arrangedRows = shuffled(spellingRows).map(row => ({ ...row, choices: shuffled(row.choices) }));
    stage.innerHTML = `<section class="word-book-board stage-panel"><section class="book-task cross-task" id="cross-task"><div class="book-task__heading"><span>3</span><div><h2>Cross out (X) the wrong words.</h2><p>Look at each picture. Tap the word that is spelled incorrectly.</p></div><button class="hear-question-btn" id="hear-cross" type="button">🔊 Listen</button></div><div class="cross-grid">${arrangedRows.map((row, rowIndex) => `<div class="cross-row" data-row="${rowIndex}"><figure class="cross-clue"><img src="${row.image}" alt="${row.alt}"></figure><div>${row.choices.map((choice, choiceIndex) => `<button type="button" class="spelling-word" data-choice="${choiceIndex}">${choice}</button>`).join("")}</div></div>`).join("")}</div><p class="word-build-feedback" id="cross-feedback" aria-live="polite">Find one wrong spelling for every picture.</p></section></section>`;
    const crossFeedback = app.querySelector("#cross-feedback");
    speak("Great matching! Now cross out the wrong words.");

    arrangedRows.forEach((row, rowIndex) => {
      const rowElement = app.querySelector(`.cross-row[data-row="${rowIndex}"]`);
      rowElement.querySelectorAll(".spelling-word").forEach((button, choiceIndex) => button.addEventListener("click", () => {
        if (crossedRows.has(rowIndex)) return;
        speak(button.textContent);
        if (button.textContent === row.word) {
          playWrongSound();
          button.classList.add("is-wrong");
          crossFeedback.textContent = "That word is spelled correctly. Find the wrong one.";
          window.setTimeout(() => button.classList.remove("is-wrong"), 500);
          return;
        }
        crossedRows.add(rowIndex);
        playCorrectSound();
        button.classList.add("is-crossed");
        rowElement.classList.add("is-complete");
        crossFeedback.textContent = `Correct! ${button.textContent} is the wrong spelling of ${row.word}.`;
        speak(`${button.textContent} is the wrong spelling. The correct word is ${row.word}.`);
        if (crossedRows.size === arrangedRows.length) {
          completedParts.add(3);
          updatePartTabs();
          window.setTimeout(showCompletion, 1400);
        }
      }));
    });

    app.querySelector("#hear-cross").addEventListener("click", () => speak("Cross out the wrong word in each row."));
    centerActiveStage();
  }

  openPart(new URLSearchParams(location.search).get("stage"), false);
}
