import { playCorrectSound, playWrongSound } from "../../assets/navigation/gp-sounds.js?v=20260921-1";
import { hideNextAction, revealNextAction } from "../../assets/navigation/gp-navigation.js?v=20260921-sounds-tools";

const app = document.querySelector("[data-moon-picture]");
const nextAction = document.querySelector("#sequence-next");
const assetRoot = "../../assets/literacy/week-2/page-05-choices";
const questions = [
  {
    answer: "new",
    html: "That’s a <strong>new moon</strong>. I see none of it.",
    speech: "That's a new moon. I see none of it.",
    choices: [
      { id: "new", file: "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/week-2/lessons/new-moon-v2.png", alt: "A new moon" },
      { id: "car", file: "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/week-2/lessons/car-v2.png", alt: "A blue car" }
    ]
  },
  {
    answer: "waning",
    html: "That’s a <strong>waning moon</strong>. It gets smaller.",
    speech: "That's a waning moon. It gets smaller.",
    choices: [
      { id: "waning", file: "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/week-2/lessons/waning-moon-v2.png", alt: "A waning moon" },
      { id: "owl", file: "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/week-2/lessons/owl-v2.png", alt: "A brown owl" }
    ]
  },
  {
    answer: "full",
    html: "That’s a <strong>full moon</strong>. I see all of it.",
    speech: "That's a full moon. I see all of it.",
    choices: [
      { id: "full", file: "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/week-2/lessons/full-moon-v2.png", alt: "A full moon" },
      { id: "scooter", file: "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/week-2/lessons/scooter-v2.png", alt: "A pink scooter" }
    ]
  },
  {
    answer: "waxing",
    html: "That’s a <strong>waxing moon</strong>. It gets bigger.",
    speech: "That's a waxing moon. It gets bigger.",
    choices: [
      { id: "waxing", file: "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/week-2/lessons/waxing-moon-v2.png", alt: "A waxing moon" },
      { id: "cat", file: "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/week-2/lessons/cat-v2.png", alt: "A black cat" }
    ]
  }
];

let voice = null;
let index = 0;

function shuffle(items) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function chooseVoice() {
  const voices = window.speechSynthesis?.getVoices?.() || [];
  voice = voices.find(item => /^en[-_]US$/i.test(item.lang || "") && /aria|jenny|samantha|zira|google us english/i.test(item.name))
    || voices.find(item => /^en[-_]US$/i.test(item.lang || ""))
    || null;
}

function speak(text) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.voice = voice;
  utterance.lang = "en-US";
  utterance.rate = 0.84;
  utterance.pitch = 1.06;
  window.speechSynthesis.speak(utterance);
}

function completion() {
  let overlay = document.querySelector("#level-c-literacy-completion");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "level-c-literacy-completion";
    overlay.className = "activity-completion-overlay";
    overlay.hidden = true;
    overlay.innerHTML = `<div class="activity-completion-frame" role="dialog" aria-modal="true" aria-label="Good job"><button class="activity-completion-close" type="button" aria-label="Close">×</button><video class="activity-completion-video" playsinline preload="auto" src="https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/assets/video/shared/pow-wow-you-did-it.mp4"></video><button class="activity-completion-play" type="button" hidden>▶</button><div class="activity-completion-actions"><button class="activity-completion-retry" type="button">↻ Try Again</button></div></div>`;
    document.body.append(overlay);
    const video = overlay.querySelector("video");
    const play = overlay.querySelector(".activity-completion-play");
    overlay.querySelector(".activity-completion-close").onclick = () => {
      video.pause();
      overlay.hidden = true;
    };
    overlay.querySelector(".activity-completion-retry").onclick = () => window.location.reload();
    play.onclick = () => video.play();
  }
  const video = overlay.querySelector("video");
  overlay.hidden = false;
  video.currentTime = 0;
  video.play().catch(() => { overlay.querySelector(".activity-completion-play").hidden = false; });
}

chooseVoice();
if ("speechSynthesis" in window) window.speechSynthesis.addEventListener("voiceschanged", chooseVoice, { once: true });

if (app) {
  app.innerHTML = `<header class="sequence-heading"><h1>🌘 Moon Phases</h1><p class="c-page-count">Page 5 of 5</p><div class="week-tools"><a class="pill-btn orange" href="week-song.html">🎵 <span class="tool-label">Week Song</span></a><a class="pill-btn blue" href="flashcards.html">🃏 <span class="tool-label">Flashcards</span></a><a class="pill-btn green" href="conversation.html">💬 <span class="tool-label">Conversation</span></a></div></header><nav class="c-pagination"><a href="week-2-page-01.html#lesson-focus">1</a><a href="week-2-page-02.html#lesson-focus">2</a><a href="week-2-page-03.html#lesson-focus">3</a><a href="week-2-page-04.html#lesson-focus">4</a><a aria-current="page" href="week-2-page-05.html#lesson-focus">5</a></nav><section class="moon-picture-card"><div class="moon-picture-layout"><figure class="moon-source-picture"><img src="https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/assets/literacy/week-2/page-05-moon-phases-v1.png" alt="The original moon phases literacy picture"></figure><aside class="moon-sentence-panel"><span class="tag">Let’s learn about the different moon phases. Circle the correct picture that matches the sentence.</span><span class="moon-question-progress" id="moon-progress"></span><h2 id="moon-sentence"></h2><button class="hear-question-btn" id="moon-speak" type="button">🔊 Hear the sentence</button><div class="moon-picture-grid" id="moon-picture-grid"></div><p class="moon-picture-feedback" id="moon-picture-feedback" aria-live="polite"></p></aside></div></section>`;

  const sentence = app.querySelector("#moon-sentence");
  const progress = app.querySelector("#moon-progress");
  const feedback = app.querySelector("#moon-picture-feedback");
  const grid = app.querySelector("#moon-picture-grid");

  function render() {
    const question = questions[index];
    sentence.innerHTML = question.html;
    progress.textContent = `Question ${index + 1} of ${questions.length}`;
    feedback.textContent = "Look at the two pictures and choose the match.";
    grid.innerHTML = "";
    hideNextAction(nextAction);

    shuffle(question.choices).forEach(choice => {
      const button = document.createElement("button");
      button.className = "moon-picture-choice";
      button.type = "button";
      button.dataset.choice = choice.id;
      button.setAttribute("aria-label", `Choose ${choice.alt}`);
      button.innerHTML = `<img src="${assetRoot}/${choice.file}" alt="${choice.alt}">`;
      button.addEventListener("click", () => {
        speak(choice.alt);
        if (choice.id !== question.answer) {
          playWrongSound();
          button.classList.add("is-wrong");
          feedback.textContent = "That picture does not match. Try again.";
          window.setTimeout(() => button.classList.remove("is-wrong"), 450);
          return;
        }

        playCorrectSound();
        button.classList.add("is-correct");
        grid.querySelectorAll("button").forEach(item => { item.disabled = true; });
        feedback.textContent = "Correct! That picture matches the sentence.";
        speak(`Correct. ${question.speech}`);
        nextAction.textContent = index + 1 < questions.length ? "Next question →" : "Finish →";
        revealNextAction(nextAction);
      });
      grid.append(button);
    });

    speak(question.speech);
  }

  nextAction.addEventListener("click", () => {
    if (index + 1 < questions.length) {
      index += 1;
      render();
    } else {
      hideNextAction(nextAction);
      completion();
    }
  });
  app.querySelector("#moon-speak").addEventListener("click", () => speak(questions[index].speech));
  render();
  window.setTimeout(() => {
    const y = app.querySelector(".moon-picture-card").getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: Math.max(0, y - 78), behavior: "auto" });
  }, 300);
}
