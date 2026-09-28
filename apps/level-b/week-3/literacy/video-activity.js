(() => {
  const video = document.getElementById('b-week3-video');
  const player = document.querySelector('.b-video-card');
  const playButton = document.getElementById('b-week3-play');
  const nowPlaying = document.getElementById('b-week3-now-playing');
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

  const root = '../../assets/media/literacy/week-3-activities/';
  const games = {
    toast: { title: 'Honey Toast Popper', prompt: 'Put in both bread slices, then push the lever!', sentence: 'We can make honey toast.' },
    tea: { title: 'Honey Drop Catch', prompt: 'Move the cup left and right to catch three honey drops!', sentence: 'We can make honey tea.' },
    cake: { title: 'Build the Honey Cake', prompt: 'Add cake layers one, two, and three in order!', sentence: 'We can make honey cake.' },
    pancakes: { title: 'Flip and Finish', prompt: 'Flip three pancakes, then add the honey!', sentence: 'We can make honey pancakes.' },
    chicken: { title: 'Honey Chicken Chef', prompt: 'Brush, sprinkle, and garnish the honey chicken!', sentence: 'We can make honey chicken.' }
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
    item.classList.remove('w3-wrong'); void item.offsetWidth; item.classList.add('w3-wrong');
    status.textContent = message; sound(190, .28); say('Try again.');
    later(() => item.classList.remove('w3-wrong'), 450);
  }
  function baseStage(className) {
    stage.className = `b-activity-stage w3-game ${className}`;
    stage.innerHTML = '<div class="b-game-sparkles" aria-hidden="true"></div>';
    status.textContent = '';
  }
  function sheet(src) {
    const board = document.createElement('div'); board.className = 'w3-stage-sheet stage-0';
    board.style.setProperty('--sheet', `url("${root}${src}")`); stage.prepend(board);
    return { board, set(number) { board.className = `w3-stage-sheet stage-${number}`; stage.classList.add('is-changing'); later(() => stage.classList.remove('is-changing'), 260); } };
  }
  function hit(className, label) {
    const button = document.createElement('button'); button.type = 'button'; button.className = `w3-hit ${className}`;
    button.setAttribute('aria-label', label); stage.append(button); return button;
  }
  function action(label, className = '') {
    const button = document.createElement('button'); button.type = 'button'; button.className = `w3-action ${className}`.trim(); button.textContent = label; return button;
  }
  function controls(...buttons) {
    const row = document.createElement('div'); row.className = 'w3-controls'; row.append(...buttons); stage.append(row); return row;
  }
  function progress(count) {
    const row = document.createElement('div'); row.className = 'w3-progress';
    for (let i = 1; i <= count; i++) { const dot = document.createElement('span'); dot.textContent = i; row.append(dot); }
    stage.append(row); return [...row.children];
  }
  function lightProgress(dots, amount) { dots.forEach((dot, index) => dot.classList.toggle('is-on', index < amount)); }
  function choose(choice) {
    activeChoice = choice; currentGame = choice.dataset.game;
    choices.forEach(button => { const active = button === choice; button.classList.toggle('is-active', active); button.setAttribute('aria-pressed', String(active)); });
  }
  function finish() {
    stage.classList.add('is-complete'); sound(820, .38); status.textContent = 'Wonderful!'; say(games[currentGame].sentence);
    later(() => {
      completionSentence.textContent = games[currentGame].sentence;
      modal.hidden = true; completion.hidden = false; completionVideo.currentTime = 0;
      completionVideo.play().catch(() => {}); completion.querySelector('[data-close-completion]').focus();
    }, 700);
  }

  function setupToast() {
    baseStage('toast-game'); const scene = sheet('https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-b/week-3/literacy/toast-stages-v2.png'); const dots = progress(3);
    const breadOne = hit('bread-hit one', 'Put in the first bread slice');
    const breadTwo = hit('bread-hit two', 'Put in the second bread slice');
    const lever = hit('lever-hit', 'Push down the toaster lever');
    scene.board.append(breadOne, breadTwo, lever);
    let breads = 0, cooking = false;
    function addBread(button) {
      if (button.classList.contains('is-done')) return;
      button.classList.add('is-done'); breads++; sound(510 + breads * 70); lightProgress(dots, breads);
      status.textContent = breads === 1 ? 'One slice is in. Add the other slice!' : 'Both slices are ready. Push the lever!';
      if (breads === 2) { scene.set(1); stage.classList.add('ready-lever'); say('Push the toaster lever.'); }
    }
    breadOne.onclick = () => addBread(breadOne); breadTwo.onclick = () => addBread(breadTwo);
    lever.onclick = () => {
      if (breads < 2 || cooking) return wrong(lever, 'Put in both bread slices first.');
      cooking = true; lever.classList.add('is-done'); stage.classList.remove('ready-lever'); scene.set(2); lightProgress(dots, 3);
      status.textContent = 'The toast is glowing and cooking!'; sound(700, .3); say('The toast is cooking.');
      later(() => { scene.set(3); status.textContent = 'Golden honey toast!'; sound(900, .35); finish(); }, 1350);
    };
    status.textContent = 'Tap both bread slices.';
  }

  function setupTea() {
    baseStage('tea-catch-game');
    const clouds = document.createElement('div'); clouds.className = 'tea-cloud'; stage.append(clouds);
    const counter = document.createElement('div'); counter.className = 'tea-caught'; counter.textContent = 'Honey drops: 0 of 3'; stage.append(counter);
    const cup = document.createElement('button'); cup.type = 'button'; cup.className = 'tea-cup stage-0'; cup.setAttribute('aria-label', 'Move the cup to catch honey drops'); cup.style.setProperty('--cup-sheet', `url("https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-b/week-3/literacy/${root}tea-cup-stages-v2.png")`); stage.append(cup);
    const left = action('←', 'tea-arrow left'); left.setAttribute('aria-label', 'Move cup left');
    const right = action('→', 'tea-arrow right'); right.setAttribute('aria-label', 'Move cup right'); stage.append(left, right);
    let cupX = 50, caught = 0, running = true, dragging = false, frame = 0, last = performance.now();
    const drops = [], lanes = [24, 76, 34];
    function setCup(x) { cupX = Math.max(16, Math.min(84, x)); cup.style.left = `${cupX}%`; }
    function moveBy(amount) { setCup(cupX + amount); sound(360, .08); }
    left.onclick = () => moveBy(-12); right.onclick = () => moveBy(12);
    cup.addEventListener('pointerdown', event => { dragging = true; cup.setPointerCapture(event.pointerId); });
    cup.addEventListener('pointermove', event => { if (!dragging) return; const rect = stage.getBoundingClientRect(); setCup((event.clientX - rect.left) / rect.width * 100); });
    cup.addEventListener('pointerup', event => { dragging = false; try { cup.releasePointerCapture(event.pointerId); } catch {} });
    cup.addEventListener('keydown', event => { if (event.key === 'ArrowLeft') { event.preventDefault(); moveBy(-10); } if (event.key === 'ArrowRight') { event.preventDefault(); moveBy(10); } });
    function makeDrop() {
      const drop = document.createElement('div'); drop.className = 'tea-drop'; drop.setAttribute('aria-hidden', 'true'); stage.append(drop);
      const data = { element: drop, x: lanes[0], y: -18, speed: 38 };
      drops.push(data); return data;
    }
    makeDrop();
    function resetDrop(drop, extra = 0) { drop.x = lanes[Math.min(caught, lanes.length - 1)]; drop.y = -18 - extra; drop.element.style.left = `${drop.x}%`; drop.element.style.top = `${drop.y}%`; }
    function catchDrop(drop) {
      caught++; sound(620 + caught * 90, .22); cup.className = `tea-cup stage-${caught}`; counter.textContent = `Honey drops: ${caught} of 3`; lightProgress([], caught);
      status.textContent = caught < 3 ? `Great catch! Move to the ${caught === 1 ? 'right' : 'left'} for the next drop.` : 'The honey tea is ready!'; resetDrop(drop, 18);
      if (caught === 3) { running = false; left.disabled = right.disabled = true; later(finish, 420); }
    }
    function animate(now) {
      if (!running) return; const rect = stage.getBoundingClientRect(); const dt = Math.min(.034, (now - last) / 1000); last = now;
      const cupRect = cup.getBoundingClientRect();
      for (const drop of drops) {
        drop.y += drop.speed * dt; drop.element.style.left = `${drop.x}%`; drop.element.style.top = `${drop.y}%`;
        const dropRect = drop.element.getBoundingClientRect();
        if (dropRect.bottom >= cupRect.top + 8 && dropRect.top < cupRect.bottom && dropRect.right > cupRect.left + 14 && dropRect.left < cupRect.right - 14) { catchDrop(drop); if (!running) break; }
        else if (dropRect.top > rect.bottom) { resetDrop(drop, 10); status.textContent = `Move the cup ${caught === 1 ? 'right' : 'left'} under the honey drop!`; }
      }
      if (running) frame = requestAnimationFrame(animate);
    }
    frame = requestAnimationFrame(animate); cleanupGame = () => { running = false; cancelAnimationFrame(frame); };
    status.textContent = 'Drag the cup or use the arrows to catch the falling honey.'; cup.focus({ preventScroll: true });
  }

  function setupCake() {
    baseStage('cake-game'); const scene = sheet('https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-b/week-3/literacy/cake-stages-v2.png'); const dots = progress(3);
    const layerButtons = [1,2,3].map(number => {
      const button = hit(`cake-layer-hit ${number === 1 ? 'one' : number === 2 ? 'two' : 'three'}`, `Add cake layer ${number}`);
      button.dataset.layer = String(number); scene.board.append(button); return button;
    });
    let next = 1;
    layerButtons.forEach((button, index) => button.onclick = () => {
      const number = index + 1; if (number !== next) return wrong(button, `Choose cake layer ${next} first.`);
      button.classList.add('is-used'); button.disabled = true; next++; lightProgress(dots, number); sound(500 + number * 100, .2);
      const stacked = document.createElement('span'); stacked.className = `cake-stack-piece piece-${number}`; stacked.setAttribute('aria-hidden','true'); scene.board.append(stacked);
      status.textContent = number < 3 ? `Layer ${number} is on the stand. Tap layer ${number + 1}.` : 'All three layers are stacked!';
      if (number === 3) later(() => { stage.classList.add('final-cake'); scene.set(3); status.textContent = 'The honey cake is complete!'; finish(); }, 650);
      else say(`Now tap layer ${number + 1}.`);
    });
    status.textContent = 'Tap the cake marked 1 to place it on the stand.';
  }

  function setupPancakes() {
    baseStage('pancake-game'); const scene = sheet('https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-b/week-3/literacy/pancake-stages-v2.png'); const dots = progress(4);
    const pan = hit('pan-hit', 'Flip a pancake in the pan'); const honey = hit('honey-hit', 'Add honey to the pancake stack');
    honey.innerHTML = `<img src="https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-b/week-3/literacy/${root}honey-dipper-clean-v1.png" alt=""><span>Honey</span>`;
    let flips = 0, busy = false;
    pan.onclick = () => {
      if (busy || flips >= 3) return; busy = true; flips++; scene.set(1); lightProgress(dots, flips); sound(610 + flips * 70, .22); status.textContent = `Flip ${flips} of 3!`;
      later(() => { busy = false; if (flips < 3) { scene.set(0); status.textContent = 'Flip the next pancake!'; } else { scene.set(2); pan.classList.add('is-done'); stage.classList.add('ready-honey'); status.textContent = 'Tall stack! Now add the honey.'; say('Now add the honey.'); } }, 520);
    };
    honey.onclick = () => { if (flips < 3) return wrong(honey, 'Flip all three pancakes first.'); honey.classList.add('is-done'); stage.classList.remove('ready-honey'); scene.set(3); lightProgress(dots, 4); status.textContent = 'A sparkling honey pancake stack!'; sound(900, .35); later(finish, 650); };
    status.textContent = 'Tap the pancake in the pan to flip it.';
  }

  function setupChicken() {
    baseStage('chicken-game'); const scene = sheet('https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-b/week-3/literacy/chicken-stages-v2.png'); const dots = progress(3);
    const brush = action('🖌️ Brush', 'gold'), sesame = action('✨ Sprinkle', 'purple'), garnish = action('🌿 Garnish', 'green'); controls(brush, sesame, garnish); sesame.disabled = garnish.disabled = true;
    brush.onclick = () => { brush.disabled = true; sesame.disabled = false; scene.set(1); lightProgress(dots, 1); status.textContent = 'The drumsticks are shiny! Sprinkle the sesame.'; sound(590, .22); say('Sprinkle the sesame.'); };
    sesame.onclick = () => { sesame.disabled = true; garnish.disabled = false; scene.set(2); lightProgress(dots, 2); status.textContent = 'Sesame added! Finish with the green garnish.'; sound(700, .22); say('Add the green garnish.'); };
    garnish.onclick = () => { garnish.disabled = true; scene.set(3); lightProgress(dots, 3); status.textContent = 'The honey chicken looks delicious!'; sound(900, .35); later(finish, 650); };
    status.textContent = 'Start by brushing on the honey glaze.';
  }

  function setupGame() { clearGame(); ({ toast:setupToast, tea:setupTea, cake:setupCake, pancakes:setupPancakes, chicken:setupChicken })[currentGame](); }
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
  completion.querySelector('[data-close-completion]').addEventListener('click', () => { closeCompletion(); modal.hidden=false; document.body.classList.add('b-activity-open'); activeChoice.focus(); });
  completion.querySelector('[data-try-again]').addEventListener('click', () => { closeCompletion(); setupGame(); modal.hidden=false; document.body.classList.add('b-activity-open'); });
  modal.addEventListener('click', event => { if (event.target === modal) closeGame(); });
  document.addEventListener('keydown', event => { if (event.key !== 'Escape') return; if (!completion.hidden) closeCompletion(); else if (!modal.hidden) closeGame(); });
  playButton.addEventListener('click', () => { playButton.hidden=true; video.play().catch(() => { playButton.hidden=false; }); });
  video.addEventListener('play', () => { playButton.hidden=true; }); video.addEventListener('pause', () => { if (!video.ended && modal.hidden) playButton.hidden=false; }); video.addEventListener('ended', () => { playButton.hidden=false; });
})();
