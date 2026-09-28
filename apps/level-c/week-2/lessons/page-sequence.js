import { hideNextAction, revealNextAction } from "../../assets/navigation/gp-navigation.js?v=20260917-c&deploy=20260929-asset-fix-5";
import { playCorrectSound, playWrongSound } from "../../assets/navigation/gp-sounds.js?v=20260921-1&deploy=20260929-asset-fix-5";

const page = Number(document.body.dataset.page);
const pages = [2, 3, 4, 5];
const activities = {
  2: {
    icon: "🐝", title: "The Horse and the Bee", image: "page-02-horse-bee-v1.png",
    reading: "Look closely at the horse and the bee. Choose the word that completes each sentence.",
    parts: ["Look, read, and circle", "Match the letters to make the words", "Cross out (X) the wrong words"],
    pictureText: [
      { title: "HORSE", lines: ["Wow! Look at that!!", "Horses run!", "Beautiful mane.", "Strong hoof.", "Wide chest.", "Handsome muzzle."] },
      { title: "BEE", lines: ["Amazing! The bee flies.", "One abdomen.", "Two antennae.", "Four wings.", "Five eyes.", "Six legs."] }
    ],
    questions: [
      { part: 0, sentence: "A bee has ___ legs.", options: ["six", "four"], correct: 0 },
      { part: 0, sentence: "The horse has a wide ___.", options: ["hoof", "chest"], correct: 1 },
      { part: 1, sentence: "Choose the pieces that make the word mane: ___.", options: ["m + an + e", "m + in + s"], correct: 0, completion: "The letters m, a n, and e make the word mane." },
      { part: 1, sentence: "Choose the pieces that make the word eyes: ___.", options: ["e + ye + s", "e + an + gs"], correct: 0, completion: "The letters e, y e, and s make the word eyes." },
      { part: 1, sentence: "Choose the pieces that make the word wings: ___.", options: ["w + in + gs", "w + ye + e"], correct: 0, completion: "The letters w, i n, and g s make the word wings." },
      { part: 2, sentence: "Cross out the wrong spelling of mane: ___.", options: ["mane", "mena"], correct: 1, completion: "Mena is the wrong spelling. The correct word is mane." },
      { part: 2, sentence: "Cross out the wrong spelling of chest: ___.", options: ["chest", "chset"], correct: 1, completion: "Chset is the wrong spelling. The correct word is chest." },
      { part: 2, sentence: "Cross out the wrong spelling of wings: ___.", options: ["wings", "swing"], correct: 1, completion: "Swing is the wrong spelling. The correct word is wings." },
      { part: 2, sentence: "Cross out the wrong spelling of legs: ___.", options: ["legs", "lges"], correct: 1, completion: "Lges is the wrong spelling. The correct word is legs." }
    ]
  },
  3: {
    icon: "🐴", title: "Parts of the Horse", image: "page-03-horse-parts-v1.png",
    reading: "Horses are amazing animals. Look at the horse and complete each sentence.",
    pictureText: [
      { title: "HORSE", lines: ["Horses are amazing animals.", "They have...", "a beautiful mane,", "strong hooves,", "a wide chest, and", "a handsome muzzle."] }
    ],
    questions: [
      { sentence: "The horse has a beautiful ___.", options: ["mane", "muzzle"], correct: 0 },
      { sentence: "The horse has strong ___.", options: ["hooves", "chest"], correct: 0 },
      { sentence: "The horse has a wide ___.", options: ["chest", "mane"], correct: 0 },
      { sentence: "The horse has a handsome ___.", options: ["muzzle", "hooves"], correct: 0 }
    ]
  },
  4: {
    icon: "🌙", title: "The Moon and Time", image: "page-04-moon-time-v1.png",
    reading: "Look at the sky and notice how the light changes during the day and night.",
    pictureText: [
      { title: "THE MOON", lines: ["Wow! Look at that!!", "The Moon changes.", "That's a full Moon.", "That's a waxing Moon.", "That's a waning Moon.", "That's a new Moon."] },
      { title: "TIME", lines: ["Wow! Look at the sky!", "What time of day is it?", "It's a morning sunrise.", "It's an evening sunset.", "It's midday sunshine.", "It's midnight darkness."] }
    ],
    questions: [
      { sentence: "I wake up for an early ___.", options: ["sunset", "sunrise"], correct: 1 },
      { sentence: "Look at the ___ moon!", options: ["full", "half"], correct: 0 }
    ]
  },
  5: {
    icon: "🌘", title: "Moon Phases", image: "page-05-moon-phases-v1.png",
    reading: "Let's learn about the different moon phases. Choose the moon phase that matches each sentence.",
    pictureText: [
      { title: "THE MOON", lines: ["Let's learn about the different moon phases.", "That's a new moon. I see none of it.", "That's a waning moon. It gets smaller.", "That's a full moon. I see all of it.", "That's a waxing moon. It gets bigger."] }
    ],
    questions: [
      { sentence: "That's a ___ moon. I see none of it.", options: ["new", "full"], correct: 0 },
      { sentence: "That's a ___ moon. It gets smaller.", options: ["waning", "waxing"], correct: 0 },
      { sentence: "That's a ___ moon. I see all of it.", options: ["full", "new"], correct: 0 },
      { sentence: "That's a ___ moon. It gets bigger.", options: ["waxing", "waning"], correct: 0 }
    ]
  }
};

const app = document.querySelector("[data-sequence-app]");
const next = document.querySelector("#sequence-next");
const activity = activities[page];
const pageIndex = pages.indexOf(page);
let questionIndex = 0;
let voice = null;
let completionShown = false;

function chooseVoice() {
  const voices = speechSynthesis?.getVoices?.() || [];
  voice = voices.find(item => /^en[-_]US$/i.test(item.lang || "") && /aria|jenny|samantha|zira|google us english/i.test(item.name)) || voices.find(item => /^en[-_]US$/i.test(item.lang || "")) || null;
}

function speak(text, delay = 0) {
  if (!("speechSynthesis" in window) || !text) return Promise.resolve();
  speechSynthesis.cancel();
  return new Promise(resolve => {
    window.setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = voice;
      utterance.lang = "en-US";
      utterance.rate = .84;
      utterance.pitch = 1.06;
      utterance.onend = resolve;
      utterance.onerror = resolve;
      speechSynthesis.speak(utterance);
      window.setTimeout(resolve, Math.min(7000, Math.max(2200, text.length * 80)));
    }, delay);
  });
}

chooseVoice();
if ("speechSynthesis" in window) speechSynthesis.addEventListener("voiceschanged", chooseVoice, { once: true });

function completedSentence(question) {
  return question.completion || question.sentence.replace("___", question.options[question.correct]);
}

function spokenPrompt(question) {
  const prompt = question.sentence.replace("___", "blank");
  return questionIndex === 0 ? `${activity.reading} ${prompt}` : prompt;
}

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
  overlay.querySelector(".activity-completion-retry").addEventListener("click", () => { close(); completionShown = false; questionIndex = 0; renderQuestion(); });
  play.addEventListener("click", () => { play.hidden = true; video.play().catch(() => { play.hidden = false; }); });
  return overlay;
}

function showCompletion() {
  if (completionShown) return;
  completionShown = true;
  const overlay = completionOverlay();
  const video = overlay.querySelector("video");
  const play = overlay.querySelector(".activity-completion-play");
  overlay.hidden = false;
  document.documentElement.classList.add("level-c-completion-open");
  video.currentTime = 0;
  play.hidden = true;
  video.play().catch(() => { play.hidden = false; });
}

if (app && next && activity) {
  const pagination = [1, 2, 3, 4, 5].map(number => `<a href="week-2-page-${String(number).padStart(2, "0")}.html#lesson-focus" ${number === page ? 'aria-current="page"' : ""}>${number}</a>`).join("");
  const imagePath = `https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/assets/literacy/week-2/${activity.image}`;
  const pictureText = activity.pictureText.map(block => `<section class="scene-text-card"><strong>${block.title}</strong>${block.lines.map(line => `<span>${line}</span>`).join("")}</section>`).join("");
  const partProgress = activity.parts ? `<ol class="activity-parts" aria-label="Page 11 activity sections">${activity.parts.map((title, index) => `<li data-part="${index}"><b>${index + 1}</b><span>${title}</span></li>`).join("")}</ol>` : "";
  app.innerHTML = `<header class="sequence-heading"><h1>${activity.icon} ${activity.title}</h1><p class="c-page-count">Page ${page} of 5</p><div class="week-tools"><a class="pill-btn orange" href="week-song.html?return=week-2-page-${String(page).padStart(2, "0")}.html%23lesson-focus"><span aria-hidden="true">🎵</span><span class="tool-label">Week Song</span></a><a class="pill-btn blue" href="flashcards.html?return=week-2-page-${String(page).padStart(2, "0")}.html%23lesson-focus"><span aria-hidden="true">🃏</span><span class="tool-label">Flashcards</span></a><a class="pill-btn green" href="conversation.html?return=week-2-page-${String(page).padStart(2, "0")}.html%23lesson-focus"><span aria-hidden="true">💬</span><span class="tool-label">Conversation</span></a></div></header><nav class="c-pagination" aria-label="Literacy pages">${pagination}</nav><section class="sequence-card sequence-card--landscape"><div class="sequence-layout"><div class="source-pair source-pair--generated-landscape"><img id="scene-page" src="${imagePath}" alt="${activity.title} horizontal picture scene"><div class="scene-text-grid scene-text-grid--${activity.pictureText.length}">${pictureText}</div><span class="scene-badge">Question <b id="scene-clue-number">1</b></span><span class="scene-zoom-hint" aria-hidden="true">🔍 Move to magnify</span><span class="scene-magnifier" aria-hidden="true"></span></div><div class="sequence-copy">${partProgress}<span class="tag">Question <span id="question-number">1</span> of ${activity.questions.length}</span><h2 id="activity-part-title">Look, listen, and answer</h2><p class="sequence-reading">${activity.reading}</p><button class="hear-question-btn" id="hear-question" type="button">🔊 Hear the question</button><p class="sequence-question" id="sequence-question"></p><div class="sequence-choices" id="sequence-choices"></div><p class="sequence-feedback" id="sequence-feedback" aria-live="polite"></p></div></div></section>`;

  const frame = app.querySelector(".source-pair");
  const magnifier = app.querySelector(".scene-magnifier");
  const questionNumber = app.querySelector("#question-number");
  const clueNumber = app.querySelector("#scene-clue-number");
  const questionText = app.querySelector("#sequence-question");
  const choices = app.querySelector("#sequence-choices");
  const feedback = app.querySelector("#sequence-feedback");
  const hear = app.querySelector("#hear-question");
  const partTitle = app.querySelector("#activity-part-title");
  const partItems = [...app.querySelectorAll(".activity-parts li")];
  const nextPage = pages[pageIndex + 1];

  magnifier.style.backgroundImage = `url("${imagePath}")`;
  const moveMagnifier = event => {
    const rect = frame.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, event.clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, event.clientY - rect.top));
    const zoom = 1.45;
    const size = magnifier.offsetWidth || 180;
    magnifier.style.left = `${x}px`;
    magnifier.style.top = `${y}px`;
    magnifier.style.backgroundSize = `${rect.width * zoom}px ${rect.height * zoom}px`;
    magnifier.style.backgroundPosition = `${size / 2 - x * zoom}px ${size / 2 - y * zoom}px`;
  };
  frame.addEventListener("pointerenter", event => { magnifier.classList.add("is-visible"); moveMagnifier(event); });
  frame.addEventListener("pointermove", event => { if (event.pointerType !== "touch") { magnifier.classList.add("is-visible"); moveMagnifier(event); } });
  frame.addEventListener("pointerleave", () => magnifier.classList.remove("is-visible"));

  function renderQuestion() {
    const current = activity.questions[questionIndex];
    if (activity.parts) {
      const activePart = current.part || 0;
      partTitle.textContent = `${activePart + 1}. ${activity.parts[activePart]}`;
      partItems.forEach((item, index) => {
        item.classList.toggle("is-current", index === activePart);
        item.classList.toggle("is-complete", index < activePart);
      });
    }
    questionNumber.textContent = String(questionIndex + 1);
    clueNumber.textContent = String(questionIndex + 1);
    const [before, after] = current.sentence.split("___");
    questionText.innerHTML = `<span class="question-number-token" style="--question-color:${["#48bfa3", "#ff6464", "#ffa717", "#d72687"][questionIndex % 4]}">${questionIndex + 1}</span><span class="question-sentence">${before}<b class="answer-blank">_____</b>${after}</span>`;
    const blank = questionText.querySelector(".answer-blank");
    choices.innerHTML = "";
    feedback.className = "sequence-feedback";
    feedback.textContent = "Look at the picture, then choose your answer.";
    hideNextAction(next);
    current.options.forEach((option, optionIndex) => {
      const wrap = document.createElement("div");
      wrap.className = "choice-option";
      const button = document.createElement("button");
      button.className = "word-choice";
      button.type = "button";
      button.textContent = option;
      const listen = document.createElement("button");
      listen.className = "choice-listen";
      listen.type = "button";
      listen.textContent = "🔊";
      listen.setAttribute("aria-label", `Hear the word ${option}`);
      listen.addEventListener("click", () => speak(option));
      button.addEventListener("click", () => {
        const answerSpeech = speak(option);
        choices.querySelectorAll(".word-choice").forEach(item => item.classList.remove("is-wrong"));
        if (optionIndex !== current.correct) {
          button.classList.add("is-wrong");
          playWrongSound();
          feedback.className = "sequence-feedback is-wrong";
          feedback.textContent = "Good try. Look closely and choose again.";
          return;
        }
        playCorrectSound();
        button.classList.add("is-correct");
        blank.textContent = option;
        blank.classList.add("is-filled");
        choices.querySelectorAll("button").forEach(item => { item.disabled = true; });
        feedback.className = "sequence-feedback is-correct";
        feedback.textContent = "Great job!";
        next.textContent = questionIndex + 1 < activity.questions.length ? "Next question →" : nextPage ? "Next page →" : "Finish Literacy →";
        revealNextAction(next);
        const sentenceSpeech = answerSpeech.then(() => speak(completedSentence(current), 180));
        if (questionIndex + 1 === activity.questions.length) sentenceSpeech.then(() => window.setTimeout(showCompletion, 320));
      });
      wrap.append(button, listen);
      choices.append(wrap);
    });
    speak(spokenPrompt(current), 420);
  }

  hear.addEventListener("click", () => speak(spokenPrompt(activity.questions[questionIndex])));
  next.addEventListener("click", () => {
    if (questionIndex + 1 < activity.questions.length) { questionIndex += 1; renderQuestion(); return; }
    location.href = nextPage ? `week-2-page-${String(nextPage).padStart(2, "0")}.html#lesson-focus` : "../";
  });
  renderQuestion();
}
