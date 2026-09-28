(() => {
  const video = document.getElementById('b-week2-video');
  const player = document.querySelector('.b-video-card');
  const playButton = document.getElementById('b-week2-play');
  const nowPlaying = document.getElementById('b-week2-now-playing');
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

  const assetRoot = '../../assets/media/literacy/week-2-activities/';
  const assets = {
    jar: 'https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-b/week-2/literacy/honey-jar-3d-v1.png', star: 'https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-b/week-2/literacy/star-3d-v1.png', bowl: 'https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-b/week-2/literacy/yogurt-bowl-3d-v1.png',
    strawberry: 'https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-b/week-2/literacy/strawberry-3d-v1.png', blueberries: 'https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-b/week-2/literacy/blueberries-3d-v1.png', banana: 'https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-b/week-2/literacy/banana-3d-v1.png',
    dipper: 'https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-b/week-2/literacy/honey-dipper-3d-v1.png', bee: 'https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-b/week-2/literacy/bee-3d-v1.png', nectar: 'https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-b/week-2/literacy/nectar-drop-3d-v1.png',
    pinkFlower: 'https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-b/week-2/literacy/pink-flower-3d-v1.png', yellowFlower: 'https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-b/week-2/literacy/yellow-flower-3d-v1.png', comb: 'https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-b/week-2/literacy/honeycomb-3d-v1.png',
    toast: 'https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-b/week-2/literacy/toast-3d-v1.png', lemon: 'https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-b/week-2/literacy/lemon-3d-v1.png', mug: 'https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-b/week-2/literacy/mug-3d-v1.png', spoon: 'https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-b/week-2/literacy/spoon-3d-v1.png',
    healthyStrawberries: 'https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-b/week-2/literacy/v2/strawberries-choice.png', healthyBlueberries: 'https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-b/week-2/literacy/v2/blueberries-choice.png',
    healthyBanana: 'https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-b/week-2/literacy/v2/banana-choice.png', healthyHoney: 'https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-b/week-2/literacy/v2/honey-dipper-choice.png', healthySpoon: 'https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-b/week-2/literacy/v2/stirring-spoon.png',
    warmWater: 'https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-b/week-2/literacy/v2/water-choice.png', healingLemon: 'https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-b/week-2/literacy/v2/lemon-choice.png',
    goodStar: 'https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-b/week-2/literacy/v2/star-choice.png', naturalBee: 'https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-b/week-2/literacy/v2/bee-choice.png'
  };
  const games = {
    good: { title: 'Honey Star Celebration', prompt: 'Put all three golden stars on the honey jar.', sentence: 'Yes! It’s good.' },
    healthy: { title: 'Build a Healthy Honey Bowl', prompt: 'Add the healthy ingredients, then stir the bowl.', sentence: 'Yes! It’s healthy.' },
    natural: { title: 'Bee’s Nectar Journey', prompt: 'Guide the bee past each nectar drop and into the honeycomb.', sentence: 'Yes! It’s natural.' },
    sweet: { title: 'Honey Toast Artist', prompt: 'Follow the golden honey path across the toast.', sentence: 'Yes! It’s sweet.' },
    healing: { title: 'Cozy Honey Cup', prompt: 'Add warm water, lemon, and honey, then stir the cozy cup.', sentence: 'Yes! It’s healing.' }
  };

  let activeChoice = choices[0];
  let currentGame = activeChoice.dataset.game;
  let timers = [];
  let audioContext;

  function later(fn, delay) { const id = setTimeout(fn, delay); timers.push(id); return id; }
  function clearTimers() { timers.forEach(clearTimeout); timers = []; }
  function say(text) {
    if (!('speechSynthesis' in window)) return;
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US'; utterance.rate = .84; utterance.pitch = 1.08;
    setTimeout(() => speechSynthesis.speak(utterance), 25);
  }
  function chime(success = true) {
    try {
      audioContext ||= new (AudioContext || webkitAudioContext)();
      const oscillator = audioContext.createOscillator(), gain = audioContext.createGain();
      oscillator.type = success ? 'sine' : 'triangle'; oscillator.frequency.value = success ? 680 : 210;
      gain.gain.setValueAtTime(.0001, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(.11, audioContext.currentTime + .02);
      gain.gain.exponentialRampToValueAtTime(.0001, audioContext.currentTime + .23);
      oscillator.connect(gain).connect(audioContext.destination); oscillator.start(); oscillator.stop(audioContext.currentTime + .24);
    } catch {}
  }
  function choose(choice) {
    activeChoice = choice; currentGame = choice.dataset.game;
    choices.forEach(button => { const active = button === choice; button.classList.toggle('is-active', active); button.setAttribute('aria-pressed', String(active)); });
  }
  function makeObject(key, className, label, x, y, width, parent = stage) {
    const button = document.createElement('button'); button.type = 'button'; button.className = `honey-object ${className}`;
    button.setAttribute('aria-label', label); button.dataset.start = `${x},${y}`;
    Object.assign(button.style, { left: `${x}%`, top: `${y}%`, width: `${width}%`, height: `${width * 1.38}%` });
    button.innerHTML = `<img src="${assetRoot}${assets[key]}" alt="">`; parent.append(button); return button;
  }
  function makeTarget(key, className, label, x, y, width) {
    const button = document.createElement('button'); button.type = 'button'; button.className = `honey-target ${className}`;
    button.setAttribute('aria-label', label); Object.assign(button.style, { left: `${x}%`, top: `${y}%`, width: `${width}%`, height: `${width * 1.3}%` });
    button.innerHTML = `<img src="${assetRoot}${assets[key]}" alt="">`; stage.append(button); return button;
  }
  function decorateStage(className) {
    stage.className = `b-activity-stage honey-game ${className}`;
    stage.innerHTML = '<div class="b-game-sparkles" aria-hidden="true"></div>';
    status.textContent = '';
  }
  function overlap(a, b) {
    const insetX = Math.min(a.width, b.width) * .2, insetY = Math.min(a.height, b.height) * .2;
    return a.right - insetX > b.left && a.left + insetX < b.right && a.bottom - insetY > b.top && a.top + insetY < b.bottom;
  }
  function resetPosition(item) {
    const [x, y] = item.dataset.start.split(','); item.style.left = `${x}%`; item.style.top = `${y}%`;
  }
  function wrong(item, message) {
    item.classList.remove('is-wrong'); void item.offsetWidth; item.classList.add('is-wrong'); status.textContent = message; chime(false);
    later(() => item.classList.remove('is-wrong'), 480);
  }
  function enableDrag(item, onDrop, onMove) {
    let dragging = false, moved = false, startX = 0, startY = 0, suppressClick = false;
    item.addEventListener('click', event => { if (!suppressClick) return; suppressClick = false; event.preventDefault(); event.stopImmediatePropagation(); }, true);
    item.addEventListener('pointerdown', event => {
      if (item.disabled) return; dragging = true; moved = false; startX = event.clientX; startY = event.clientY;
      item.setPointerCapture(event.pointerId);
    });
    item.addEventListener('pointermove', event => {
      if (!dragging) return;
      if (!moved && Math.hypot(event.clientX - startX, event.clientY - startY) < 6) return;
      moved = true; item.classList.add('is-dragging');
      const rect = stage.getBoundingClientRect();
      const left = Math.max(item.offsetWidth / 2, Math.min(rect.width - item.offsetWidth / 2, event.clientX - rect.left));
      const top = Math.max(item.offsetHeight / 2, Math.min(rect.height - item.offsetHeight / 2, event.clientY - rect.top));
      item.style.left = `${left}px`; item.style.top = `${top}px`; onMove?.(item, event, rect);
    });
    item.addEventListener('pointerup', event => {
      if (!dragging) return; dragging = false; item.classList.remove('is-dragging');
      if (item.hasPointerCapture(event.pointerId)) item.releasePointerCapture(event.pointerId);
      suppressClick = moved; onDrop(item, moved);
    });
    item.addEventListener('pointercancel', () => { dragging = false; item.classList.remove('is-dragging'); resetPosition(item); });
  }
  function closeCompletion() { completionVideo.pause(); completion.hidden = true; document.body.classList.remove('completion-open'); }
  function closeGame({ restoreFocus = true } = {}) {
    clearTimers(); speechSynthesis?.cancel(); modal.hidden = true; document.body.classList.remove('b-activity-open');
    if (restoreFocus) activeChoice?.focus();
  }
  function finish() {
    status.textContent = 'Great job!'; stage.classList.add('is-complete'); chime(true);
    later(() => {
      modal.hidden = true; completionSentence.textContent = games[currentGame].sentence; completion.hidden = false;
      document.body.classList.add('completion-open'); completionVideo.currentTime = 0; completionVideo.play().catch(() => {});
      completion.querySelector('[data-watch-video]')?.focus();
    }, 550);
  }

  function setupGood() {
    decorateStage('good-game good-scene-game');
    const states=['https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-b/week-2/literacy/good-00-jar.png','https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-b/week-2/literacy/good-01-star.png','https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-b/week-2/literacy/good-02-stars.png','https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-b/week-2/literacy/good-03-finished.png'];
    const scene=document.createElement('img');scene.className='activity-state-scene';scene.src=`${assetRoot}v2/${states[0]}`;scene.alt='A complete honey jar in a sunny flower garden';stage.prepend(scene);
    const jarFill=document.createElement('span');jarFill.className='jar-fill-level';stage.append(jarFill);
    const jar=document.createElement('button');jar.type='button';jar.className='good-jar-drop';jar.setAttribute('aria-label','Put a golden star on the honey jar');stage.append(jar);
    const stars = [[20,20],[50,16],[80,20]].map(([x,y],index) => {const star=makeObject('goodStar','honey-star full-cutout',`Golden star ${index+1}`,x,y,15);star.dataset.index=String(index);return star;});
    let selected = null, placed = 0;
    function place(star) {
      if (star.disabled) return; star.disabled = true; star.classList.remove('is-selected'); star.classList.add('is-used'); selected = null; placed++;
      scene.src=`${assetRoot}v2/${states[placed]}`;scene.alt=`Honey jar with ${placed} golden ${placed===1?'star':'stars'}`;
      jarFill.dataset.level=String(placed);
      status.textContent = `${placed} of 3 stars on the honey jar.`; chime();
      if (placed === 3) { say('Honey is good!'); finish(); }
    }
    stars.forEach(star => {
      star.addEventListener('click', () => { if (star.disabled) return; stars.forEach(s => s.classList.remove('is-selected')); selected = star; star.classList.add('is-selected'); status.textContent = 'Now tap the honey jar.'; say('Put the star on the honey jar.'); });
      enableDrag(star, item => overlap(item.getBoundingClientRect(), jar.getBoundingClientRect()) ? place(item) : (resetPosition(item), wrong(item, 'Put the star on the honey jar.')));
    });
    jar.addEventListener('click', () => selected ? place(selected) : wrong(jar, 'Choose a golden star first.'));
  }

  function setupStir(spoon, center, done) {
    let total = 0, previous = null, taps = 0;
    spoon.classList.add('is-ready');
    enableDrag(spoon, item => { if (total >= Math.PI * 1.55) done(); else { resetPosition(item); wrong(item, 'Move the spoon around the bowl.'); } }, (item, event, rect) => {
      const cx = rect.left + rect.width * center[0] / 100, cy = rect.top + rect.height * center[1] / 100;
      const angle = Math.atan2(event.clientY - cy, event.clientX - cx);
      if (previous !== null) { let delta = angle - previous; if (delta > Math.PI) delta -= Math.PI * 2; if (delta < -Math.PI) delta += Math.PI * 2; total += Math.abs(delta); }
      previous = angle; status.textContent = total > Math.PI ? 'Keep stirring!' : 'Stir around the circle.';
    });
    spoon.addEventListener('click', () => { taps++; spoon.animate([{transform:'translate(-50%,-50%) rotate(-18deg)'},{transform:'translate(-50%,-50%) rotate(18deg)'},{transform:'translate(-50%,-50%) rotate(0)'}],{duration:330}); if (taps >= 3) done(); else status.textContent = `${taps} of 3 stirs.`; });
  }

  function setupHealthy() {
    decorateStage('healthy-game healthy-ordered-game');
    const states = ['https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-b/week-2/literacy/healthy-00-yogurt.png','https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-b/week-2/literacy/healthy-01-strawberries.png','https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-b/week-2/literacy/healthy-02-blueberries.png','https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-b/week-2/literacy/healthy-03-banana.png','https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-b/week-2/literacy/healthy-04-honey.png','https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-b/week-2/literacy/healthy-05-finished.png'];
    const scene = document.createElement('img'); scene.className = 'healthy-state-scene'; scene.src = `${assetRoot}v2/${states[0]}`; scene.alt = 'A bowl of plain yogurt in a sunny garden'; stage.prepend(scene);
    const bowl = document.createElement('button'); bowl.type = 'button'; bowl.className = 'healthy-bowl-drop'; bowl.setAttribute('aria-label','Add the next ingredient to the yogurt bowl'); stage.append(bowl);
    const ring = document.createElement('span'); ring.className = 'stir-ring'; stage.append(ring);
    const specs = [
      ['healthyStrawberries','Strawberries',17,19],['healthyBlueberries','Blueberries',39,16],
      ['healthyBanana','Banana',61,16],['healthyHoney','Honey',83,19]
    ];
    const items = specs.map(([key,label,x,y],index) => { const item=makeObject(key,`ingredient ordered-ingredient step-${index}`,label,x,y,15); item.dataset.step=String(index); return item; });
    let selected = null, step = 0, stirring = false;
    const spoon = makeObject('healthySpoon','stir-spoon ordered-spoon','Stirring spoon',50,56,14); spoon.style.display='none';
    function refreshChoices(){items.forEach((item,index)=>{const locked=index!==step;item.classList.toggle('is-next',index===step);item.classList.toggle('is-locked',index>step);item.disabled=index<step;item.setAttribute('aria-disabled',String(locked));});}
    function add(item){
      const index=Number(item.dataset.step); if(index!==step){wrong(item,`Add ${specs[step][1].toLowerCase()} next.`);say(`${specs[step][1]} next.`);return;}
      item.disabled=true;item.classList.remove('is-selected','is-next');item.classList.add('is-used');selected=null;step++;scene.src=`${assetRoot}v2/${states[step]}`;scene.alt=`Healthy yogurt bowl after adding ${specs[index][1].toLowerCase()}`;chime();
      status.textContent=`${step} of 4 ingredients added. ${step<4?`${specs[step][1]} next.`:''}`;
      if(step<4){refreshChoices();say(`${specs[step][1]} next.`);return;}
      if(!stirring){stirring=true;spoon.style.display='';ring.classList.add('is-ready');status.textContent='Now stir the healthy bowl!';say('Now stir the healthy bowl.');setupStir(spoon,[50,64],()=>{scene.src=`${assetRoot}v2/${states[5]}`;scene.alt='Finished healthy honey yogurt bowl with fruit';finish();});}
    }
    items.forEach(item=>{
      item.addEventListener('click',()=>{const index=Number(item.dataset.step);if(index!==step)return wrong(item,`${specs[step][1]} comes next.`);items.forEach(i=>i.classList.remove('is-selected'));selected=item;item.classList.add('is-selected');status.textContent=`Now tap the bowl to add ${specs[index][1].toLowerCase()}.`;say(specs[index][1]);});
      enableDrag(item,obj=>overlap(obj.getBoundingClientRect(),bowl.getBoundingClientRect())?add(obj):(resetPosition(obj),wrong(obj,'Take it to the yogurt bowl.')));
    });
    bowl.addEventListener('click',()=>selected?add(selected):wrong(bowl,`Choose ${specs[step][1].toLowerCase()} first.`));
    refreshChoices();status.textContent='Add the strawberries first.';
  }

  function setupNatural() {
    decorateStage('natural-game natural-scene-game');
    const scene=document.createElement('img');scene.className='activity-state-scene';scene.src=`https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-b/week-2/literacy/${assetRoot}v2/natural-00-path.png`;scene.alt='A golden dotted nectar path through three garden flowers to a honeycomb';stage.prepend(scene);
    // These coordinates follow the actual nectar drops painted into the scene,
    // rather than the centres of the surrounding flowers.
    const points=[[11,73],[24.2,50.2],[51.1,29.3],[73.5,50.1],[89,70]];
    const drops=points.slice(1,4).map(([x,y],index)=>{const target=document.createElement('button');target.type='button';target.className='natural-checkpoint';target.style.left=`${x}%`;target.style.top=`${y}%`;target.setAttribute('aria-label',`Nectar stop ${index+1}`);stage.append(target);return target;});
    const comb=document.createElement('button');comb.type='button';comb.className='natural-checkpoint natural-finish';comb.style.left='89%';comb.style.top='70%';comb.setAttribute('aria-label','Honeycomb finish');stage.append(comb);
    const bee=makeObject('naturalBee','journey-bee full-cutout','Bee',11,73,15);
    let step = 0, selected = false, completed = false, crossedDuringDrag = false; const progress = stage.querySelector('.trail-progress');
    function refreshTargets() {
      drops.forEach((drop,index) => drop.classList.toggle('is-next', index === step));
      comb.classList.toggle('is-next', step === 3);
    }
    function advance() {
      if (step < 3) { drops[step].classList.add('is-collected'); step++; if (progress) progress.style.strokeDashoffset = String(100 - step * 25); status.textContent = `${step} of 3 nectar drops collected.`; chime(); refreshTargets(); if (step === 3) { status.textContent = 'Now take the bee to the honeycomb!'; say('Take the bee to the honeycomb.'); } }
      else { completed = true; if (progress) progress.style.strokeDashoffset = '0'; bee.style.left = '89%'; bee.style.top = '70%';scene.src=`https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-b/week-2/literacy/${assetRoot}v2/natural-01-finished.png`;scene.alt='The happy bee reached its honeycomb after collecting nectar';bee.style.opacity='0'; finish(); }
    }
    function moveToNext() { const [x,y] = points[step+1]; bee.style.left = `${x}%`; bee.style.top = `${y}%`; advance(); }
    bee.addEventListener('click', () => { selected = true; bee.classList.add('is-selected'); status.textContent = step < 3 ? 'Tap the next glowing nectar drop.' : 'Tap the honeycomb.'; });
    drops.forEach((drop,index) => { drop.addEventListener('click', () => { if (!selected || index !== step) return wrong(drop, 'Follow the nectar trail in order.'); moveToNext(); }); });
    comb.addEventListener('click', () => { if (selected && step === 3) moveToNext(); else wrong(comb, 'Collect all three nectar drops first.'); });
    function collectCrossedTarget(item) {
      if (completed) return false;
      const target = step < 3 ? drops[step] : comb;
      if (!overlap(item.getBoundingClientRect(), target.getBoundingClientRect())) return false;
      crossedDuringDrag = true;
      advance();
      return true;
    }
    enableDrag(bee, item => {
      if (completed) return;
      collectCrossedTarget(item);
      const [x,y] = points[step]; item.style.left=`${x}%`; item.style.top=`${y}%`;
      if (!crossedDuringDrag) wrong(item, 'Stay on the nectar trail.');
      crossedDuringDrag = false;
    }, item => collectCrossedTarget(item));
    refreshTargets();
  }

  function setupSweet() {
    decorateStage('sweet-game sweet-scene-game');
    const states=['https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-b/week-2/literacy/sweet-00-toast.png','https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-b/week-2/literacy/sweet-01-honey.png'];
    const scene=document.createElement('img');scene.className='activity-state-scene';scene.src=`${assetRoot}v2/${states[0]}`;scene.alt='A plain toast on a plate in a sunny garden';stage.prepend(scene);
    const honeyPath='M38 44 C46 46 53 42 54 46 C53 49 42 49 40 53 C42 57 57 49 60 53 C61 57 48 58 46 62 C49 66 59 60 64 63';
    stage.insertAdjacentHTML('beforeend',`<svg class="sweet-trace-svg" viewBox="0 0 100 100" preserveAspectRatio="none"><path class="sweet-trace-base" d="${honeyPath}"/><path class="sweet-trace-progress" d="${honeyPath}"/></svg>`);
    const points = [[38,44],[54,46],[40,53],[60,53],[46,62],[64,63]];
    const dots = points.map(([x,y]) => { const dot=document.createElement('button');dot.type='button';dot.className='honey-dot';dot.style.left=`${x}%`;dot.style.top=`${y}%`;dot.setAttribute('aria-label','Next honey tracing dot');stage.append(dot);return dot; });
    const pen = makeObject('healthyHoney','honey-pen full-cutout','Honey dipper',18,22,16);
    let step=0,selected=false;
    dots[0].classList.add('is-next');
    const traceProgress=stage.querySelector('.sweet-trace-progress');
    function passed() { dots[step].classList.remove('is-next');dots[step].classList.add('is-passed'); step++;traceProgress.style.strokeDashoffset=String(100-step*(100/dots.length)); status.textContent=`${step} of ${dots.length} honey dots traced.`; chime(); if(step===dots.length){ pen.disabled=true;pen.classList.add('is-used');dots.forEach(dot=>dot.style.display='none');scene.src=`${assetRoot}v2/${states[1]}`;scene.alt='Golden honey drizzled across the toast';status.textContent='The honey toast is ready!';finish(); }else{dots[step].classList.add('is-next');} }
    pen.addEventListener('click',()=>{selected=true;pen.classList.add('is-selected');status.textContent='Tap the honey dots in order.'});
    dots.forEach((dot,index)=>{dot.addEventListener('click',()=>{if(!selected||index!==step)return wrong(dot,'Follow the next honey dot.');const [x,y]=points[index];pen.style.left=`${x}%`;pen.style.top=`${y}%`;passed();});});
    enableDrag(pen,item=>{if(step>=points.length)return;const dot=dots[step];if(overlap(item.getBoundingClientRect(),dot.getBoundingClientRect()))passed();else{const [x,y]=step?points[step-1]:[15,30];item.style.left=`${x}%`;item.style.top=`${y}%`;wrong(item,'Follow the golden honey dots.');}});
  }

  function setupHealing() {
    decorateStage('healing-game healing-ordered-game');
    const states=['https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-b/week-2/literacy/healing-00-empty.png','https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-b/week-2/literacy/healing-01-water.png','https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-b/week-2/literacy/healing-02-lemon.png','https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-b/week-2/literacy/healing-03-honey.png','https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-b/week-2/literacy/healing-04-finished.png'];
    const scene=document.createElement('img');scene.className='healthy-state-scene';scene.src=`${assetRoot}v2/${states[0]}`;scene.alt='An empty blue mug in a sunny garden';stage.prepend(scene);
    const mug=document.createElement('button');mug.type='button';mug.className='healing-mug-drop';mug.setAttribute('aria-label','Add the next ingredient to the cozy mug');stage.append(mug);
    const ring=document.createElement('span');ring.className='stir-ring';stage.append(ring);
    const specs=[['warmWater','Warm water',22,19],['healingLemon','Lemon',50,16],['healthyHoney','Honey',78,19]];
    const items=specs.map(([key,label,x,y],index)=>{const item=makeObject(key,`cup-item ordered-ingredient step-${index}`,label,x,y,16);item.dataset.step=String(index);return item;});
    let selected=null,step=0,stirring=false;
    const spoon=makeObject('healthySpoon','stir-spoon ordered-spoon','Stirring spoon',50,56,14);spoon.style.display='none';
    function refreshChoices(){items.forEach((item,index)=>{item.classList.toggle('is-next',index===step);item.classList.toggle('is-locked',index>step);item.disabled=index<step;item.setAttribute('aria-disabled',String(index!==step));});}
    function add(item){
      const index=Number(item.dataset.step);if(index!==step){wrong(item,`Add ${specs[step][1].toLowerCase()} next.`);say(`${specs[step][1]} next.`);return;}
      item.disabled=true;item.classList.remove('is-selected','is-next');item.classList.add('is-used');selected=null;step++;scene.src=`${assetRoot}v2/${states[step]}`;scene.alt=`Cozy mug after adding ${specs[index][1].toLowerCase()}`;chime();
      status.textContent=`${step} of 3 ingredients added. ${step<3?`${specs[step][1]} next.`:''}`;
      if(step<3){refreshChoices();say(`${specs[step][1]} next.`);return;}
      if(!stirring){stirring=true;spoon.style.display='';ring.classList.add('is-ready');status.textContent='Now stir the cozy honey cup!';say('Now stir the cozy honey cup.');setupStir(spoon,[50,69],()=>{scene.src=`${assetRoot}v2/${states[4]}`;scene.alt='Finished cozy honey lemon drink with heart-shaped steam';finish();});}
    }
    items.forEach(item=>{item.addEventListener('click',()=>{const index=Number(item.dataset.step);if(index!==step)return wrong(item,`${specs[step][1]} comes next.`);items.forEach(i=>i.classList.remove('is-selected'));selected=item;item.classList.add('is-selected');status.textContent=`Now tap the mug to add ${specs[index][1].toLowerCase()}.`;say(specs[index][1]);});enableDrag(item,obj=>overlap(obj.getBoundingClientRect(),mug.getBoundingClientRect())?add(obj):(resetPosition(obj),wrong(obj,'Take it to the cozy mug.')));});
    mug.addEventListener('click',()=>selected?add(selected):wrong(mug,`Choose ${specs[step][1].toLowerCase()} first.`));
    refreshChoices();status.textContent='Add the warm water first.';
  }

  function setupGame() { clearTimers(); ({good:setupGood,healthy:setupHealthy,natural:setupNatural,sweet:setupSweet,healing:setupHealing}[currentGame])(); }
  function openGame(choice) {
    choose(choice); closeCompletion(); video.pause(); title.textContent=games[currentGame].title; prompt.textContent=games[currentGame].prompt; setupGame();
    modal.hidden=false; document.body.classList.add('b-activity-open'); modal.querySelector('[data-close-game]')?.focus(); later(()=>say(games[currentGame].prompt),220);
  }
  function playSelected() {
    closeCompletion(); closeGame({restoreFocus:false}); const label=activeChoice.dataset.label; video.pause(); video.src=activeChoice.dataset.video;
    video.setAttribute('aria-label',`${label} video`); video.load(); nowPlaying.textContent=label; playButton.setAttribute('aria-label',`Play ${label} video`); playButton.hidden=true;
    player.scrollIntoView({block:'center',behavior:'smooth'}); video.play().catch(()=>playButton.hidden=false);
  }

  choices.forEach(choice=>choice.addEventListener('click',()=>openGame(choice)));
  modal.querySelector('[data-close-game]').addEventListener('click',()=>closeGame());
  modal.querySelector('[data-hear-prompt]').addEventListener('click',()=>say(games[currentGame].prompt));
  modal.querySelector('[data-watch-video]').addEventListener('click',playSelected);
  completion.querySelector('[data-watch-video]').addEventListener('click',playSelected);
  completion.querySelector('[data-close-completion]').addEventListener('click',()=>{closeCompletion();modal.hidden=false;document.body.classList.add('b-activity-open');activeChoice.focus();});
  completion.querySelector('[data-try-again]').addEventListener('click',()=>{closeCompletion();setupGame();modal.hidden=false;document.body.classList.add('b-activity-open');later(()=>stage.querySelector('button')?.focus(),0);});
  modal.addEventListener('click',event=>{if(event.target===modal)closeGame();});
  document.addEventListener('keydown',event=>{if(event.key!=='Escape')return;if(!completion.hidden)closeCompletion();else if(!modal.hidden)closeGame();});
  playButton.addEventListener('click',()=>{playButton.hidden=true;video.play().catch(()=>playButton.hidden=false);});
  video.addEventListener('play',()=>playButton.hidden=true); video.addEventListener('pause',()=>{if(!video.ended&&modal.hidden)playButton.hidden=false}); video.addEventListener('ended',()=>playButton.hidden=false);
})();
