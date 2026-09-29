(() => {
  const video = document.getElementById('b-week1-video');
  const player = document.querySelector('.b-video-card');
  const playButton = document.getElementById('b-week1-play');
  const nowPlaying = document.getElementById('b-week1-now-playing');
  const choices = [...document.querySelectorAll('.b-video-choice')];
  const modal = document.getElementById('b-activity-modal');
  const dialog = modal?.querySelector('.b-activity-dialog');
  const title = modal?.querySelector('#b-activity-title');
  const prompt = modal?.querySelector('.b-activity-prompt');
  const stage = modal?.querySelector('.b-activity-stage');
  const status = modal?.querySelector('.b-activity-status');
  const completion = document.querySelector('[data-completion]');
  const completionVideo = completion?.querySelector('video');
  const completionSentence = completion?.querySelector('.b-completion-sentence');
  const beeAsset = 'https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-b/assets/media/literacy/week-1-activities/bee-mascot-3d-v1.png?asset=e7f5fff546f5';
  const boardRoot = 'https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-b/assets/media/literacy/week-1-activities/';

  if (!video || !player || !playButton || !nowPlaying || !modal || !dialog || !stage || !completion || !choices.length) return;

  const GAMES = {
    flowers: { title: 'Nectar Delivery', prompt: 'Take each colorful bee to the matching flowers.', sentence: 'There are bees near the flowers.' },
    lamp: { title: 'Light and Find', prompt: 'Turn on the lamp, move the light, and find three bees.', sentence: 'There are bees near the lamp.' },
    trees: { title: 'Canopy Peek', prompt: 'Tap each leafy tree to find the hiding bees.', sentence: 'There are bees near the trees.' },
    bench: { title: 'Bee Picnic', prompt: 'Bring all three bees to the picnic spots near the bench.', sentence: 'There are bees near the bench.' },
    grass: { title: 'Dewdrop Trail', prompt: 'Drag the bee along the sparkling trail to the flower.', sentence: 'There are bees near the grass.' }
  };

  let activeChoice = choices[0];
  let currentGame = activeChoice.dataset.game;
  let timers = [];
  let audioContext;

  function later(fn, delay) {
    const id = window.setTimeout(fn, delay);
    timers.push(id);
    return id;
  }

  function clearTimers() {
    timers.forEach(window.clearTimeout);
    timers = [];
  }

  function say(text) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.84;
    utterance.pitch = 1.08;
    window.setTimeout(() => window.speechSynthesis.speak(utterance), 30);
  }

  function chime(success = true) {
    try {
      audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.frequency.value = success ? 660 : 220;
      oscillator.type = success ? 'sine' : 'triangle';
      gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.12, audioContext.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.22);
      oscillator.connect(gain).connect(audioContext.destination);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.24);
    } catch {}
  }

  function showPlayButton(show) {
    playButton.hidden = !show;
  }

  function selectChoice(choice) {
    activeChoice = choice;
    currentGame = choice.dataset.game;
    choices.forEach((button) => {
      const active = button === choice;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  }

  function closeCompletion() {
    completionVideo.pause();
    completion.hidden = true;
    document.body.classList.remove('completion-open');
  }

  function closeGame({ restoreFocus = true } = {}) {
    clearTimers();
    window.speechSynthesis?.cancel();
    modal.hidden = true;
    document.body.classList.remove('b-activity-open');
    if (restoreFocus) activeChoice?.focus();
  }

  function playSelected() {
    closeCompletion();
    closeGame({ restoreFocus: false });
    const label = activeChoice.dataset.label;
    video.pause();
    video.src = activeChoice.dataset.video;
    video.setAttribute('aria-label', `${label} video`);
    video.load();
    nowPlaying.textContent = label;
    playButton.setAttribute('aria-label', `Play ${label} video`);
    showPlayButton(false);
    player.scrollIntoView({ block: 'center', behavior: 'smooth' });
    video.play().catch(() => showPlayButton(true));
  }

  function board(file, className) {
    stage.className = `b-activity-stage ${className}`;
    stage.innerHTML = `<img class="b-game-board" src="${boardRoot}${file}" alt=""><div class="b-game-sparkles" aria-hidden="true"></div>`;
    status.textContent = '';
  }

  function beeButton(className, label) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = className;
    button.setAttribute('aria-label', label);
    button.innerHTML = `<img src="${beeAsset}" alt="">`;
    return button;
  }

  function wrong(element, message) {
    element.classList.remove('is-wrong');
    void element.offsetWidth;
    element.classList.add('is-wrong');
    status.textContent = message;
    chime(false);
    later(() => element.classList.remove('is-wrong'), 500);
  }

  function finish() {
    status.textContent = 'Great job!';
    stage.classList.add('is-complete');
    chime(true);
    later(() => {
      modal.hidden = true;
      completionSentence.textContent = GAMES[currentGame].sentence;
      completion.hidden = false;
      document.body.classList.add('completion-open');
      completionVideo.currentTime = 0;
      completionVideo.play().catch(() => {});
      completion.querySelector('[data-watch-video]')?.focus();
    }, 650);
  }

  function enableDrag(item, onDrop) {
    let dragging = false;
    let moved = false;
    let startX = 0;
    let startY = 0;
    let suppressClick = false;
    item.addEventListener('click', (event) => {
      if (!suppressClick) return;
      suppressClick = false;
      event.preventDefault();
      event.stopImmediatePropagation();
    }, true);
    item.addEventListener('pointerdown', (event) => {
      if (item.disabled) return;
      dragging = true;
      moved = false;
      startX = event.clientX;
      startY = event.clientY;
      item.setPointerCapture(event.pointerId);
    });
    item.addEventListener('pointermove', (event) => {
      if (!dragging) return;
      if (!moved && Math.hypot(event.clientX - startX, event.clientY - startY) < 7) return;
      const rect = stage.getBoundingClientRect();
      moved = true;
      item.classList.add('is-dragging');
      const left = Math.max(item.offsetWidth / 2, Math.min(rect.width - item.offsetWidth / 2, event.clientX - rect.left));
      const top = Math.max(item.offsetHeight / 2, Math.min(rect.height - item.offsetHeight / 2, event.clientY - rect.top));
      item.style.left = `${left}px`;
      item.style.top = `${top}px`;
    });
    item.addEventListener('pointerup', (event) => {
      if (!dragging) return;
      dragging = false;
      item.classList.remove('is-dragging');
      item.releasePointerCapture(event.pointerId);
      suppressClick = moved;
      onDrop(item, moved);
    });
    item.addEventListener('pointercancel', () => {
      dragging = false;
      item.classList.remove('is-dragging');
    });
  }

  function overlaps(a, b) {
    const x = a.left + a.width / 2;
    const y = a.top + a.height / 2;
    return x >= b.left && x <= b.right && y >= b.top && y <= b.bottom;
  }

  function snapTo(item, target) {
    const stageRect = stage.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    item.style.left = `${targetRect.left - stageRect.left + targetRect.width / 2}px`;
    item.style.top = `${targetRect.top - stageRect.top + targetRect.height / 2}px`;
  }

  function setupFlowers() {
    board('flowers-board-3d-v1.png', 'flowers-game');
    const colors = ['pink', 'yellow', 'purple'];
    const starts = [[20, 12], [46, 9], [72, 13]];
    // Always scramble the bees away from the flower bed directly beneath them.
    // Either derangement keeps every round visually different without making it
    // possible to solve by simply dragging all three bees straight down.
    const startOrder = Math.random() < 0.5 ? [1, 2, 0] : [2, 0, 1];
    const targets = [[18, 69], [49, 69], [80, 69]];
    let selected = null;
    let delivered = 0;
    colors.forEach((color, index) => {
      const target = document.createElement('button');
      target.type = 'button';
      target.className = `b-flower-target ${color}`;
      target.dataset.color = color;
      target.style.left = `${targets[index][0]}%`;
      target.style.top = `${targets[index][1]}%`;
      target.setAttribute('aria-label', `${color} flowers`);
      stage.append(target);
      const bee = beeButton(`b-game-bee b-pollen-bee ${color}`, `${color} pollen bee`);
      bee.dataset.color = color;
      const start = starts[startOrder[index]];
      bee.dataset.start = start.join(',');
      bee.style.left = `${start[0]}%`;
      bee.style.top = `${start[1]}%`;
      bee.addEventListener('click', () => {
        if (bee.disabled) return;
        stage.querySelectorAll('.b-pollen-bee').forEach((item) => item.classList.remove('is-selected'));
        selected = bee;
        bee.classList.add('is-selected');
        status.textContent = `Take the ${color} bee to the ${color} flowers.`;
        say(`${color} flowers`);
      });
      target.addEventListener('click', () => {
        if (!selected) return wrong(target, 'Choose a bee first.');
        if (selected.dataset.color !== color) return wrong(target, 'Try the matching flower color.');
        snapTo(selected, target);
        selected.disabled = true;
        selected.classList.add('is-landed');
        target.classList.add('is-filled');
        selected = null;
        delivered += 1;
        status.textContent = `${delivered} of 3 bees delivered`;
        chime(true);
        if (delivered === 3) finish();
      });
      enableDrag(bee, (item, moved) => {
        if (!moved) return;
        const targetRect = target.getBoundingClientRect();
        if (overlaps(item.getBoundingClientRect(), targetRect)) {
          selected = item;
          target.click();
        }
        else {
          const [x, y] = item.dataset.start.split(',');
          item.style.left = `${x}%`;
          item.style.top = `${y}%`;
          wrong(item, 'Fly to the matching flowers.');
        }
      });
      stage.append(bee);
    });
  }

  function setupLamp() {
    board('lamp-board-3d-v1.png', 'lamp-game is-off');
    const darkness = document.createElement('div');
    darkness.className = 'b-lamp-darkness';
    stage.append(darkness);
    const switchButton = document.createElement('button');
    switchButton.type = 'button';
    switchButton.className = 'b-lamp-switch';
    switchButton.textContent = '💡 Turn On';
    stage.append(switchButton);
    const positions = [[18, 48], [47, 68], [76, 47]];
    let found = 0;
    positions.forEach(([x, y], index) => {
      const bee = beeButton('b-game-bee b-lamp-bee', `Hidden bee ${index + 1}`);
      bee.style.left = `${x}%`;
      bee.style.top = `${y}%`;
      bee.addEventListener('click', () => {
        if (!stage.classList.contains('is-on') || bee.disabled) return;
        bee.disabled = true;
        bee.classList.add('is-found');
        found += 1;
        status.textContent = `${found} of 3 bees found`;
        chime(true);
        if (found === 3) finish();
      });
      stage.append(bee);
    });
    switchButton.addEventListener('click', () => {
      stage.classList.remove('is-off');
      stage.classList.add('is-on');
      switchButton.textContent = '✨ Move the light';
      switchButton.disabled = true;
      status.textContent = 'Move your finger or mouse to find the bees.';
      say('Find the bees near the lamp.');
    });
    const moveLight = (event) => {
      if (!stage.classList.contains('is-on')) return;
      const rect = stage.getBoundingClientRect();
      stage.style.setProperty('--light-x', `${(event.clientX - rect.left) / rect.width * 100}%`);
      stage.style.setProperty('--light-y', `${(event.clientY - rect.top) / rect.height * 100}%`);
    };
    stage.addEventListener('pointermove', moveLight);
    stage.addEventListener('pointerdown', moveLight);
  }

  function setupTrees() {
    board('trees-board-3d-v1.png', 'trees-game');
    const positions = [[17, 23], [49, 22], [80, 23]];
    const gatheredPositions = [[44, 75], [50, 71], [56, 75]];
    let found = 0;
    let gathered = 0;
    let selected = null;
    const bees = [];
    const gatherTarget = document.createElement('button');
    gatherTarget.type = 'button';
    gatherTarget.className = 'b-tree-gather';
    gatherTarget.textContent = 'Gather here!';
    gatherTarget.setAttribute('aria-label', 'Gather the bees in the middle');
    gatherTarget.hidden = true;
    gatherTarget.addEventListener('click', () => {
      if (!selected) return wrong(gatherTarget, 'Choose a bee first.');
      const [x, y] = gatheredPositions[gathered];
      selected.style.left = `${x}%`;
      selected.style.top = `${y}%`;
      selected.disabled = true;
      selected.classList.remove('is-selected');
      selected.classList.add('is-gathered');
      selected = null;
      gathered += 1;
      status.textContent = `${gathered} of 3 bees gathered in the middle`;
      chime(true);
      if (gathered === 3) {
        gatherTarget.classList.add('is-filled');
        finish();
      }
    });
    stage.append(gatherTarget);
    positions.forEach(([x, y], index) => {
      const bee = beeButton('b-game-bee b-tree-bee', `Bee near tree ${index + 1}`);
      bee.disabled = true;
      bee.dataset.start = `${x},${y + 12}`;
      bee.style.left = `${x}%`;
      bee.style.top = `${y + 12}%`;
      bee.addEventListener('click', () => {
        if (bee.disabled) return;
        bees.forEach((item) => item.classList.remove('is-selected'));
        selected = bee;
        bee.classList.add('is-selected');
        status.textContent = 'Now tap the glowing middle circle.';
      });
      enableDrag(bee, (item, moved) => {
        if (!moved) return;
        if (overlaps(item.getBoundingClientRect(), gatherTarget.getBoundingClientRect())) {
          selected = item;
          gatherTarget.click();
        } else {
          const [sx, sy] = item.dataset.start.split(',');
          item.style.left = `${sx}%`;
          item.style.top = `${sy}%`;
          wrong(item, 'Bring the bee to the glowing middle circle.');
        }
      });
      stage.append(bee);
      bees.push(bee);
      const canopy = document.createElement('button');
      canopy.type = 'button';
      canopy.className = 'b-canopy-button';
      canopy.style.left = `${x - 13}%`;
      canopy.style.top = `${y - 12}%`;
      canopy.setAttribute('aria-label', `Look in tree ${index + 1}`);
      canopy.addEventListener('click', () => {
        if (canopy.disabled) return;
        canopy.disabled = true;
        canopy.classList.add('is-opened');
        bee.classList.add('is-revealed');
        found += 1;
        status.textContent = `${found} of 3 bees found`;
        say('Bee!');
        chime(true);
        if (found === 3) {
          gatherTarget.hidden = false;
          bees.forEach((item) => {
            item.disabled = false;
            item.classList.add('is-ready');
          });
          status.textContent = 'Great! Now gather all three bees in the middle.';
          say('Now gather the bees in the middle.');
        }
      });
      stage.append(canopy);
    });
  }

  function setupBench() {
    board('bench-board-3d-v1.png', 'bench-game');
    const starts = [[17, 10], [45, 8], [73, 10]];
    const targets = [[27, 72], [50, 72], [73, 72]];
    const occupied = new Set();
    let selected = null;
    let landed = 0;
    targets.forEach(([x, y], index) => {
      const target = document.createElement('button');
      target.type = 'button';
      target.className = 'b-bench-target';
      target.dataset.index = String(index);
      target.style.left = `${x}%`;
      target.style.top = `${y}%`;
      target.setAttribute('aria-label', `Picnic landing spot ${index + 1}`);
      target.addEventListener('click', () => {
        if (!selected) return wrong(target, 'Choose a bee first.');
        if (occupied.has(index)) return wrong(target, 'That picnic spot is full.');
        snapTo(selected, target);
        selected.disabled = true;
        selected.classList.add('is-landed');
        target.classList.add('is-filled');
        occupied.add(index);
        selected = null;
        landed += 1;
        status.textContent = `${landed} of 3 bees near the bench`;
        chime(true);
        if (landed === 3) finish();
      });
      stage.append(target);
    });
    starts.forEach(([x, y], index) => {
      const bee = beeButton('b-game-bee b-picnic-bee', `Picnic bee ${index + 1}`);
      bee.dataset.start = `${x},${y}`;
      bee.style.left = `${x}%`;
      bee.style.top = `${y}%`;
      bee.addEventListener('click', () => {
        if (bee.disabled) return;
        stage.querySelectorAll('.b-picnic-bee').forEach((item) => item.classList.remove('is-selected'));
        selected = bee;
        bee.classList.add('is-selected');
        status.textContent = 'Choose a picnic spot near the bench.';
      });
      enableDrag(bee, (item, moved) => {
        if (!moved) return;
        const target = [...stage.querySelectorAll('.b-bench-target')].find((candidate) => !occupied.has(Number(candidate.dataset.index)) && overlaps(item.getBoundingClientRect(), candidate.getBoundingClientRect()));
        if (target) {
          selected = item;
          target.click();
        } else {
          const [sx, sy] = item.dataset.start.split(',');
          item.style.left = `${sx}%`;
          item.style.top = `${sy}%`;
          wrong(item, 'Land on a picnic spot near the bench.');
        }
      });
      stage.append(bee);
    });
  }

  function setupGrass() {
    board('grass-board-3d-v1.png', 'grass-game');
    const points = [[16, 80], [29, 69], [42, 59], [58, 58], [73, 52], [79, 35], [86, 17]];
    let step = 0;
    const bee = beeButton('b-game-bee b-trail-bee', 'Bee on the dewdrop trail');
    bee.style.left = `${points[0][0]}%`;
    bee.style.top = `${points[0][1]}%`;
    stage.append(bee);
    const checkpoints = points.map(([x, y], index) => {
      const point = document.createElement('button');
      point.type = 'button';
      point.className = `b-dew-point${index === 0 ? ' is-passed' : ''}`;
      point.style.left = `${x}%`;
      point.style.top = `${y}%`;
      point.setAttribute('aria-label', index === points.length - 1 ? 'Flower finish' : `Dewdrop ${index + 1}`);
      point.addEventListener('click', () => {
        if (index !== step + 1) return wrong(point, 'Follow the next sparkling dewdrop.');
        step = index;
        point.classList.add('is-passed');
        bee.style.left = `${x}%`;
        bee.style.top = `${y}%`;
        status.textContent = index === points.length - 1 ? 'You reached the flower!' : `${index} ${index === 1 ? 'dewdrop' : 'dewdrops'} followed`;
        chime(true);
        if (index === points.length - 1) finish();
      });
      stage.append(point);
      return point;
    });
    enableDrag(bee, (item) => {
      const next = checkpoints[step + 1];
      if (next && overlaps(item.getBoundingClientRect(), next.getBoundingClientRect())) next.click();
      else {
        const [x, y] = points[step];
        item.style.left = `${x}%`;
        item.style.top = `${y}%`;
        wrong(item, 'Stay on the sparkling trail.');
      }
    });
  }

  function setupGame() {
    clearTimers();
    stage.className = 'b-activity-stage';
    stage.innerHTML = '';
    const setup = { flowers: setupFlowers, lamp: setupLamp, trees: setupTrees, bench: setupBench, grass: setupGrass }[currentGame];
    setup?.();
  }

  function openGame(choice) {
    selectChoice(choice);
    closeCompletion();
    video.pause();
    const game = GAMES[currentGame];
    title.textContent = game.title;
    prompt.textContent = game.prompt;
    setupGame();
    modal.hidden = false;
    document.body.classList.add('b-activity-open');
    modal.querySelector('[data-close-game]')?.focus();
    later(() => say(game.prompt), 220);
  }

  choices.forEach((choice) => choice.addEventListener('click', () => openGame(choice)));
  modal.querySelector('[data-close-game]').addEventListener('click', () => closeGame());
  modal.querySelector('[data-hear-prompt]').addEventListener('click', () => say(GAMES[currentGame].prompt));
  modal.querySelector('[data-watch-video]').addEventListener('click', playSelected);
  completion.querySelector('[data-watch-video]').addEventListener('click', playSelected);
  completion.querySelector('[data-close-completion]').addEventListener('click', () => {
    closeCompletion();
    modal.hidden = false;
    document.body.classList.add('b-activity-open');
    activeChoice.focus();
  });
  completion.querySelector('[data-try-again]').addEventListener('click', () => {
    closeCompletion();
    setupGame();
    modal.hidden = false;
    document.body.classList.add('b-activity-open');
    later(() => stage.querySelector('button')?.focus(), 0);
  });
  modal.addEventListener('click', (event) => {
    if (event.target === modal) closeGame();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (!completion.hidden) closeCompletion();
    else if (!modal.hidden) closeGame();
  });

  playButton.addEventListener('click', () => {
    showPlayButton(false);
    video.play().catch(() => showPlayButton(true));
  });
  video.addEventListener('play', () => showPlayButton(false));
  video.addEventListener('pause', () => {
    if (!video.ended && modal.hidden) showPlayButton(true);
  });
  video.addEventListener('ended', () => showPlayButton(true));
})();
