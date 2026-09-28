(() => {
  'use strict';
  const modal = document.querySelector('#week3-game');
  const board = modal.querySelector('#w3-game-board');
  const feedback = modal.querySelector('#w3-game-feedback');
  const prompt = modal.querySelector('#w3-game-prompt');
  const celebration = modal.querySelector('[data-week3-completion]');
  const goodJob = celebration.querySelector('video');
  const base = 'https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-a/assets/media/literacy/week-3-games/';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let game = 'run', launch, done = false, revision = 0, frame = 0;
  const timers = new Set();
  const speech = window.speechSynthesis;
  const introductions = {
    run: 'Soccer players run! Follow the blue path around the cones.',
    pass: 'Soccer players pass! Find your open teammate and pass the ball.',
    tackle: 'Soccer players tackle! Move into the same lane. Win the ball when it glows blue.',
    kick: 'Soccer players kick! Aim for a star, then kick the ball into the goal.',
    jump: 'Soccer players jump! Jump when the star is inside the blue zone.'
  };
  function silence() { if (speech) speech.cancel(); }
  function say(line) {
    if (!speech || !window.SpeechSynthesisUtterance || done || !modal.open) return;
    silence();
    const utterance = new SpeechSynthesisUtterance(line);
    utterance.lang = 'en-US'; utterance.rate = .92; utterance.pitch = 1.08; utterance.volume = .9;
    const voices = speech.getVoices();
    utterance.voice = voices.find(voice => /^en[-_]US$/i.test(voice.lang || "")) || null;
    speech.speak(utterance);
  }
  const art = (name, alt, classes = '') => `<img class="w3-art ${classes}" src="${base}${name}.png" alt="${alt}" draggable="false">`;
  function later(callback, ms) {
    const stamp = revision;
    const id = setTimeout(() => { timers.delete(id); if (stamp === revision && modal.open) callback(); }, ms);
    timers.add(id);
  }
  function cleanup() {
    silence();
    revision++;
    timers.forEach(clearTimeout); timers.clear();
    cancelAnimationFrame(frame); frame = 0;
    goodJob.pause(); goodJob.currentTime = 0; celebration.hidden = true;
  }
  function wrong(button) {
    feedback.textContent = 'Try again!';
    button.classList.remove('w3-wrong'); void button.offsetWidth;
    button.classList.add('w3-wrong');
    later(() => button.classList.remove('w3-wrong'), 420);
  }
  function stars(count, total = 3) {
    const rack = board.querySelector('.w3-stars');
    rack.setAttribute('aria-label', `${count} of ${total} stars`);
    [...rack.children].forEach((star, i) => star.classList.toggle('earned', i < count));
  }
  function complete() {
    if (done) return;
    done = true; cancelAnimationFrame(frame); silence();
    feedback.textContent = 'Great job!';
    later(() => {
      celebration.hidden = false;
      goodJob.hidden = reduced.matches;
      celebration.querySelector('p').hidden = !reduced.matches;
      if (!reduced.matches) goodJob.play().catch(() => {
        goodJob.hidden = true; celebration.querySelector('p').hidden = false;
      });
      celebration.querySelector('button').focus();
    }, 500);
  }
  function scene(total = 3) {
    board.innerHTML = `<div class="w3-stars" aria-label="0 of ${total} stars">${Array.from({ length: total }, () => art('star', '', 'w3-earned-star')).join('')}</div><div class="w3-field"></div><div class="w3-controls"></div>`;
    return [board.querySelector('.w3-field'), board.querySelector('.w3-controls')];
  }
  function button(label, action, parent, attributes = '') {
    const element = document.createElement('button');
    element.type = 'button'; element.textContent = label;
    if (attributes) element.setAttribute('aria-label', attributes);
    element.addEventListener('click', action); parent.append(element); return element;
  }
  function pose(image, name, alt) { image.src = `${base}${name}.png`; image.alt = alt; }

  function runGame() {
    prompt.textContent = 'Drag the player along the blue path, around the cones. Collect five stars!';
    const [field, controls] = scene(5);
    field.classList.add('w3-run-course');
    // Coordinates represent the player's feet, keeping his entire body in the field.
    const route = [{x:10,y:80},{x:25,y:39},{x:40,y:80},{x:55,y:39},{x:70,y:80},{x:86,y:39}];
    const points = route.map(point => `${point.x},${point.y}`).join(' ');
    field.innerHTML = `<svg class="w3-route" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><polyline points="${points}" class="w3-route-under"/><polyline points="${points}" class="w3-route-line"/></svg><div class="w3-course-cones">${route.slice(1).map((point,i) => `<img class="w3-art w3-course-cone" src="${base}cone.png" alt="Cone ${i+1}" style="left:${point.x}%;top:${point.y + (i % 2 ? -16 : 16)}%" draggable="false">`).join('')}</div><div class="w3-route-stars">${route.slice(1).map((point,i) => `<img class="w3-art w3-route-star" src="${base}star.png" alt="Waypoint ${i+1}" style="left:${point.x}%;top:${point.y}%" draggable="false">`).join('')}</div><button type="button" class="w3-trace-runner" aria-label="Drag soccer player along the path, or use arrow keys to move" aria-describedby="w3-run-keyboard">${art('run-a','Soccer player running')}</button>`;
    const runner = field.querySelector('.w3-trace-runner');
    controls.id = 'w3-run-keyboard';
    controls.textContent = 'Keyboard: focus the player, then use ↑ ↓ ← → to follow the path.';
    let position = {...route[0]}, segment = 0, pointer = null;
    function draw() {
      runner.style.left = `${position.x}%`; runner.style.top = `${position.y}%`;
      runner.setAttribute('aria-label', `Soccer player, ${segment} of 5 stars. Use arrow keys to follow the path.`);
    }
    function moveTo(wanted) {
      if (done) return;
      const distance = Math.hypot(wanted.x-position.x,wanted.y-position.y);
      // Reject teleports instead of advancing automatically toward a distant cursor.
      if (distance > 12) { feedback.textContent = 'Keep your pointer near the player and follow the path.'; return; }
      const start = route[segment], end = route[segment+1];
      const vx=end.x-start.x, vy=end.y-start.y, length=vx*vx+vy*vy;
      const t=Math.max(0,Math.min(1,((wanted.x-start.x)*vx+(wanted.y-start.y)*vy)/length));
      const closest={x:start.x+t*vx,y:start.y+t*vy};
      if (Math.hypot(wanted.x-closest.x,wanted.y-closest.y)>5.5) {
        feedback.textContent='Stay on the blue path. You can keep going!';
        runner.classList.add('w3-off-route'); return;
      }
      runner.classList.remove('w3-off-route');
      position={x:Math.max(7,Math.min(92,wanted.x)),y:Math.max(33,Math.min(88,wanted.y))};
      // Keep the initial sprite and its scale: alternate artwork changed the child's identity.
      if (Math.hypot(position.x-end.x,position.y-end.y)<4.5) {
        position={...end}; segment++; stars(segment,5);
        field.querySelectorAll('.w3-route-star')[segment-1].classList.add('earned');
        field.querySelectorAll('.w3-course-cone')[segment-1].classList.add('passed');
        feedback.textContent=`${segment} of 5 stars!`;
        if (segment===5) { draw(); complete(); return; }
        say(segment===1?'Great running! Go around the next cone.':segment===3?'Keep running! Two more stars.':'Nice running!');
      }
      draw();
    }
    function location(event) {
      const box=field.getBoundingClientRect();
      return {x:(event.clientX-box.left)/box.width*100,y:(event.clientY-box.top)/box.height*100};
    }
    runner.onpointerdown=event=>{
      if(done)return; event.preventDefault(); runner.focus();
      const point=location(event); pointer={id:event.pointerId,dx:point.x-position.x,dy:point.y-position.y};
      runner.setPointerCapture(event.pointerId);
    };
    runner.onpointermove=event=>{
      if(!pointer||pointer.id!==event.pointerId)return;
      event.preventDefault();
      // Coalesced events keep fast but legitimate dragging smooth on supported devices.
      const samples=event.getCoalescedEvents ? event.getCoalescedEvents() : [event];
      (samples.length?samples:[event]).forEach(sample=>{
        const point=location(sample); moveTo({x:point.x-pointer.dx,y:point.y-pointer.dy});
      });
    };
    runner.onpointerup=runner.onpointercancel=()=>{pointer=null;};
    runner.onlostpointercapture=()=>{pointer=null;};
    runner.onkeydown=event=>{
      const directions={ArrowLeft:[-1.7,0],ArrowRight:[1.7,0],ArrowUp:[0,-1.7],ArrowDown:[0,1.7]};
      if(!directions[event.key])return; event.preventDefault();
      const [dx,dy]=directions[event.key]; moveTo({x:position.x+dx,y:position.y+dy});
    };
    draw();
  }

  function passGame() {
    prompt.textContent = 'Choose the open teammate. Drag the ball to them—or tap the ball, then your teammate!';
    const [field, controls] = scene();
    field.innerHTML = `${art('ready', 'Your player', 'w3-passer')}<button type="button" class="w3-ball-button" aria-label="Select ball to pass">${art('ball', 'Soccer ball')}</button><div class="w3-receivers"></div>`;
    const ball = field.querySelector('.w3-ball-button');
    const receivers = field.querySelector('.w3-receivers');
    const passer = field.querySelector('.w3-passer');
    let count = 0, armed = false, busy = false, openLane = 1, chosen = -1;
    function round() {
      openLane = (count + 1) % 3; chosen = -1; armed = false; busy = false;
      ball.style.left = '12%'; ball.style.top = '76%'; ball.classList.remove('selected');
      ball.setAttribute('aria-pressed', 'false'); pose(passer, 'ready', 'Your player ready to pass');
      receivers.replaceChildren();
      for (let lane = 0; lane < 3; lane++) {
        const receiver = button('', () => choose(lane), receivers);
        receiver.className = 'w3-receiver'; receiver.dataset.lane = lane;
        receiver.setAttribute('aria-label', lane === openLane ? `Open teammate ${lane + 1}` : `Teammate ${lane + 1}, blocked by defender`);
        receiver.innerHTML = art(`teammate-${lane+1}`, `Teammate ${lane+1}`) + (lane !== openLane ? art('opponent', 'Defender', 'w3-blocker') : '<span>Open!</span>');
      }
    }
    function choose(lane) {
      if (done || busy) return;
      const target = receivers.children[lane];
      if (lane !== openLane) { wrong(target); return; }
      chosen = lane;
      [...receivers.children].forEach((receiver, i) => receiver.classList.toggle('selected', i === lane));
      if (armed) pass(); else feedback.textContent = 'Great! Now tap or drag the ball to your teammate.';
    }
    function pass() {
      if (busy || done || chosen !== openLane) return;
      busy = true; armed = false;
      const target = receivers.children[chosen];
      const fieldBox = field.getBoundingClientRect(), targetBox = target.getBoundingClientRect();
      ball.style.left = `${(targetBox.left + targetBox.width / 2 - fieldBox.left) / fieldBox.width * 100}%`;
      ball.style.top = '45%';
      pose(passer, 'kick', 'Boy passing the ball');
      feedback.textContent = 'Pass!';
      later(() => {
        target.querySelector('img').alt = `Teammate ${chosen+1} receives the ball and runs`;
        target.classList.add('w3-receiving-run'); ball.classList.add('w3-ball-follow');
        feedback.textContent = 'Receive and run!'; say('Great pass! Receive the ball and run!');
        later(() => {
          count++; stars(count); ball.classList.remove('w3-ball-follow');
          if (count === 3) complete(); else round();
        }, reduced.matches ? 250 : 850);
      }, reduced.matches ? 100 : 650);
    }
    ball.onclick = () => {
      if (done || busy) return;
      armed = true; ball.classList.add('selected'); ball.setAttribute('aria-pressed', 'true');
      if (chosen === openLane) pass(); else feedback.textContent = 'Choose the open teammate!';
    };
    // Pointer events support touch and mouse without relying on HTML drag and drop.
    let pointer = null;
    ball.onpointerdown = event => {
      if (done || busy) return;
      pointer = { id: event.pointerId, x: event.clientX, y: event.clientY };
      ball.setPointerCapture(event.pointerId);
    };
    ball.onpointerup = event => {
      if (!pointer || pointer.id !== event.pointerId) return;
      const moved = Math.hypot(event.clientX - pointer.x, event.clientY - pointer.y) > 12;
      pointer = null;
      if (!moved || busy || done) return;
      const target = [...receivers.children].find(receiver => {
        const box = receiver.getBoundingClientRect();
        return event.clientX >= box.left && event.clientX <= box.right && event.clientY >= box.top && event.clientY <= box.bottom;
      });
      if (target) { armed = true; choose(Number(target.dataset.lane)); }
    };
    ball.onpointercancel = () => { pointer = null; };
    controls.textContent = 'Three teamwork passes!'; round();
  }

  function tackleGame() {
    prompt.textContent = 'Move into the ball’s lane. Tackle when the ball glows blue!';
    const [field, controls] = scene();
    field.innerHTML = `<div class="w3-lane-lines"></div>${art('opponent', 'Opponent with the ball', 'w3-opponent')}${art('ready', 'Your defender', 'w3-defender')}${art('ball', 'Soccer ball', 'w3-tackle-ball')}<span class="w3-cue" role="status">Watch the ball</span>`;
    const defender = field.querySelector('.w3-defender'), opponent = field.querySelector('.w3-opponent');
    const ball = field.querySelector('.w3-tackle-ball'), cue = field.querySelector('.w3-cue');
    let lane = 1, targetLane = 1, count = 0, exposed = false, busy = false;
    const laneX = position => `${18 + position * 32}%`;
    function move(direction) {
      if (busy || done) return;
      lane = Math.max(0, Math.min(2, lane + direction)); defender.style.left = laneX(lane);
      feedback.textContent = `${['Left', 'Middle', 'Right'][lane]} lane`;
    }
    button('◀ Left', () => move(-1), controls);
    const tackle = button('Win the ball!', event => {
      if (busy || done) return;
      if (lane !== targetLane || !exposed) { wrong(event.currentTarget); return; }
      busy = true; exposed = false; cue.textContent = 'You won the ball!'; say('Great tackle! You won the ball!');
      ball.classList.remove('exposed'); tackle.classList.remove('w3-cue-ready');
      pose(defender, 'kick', 'Defender reaches a foot toward the ball');
      defender.classList.add('w3-contest'); opponent.classList.add('w3-contest-opponent');
      ball.style.top = '75%'; ball.style.left = laneX(lane); ball.classList.add('w3-possession');
      later(() => {
        count++; stars(count); defender.classList.remove('w3-contest'); opponent.classList.remove('w3-contest-opponent');
        pose(defender, 'ready', 'Defender has won possession');
        if (count === 3) complete(); else nextRound();
      }, reduced.matches ? 250 : 850);
    }, controls);
    button('Right ▶', () => move(1), controls);
    function pulse() {
      if (done) return;
      if (!busy) {
        exposed = reduced.matches || !exposed;
        ball.classList.toggle('exposed', exposed);
        cue.textContent = exposed ? 'Tackle now!' : 'Watch the ball';
        tackle.classList.toggle('w3-cue-ready', exposed);
      }
      later(pulse, exposed ? 2400 : 1000);
    }
    function nextRound() {
      busy = false; exposed = false; targetLane = [1, 2, 0][count];
      ball.classList.remove('exposed'); tackle.classList.remove('w3-cue-ready');
      cue.textContent = 'Watch the ball';
      opponent.style.left = laneX(targetLane); ball.style.left = laneX(targetLane);
      ball.style.top = '43%'; ball.classList.remove('w3-possession');
    }
    defender.style.left = laneX(lane); nextRound(); pulse();
  }

  function kickGame() {
    prompt.textContent = 'Aim for a target! Pull back from the ball and release—or choose a target, then Kick.';
    const [field, controls] = scene();
    field.innerHTML = `${art('goal', 'Soccer goal', 'w3-goal')}<div class="w3-goal-targets"></div>${art('ready', 'Boy ready to kick', 'w3-kicker')}<button type="button" class="w3-shot-ball" aria-label="Drag back from the ball to aim and release">${art('ball', 'Soccer ball')}</button>`;
    const targets = field.querySelector('.w3-goal-targets'), ball = field.querySelector('.w3-shot-ball');
    const kicker = field.querySelector('.w3-kicker');
    let selected = 1, busy = false, count = 0;
    const hit = new Set();
    for (let index = 0; index < 3; index++) {
      const target = button('', () => { if (busy || done || hit.has(index)) return; selected = index; updateAim(); }, targets);
      target.innerHTML = art('star', `Target ${index + 1}`);
      target.setAttribute('aria-label', `Aim at ${['left', 'middle', 'right'][index]} target`);
    }
    function updateAim() {
      [...targets.children].forEach((target, index) => {
        target.classList.toggle('selected', index === selected); target.setAttribute('aria-pressed', String(index === selected));
      });
      feedback.textContent = `Aim: ${['left', 'middle', 'right'][selected]}`;
    }
    function shoot() {
      if (busy || done) return;
      if (hit.has(selected)) { feedback.textContent = 'Choose a new star!'; return; }
      busy = true; const shot = selected;
      pose(kicker, 'kick', 'Boy kicking toward the target');
      const targetBox = targets.children[shot].getBoundingClientRect(), fieldBox = field.getBoundingClientRect();
      ball.style.left = `${(targetBox.left + targetBox.width / 2 - fieldBox.left) / fieldBox.width * 100}%`;
      ball.style.top = `${(targetBox.top + targetBox.height / 2 - fieldBox.top) / fieldBox.height * 100}%`;
      ball.classList.add('w3-shot');
      later(() => {
        hit.add(shot); count++; stars(count); targets.children[shot].classList.add('hit');
        targets.children[shot].disabled = true; feedback.textContent = 'Goal!'; say('Goal! What a kick!');
        if (count === 3) { complete(); return; }
        later(() => {
          ball.style.left = '50%'; ball.style.top = '82%'; ball.classList.remove('w3-shot');
          pose(kicker, 'ready', 'Boy ready for another kick'); busy = false;
          selected = [0, 1, 2].find(index => !hit.has(index)); updateAim();
        }, 500);
      }, reduced.matches ? 100 : 700);
    }
    button('Kick!', shoot, controls);
    let drag = null;
    ball.onpointerdown = event => {
      if (done || busy) return;
      drag = { id: event.pointerId, x: event.clientX, y: event.clientY };
      ball.setPointerCapture(event.pointerId);
    };
    ball.onpointermove = event => {
      if (!drag || drag.id !== event.pointerId) return;
      const dx = event.clientX - drag.x;
      selected = dx > 22 ? 0 : dx < -22 ? 2 : 1; updateAim();
    };
    ball.onpointerup = event => {
      if (!drag || drag.id !== event.pointerId) return;
      const distance = Math.hypot(event.clientX - drag.x, event.clientY - drag.y); drag = null;
      if (distance > 12) shoot(); else feedback.textContent = 'Choose a star, then press Kick!';
    };
    ball.onpointercancel = () => { drag = null; };
    updateAim();
  }

  function jumpGame() {
    prompt.textContent = reduced.matches ? 'Jump and collect three stars!' : 'Jump when the star enters the blue zone!';
    const [field, controls] = scene();
    field.innerHTML = `${art('ready', 'Boy ready to jump', 'w3-jumper')}<div class="w3-jump-track"><span class="w3-jump-zone"></span>${art('star', 'Moving star', 'w3-moving-star')}</div>`;
    const jumper = field.querySelector('.w3-jumper'), star = field.querySelector('.w3-moving-star');
    let count = 0, busy = false, position = .5;
    function tick(time) {
      if (done || !modal.open) return;
      position = reduced.matches ? .5 : .5 + Math.sin(time / 1250) * .4;
      star.style.left = `${position * 100}%`;
      jump.classList.toggle('w3-cue-ready', position >= .28 && position <= .72);
      frame = requestAnimationFrame(tick);
    }
    const jump = button('Jump!', event => {
      if (done || busy) return;
      if (!reduced.matches && (position < .28 || position > .72)) { wrong(event.currentTarget); return; }
      busy = true;
      pose(jumper, 'jump', 'Boy jumping with both feet off the ground'); jumper.classList.add('jumping');
      star.classList.add('collected'); feedback.textContent = 'Jump!'; say('Jump! You caught a star!');
      later(() => {
        pose(jumper, 'ready', 'Boy lands safely'); jumper.classList.remove('jumping');
        count++; stars(count);
        if (count === 3) complete(); else { busy = false; star.classList.remove('collected'); }
      }, reduced.matches ? 250 : 900);
    }, controls);
    frame = requestAnimationFrame(tick);
  }

  function build() {
    cleanup(); done = false; feedback.textContent = ''; board.replaceChildren();
    modal.querySelector('h2').textContent = `Soccer players ${game}.`;
    ({ run: runGame, pass: passGame, tackle: tackleGame, kick: kickGame, jump: jumpGame })[game]();
    later(() => say(introductions[game]), 200);
  }
  function close() { cleanup(); modal.close(); if (launch) launch.focus(); }
  document.querySelectorAll('[data-clip]').forEach(choice => choice.addEventListener('click', () => {
    launch = choice; game = choice.dataset.clip; document.querySelector('#week3-video').pause();
    modal.showModal(); build(); modal.querySelector('[data-game-close]').focus();
  }));
  modal.querySelectorAll('[data-game-watch]').forEach(button => { button.onclick = () => {
    const selected = game; close(); document.dispatchEvent(new CustomEvent('week3-watch-video', { detail: selected }));
  }; });
  ['close', 'done'].forEach(name => { modal.querySelector(`[data-game-${name}]`).onclick = close; });
  ['reset', 'again'].forEach(name => {
    modal.querySelector(`[data-game-${name}]`).onclick = () => { build(); modal.querySelector('[data-game-close]').focus(); };
  });
  modal.addEventListener('cancel', event => { event.preventDefault(); close(); });
  modal.addEventListener('close', () => { if (!modal.open) cleanup(); }); window.addEventListener('pagehide', cleanup);
  modal.addEventListener('keydown', event => {
    if (event.key !== 'Tab' || celebration.hidden) return;
    const buttons = celebration.querySelectorAll('button');
    const first = buttons[0], last = buttons[buttons.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
})();
