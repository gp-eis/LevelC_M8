let audioContext;

function getAudioContext() {
  if (!audioContext) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return null;
    audioContext = new AudioContext();
  }
  if (audioContext.state === "suspended") audioContext.resume().catch(() => {});
  return audioContext;
}

function tone(frequency, duration, volume, type = "sine", delay = 0) {
  const context = getAudioContext();
  if (!context) return;
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const start = context.currentTime + delay;
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, start);
  gain.gain.setValueAtTime(.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + .018);
  gain.gain.exponentialRampToValueAtTime(.0001, start + duration);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(start);
  oscillator.stop(start + duration + .025);
}

export function playClickSound() {
  const context = getAudioContext();
  if (!context) return;
  if (context.state !== "running") {
    context.resume().then(playClickSound).catch(() => {});
    return;
  }
  const start = context.currentTime;
  const pop = context.createOscillator();
  const gain = context.createGain();
  pop.type = "sine";
  pop.frequency.setValueAtTime(260, start);
  pop.frequency.exponentialRampToValueAtTime(680, start + .065);
  pop.frequency.exponentialRampToValueAtTime(520, start + .105);
  gain.gain.setValueAtTime(.0001, start);
  gain.gain.exponentialRampToValueAtTime(.22, start + .008);
  gain.gain.exponentialRampToValueAtTime(.0001, start + .12);
  pop.connect(gain);
  gain.connect(context.destination);
  pop.start(start);
  pop.stop(start + .13);
  tone(820, .068, .09, "triangle", .018);
  tone(1120, .068, .075, "triangle", .052);
  tone(1480, .068, .055, "triangle", .086);
}

export function playCorrectSound() {
  tone(523.25, .16, .13, "triangle");
  tone(659.25, .17, .12, "triangle", .11);
  tone(783.99, .24, .13, "triangle", .22);
}

export function playWrongSound() {
  tone(220, .18, .12, "sawtooth");
  tone(165, .24, .1, "sawtooth", .13);
}

const findControl = target => target instanceof Element ? target.closest("button, a, [role='button']") : null;
document.addEventListener("pointerdown", event => {
  const control = findControl(event.target);
  if (!control || control.hasAttribute("data-no-click-sound") || control.matches(":disabled, [aria-disabled='true']")) return;
  playClickSound();
}, true);
document.addEventListener("keydown", event => {
  if (event.repeat || (event.key !== "Enter" && event.key !== " ")) return;
  const control = findControl(event.target);
  if (!control || control.hasAttribute("data-no-click-sound") || control.matches(":disabled, [aria-disabled='true']")) return;
  playClickSound();
}, true);
