import { playCorrectSound, playWrongSound } from "../../assets/navigation/gp-sounds.js?v=20260921-1&deploy=20260929-asset-fix-3";

const app = document.querySelector("[data-horse-label]");
const words = ["mane", "hoof", "chest", "muzzle"];
let voice = null;
let selectedWord = null;
let dragState = null;
const completed = new Set();

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
  utterance.pitch = 1.06;
  speechSynthesis.speak(utterance);
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

chooseVoice();
if ("speechSynthesis" in window) speechSynthesis.addEventListener("voiceschanged", chooseVoice, { once: true });

if (app) {
  const tiles = shuffled(words);
  app.innerHTML = `<header class="sequence-heading"><h1>🐴 Parts of the Horse</h1><p class="c-page-count">Page 3 of 5</p><div class="week-tools"><a class="pill-btn orange" href="week-song.html?return=week-2-page-03.html%23lesson-focus"><span aria-hidden="true">🎵</span><span class="tool-label">Week Song</span></a><a class="pill-btn blue" href="flashcards.html?return=week-2-page-03.html%23lesson-focus"><span aria-hidden="true">🃏</span><span class="tool-label">Flashcards</span></a><a class="pill-btn green" href="conversation.html?return=week-2-page-03.html%23lesson-focus"><span aria-hidden="true">💬</span><span class="tool-label">Conversation</span></a></div></header><nav class="c-pagination" aria-label="Literacy pages"><a href="week-2-page-01.html#lesson-focus">1</a><a href="week-2-page-02.html#lesson-focus">2</a><a aria-current="page" href="week-2-page-03.html#lesson-focus">3</a><a href="week-2-page-04.html#lesson-focus">4</a><a href="week-2-page-05.html#lesson-focus">5</a></nav><section class="horse-label-card"><div class="horse-label-layout"><div class="horse-label-scene" id="horse-label-scene"><img src="https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/assets/literacy/week-2/page-03-horse-parts-v1.png" alt="A horse standing in a meadow"><svg class="horse-label-guides" viewBox="0 0 100 66.67" preserveAspectRatio="none" aria-hidden="true"><defs><marker id="horse-label-arrow" markerWidth="3" markerHeight="3" refX="2.3" refY="1.5" orient="auto"><path d="M0,0 L3,1.5 L0,3 Z" fill="#17232d"></path></marker></defs><path d="M27 12 C39 10 49 13 57 16"></path><circle cx="57" cy="16" r="1.05"></circle><path d="M78 11 C76 13 75 17 75 20"></path><circle cx="75" cy="20" r="1.05"></circle><path d="M27 53 C42 48 54 40 65 35"></path><circle cx="65" cy="35" r="1.05"></circle><path d="M72 59 C70 60 68 60 65 60"></path><circle cx="65" cy="60" r="1.05"></circle></svg>${words.map(word => `<button class="horse-drop" type="button" data-part="${word}" aria-label="Drop ${word} here"></button>`).join("")}</div><aside class="horse-label-copy"><span class="tag">Label the different parts of the horse.</span><p class="horse-reading"><strong>Horses are amazing animals.</strong><br>They have a beautiful mane, strong hooves, a wide chest, and a handsome muzzle.</p><button class="hear-question-btn" id="hear-horse-directions" type="button">🔊 Hear the directions</button><div class="horse-word-bank" aria-label="Horse-part word choices">${tiles.map(word => `<button class="horse-word" type="button" data-word="${word}">${word[0].toUpperCase()}${word.slice(1)}</button>`).join("")}</div><p class="horse-label-feedback" id="horse-label-feedback" aria-live="polite">Drag a word to the correct white rectangle.</p></aside></div></section>`;

  const scene = app.querySelector("#horse-label-scene");
  const feedback = app.querySelector("#horse-label-feedback");
  const wordButtons = [...app.querySelectorAll(".horse-word")];
  const dropZones = [...app.querySelectorAll(".horse-drop")];

  function selectWord(button) {
    if (button.classList.contains("is-placed")) return;
    wordButtons.forEach(item => item.classList.remove("is-selected"));
    selectedWord = button.dataset.word;
    button.classList.add("is-selected");
    feedback.textContent = `Now place ${selectedWord} on the correct horse part.`;
    speak(selectedWord);
  }

  function placeWord(word, zone) {
    const source = app.querySelector(`.horse-word[data-word="${word}"]`);
    if (!source || source.classList.contains("is-placed") || zone.classList.contains("is-complete")) return;
    if (zone.dataset.part !== word) {
      playWrongSound();
      zone.classList.add("is-wrong");
      feedback.textContent = `${word} does not belong there. Try again.`;
      window.setTimeout(() => zone.classList.remove("is-wrong"), 500);
      return;
    }
    completed.add(word);
    playCorrectSound();
    zone.textContent = word[0].toUpperCase() + word.slice(1);
    zone.classList.add("is-complete");
    source.classList.remove("is-selected");
    source.classList.add("is-placed");
    source.disabled = true;
    selectedWord = null;
    feedback.textContent = `Correct! This is the horse's ${word}.`;
    speak(`Correct! This is the horse's ${word}.`);
    if (completed.size === words.length) {
      feedback.textContent = "Excellent! You labeled all the parts of the horse.";
      window.setTimeout(showCompletion, 1300);
    }
  }

  function zoneAtPoint(x, y) {
    return dropZones.find(zone => {
      const rect = zone.getBoundingClientRect();
      return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
    }) || null;
  }

  function highlightDropZone(x, y) {
    const target = zoneAtPoint(x, y);
    dropZones.forEach(zone => zone.classList.toggle("is-target", zone === target));
  }

  function stopDragAutoScroll(state) {
    if (state?.scrollFrame) window.cancelAnimationFrame(state.scrollFrame);
  }

  function clearDrag({ releaseCapture = true } = {}) {
    const state = dragState;
    if (!state) {
      document.querySelectorAll(".horse-drag-ghost").forEach(item => item.remove());
      dropZones.forEach(item => item.classList.remove("is-target"));
      return null;
    }

    dragState = null;
    stopDragAutoScroll(state);
    state.ghost?.remove();
    state.button?.classList.remove("is-dragging");
    dropZones.forEach(item => item.classList.remove("is-target"));

    if (releaseCapture && state.button?.hasPointerCapture?.(state.pointerId)) {
      try { state.button.releasePointerCapture(state.pointerId); } catch { /* Pointer already ended. */ }
    }
    return state;
  }

  function dragAutoScroll() {
    if (!dragState) return;

    const state = dragState;
    const edgeSize = Math.min(120, window.innerHeight * 0.22);
    let scrollAmount = 0;

    if (state.moved && state.lastY < edgeSize) {
      scrollAmount = -Math.max(4, 20 * (1 - Math.max(0, state.lastY) / edgeSize));
    } else if (state.moved && state.lastY > window.innerHeight - edgeSize) {
      const distanceIntoEdge = state.lastY - (window.innerHeight - edgeSize);
      scrollAmount = Math.max(4, 20 * Math.min(1, distanceIntoEdge / edgeSize));
    }

    if (scrollAmount) {
      window.scrollBy({ top: scrollAmount, left: 0, behavior: "auto" });
      highlightDropZone(state.lastX, state.lastY);
    }

    state.scrollFrame = window.requestAnimationFrame(dragAutoScroll);
  }

  wordButtons.forEach(button => {
    button.addEventListener("click", event => { if (!dragState && event.detail === 0) selectWord(button); });
    button.addEventListener("pointerdown", event => {
      if (button.classList.contains("is-placed") || dragState || !event.isPrimary) return;
      if (event.pointerType === "mouse" && event.button !== 0) return;
      event.preventDefault();
      document.querySelectorAll(".horse-drag-ghost").forEach(item => item.remove());
      try { button.setPointerCapture(event.pointerId); } catch { return; }
      const ghost = document.createElement("div");
      ghost.className = "horse-drag-ghost";
      ghost.textContent = button.textContent;
      document.body.append(ghost);
      button.classList.add("is-dragging");
      dragState = {
        button,
        word: button.dataset.word,
        ghost,
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        lastX: event.clientX,
        lastY: event.clientY,
        moved: false,
        scrollFrame: null
      };
      ghost.style.left = `${event.clientX}px`; ghost.style.top = `${event.clientY}px`;
      dragState.scrollFrame = window.requestAnimationFrame(dragAutoScroll);
    });
    button.addEventListener("pointermove", event => {
      if (!dragState || dragState.pointerId !== event.pointerId) return;
      dragState.moved ||= Math.hypot(event.clientX - dragState.startX, event.clientY - dragState.startY) > 7;
      dragState.lastX = event.clientX;
      dragState.lastY = event.clientY;
      dragState.ghost.style.left = `${event.clientX}px`; dragState.ghost.style.top = `${event.clientY}px`;
      highlightDropZone(event.clientX, event.clientY);
    });
    button.addEventListener("pointerup", event => {
      if (!dragState || dragState.pointerId !== event.pointerId) return;
      const zone = zoneAtPoint(event.clientX, event.clientY);
      const state = clearDrag();
      if (zone && state.moved) placeWord(state.word, zone);
      else selectWord(state.button);
    });
    button.addEventListener("pointercancel", event => {
      if (!dragState || dragState.pointerId !== event.pointerId) return;
      clearDrag({ releaseCapture: false });
    });
    button.addEventListener("lostpointercapture", event => {
      if (!dragState || dragState.pointerId !== event.pointerId) return;
      clearDrag({ releaseCapture: false });
    });
  });

  window.addEventListener("blur", () => clearDrag());
  window.addEventListener("pagehide", () => clearDrag({ releaseCapture: false }));

  dropZones.forEach(zone => zone.addEventListener("click", () => {
    if (!selectedWord) {
      feedback.textContent = "Choose a word first, then choose its white rectangle.";
      speak("Choose a word first.");
      return;
    }
    placeWord(selectedWord, zone);
  }));

  app.querySelector("#hear-horse-directions").addEventListener("click", () => speak("Horses are amazing animals. They have a beautiful mane, strong hooves, a wide chest, and a handsome muzzle. Drag each word to the correct horse part."));
  window.setTimeout(() => {
    const cardTop = app.querySelector(".horse-label-card").getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: Math.max(0, cardTop - 78), behavior: "auto" });
  }, 350);
}
