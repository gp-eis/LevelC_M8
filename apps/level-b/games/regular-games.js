const board = document.querySelector('#game-content');
const status = document.querySelector('#game-status');
const mode = document.body.dataset.game;
const park = [
  { word: 'grass', emoji: '🌿' },
  { word: 'lamp', emoji: '💡' },
  { word: 'flowers', emoji: '🌸' },
  { word: 'bench', emoji: '🪑' },
  { word: 'trees', emoji: '🌳' },
  { word: 'people', emoji: '👥' }
];
const shuffle = list => [...list].sort(() => Math.random() - .5);
const feedback = (element, message, kind = '') => {
  element.textContent = message;
  element.className = `feedback${kind ? ` ${kind}` : ''}`;
};
const finish = (title, copy) => {
  board.className = '';
  board.innerHTML = `<div class="finish-panel"><div class="trophy">🏆🐝</div><h2>${title}</h2><p>${copy}</p><button class="game-button" type="button" onclick="location.reload()">Play Again</button></div>`;
  status.textContent = 'Complete!';
};

function memory() {
  let open = [], matched = 0, turns = 0;
  const cards = shuffle(park.flatMap((item, index) => [{ ...item, id: index }, { ...item, id: index }]));
  status.textContent = 'Find all 6 park-word pairs.';
  board.className = 'memory-grid';
  board.innerHTML = `${cards.map((item, i) => `<button class="memory-card" data-id="${item.id}" data-index="${i}" aria-label="Hidden park card"><span class="back">🐝</span><span class="face"><span class="emoji">${item.emoji}</span>${item.word}</span></button>`).join('')}<p id="memory-feedback" class="sr-feedback" role="status" aria-live="polite"></p>`;
  const live = board.querySelector('#memory-feedback');
  board.querySelectorAll('button').forEach(card => card.addEventListener('click', () => {
    if (open.length === 2 || card.classList.contains('is-open') || card.classList.contains('is-matched')) return;
    card.classList.add('is-open');
    card.setAttribute('aria-label', `${card.querySelector('.face').textContent.trim()} card`);
    open.push(card);
    if (open.length < 2) return;
    turns++;
    if (open[0].dataset.id === open[1].dataset.id) {
      open.forEach(item => item.classList.replace('is-open', 'is-matched'));
      live.textContent = 'Correct pair!';
      open = [];
      matched++;
      status.textContent = `${matched} of 6 pairs · ${turns} turns`;
      if (matched === 6) setTimeout(() => finish('Memory Garden Complete!', `You matched every park word in ${turns} turns.`), 350);
    } else {
      live.textContent = 'Those cards do not match. Try again.';
      setTimeout(() => {
        open.forEach(item => {
          item.classList.remove('is-open');
          item.setAttribute('aria-label', 'Hidden park card');
        });
        open = [];
      }, 650);
    }
  }));
}

function spin() {
  let round = 0;
  const deck = shuffle(park);
  status.textContent = 'Press Spin, press Stop, then flip the card.';
  board.innerHTML = `<div class="wheel-layout"><div><div id="wheel" class="wheel"></div><div class="wheel-actions"><button id="spin" class="spin-button" type="button">Spin the Honey Wheel</button><button id="stop" class="stop-button" type="button" hidden>Stop the Wheel</button></div></div><div id="spin-round" class="round-card"><h2>Ready to spin?</h2><p>You control when the wheel stops.</p><p id="wheel-feedback" class="feedback" role="status" aria-live="polite"></p></div></div>`;
  const wheel = board.querySelector('#wheel');
  const spinButton = board.querySelector('#spin');
  const stopButton = board.querySelector('#stop');
  const panel = board.querySelector('#spin-round');

  spinButton.addEventListener('click', () => {
    spinButton.hidden = true;
    stopButton.hidden = false;
    stopButton.disabled = false;
    wheel.classList.add('is-spinning');
    panel.innerHTML = '<h2>The wheel is spinning!</h2><p>Press Stop when you are ready.</p><p class="feedback" role="status" aria-live="polite">Wheel spinning. Stop it when you choose.</p>';
    stopButton.focus({ preventScroll: true });
  });

  stopButton.addEventListener('click', () => {
    stopButton.disabled = true;
    wheel.classList.remove('is-spinning');
    wheel.style.transform = `rotate(${720 + round * 67}deg)`;
    const item = deck[round];
    panel.innerHTML = `<h2>The wheel stopped!</h2><button id="flip-card" class="word-card" type="button" aria-pressed="false"><span class="word-card__front">Tap to flip the card</span><span class="word-card__back"><span class="round-emoji">${item.emoji}</span><strong>${item.word}</strong></span></button><p id="wheel-feedback" class="feedback" role="status" aria-live="polite">Flip the card to reveal the park word.</p>`;
    const card = panel.querySelector('#flip-card');
    card.addEventListener('click', () => {
      if (card.classList.contains('is-flipped')) return;
      card.classList.add('is-flipped');
      card.setAttribute('aria-pressed', 'true');
      feedback(panel.querySelector('#wheel-feedback'), `Great reveal — ${item.word}!`, 'good');
      round++;
      status.textContent = `${round} of ${deck.length} cards revealed`;
      if (round === deck.length) {
        setTimeout(() => finish('Honey Wheel Complete!', 'You spun, stopped, and flipped all six park cards.'), 600);
      } else {
        spinButton.hidden = false;
        spinButton.textContent = 'Spin Again';
        stopButton.hidden = true;
        spinButton.focus({ preventScroll: true });
      }
    });
    card.focus({ preventScroll: true });
  });
}

const pictureRounds = [
  { prompt: 'Look out! A bee is near the bench.', answer: 'bench' },
  { prompt: 'Look out! A bee is near the lamp.', answer: 'lamp' },
  { prompt: 'Look out! A bee is near the trees.', answer: 'trees' },
  { prompt: 'Look out! A bee is near the grass.', answer: 'grass' }
];
const pickRounds = [
  { prompt: 'How many bees are in the garden?', options: ['5', '6', '7', '8'], answer: '6' },
  { prompt: 'Which first letters complete bench, trees, lamp, people?', options: ['b · t · l · p', 'p · l · t · b', 'd · f · r · m'], answer: 'b · t · l · p' },
  { prompt: 'Which one does not belong in the park list?', options: ['grass', 'bench', 'classroom', 'trees'], answer: 'classroom' },
  { prompt: 'Where does the maze lead?', options: ['park gate', 'classroom', 'pond'], answer: 'park gate' },
  { prompt: 'Complete the supplied sentence: A bee is near ___.', options: ['the bench.', 'the fountain.', 'the store.'], answer: 'the bench.' },
  { prompt: 'Which supplied sentence matches the tree picture?', options: ['A bee is near the trees.', 'A bee is in a classroom.'], answer: 'A bee is near the trees.' }
];

function pictureMatch() {
  let index = 0;
  function render() {
    const round = pictureRounds[index];
    const choices = shuffle([park.find(item => item.word === round.answer), ...shuffle(park.filter(item => item.word !== round.answer)).slice(0, 3)]);
    status.textContent = `Picture ${index + 1} of ${pictureRounds.length}`;
    board.className = 'round-card';
    board.innerHTML = `<h2>${round.prompt}</h2><p>Choose the matching picture.</p><div class="answer-grid picture-choice-grid">${choices.map((item, choiceIndex) => `<button class="answer picture-answer" type="button" data-answer="${item.word}" aria-label="Picture choice ${choiceIndex + 1}: ${item.word}"><span class="picture-answer__visual" aria-hidden="true">${item.emoji}</span></button>`).join('')}</div><p id="feedback" class="feedback" role="status" aria-live="polite"></p>`;
    board.querySelectorAll('.answer').forEach(button => button.addEventListener('click', () => {
      const live = board.querySelector('#feedback');
      if (button.dataset.answer !== round.answer) {
        button.classList.add('wrong');
        feedback(live, 'Good try. Look closely and choose another picture.', 'try');
        return;
      }
      button.classList.add('correct');
      board.querySelectorAll('.answer').forEach(item => { item.disabled = true; });
      feedback(live, 'Excellent picture match!', 'good');
      setTimeout(() => {
        index++;
        index === pictureRounds.length
          ? finish('Picture Match Complete!', 'You matched every supplied bee sentence to its park picture.')
          : render();
      }, 450);
    }));
  }
  render();
}

function quiz(rounds) {
  let index = 0;
  function render() {
    const round = rounds[index];
    const options = round.options || shuffle([round.answer, ...shuffle(park.filter(item => item.word !== round.answer).map(item => item.word)).slice(0, 3)]);
    status.textContent = `Round ${index + 1} of ${rounds.length}`;
    board.className = 'round-card';
    board.innerHTML = `<h2>${round.prompt}</h2><div class="answer-grid">${options.map(option => `<button class="answer" type="button" data-answer="${option}">${option}</button>`).join('')}</div><p id="feedback" class="feedback" role="status" aria-live="polite"></p>`;
    board.querySelectorAll('.answer').forEach(button => button.addEventListener('click', () => {
      const live = board.querySelector('#feedback');
      if (button.dataset.answer !== round.answer) {
        button.classList.add('wrong');
        feedback(live, 'Good try. Check the book clue and choose again.', 'try');
        return;
      }
      button.classList.add('correct');
      board.querySelectorAll('.answer').forEach(item => item.disabled = true);
      feedback(live, 'Excellent choice!', 'good');
      setTimeout(() => {
        index++;
        index === rounds.length
          ? finish('Pick the Right One Complete!', 'You completed every Week 1 challenge.')
          : render();
      }, 450);
    }));
  }
  render();
}

if (mode === 'memory') memory();
else if (mode === 'spin') spin();
else if (mode === 'picture') pictureMatch();
else if (mode === 'pick') quiz(pickRounds);
