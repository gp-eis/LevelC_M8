(() => {
  const video = document.getElementById('b-week4-video');
  const player = document.querySelector('.b-video-card');
  const playButton = document.getElementById('b-week4-play');
  const nowPlaying = document.getElementById('b-week4-now-playing');
  const choices = [...document.querySelectorAll('.b-video-choice')];
  const modal = document.getElementById('b-activity-modal');
  const title = modal?.querySelector('#b-activity-title');
  const prompt = modal?.querySelector('.b-activity-prompt');
  const stage = modal?.querySelector('.b-activity-stage');
  const status = modal?.querySelector('.b-activity-status');
  const completion = document.querySelector('[data-completion]');
  const completionVideo = completion?.querySelector('video');
  const completionSentence = completion?.querySelector('.b-completion-sentence');
  if (!video || !player || !playButton || !nowPlaying || !modal || !stage || !completion || !choices.length) return;

  const games = {
    health: { title: 'Healthy Choice Catch', prompt: 'Catch four healthy choices. Let the silly treats fall!', sentence: 'It’s good for our health.' },
    tummy: { title: 'Tummy Path Builder', prompt: 'Turn all three path pieces, then send the honey drop to the tummy!', sentence: 'It’s good for my tummy.' },
    throat: { title: 'Warm Throat Glow', prompt: 'Move the honey dipper to the mouth, then trace down to the throat!', sentence: 'It’s good for my throat.' },
    body: { title: 'Move and Glow', prompt: 'Look at the pose, then tap the matching pose card!', sentence: 'It’s good for my body.' },
    skin: { title: 'Flower and Honeycomb Match', prompt: 'Find each flower and honeycomb pair with the same color!', sentence: 'It’s good for my skin.' }
  };

  let activeChoice = choices[0];
  let currentGame = activeChoice.dataset.game;
  let timers = [];
  let cleanupGame = () => {};
  let audioContext;

  function later(fn, delay) { const id = setTimeout(fn, delay); timers.push(id); return id; }
  function clearGame() { timers.forEach(clearTimeout); timers = []; cleanupGame(); cleanupGame = () => {}; }
  function say(text) {
    if (!('speechSynthesis' in window)) return;
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US'; utterance.rate = .84; utterance.pitch = 1.08;
    later(() => speechSynthesis.speak(utterance), 40);
  }
  function sound(frequency = 660, duration = .18) {
    try {
      audioContext ||= new (AudioContext || webkitAudioContext)();
      const oscillator = audioContext.createOscillator(), gain = audioContext.createGain();
      oscillator.type = 'sine'; oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(.0001, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(.09, audioContext.currentTime + .02);
      gain.gain.exponentialRampToValueAtTime(.0001, audioContext.currentTime + duration);
      oscillator.connect(gain).connect(audioContext.destination); oscillator.start(); oscillator.stop(audioContext.currentTime + duration + .02);
    } catch {}
  }
  function wrong(item, message = 'Try again.') {
    item.classList.remove('w4-wrong'); void item.offsetWidth; item.classList.add('w4-wrong');
    status.textContent = message; sound(190, .28); say('Try again.');
    later(() => item.classList.remove('w4-wrong'), 450);
  }
  function baseStage(className) {
    stage.className = `b-activity-stage w4-game ${className}`;
    stage.innerHTML = '<div class="b-game-sparkles" aria-hidden="true"></div>';
    status.textContent = '';
  }
  function button(label, className = '') {
    const element = document.createElement('button'); element.type = 'button'; element.className = `w4-pill ${className}`.trim(); element.textContent = label; return element;
  }
  function choose(choice) {
    activeChoice = choice; currentGame = choice.dataset.game;
    choices.forEach(item => { const active = item === choice; item.classList.toggle('is-active', active); item.setAttribute('aria-pressed', String(active)); });
  }
  function finish() {
    stage.classList.add('is-complete'); sound(860, .4); status.textContent = 'Wonderful!'; say(games[currentGame].sentence);
    later(() => {
      completionSentence.textContent = games[currentGame].sentence;
      modal.hidden = true; completion.hidden = false; completionVideo.currentTime = 0;
      completionVideo.play().catch(() => {}); completion.querySelector('[data-close-completion]').focus();
    }, 720);
  }

  function setupHealth() {
    baseStage('w4-health-game');
    const counter = document.createElement('div'); counter.className = 'w4-counter'; counter.textContent = 'Healthy choices: 0 of 4';
    const catcher = document.createElement('button'); catcher.type = 'button'; catcher.className = 'w4-health-catcher'; catcher.setAttribute('aria-label', 'Move the 3D health catcher');
    const left = button('←', 'w4-health-arrow left'), right = button('→', 'w4-health-arrow right');
    left.setAttribute('aria-label', 'Move left'); right.setAttribute('aria-label', 'Move right'); stage.append(counter, catcher, left, right);
    const sequence = [
      { asset:'https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-b/week-4/literacy/health-apple-v1.png', healthy:true, lane:18 }, { asset:'https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-b/week-4/literacy/health-lollipop-v1.png', healthy:false, lane:72 }, { asset:'https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-b/week-4/literacy/health-water-v1.png', healthy:true, lane:78 },
      { asset:'https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-b/week-4/literacy/health-soda-v1.png', healthy:false, lane:30 }, { asset:'https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-b/week-4/literacy/health-carrot-v1.png', healthy:true, lane:36 }, { asset:'https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-b/week-4/literacy/health-broccoli-v1.png', healthy:true, lane:62 }
    ];
    let catcherX = 50, index = 0, caught = 0, current = null, running = true, dragging = false, frame = 0, last = performance.now();
    function setCatcher(x) { catcherX = Math.max(15, Math.min(85, x)); catcher.style.left = `${catcherX}%`; }
    function move(amount) { setCatcher(catcherX + amount); sound(350, .08); }
    left.onclick = () => move(-12); right.onclick = () => move(12);
    catcher.addEventListener('pointerdown', event => { dragging = true; catcher.setPointerCapture(event.pointerId); });
    catcher.addEventListener('pointermove', event => { if (!dragging) return; const rect = stage.getBoundingClientRect(); setCatcher((event.clientX - rect.left) / rect.width * 100); });
    catcher.addEventListener('pointerup', event => { dragging = false; try { catcher.releasePointerCapture(event.pointerId); } catch {} });
    catcher.addEventListener('keydown', event => { if (event.key === 'ArrowLeft') { event.preventDefault(); move(-10); } if (event.key === 'ArrowRight') { event.preventDefault(); move(10); } });
    function nextItem() {
      if (!running || caught >= 4) return;
      const data = sequence[index++ % sequence.length];
      const element = document.createElement('div'); element.className = `w4-fall-item${data.healthy ? '' : ' silly'}`; element.style.setProperty('--item-art', `url("https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-b/assets/media/literacy/week-4-activities/${data.asset}")`); element.style.left = `${data.lane}%`; element.style.top = '-16%'; stage.append(element);
      current = { ...data, element, y:-16, speed:32 };
      status.textContent = data.healthy ? 'Move the shield under the healthy choice!' : 'That is a silly treat. Let it fall!';
    }
    function resolve(hit) {
      const item = current; if (!item) return; current = null; item.element.remove();
      if (hit && item.healthy) { caught++; counter.textContent = `Healthy choices: ${caught} of 4`; sound(610 + caught * 70, .2); status.textContent = 'Healthy catch!'; if (caught === 4) { running = false; later(finish, 450); return; } }
      else if (hit && !item.healthy) { wrong(catcher, 'Let the silly treats fall.'); }
      else if (!hit && item.healthy) { status.textContent = 'The healthy choice got away. Try the next one!'; sound(220, .2); }
      else { status.textContent = 'Great! You let the silly treat fall.'; sound(520, .14); }
      later(nextItem, 430);
    }
    function animate(now) {
      if (!running) return; const dt = Math.min(.034, (now - last) / 1000); last = now;
      if (current) {
        current.y += current.speed * dt; current.element.style.top = `${current.y}%`;
        const itemRect = current.element.getBoundingClientRect(), catchRect = catcher.getBoundingClientRect(), stageRect = stage.getBoundingClientRect();
        if (itemRect.bottom >= catchRect.top + 8 && itemRect.top < catchRect.bottom && itemRect.right > catchRect.left + 10 && itemRect.left < catchRect.right - 10) resolve(true);
        else if (itemRect.top > stageRect.bottom) resolve(false);
      }
      if (running) frame = requestAnimationFrame(animate);
    }
    nextItem(); frame = requestAnimationFrame(animate); cleanupGame = () => { running = false; cancelAnimationFrame(frame); };
  }

  function setupTummy() {
    baseStage('w4-tummy-game');
    const counter = document.createElement('div'); counter.className = 'w4-counter'; counter.textContent = 'Turn the path pieces';
    const wrap = document.createElement('div'); wrap.className = 'w4-tummy-wrap';
    const start = document.createElement('div'); start.className = 'w4-tummy-start'; start.textContent = '🍯';
    const end = document.createElement('div'); end.className = 'w4-tummy-end'; end.textContent = '😊';
    const go = button('GO! ▶', 'gold w4-tummy-go'); go.disabled = true;
    const drop = document.createElement('div'); drop.className = 'w4-travel-drop';
    const starts = [1, 3, 2];
    const tiles = starts.map((turn, index) => {
      const tile = document.createElement('button'); tile.type = 'button'; tile.className = 'w4-path-tile'; tile.dataset.turn = String(turn); tile.setAttribute('aria-label', `Turn path piece ${index + 1}`);
      const road = document.createElement('span'); road.className = 'w4-honey-road'; road.style.setProperty('--turn', `${turn * 90}deg`); tile.append(road); wrap.append(tile); return tile;
    });
    stage.append(counter, wrap, start, end, go, drop);
    function check() {
      tiles.forEach(tile => tile.classList.toggle('is-right', Number(tile.dataset.turn) % 2 === 0));
      const ready = tiles.every(tile => Number(tile.dataset.turn) % 2 === 0); go.disabled = !ready;
      counter.textContent = ready ? 'The path is ready!' : 'Turn the path pieces';
      if (ready) { status.textContent = 'Great path! Tap GO.'; say('Tap go.'); sound(740, .22); }
    }
    tiles.forEach(tile => tile.onclick = () => {
      const turn = (Number(tile.dataset.turn) + 1) % 4; tile.dataset.turn = String(turn); tile.firstElementChild.style.setProperty('--turn', `${turn * 90}deg`); sound(420 + turn * 40, .1); check();
    });
    go.onclick = () => { if (go.disabled) return; go.disabled = true; tiles.forEach(tile => tile.disabled = true); drop.classList.add('is-moving'); counter.textContent = 'Follow the honey drop!'; status.textContent = 'The honey drop is traveling to the tummy!'; sound(760, .28); later(finish, 2150); };
    check(); status.textContent = 'Tap each tile until its golden path goes across.';
  }

  function setupThroat() {
    baseStage('w4-throat-game');
    const counter = document.createElement('div'); counter.className = 'w4-counter'; counter.textContent = '1. Move the dipper';
    const child = document.createElement('div'); child.className = 'w4-throat-child'; child.innerHTML = '<span class="w4-throat-head"></span><span class="w4-throat-neck"></span><span class="w4-throat-shirt"></span>';
    const mouth = document.createElement('div'); mouth.className = 'w4-mouth-target';
    const throat = document.createElement('div'); throat.className = 'w4-throat-target';
    const line = document.createElement('div'); line.className = 'w4-trace-line';
    const dipper = document.createElement('button'); dipper.type = 'button'; dipper.className = 'w4-dipper'; dipper.setAttribute('aria-label', 'Drag the honey dipper to the mouth');
    const dots = ['one','two','three'].map((name, index) => { const dot = document.createElement('button'); dot.type = 'button'; dot.className = `w4-trace-dot ${name}`; dot.setAttribute('aria-label', `Trace point ${index + 1}`); return dot; });
    stage.append(counter, child, mouth, throat, line, dipper, ...dots);
    let dragging = false, placed = false, next = 0;
    const home = { left:9, top:42 };
    function setDipper(x, y) { dipper.style.left = `${x}%`; dipper.style.top = `${y}%`; }
    function placeDipper() {
      if (placed) return; placed = true; setDipper(48, 29); dipper.disabled = true; mouth.style.opacity = '.25'; stage.classList.add('trace-ready'); line.classList.add('is-ready'); throat.classList.add('is-ready'); counter.textContent = '2. Trace to the throat'; status.textContent = 'Now tap the glowing dots from top to bottom.'; say('Trace down to the throat.'); sound(700, .24);
    }
    dipper.onclick = () => placeDipper();
    dipper.addEventListener('pointerdown', event => { if (placed) return; dragging = true; dipper.setPointerCapture(event.pointerId); });
    dipper.addEventListener('pointermove', event => { if (!dragging || placed) return; const rect = stage.getBoundingClientRect(); setDipper((event.clientX - rect.left) / rect.width * 100 - 14, (event.clientY - rect.top) / rect.height * 100 - 12); });
    dipper.addEventListener('pointerup', event => {
      if (!dragging || placed) return; dragging = false; try { dipper.releasePointerCapture(event.pointerId); } catch {}
      const a = dipper.getBoundingClientRect(), b = mouth.getBoundingClientRect();
      if (a.right > b.left && a.left < b.right && a.bottom > b.top && a.top < b.bottom) placeDipper(); else { setDipper(home.left, home.top); wrong(dipper, 'Move the dipper to the glowing mouth circle.'); }
    });
    dots.forEach((dot, index) => dot.onclick = () => {
      if (!placed) return wrong(dipper, 'Move the dipper first.'); if (index !== next) return wrong(dot, 'Start with the top glowing dot.');
      dot.classList.add('is-on'); next++; sound(560 + next * 90, .16);
      if (next === dots.length) { stage.classList.add('is-glowing'); counter.textContent = 'Warm throat glow!'; status.textContent = 'You traced the warm glow to the throat!'; later(finish, 650); }
    });
    status.textContent = 'Drag or tap the honey dipper toward the glowing mouth circle.';
  }

  function setupBody() {
    baseStage('w4-body-game');
    const order = ['stretch','wide','tall']; const labels = { stretch:'Stretch up', wide:'Reach wide', tall:'Stand tall' }; const icons = { stretch:'🙆', wide:'↔', tall:'🧍' };
    const heading = document.createElement('div'); heading.className = 'w4-pose-title';
    const kid = document.createElement('div'); kid.className = 'w4-body-kid'; kid.innerHTML = '<span class="head"></span><span class="torso"></span><span class="limb arm left"></span><span class="limb arm right"></span><span class="limb leg left"></span><span class="limb leg right"></span>';
    const row = document.createElement('div'); row.className = 'w4-pose-choices';
    const cards = order.map(pose => { const card = document.createElement('button'); card.type = 'button'; card.className = 'w4-pose-card'; card.dataset.pose = pose; card.innerHTML = `<span>${icons[pose]}</span>${labels[pose]}`; row.append(card); return card; });
    stage.append(heading, kid, row); let round = 0;
    function showRound() { const pose = order[round]; heading.textContent = `Match: ${labels[pose]}`; kid.className = `w4-body-kid pose-${pose}`; status.textContent = `Which card shows “${labels[pose]}”?`; say(labels[pose]); }
    cards.forEach(card => card.onclick = () => {
      const target = order[round]; if (card.dataset.pose !== target) return wrong(card, `Find “${labels[target]}.”`);
      card.classList.add('is-done'); card.disabled = true; kid.classList.add('is-lit'); sound(620 + round * 100, .22); round++;
      if (round === order.length) { heading.textContent = 'Your whole body is glowing!'; status.textContent = 'Stretch, reach, and stand tall!'; later(finish, 650); }
      else later(() => { kid.classList.remove('is-lit'); showRound(); }, 420);
    });
    showRound();
  }

  function setupSkin() {
    baseStage('w4-skin-game');
    const meter = document.createElement('div'); meter.className = 'w4-skin-meter'; meter.innerHTML = '<span></span>';
    const peek = button('👀 Peek for 3 Seconds', 'gold w4-skin-peek');
    peek.setAttribute('aria-label', 'Show every unmatched card for three seconds');
    const grid = document.createElement('div'); grid.className = 'w4-memory-grid';
    const deck = [
      { color:'pink', icon:'🌸', name:'pink flower' }, { color:'blue', icon:'🌼', name:'blue flower' }, { color:'gold', icon:'🌻', name:'gold flower' },
      { color:'gold', icon:'🍯', name:'gold honeycomb' }, { color:'pink', icon:'🍯', name:'pink honeycomb' }, { color:'blue', icon:'🍯', name:'blue honeycomb' }
    ];
    const cards = deck.map(item => {
      const card = document.createElement('button'); card.type = 'button'; card.className = 'w4-memory-card'; card.dataset.color = item.color; card.setAttribute('aria-label', `Hidden card: ${item.name}`);
      card.dataset.kind = item.icon === '🍯' ? 'honeycomb' : 'flower';
      card.innerHTML = `<span class="w4-memory-inner"><span class="w4-memory-face w4-memory-back">?</span><span class="w4-memory-face w4-memory-front">${item.icon}</span></span>`; grid.append(card); return card;
    });
    stage.append(meter, peek, grid); let open = [], matched = 0, locked = false;
    peek.onclick = () => {
      if (locked || peek.disabled) return;
      open.forEach(card => card.classList.remove('is-open'));
      open = []; locked = true; peek.disabled = true;
      cards.filter(card => !card.classList.contains('is-matched')).forEach(card => card.classList.add('is-peeking'));
      peek.textContent = '👀 Look: 3';
      status.textContent = 'Look closely! The cards will hide again.';
      say('Look closely. The cards will hide in three seconds.');
      sound(650, .16);
      later(() => { peek.textContent = '👀 Look: 2'; }, 1000);
      later(() => { peek.textContent = '👀 Look: 1'; }, 2000);
      later(() => {
        cards.forEach(card => card.classList.remove('is-peeking'));
        peek.textContent = '👀 Peek for 3 Seconds'; peek.disabled = false; locked = false;
        status.textContent = 'Now tap two cards and match their colors.';
      }, 3000);
    };
    cards.forEach(card => card.onclick = () => {
      if (locked || card.classList.contains('is-open') || card.classList.contains('is-matched')) return;
      card.classList.add('is-open'); open.push(card); sound(470 + open.length * 60, .12);
      if (open.length < 2) { status.textContent = 'Now find its matching color.'; return; }
      locked = true; const [first, second] = open;
      if (first.dataset.color === second.dataset.color) {
        first.classList.add('is-matched'); second.classList.add('is-matched'); first.disabled = second.disabled = true; matched++; meter.firstElementChild.style.width = `${matched / 3 * 100}%`; status.textContent = 'Color match!'; sound(700 + matched * 70, .22); open = []; locked = false;
        if (matched === 3) { status.textContent = 'All flower and honeycomb colors match!'; later(finish, 650); }
      } else {
        status.textContent = 'Different colors. Look again!'; sound(200, .22); later(() => { first.classList.remove('is-open'); second.classList.remove('is-open'); open = []; locked = false; }, 850);
      }
    });
    status.textContent = 'Tap two cards and match their colors.';
  }

  function setupGame() { clearGame(); ({ health:setupHealth, tummy:setupTummy, throat:setupThroat, body:setupBody, skin:setupSkin })[currentGame](); }
  function closeCompletion() { completionVideo.pause(); completion.hidden = true; }
  function closeGame({ restoreFocus = true } = {}) { clearGame(); if ('speechSynthesis' in window) speechSynthesis.cancel(); modal.hidden = true; document.body.classList.remove('b-activity-open'); if (restoreFocus) activeChoice.focus({ preventScroll:true }); }
  function openGame(choice) {
    closeCompletion(); choose(choice); video.pause(); title.textContent = games[currentGame].title; prompt.textContent = games[currentGame].prompt; setupGame();
    modal.hidden = false; document.body.classList.add('b-activity-open'); modal.querySelector('[data-close-game]').focus(); later(() => say(games[currentGame].prompt), 220);
  }
  function playSelected() {
    closeCompletion(); closeGame({ restoreFocus:false }); const label = activeChoice.dataset.label; video.pause(); video.src = activeChoice.dataset.video;
    video.setAttribute('aria-label', `${label} video`); video.load(); nowPlaying.textContent = label; playButton.setAttribute('aria-label', `Play ${label} video`); playButton.hidden = true;
    player.scrollIntoView({ block:'center', behavior:'smooth' }); video.play().catch(() => { playButton.hidden = false; });
  }

  choices.forEach(choice => choice.addEventListener('click', () => openGame(choice)));
  modal.querySelector('[data-close-game]').addEventListener('click', () => closeGame());
  modal.querySelector('[data-hear-prompt]').addEventListener('click', () => say(games[currentGame].prompt));
  modal.querySelector('[data-watch-video]').addEventListener('click', playSelected);
  completion.querySelector('[data-watch-video]').addEventListener('click', playSelected);
  completion.querySelector('[data-close-completion]').addEventListener('click', () => { closeCompletion(); modal.hidden = false; document.body.classList.add('b-activity-open'); modal.querySelector('[data-close-game]').focus(); });
  completion.querySelector('[data-try-again]').addEventListener('click', () => { closeCompletion(); setupGame(); modal.hidden = false; document.body.classList.add('b-activity-open'); });
  modal.addEventListener('click', event => { if (event.target === modal) closeGame(); });
  document.addEventListener('keydown', event => { if (event.key !== 'Escape') return; if (!completion.hidden) closeCompletion(); else if (!modal.hidden) closeGame(); });
  playButton.addEventListener('click', () => { playButton.hidden = true; video.play().catch(() => { playButton.hidden = false; }); });
  video.addEventListener('play', () => { playButton.hidden = true; }); video.addEventListener('pause', () => { if (!video.ended && modal.hidden) playButton.hidden = false; }); video.addEventListener('ended', () => { playButton.hidden = false; });
})();
