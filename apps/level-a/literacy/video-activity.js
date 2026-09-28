(() => {
  const video = document.getElementById('ees-video');
  const playerCard = document.querySelector('.ees-player-card');
  const playButton = document.getElementById('ees-play');
  const nowPlaying = document.getElementById('ees-now-playing');
  const choices = [...document.querySelectorAll('.ees-sentence')];
  const modal = document.getElementById('ees-game-modal');
  const dialog = modal?.querySelector('.ees-game-dialog');
  const title = modal?.querySelector('#ees-game-title');
  const prompt = modal?.querySelector('.ees-game-prompt');
  const stage = modal?.querySelector('.ees-game-stage');
  const result = modal?.querySelector('.ees-game-result');
  const resultSentence = modal?.querySelector('.ees-game-result-sentence');
  const statusLive = modal?.querySelector('[data-game-status-live]');
  const backgroundContent = [...document.body.children].filter((element) => element !== modal);

  if (!video || !playerCard || !playButton || !nowPlaying || !modal || !dialog || !stage || !choices.length) return;

  const GAMES = {
    'ball-sports': { title: 'Pack the Ball-Sports Locker!', prompt: 'Find the four ball sports.', sentence: 'I like ball sports.' },
    soccer: { title: 'Dribble to the Goal!', prompt: 'Follow the glowing cones to score.', sentence: 'I like soccer.' },
    basketball: { title: 'Bounce and Shoot!', prompt: 'Wait for the green glow, then shoot.', sentence: 'I like basketball.' },
    baseball: { title: 'Baseball Gear Match!', prompt: 'Match each piece of baseball gear.', sentence: 'I like baseball.' },
    volleyball: { title: 'Bump, Set, Spike!', prompt: 'Tap the volleyball moves in order.', sentence: 'I like volleyball.' }
  };

  let activeChoice = choices[0];
  let currentGame = activeChoice.dataset.game;
  let timers = [];
  let selectedPiece = null;

  const statusObserver = new MutationObserver(() => {
    if (statusLive) statusLive.textContent = stage.dataset.message || '';
  });
  statusObserver.observe(stage, { attributes: true, attributeFilter: ['data-message'] });

  const later = (fn, delay) => {
    const id = window.setTimeout(fn, delay);
    timers.push(id);
    return id;
  };

  function clearTimers() {
    timers.forEach(window.clearTimeout);
    timers = [];
  }

  function say(text) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.86;
    utterance.pitch = 1.08;
    window.setTimeout(() => window.speechSynthesis.speak(utterance), 40);
  }

  function shuffle(items) {
    const copy = [...items];
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const swap = Math.floor(Math.random() * (index + 1));
      [copy[index], copy[swap]] = [copy[swap], copy[index]];
    }
    return copy;
  }

  function setPlayButtonVisible(visible) {
    playButton.hidden = !visible;
  }

  function closeGame({ restoreFocus = true } = {}) {
    clearTimers();
    window.speechSynthesis?.cancel();
    modal.hidden = true;
    backgroundContent.forEach((element) => { element.inert = false; });
    document.body.classList.remove('ees-game-open');
    selectedPiece = null;
    if (restoreFocus) activeChoice?.focus();
  }

  function playSelected(choice = activeChoice) {
    activeChoice = choice;
    const source = choice.dataset.video;
    const label = choice.dataset.label;

    closeGame({ restoreFocus: false });
    choices.forEach((button) => {
      const selected = button === choice;
      button.classList.toggle('is-active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });

    video.pause();
    video.src = source;
    video.setAttribute('aria-label', `${label} video`);
    video.load();
    nowPlaying.textContent = label;
    playButton.setAttribute('aria-label', `Play ${label} video`);
    setPlayButtonVisible(false);
    playerCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    video.play().catch(() => setPlayButtonVisible(true));
  }

  function wrong(button, message) {
    button.classList.remove('is-wrong');
    void button.offsetWidth;
    button.classList.add('is-wrong');
    stage.dataset.message = message;
    later(() => button.classList.remove('is-wrong'), 650);
  }

  function finishGame() {
    clearTimers();
    stage.classList.add('is-complete');
    stage.dataset.message = 'Great job!';
    resultSentence.textContent = GAMES[currentGame].sentence;
    later(() => {
      result.hidden = false;
      say(GAMES[currentGame].sentence);
      result.querySelector('[data-watch-video]')?.focus();
    }, 650);
  }

  function ballMarkup(kind) {
    const files = {
      soccer: 'soccer-ball-3d-v2.png',
      basketball: 'basketball-3d-v2.png',
      baseball: 'baseball-3d-v2.png',
      volleyball: 'volleyball-3d-v2.png'
    };
    return `<img class="sport-ball-img ${kind}" src="https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-a/assets/media/games/week-1/${files[kind]}" alt="">`;
  }

  function setupBallSports() {
    const objects = shuffle([
      { id: 'soccer', label: 'Soccer', correct: true },
      { id: 'basketball', label: 'Basketball', correct: true },
      { id: 'baseball', label: 'Baseball', correct: true },
      { id: 'volleyball', label: 'Volleyball', correct: true },
      { id: 'trophy', label: 'Trophy', correct: false },
      { id: 'shoe', label: 'Running shoe', correct: false }
    ]);
    stage.className = 'ees-game-stage locker-game';
    stage.dataset.message = '0 of 4 ball sports packed';
    stage.innerHTML = `
      <div class="sports-locker" aria-label="Ball sports locker">
        <div class="locker-top"><span>TEAM</span><strong>BALL SPORTS</strong></div>
        <div class="locker-shelf" data-locker-shelf></div>
      </div>
      <div class="sports-object-grid">
        ${objects.map((item) => `<button type="button" class="sports-object ${item.correct ? 'is-ball' : 'is-decoy'}" data-object="${item.id}" data-correct="${item.correct}" aria-label="${item.label}">${item.correct ? ballMarkup(item.id) : item.id === 'trophy' ? '<img src="https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-a/assets/ui/sport-trophy-3d.webp" alt="">' : '<img class="sport-cleats-img" src="https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-a/assets/media/games/week-1/running-cleats-3d-v2.png" alt="">'}<span>${item.label}</span></button>`).join('')}
      </div>`;
    let packed = 0;
    const shelf = stage.querySelector('[data-locker-shelf]');
    stage.querySelectorAll('.sports-object').forEach((button) => {
      button.addEventListener('click', () => {
        if (button.disabled) return;
        if (button.dataset.correct !== 'true') {
          wrong(button, 'That is not a ball sport. Try another one!');
          return;
        }
        button.disabled = true;
        button.classList.add('is-packed');
        const kind = button.dataset.object;
        shelf.insertAdjacentHTML('beforeend', `<span class="locker-ball">${ballMarkup(kind)}</span>`);
        packed += 1;
        stage.dataset.message = `${packed} of 4 ball sports packed`;
        say(button.getAttribute('aria-label'));
        if (packed === 4) later(finishGame, 500);
      });
    });
  }

  function setupSoccer() {
    stage.className = 'ees-game-stage soccer-game';
    stage.dataset.message = 'Tap cone 1';
    stage.innerHTML = `
      <div class="soccer-field">
        <div class="soccer-goal" aria-hidden="true"><span class="goal-roof"></span><span class="goal-side"></span><span class="goal-net"></span><strong>GOAL!</strong></div>
        <div class="soccer-ball-wrap">${ballMarkup('soccer')}</div>
        ${[1, 2, 3].map((number) => `<button type="button" class="route-marker marker-${number}${number === 1 ? ' is-current' : ''}" data-route="${number}" aria-label="Cone ${number}"><img src="https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-a/assets/media/games/week-1/training-cone-3d-v2.png" alt=""><span>${number}</span></button>`).join('')}
        <button type="button" class="route-marker goal-marker" data-route="4" aria-label="Goal"><span>⚽</span></button>
      </div>`;
    let expected = 1;
    stage.querySelectorAll('[data-route]').forEach((button) => {
      button.addEventListener('click', () => {
        const step = Number(button.dataset.route);
        if (step !== expected) {
          wrong(button, `Find ${expected === 4 ? 'the goal' : `cone ${expected}`} first.`);
          return;
        }
        button.classList.remove('is-current');
        button.classList.add('is-done');
        button.disabled = true;
        stage.classList.add(`soccer-step-${step}`);
        expected += 1;
        const next = stage.querySelector(`[data-route="${expected}"]`);
        next?.classList.add('is-current');
        stage.dataset.message = expected === 5 ? 'Goal!' : `Tap ${expected === 4 ? 'the goal' : `cone ${expected}`}`;
        if (expected === 5) later(finishGame, 850);
      });
    });
  }

  function setupBasketball() {
    stage.className = 'ees-game-stage basketball-game';
    stage.dataset.message = 'Tap Start';
    stage.innerHTML = `
      <div class="basketball-court">
        <div class="basketball-hoop" aria-hidden="true"><span class="hoop-post"></span><span class="backboard"><i></i></span><span class="rim"></span><span class="net"></span></div>
        <img class="basketball-player-3d" src="https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-a/assets/media/games/week-1/regular/basketball-dribble-girl-v1.png" alt="Girl playing basketball">
        <div class="basketball-ball-wrap">${ballMarkup('basketball')}</div>
        <div class="shot-glow" aria-hidden="true"></div>
      </div>
      <div class="game-controls"><button type="button" class="game-control start-shot" data-start-shot>Start</button><button type="button" class="game-control shoot-ball" data-shoot disabled>Shoot!</button></div>`;
    const start = stage.querySelector('[data-start-shot]');
    const shoot = stage.querySelector('[data-shoot]');
    let ready = false;
    const begin = () => {
      clearTimers();
      ready = false;
      start.disabled = true;
      shoot.disabled = false;
      stage.classList.remove('shot-ready', 'shot-missed');
      stage.classList.add('ball-bouncing');
      stage.dataset.message = 'Watch the glow…';
      later(() => {
        ready = true;
        stage.classList.add('shot-ready');
        stage.dataset.message = 'Shoot now!';
      }, 700);
      later(() => {
        if (!ready) return;
        ready = false;
        stage.classList.remove('shot-ready', 'ball-bouncing');
        stage.classList.add('shot-missed');
        stage.dataset.message = 'Almost! Tap Start and try again.';
        start.disabled = false;
        shoot.disabled = true;
      }, 12000);
    };
    start.addEventListener('click', begin);
    shoot.addEventListener('click', () => {
      if (!ready) {
        wrong(shoot, 'Wait for the green glow.');
        return;
      }
      ready = false;
      clearTimers();
      start.disabled = true;
      shoot.disabled = true;
      stage.classList.remove('shot-ready', 'ball-bouncing');
      stage.classList.add('shot-made');
      stage.dataset.message = 'Swish!';
      later(finishGame, 1200);
    });
  }

  function gearMarkup(kind, shadow = false) {
    if (kind === 'ball') return ballMarkup('baseball');
    const file = kind === 'bat' ? 'baseball-bat-3d-v2.png' : 'baseball-glove-3d-v2.png';
    return `<img class="baseball-gear-img ${kind}${shadow ? ' shadow' : ''}" src="https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-a/assets/media/games/week-1/${file}" alt="">`;
  }

  function setupBaseball() {
    stage.className = 'ees-game-stage baseball-game';
    stage.dataset.message = 'Choose a piece, then its matching shadow.';
    const pieces = shuffle([
      { id: 'bat', label: 'Baseball bat' },
      { id: 'ball', label: 'Baseball' },
      { id: 'glove', label: 'Baseball glove' }
    ]);
    stage.innerHTML = `
      <div class="baseball-diamond">
        <div class="gear-slots">${pieces.map((piece) => `<button type="button" class="gear-slot" data-slot="${piece.id}" aria-label="${piece.label} shadow">${gearMarkup(piece.id, true)}<span>${piece.label}</span></button>`).join('')}</div>
      </div>
      <div class="gear-tray">${shuffle(pieces).map((piece) => `<button type="button" class="gear-piece" data-piece="${piece.id}" aria-label="${piece.label}">${gearMarkup(piece.id)}<span>${piece.label}</span></button>`).join('')}</div>`;
    let placed = 0;
    stage.querySelectorAll('.gear-piece').forEach((piece) => {
      piece.addEventListener('click', () => {
        selectedPiece?.classList.remove('is-selected');
        selectedPiece = piece;
        piece.classList.add('is-selected');
        stage.dataset.message = `Now tap the ${piece.getAttribute('aria-label')} shadow.`;
        say(piece.getAttribute('aria-label'));
      });
    });
    stage.querySelectorAll('.gear-slot').forEach((slot) => {
      slot.addEventListener('click', () => {
        if (!selectedPiece) {
          wrong(slot, 'Choose a piece first.');
          return;
        }
        if (selectedPiece.dataset.piece !== slot.dataset.slot) {
          wrong(slot, 'Try a different shadow.');
          return;
        }
        slot.classList.add('is-filled');
        slot.innerHTML = selectedPiece.innerHTML;
        slot.disabled = true;
        selectedPiece.disabled = true;
        selectedPiece.classList.add('is-placed');
        selectedPiece.classList.remove('is-selected');
        selectedPiece = null;
        placed += 1;
        stage.dataset.message = placed === 3 ? 'All the baseball gear is ready!' : `${placed} of 3 pieces matched`;
        if (placed === 3) later(finishGame, 650);
      });
    });
  }

  function setupVolleyball() {
    stage.className = 'ees-game-stage volleyball-game';
    stage.dataset.message = 'Tap Bump';
    stage.innerHTML = `
      <div class="volleyball-court">
        <div class="volleyball-net" aria-hidden="true"><span></span></div>
        <div class="volley-action-card player-left">
          <img class="volley-player-3d" src="https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-a/assets/media/games/week-1/regular/volleyball-bump-girl-v1.png" alt="Girl demonstrating a volleyball move">
          <span class="volley-action-label" aria-live="polite">Ready!</span>
        </div>
        <span class="volley-motion volley-motion-one" aria-hidden="true"></span>
        <span class="volley-motion volley-motion-two" aria-hidden="true"></span>
      </div>
      <div class="game-controls volley-controls">${['Bump', 'Set', 'Spike!'].map((label, index) => `<button type="button" class="game-control${index === 0 ? ' is-current' : ''}" data-volley="${index}">${label}</button>`).join('')}</div>`;
    let expected = 0;
    const labels = ['Bump', 'Set', 'Spike'];
    stage.querySelectorAll('[data-volley]').forEach((button) => {
      button.addEventListener('click', () => {
        const step = Number(button.dataset.volley);
        if (step !== expected) {
          wrong(button, `Tap ${labels[expected]} next.`);
          return;
        }
        button.classList.remove('is-current');
        button.classList.add('is-done');
        button.disabled = true;
        stage.classList.add(`volley-step-${step + 1}`);
        const actionLabel = stage.querySelector('.volley-action-label');
        if (actionLabel) actionLabel.textContent = `${labels[step]}!`;
        expected += 1;
        stage.querySelector(`[data-volley="${expected}"]`)?.classList.add('is-current');
        stage.dataset.message = expected === 3 ? 'Spike!' : `Now tap ${labels[expected]}`;
        say(labels[step]);
        if (expected === 3) later(finishGame, 1050);
      });
    });
  }

  function setupGame() {
    clearTimers();
    selectedPiece = null;
    result.hidden = true;
    stage.className = 'ees-game-stage';
    stage.innerHTML = '';
    stage.removeAttribute('data-message');
    const setups = {
      'ball-sports': setupBallSports,
      soccer: setupSoccer,
      basketball: setupBasketball,
      baseball: setupBaseball,
      volleyball: setupVolleyball
    };
    setups[currentGame]?.();
  }

  function focusFirstGameControl() {
    stage.querySelector('button:not([disabled])')?.focus();
  }

  function openGame(choice) {
    activeChoice = choice;
    currentGame = choice.dataset.game;
    const game = GAMES[currentGame];
    video.pause();
    title.textContent = game.title;
    prompt.textContent = game.prompt;
    dialog.dataset.game = currentGame;
    setupGame();
    modal.hidden = false;
    backgroundContent.forEach((element) => { element.inert = true; });
    document.body.classList.add('ees-game-open');
    modal.querySelector('[data-close-game]')?.focus();
    later(() => say(game.prompt), 220);
  }

  choices.forEach((choice, index) => {
    choice.setAttribute('aria-pressed', String(index === 0));
    choice.addEventListener('click', () => openGame(choice));
  });

  modal.querySelectorAll('[data-watch-video]').forEach((button) => button.addEventListener('click', () => playSelected(activeChoice)));
  modal.querySelector('[data-close-game]').addEventListener('click', () => closeGame());
  modal.querySelector('[data-hear-prompt]').addEventListener('click', () => say(GAMES[currentGame].prompt));
  modal.querySelector('[data-play-again]').addEventListener('click', () => {
    setupGame();
    later(focusFirstGameControl, 0);
  });
  modal.addEventListener('click', (event) => {
    if (event.target === modal) closeGame();
  });
  document.addEventListener('keydown', (event) => {
    if (modal.hidden) return;
    if (event.key === 'Escape') {
      closeGame();
      return;
    }
    if (event.key !== 'Tab') return;
    const focusable = [...dialog.querySelectorAll('button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])')]
      .filter((element) => !element.closest('[hidden]'));
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  playButton.addEventListener('click', () => {
    setPlayButtonVisible(false);
    video.play().catch(() => setPlayButtonVisible(true));
  });
  video.addEventListener('play', () => setPlayButtonVisible(false));
  video.addEventListener('pause', () => {
    if (!video.ended && modal.hidden) setPlayButtonVisible(true);
  });
  video.addEventListener('ended', () => setPlayButtonVisible(true));
})();
