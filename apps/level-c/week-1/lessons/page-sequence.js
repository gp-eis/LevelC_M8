import { hideNextAction, revealNextAction } from "../../assets/navigation/gp-navigation.js?v=20260917-c&deploy=20260929-level-c-live-refresh-11";
import { playCorrectSound, playWrongSound } from "../../assets/navigation/gp-sounds.js?v=20260921-1&deploy=20260929-level-c-live-refresh-11";

const page = Number(document.body.dataset.page);
const includedPages = [2, 4, 6, 8];
const activities = {
  2: { icon: "🌳", title: "Explore the Park", landscapeImage: "physical-page-02-landscape-trial-v1.png", reading: "The children are walking in the park. They see many animals. What are the animals doing?", focus: [[50,50],[50,50],[50,50],[50,50],[50,50]], questions: [
    { article: "a", animals: ["dog", "swan"], animalCorrect: 0, actions: ["sitting", "hunting"], actionCorrect: 0, ending: "on the grass.", color: "#48bfa3" },
    { article: "a", animals: ["rabbit", "cat"], animalCorrect: 1, actions: ["jumping", "yawning"], actionCorrect: 1, ending: "on the path.", color: "#ff6464" },
    { article: "a", animals: ["squirrel", "bat"], animalCorrect: 0, actions: ["hunting", "playing"], actionCorrect: 1, ending: "by the tree.", color: "#ffa717" },
    { article: "a", animals: ["dog", "deer"], animalCorrect: 1, actions: ["walking", "sleeping"], actionCorrect: 0, ending: "on the grass.", color: "#d72687" },
    { article: "an", animals: ["cat", "eagle"], animalCorrect: 1, actions: ["swimming", "hunting"], actionCorrect: 1, ending: "in the sky.", color: "#5168c0" }
  ]},
  4: { icon: "🌷", title: "Explore the Garden", landscapeImage: "physical-page-04-landscape-v1.png", reading: "The children are planting flowers. They compare the colors and sizes of the things they see. What do they see?", focus: [[48,69],[42,62],[46,47],[56,34],[52,20]], questions: [
    { lead: "They see a", firstOptions: ["red", "green"], firstCorrect: 0, secondOptions: ["ladybug", "snail"], secondCorrect: 0, ending: "on the flower.", firstLabel: "Choose the color", secondLabel: "Choose the animal", color: "#48bfa3" },
    { lead: "They see a", firstOptions: ["pink", "brown"], firstCorrect: 1, secondOptions: ["cactus", "ant"], secondCorrect: 1, ending: "on the rain boots.", firstLabel: "Choose the color", secondLabel: "Choose the animal", color: "#ff6464" },
    { lead: "They see a", firstOptions: ["tall", "short"], firstCorrect: 0, secondOptions: ["fence", "ladybug"], secondCorrect: 0, ending: "in the garden.", firstLabel: "Choose the size", secondLabel: "Choose the thing", color: "#ffa717" },
    { lead: "They see a", firstOptions: ["green", "blue"], firstCorrect: 0, secondOptions: ["cactus", "ant"], secondCorrect: 0, ending: "by the fence.", firstLabel: "Choose the color", secondLabel: "Choose the thing", color: "#d72687" },
    { lead: "They see a", firstOptions: ["big", "small"], firstCorrect: 1, secondOptions: ["snail", "ladybug"], secondCorrect: 0, ending: "on the fence.", firstLabel: "Choose the size", secondLabel: "Choose the animal", color: "#5168c0" }
  ]},
  6: { icon: "🌙", title: "Explore the Night Yard", landscapeImage: "physical-page-06-landscape-v1.png", reading: "A dog barks in the yard at night. Dogs become more alert at night. What is the dog barking at?", focus: [[50,80],[62,63],[63,31],[36,25]], questions: [
    { lead: "The dog is barking at the", firstOptions: ["white", "blue"], firstCorrect: 1, secondOptions: ["car", "scooter"], secondCorrect: 0, ending: ".", firstLabel: "Choose the color", secondLabel: "Choose the thing", color: "#48bfa3" },
    { lead: "The dog is barking at the", firstOptions: ["purple", "brown"], firstCorrect: 0, secondOptions: ["scooter", "owl"], secondCorrect: 0, ending: ".", firstLabel: "Choose the color", secondLabel: "Choose the thing", color: "#ff6464" },
    { lead: "The dog is barking at the", firstOptions: ["brown", "blue"], firstCorrect: 0, secondOptions: ["owl", "car"], secondCorrect: 0, ending: ".", firstLabel: "Choose the color", secondLabel: "Choose the animal", color: "#ffa717" },
    { lead: "The dog is barking at the", firstOptions: ["purple", "white"], firstCorrect: 1, secondOptions: ["moon", "scooter"], secondCorrect: 0, ending: ".", firstLabel: "Choose the color", secondLabel: "Choose the thing", color: "#d72687" }
  ]},
  8: { icon: "🦇", title: "Explore the Cave", landscapeImage: "physical-page-08-landscape-v1.png", reading: "In the cave, the children and the teacher see and hear many scary things. What is scary inside a cave?", focus: [[56,77],[69,50],[46,54],[36,24]], questions: [
    { lead: "The", firstOptions: ["two", "four"], firstCorrect: 0, secondOptions: ["spiders", "ghosts"], secondCorrect: 0, ending: "are scary.", firstLabel: "Choose the number", secondLabel: "Choose the creature", color: "#48bfa3" },
    { lead: "The", firstOptions: ["three", "one"], firstCorrect: 1, secondOptions: ["bats", "monster"], secondCorrect: 1, ending: "is scary.", firstLabel: "Choose the number", secondLabel: "Choose the creature", color: "#ff6464" },
    { lead: "The", firstOptions: ["one", "three"], firstCorrect: 1, secondOptions: ["spider", "ghosts"], secondCorrect: 1, ending: "are scary.", firstLabel: "Choose the number", secondLabel: "Choose the creature", color: "#ffa717" },
    { lead: "The", firstOptions: ["four", "two"], firstCorrect: 0, secondOptions: ["bats", "spiders"], secondCorrect: 0, ending: "are scary.", firstLabel: "Choose the number", secondLabel: "Choose the creature", color: "#d72687" }
  ]}
};

const app = document.querySelector("[data-sequence-app], #sequence-app");
const next = document.querySelector("#sequence-next");
const sequenceIndex = includedPages.indexOf(page);

let preferredVoice = null;
let speechTimer = 0;
let speechFallbackTimer = 0;
let settleSpeech = null;

function refreshVoice() {
  if (!("speechSynthesis" in window)) return;
  const voices = window.speechSynthesis.getVoices();
  preferredVoice = voices.find(voice => /^en[-_]US$/i.test(voice.lang || "") && /aria|jenny|samantha|zira|google us english/i.test(voice.name))
    || voices.find(voice => /^en[-_]US$/i.test(voice.lang || ""))
    || null;
}

function speak(text, delay = 0) {
  if (!("speechSynthesis" in window) || !text) return Promise.resolve();
  window.clearTimeout(speechTimer);
  window.clearTimeout(speechFallbackTimer);
  if (settleSpeech) settleSpeech();
  settleSpeech = null;
  window.speechSynthesis.cancel();
  return new Promise(resolve => {
    const finish = () => {
      window.clearTimeout(speechFallbackTimer);
      if (settleSpeech === finish) settleSpeech = null;
      resolve();
    };
    settleSpeech = finish;
    speechTimer = window.setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = preferredVoice;
      utterance.lang = "en-US";
      utterance.rate = 0.84;
      utterance.pitch = 1.08;
      utterance.onend = finish;
      utterance.onerror = finish;
      window.speechSynthesis.speak(utterance);
    }, delay);
    const maximumWait = delay + Math.min(7000, Math.max(2200, text.length * 75));
    speechFallbackTimer = window.setTimeout(finish, maximumWait);
  });
}

refreshVoice();
if ("speechSynthesis" in window) window.speechSynthesis.addEventListener("voiceschanged", refreshVoice, { once: true });

if (app && next && sequenceIndex !== -1) {
  const activity = activities[page];
  const progress = `<ol class="page-progress" aria-label="Literacy pages"><li><a href="week-1-page-01.html#lesson-focus">1</a></li>${includedPages.map((number, index) => `<li class="${number === page ? "is-current" : ""}">${index + 2}</li>`).join("")}</ol>`;
  const imageFile = activity.landscapeImage || `physical-page-${String(page).padStart(2, "0")}.png`;
  const imagePath = `https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/assets/literacy/week-1/${imageFile}`;
  const sceneClass = activity.landscapeImage ? "source-pair source-pair--generated-landscape" : "source-pair";
  app.innerHTML = `<header class="sequence-heading"><h1>${activity.icon} ${activity.title}</h1><p>Page ${sequenceIndex + 2} of 5</p></header>${progress}<section class="sequence-card sequence-card--landscape"><div class="sequence-layout"><div class="${sceneClass}"><img id="scene-page" src="${imagePath}" alt="${activity.title} picture scene"><span class="scene-badge">Find clue <b id="scene-clue-number">1</b></span><span class="scene-zoom-hint" aria-hidden="true">🔍 Move to magnify</span><span class="scene-magnifier" aria-hidden="true"></span></div><div class="sequence-copy"><span class="tag">Question <span id="question-number">1</span> of ${activity.questions.length}</span><h2>Look, listen, and answer</h2><p class="sequence-reading">${activity.reading}</p><button class="hear-question-btn" id="hear-question" type="button">🔊 Hear the question</button><p class="sequence-question" id="sequence-question"></p><div class="sequence-choices" id="sequence-choices"></div><p class="sequence-feedback" id="sequence-feedback" aria-live="polite"></p></div></div></section>`;

  const questionNumber = app.querySelector("#question-number");
  const clueNumber = app.querySelector("#scene-clue-number");
  const sceneImage = app.querySelector("#scene-page");
  const sceneFrame = app.querySelector(".source-pair");
  const magnifier = app.querySelector(".scene-magnifier");
  const question = app.querySelector("#sequence-question");
  const choices = app.querySelector("#sequence-choices");
  const feedback = app.querySelector("#sequence-feedback");
  const hearQuestion = app.querySelector("#hear-question");
  const nextPage = includedPages[sequenceIndex + 1];
  let questionIndex = 0;
  let completionShown = false;

  function moveMagnifier(event) {
    const rect = sceneFrame.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, event.clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, event.clientY - rect.top));
    const zoom = 1.65;
    const lensSize = magnifier.offsetWidth || 150;
    magnifier.style.left = `${x}px`;
    magnifier.style.top = `${y}px`;
    magnifier.style.backgroundSize = `${rect.width * zoom}px ${rect.height * zoom}px`;
    magnifier.style.backgroundPosition = `${lensSize / 2 - x * zoom}px ${lensSize / 2 - y * zoom}px`;
  }

  magnifier.style.backgroundImage = `url("${imagePath}")`;
  sceneFrame.addEventListener("pointerenter", event => {
    magnifier.classList.add("is-visible");
    moveMagnifier(event);
  });
  sceneFrame.addEventListener("pointermove", event => {
    if (event.pointerType === "touch" && event.buttons === 0) return;
    magnifier.classList.add("is-visible");
    moveMagnifier(event);
  });
  sceneFrame.addEventListener("pointerleave", () => magnifier.classList.remove("is-visible"));
  sceneFrame.addEventListener("pointerdown", event => {
    if (event.pointerType === "touch") event.preventDefault();
    sceneFrame.setPointerCapture?.(event.pointerId);
    magnifier.classList.add("is-visible");
    moveMagnifier(event);
  });
  sceneFrame.addEventListener("pointerup", event => {
    sceneFrame.releasePointerCapture?.(event.pointerId);
    if (event.pointerType === "touch") magnifier.classList.remove("is-visible");
  });

  function questionParts(current) {
    return {
      lead: current.lead || `There is ${current.article}`,
      firstOptions: current.firstOptions || current.animals,
      firstCorrect: current.firstCorrect ?? current.animalCorrect,
      secondOptions: current.secondOptions || current.actions,
      secondCorrect: current.secondCorrect ?? current.actionCorrect,
      firstLabel: current.firstLabel || "Choose the animal",
      secondLabel: current.secondLabel || "Choose the action",
      ending: current.ending
    };
  }

  function endingSpacer(ending) {
    return /^[.,!?]/.test(ending) ? "" : " ";
  }

  function spokenQuestion(current) {
    if (Array.isArray(current)) {
      const sentence = current[0].replaceAll("___", "blank");
      return questionIndex === 0 ? `${activity.reading} ${sentence}` : sentence;
    }
    const parts = questionParts(current);
    const sentence = `${parts.lead} blank, blank${endingSpacer(parts.ending)}${parts.ending}`;
    return questionIndex === 0 ? `${activity.reading} ${sentence}` : sentence;
  }

  function completedSentence(current) {
    const parts = questionParts(current);
    const first = parts.firstOptions[parts.firstCorrect];
    const second = parts.secondOptions[parts.secondCorrect];
    return `${parts.lead} ${first} ${second}${endingSpacer(parts.ending)}${parts.ending}`;
  }

  function ensureCompletionOverlay() {
    let overlay = document.querySelector("#level-c-literacy-completion");
    if (overlay) return overlay;
    overlay = document.createElement("div");
    overlay.id = "level-c-literacy-completion";
    overlay.className = "activity-completion-overlay level-c-literacy-completion";
    overlay.hidden = true;
    overlay.innerHTML = `<div class="activity-completion-frame" role="dialog" aria-modal="true" aria-label="Good job"><button class="activity-completion-close" type="button" aria-label="Close">×</button><video class="activity-completion-video" playsinline preload="auto" src="https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/assets/video/shared/pow-wow-you-did-it.mp4"></video><button class="activity-completion-play" type="button" aria-label="Play the good job video" hidden>▶</button><div class="activity-completion-actions"><button class="activity-completion-retry" type="button">↻ Try Again</button></div></div>`;
    document.body.append(overlay);
    const video = overlay.querySelector("video");
    const play = overlay.querySelector(".activity-completion-play");
    const close = () => {
      video.pause();
      overlay.hidden = true;
      document.documentElement.classList.remove("level-c-completion-open");
      document.body.classList.remove("level-c-completion-open");
    };
    overlay.querySelector(".activity-completion-close").addEventListener("click", close);
    overlay.querySelector(".activity-completion-retry").addEventListener("click", () => {
      close();
      completionShown = false;
      questionIndex = 0;
      renderQuestion();
    });
    play.addEventListener("click", () => {
      play.hidden = true;
      video.play().catch(() => { play.hidden = false; });
    });
    overlay.addEventListener("click", event => { if (event.target === overlay) close(); });
    return overlay;
  }

  function showCompletion() {
    if (completionShown) return;
    completionShown = true;
    window.clearTimeout(speechTimer);
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    const overlay = ensureCompletionOverlay();
    const video = overlay.querySelector("video");
    const play = overlay.querySelector(".activity-completion-play");
    overlay.hidden = false;
    document.documentElement.classList.add("level-c-completion-open");
    document.body.classList.add("level-c-completion-open");
    video.currentTime = 0;
    play.hidden = true;
    video.play().catch(() => { play.hidden = false; });
  }

  function renderQuestion() {
    const current = activity.questions[questionIndex];
    questionNumber.textContent = String(questionIndex + 1);
    clueNumber.textContent = String(questionIndex + 1);
    const [focusX, focusY] = activity.focus[questionIndex];
    sceneImage.style.objectPosition = `${focusX}% ${focusY}%`;
    choices.innerHTML = "";
    feedback.className = "sequence-feedback";
    feedback.textContent = "Find the matching numbered clue in the picture.";
    if (!Array.isArray(current)) {
      const parts = questionParts(current);
      let firstDone = false;
      let secondDone = false;
      question.innerHTML = `<span class="question-number-token" style="--question-color:${current.color}">${questionIndex + 1}</span><span class="question-sentence">${parts.lead} <b id="first-blank" class="answer-blank">_____</b> <b id="second-blank" class="answer-blank">_____</b>${endingSpacer(parts.ending)}${parts.ending}</span>`;
      const firstBlank = question.querySelector("#first-blank");
      const secondBlank = question.querySelector("#second-blank");
      const completeIfReady = answerSpeech => {
        if (!firstDone || !secondDone) return;
        feedback.className = "sequence-feedback is-correct";
        feedback.textContent = "Great job!";
        next.textContent = questionIndex + 1 < activity.questions.length ? "Next question →" : nextPage ? "Next page →" : "Finish Literacy →";
        revealNextAction(next);
        const sentenceSpeech = Promise.resolve(answerSpeech).then(() => speak(completedSentence(current), 220));
        if (questionIndex + 1 === activity.questions.length) sentenceSpeech.then(() => window.setTimeout(showCompletion, 350));
      };
      const addChoiceGroup = (label, options, correctIndex, onCorrect) => {
        const group = document.createElement("div");
        group.className = "choice-group";
        group.innerHTML = `<span class="choice-group__label">${label}</span><div class="choice-row"></div>`;
        const row = group.querySelector(".choice-row");
        options.forEach((option, index) => {
          const optionWrap = document.createElement("div");
          optionWrap.className = "choice-option";
          const button = document.createElement("button");
          button.className = "word-choice";
          button.type = "button";
          button.textContent = option;
          button.addEventListener("click", () => {
            const answerSpeech = speak(option);
            [...row.querySelectorAll(".word-choice")].forEach(choice => choice.classList.remove("is-wrong"));
            if (index !== correctIndex) {
              button.classList.add("is-wrong");
              playWrongSound();
              feedback.className = "sequence-feedback is-wrong";
              feedback.textContent = "Good try. Look at the matching number in the picture.";
              return;
            }
            button.classList.add("is-correct");
            playCorrectSound();
            [...row.querySelectorAll(".word-choice")].forEach(choice => { choice.disabled = true; });
            onCorrect(option);
            feedback.className = "sequence-feedback";
            feedback.textContent = "Now complete the other blank.";
            completeIfReady(answerSpeech);
          });
          const listen = document.createElement("button");
          listen.className = "choice-listen";
          listen.type = "button";
          listen.textContent = "🔊";
          listen.setAttribute("aria-label", `Hear the word ${option}`);
          listen.title = `Hear “${option}”`;
          listen.addEventListener("click", () => speak(option));
          optionWrap.append(button, listen);
          row.append(optionWrap);
        });
        choices.append(group);
      };
      addChoiceGroup(parts.firstLabel, parts.firstOptions, parts.firstCorrect, option => { firstDone = true; firstBlank.textContent = option; firstBlank.classList.add("is-filled"); });
      addChoiceGroup(parts.secondLabel, parts.secondOptions, parts.secondCorrect, option => { secondDone = true; secondBlank.textContent = option; secondBlank.classList.add("is-filled"); });
      hideNextAction(next);
      speak(spokenQuestion(current), 450);
      return;
    }
    const [prompt, options, correct] = current;
    question.textContent = prompt;
    options.forEach((option, index) => {
      const button = document.createElement("button");
      button.className = "word-choice";
      button.type = "button";
      button.textContent = option;
      button.addEventListener("click", () => {
        const answerSpeech = speak(option);
        [...choices.children].forEach(choice => choice.classList.remove("is-wrong"));
        if (index !== correct) {
          button.classList.add("is-wrong");
          playWrongSound();
          feedback.className = "sequence-feedback is-wrong";
          feedback.textContent = "Good try. Look at the numbered clue again.";
          return;
        }
        button.classList.add("is-correct");
        playCorrectSound();
        [...choices.children].forEach(choice => { choice.disabled = true; });
        feedback.className = "sequence-feedback is-correct";
        feedback.textContent = "Great job!";
        next.textContent = questionIndex + 1 < activity.questions.length ? "Next question →" : nextPage ? "Next page →" : "Finish Literacy →";
        revealNextAction(next);
        if (questionIndex + 1 === activity.questions.length) answerSpeech.then(() => window.setTimeout(showCompletion, 350));
      });
      choices.append(button);
    });
    hideNextAction(next);
    speak(spokenQuestion(current), 450);
  }

  hearQuestion.addEventListener("click", () => speak(spokenQuestion(activity.questions[questionIndex])));

  next.addEventListener("click", () => {
    if (questionIndex + 1 < activity.questions.length) { questionIndex += 1; renderQuestion(); return; }
    location.href = nextPage ? `week-1-page-${String(nextPage).padStart(2, "0")}.html#lesson-focus` : "../";
  });
  renderQuestion();
}
