const board = document.querySelector('#game-content');
const status = document.querySelector('#game-status');
const mode = document.body.dataset.game;
const words = [
  { word: 'bug', family: 'ug' }, { word: 'mug', family: 'ug' }, { word: 'rug', family: 'ug' },
  { word: 'plum', family: 'um' }, { word: 'gum', family: 'um' }, { word: 'drum', family: 'um' },
  { word: 'nun', family: 'un' }, { word: 'bun', family: 'un' }, { word: 'run', family: 'un' }, { word: 'sun', family: 'un' }
];
const sourceFrames = [
  { prompt: 'I see a ___ and a mug on the rug.', answer: 'bug' },
  { prompt: 'I see a bug and a ___ on the rug.', answer: 'mug' },
  { prompt: 'I see a bug and a mug on the ___.', answer: 'rug' },
  { prompt: 'I see a ___ and gum on the drum.', answer: 'plum' },
  { prompt: 'I see a plum and ___ on the drum.', answer: 'gum' },
  { prompt: 'I see a plum and gum on the ___.', answer: 'drum' },
  { prompt: 'I see a ___ with a bun run in the sun.', answer: 'nun' },
  { prompt: 'I see a nun with a ___ run in the sun.', answer: 'bun' },
  { prompt: 'I see a nun with a bun ___ in the sun.', answer: 'run' },
  { prompt: 'I see a nun with a bun run in the ___.', answer: 'sun' }
];
const pictureEmoji = { bug: '🐞', mug: '☕', drum: '🥁', run: '🏃', sun: '☀️' };
const shuffle = list => [...list].sort(() => Math.random() - .5);
const setFeedback = (element, message, kind = '') => {
  element.textContent = message;
  element.className = `feedback${kind ? ` ${kind}` : ''}`;
};
const liveFeedback = '<p id="feedback" class="feedback" role="status" aria-live="polite"></p>';
const pictureVisual = word => pictureEmoji[word]
  ? `<span class="phonics-picture phonics-picture--emoji" aria-hidden="true">${pictureEmoji[word]}</span>`
  : `<span class="phonics-picture phonics-picture--${word}" aria-hidden="true"><span></span></span>`;
const finish = title => {
  board.innerHTML = `<div class="finish-panel"><div class="trophy">🏆🔤</div><h2>${title}</h2><p>You practiced the Month 8 short-u families: ug, um, and un.</p><button class="game-button" type="button" onclick="location.reload()">Play Again</button></div>`;
  status.textContent = 'Complete!';
};

function findWord() {
  const families = ['ug', 'um', 'un'];
  let index = 0;
  function render() {
    const family = families[index];
    const targetCount = words.filter(item => item.family === family).length;
    let found = 0;
    status.textContent = `Family ${index + 1} of ${families.length} · 0 of ${targetCount} found`;
    board.innerHTML = `<div class="round-card"><div class="family-badge">-${family}</div><h2>Find every word ending in ${family}.</h2><p>Select all ${targetCount} words in this family.</p><div class="answer-grid find-word-grid">${shuffle(words).map(item => `<button class="answer" type="button" data-family="${item.family}">${item.word}</button>`).join('')}</div>${liveFeedback}</div>`;
    board.querySelectorAll('.answer').forEach(button => button.addEventListener('click', () => {
      const live = board.querySelector('#feedback');
      if (button.dataset.family !== family) {
        button.classList.add('wrong');
        setFeedback(live, `That word does not end in ${family}. Try another.`, 'try');
        return;
      }
      button.classList.add('correct');
      button.disabled = true;
      found++;
      status.textContent = `Family ${index + 1} of ${families.length} · ${found} of ${targetCount} found`;
      setFeedback(live, `${found} of ${targetCount} ${family} words found.`, 'good');
      if (found === targetCount) setTimeout(() => { index++; index === families.length ? finish('Find the Word Complete!') : render(); }, 450);
    }));
  }
  render();
}

function buildWord() {
  let index = 0;
  const rounds = shuffle(words).slice(0, 8);
  let built = '';
  function render() {
    const item = rounds[index];
    built = '';
    status.textContent = `Word ${index + 1} of ${rounds.length}`;
    board.innerHTML = `<div class="round-card"><div class="family-badge">-${item.family}</div><h2>Build the ${item.family} word that begins with ${item.word[0]}.</h2><p>Drag a tile to the answer line, or tap it.</p><div id="build-line" class="build-line build-drop-zone" aria-label="Built word drop zone"></div><div id="tile-bank" class="tile-bank">${shuffle([...item.word]).map((letter, i) => `<button class="letter-tile" type="button" draggable="true" data-letter="${letter}" data-i="${i}" aria-label="Letter ${letter}. Drag or tap to add.">${letter}</button>`).join('')}</div>${liveFeedback}<button id="clear" class="game-button" type="button">Clear</button></div>`;
    const line = board.querySelector('#build-line');
    const live = board.querySelector('#feedback');
    let draggedTile = null;
    const placeTile = tile => {
      if (!tile || tile.disabled) return;
      built += tile.dataset.letter;
      tile.disabled = true;
      line.textContent = built;
      if (!item.word.startsWith(built)) {
        setFeedback(live, 'That order does not match. Clear and try again.', 'try');
      } else if (built === item.word) {
        setFeedback(live, `Great building: ${item.word}!`, 'good');
        board.querySelectorAll('.letter-tile').forEach(item => item.disabled = true);
        setTimeout(() => { index++; index === rounds.length ? finish('Build the Word Complete!') : render(); }, 450);
      }
    };
    board.querySelectorAll('.letter-tile').forEach(tile => {
      tile.addEventListener('click', () => placeTile(tile));
      tile.addEventListener('dragstart', event => {
        draggedTile = tile;
        tile.classList.add('is-dragging');
        event.dataTransfer?.setData('text/plain', tile.dataset.i);
      });
      tile.addEventListener('dragend', () => {
        tile.classList.remove('is-dragging');
        line.classList.remove('is-drop-target');
        draggedTile = null;
      });
    });
    line.addEventListener('dragover', event => { event.preventDefault(); line.classList.add('is-drop-target'); });
    line.addEventListener('dragleave', () => line.classList.remove('is-drop-target'));
    line.addEventListener('drop', event => {
      event.preventDefault();
      line.classList.remove('is-drop-target');
      placeTile(draggedTile);
    });
    board.querySelector('#clear').addEventListener('click', render);
  }
  render();
}

function maze() {
  const familyOrder = ['ug', 'um', 'un'];
  const routePositions = [[0, 1, 4], [6, 7, 4], [2, 5, 8, 7]];
  let step = 0;
  function render() {
    const family = familyOrder[step];
    const correct = shuffle(words.filter(word => word.family === family));
    const wrong = shuffle(words.filter(word => word.family !== family)).slice(0, 9 - correct.length);
    const route = routePositions[step];
    const cells = Array(9).fill(null);
    route.forEach((position, routeStep) => { cells[position] = { ...correct[routeStep], routeStep }; });
    wrong.forEach(item => { cells[cells.indexOf(null)] = { ...item, routeStep: -1 }; });
    status.textContent = `Path ${step + 1} of 3`;
    board.innerHTML = `<div class="round-card"><h2>Travel the ${family} word maze.</h2><p>Start at the glowing entrance. Move through ${correct.length} connected ${family} words in order.</p><div class="maze-grid maze-path-grid">${cells.map(item => `<button class="maze-cell${item.routeStep === 0 ? ' is-next' : ''}" type="button" data-route-step="${item.routeStep}" data-family="${item.family}">${item.routeStep === 0 ? '<span class="maze-marker" aria-hidden="true">START</span>' : ''}${item.word}${item.routeStep === correct.length - 1 ? '<span class="maze-marker" aria-hidden="true">FINISH</span>' : ''}</button>`).join('')}</div>${liveFeedback}</div>`;
    let found = 0;
    board.querySelectorAll('.maze-cell').forEach(cell => cell.addEventListener('click', () => {
      const live = board.querySelector('#feedback');
      if (Number(cell.dataset.routeStep) !== found) {
        cell.classList.add('wrong');
        setFeedback(live, `Follow the connected path in order and choose the next ${family} word.`, 'try');
        return;
      }
      cell.classList.add('is-path');
      cell.classList.remove('wrong');
      cell.classList.remove('is-next');
      cell.disabled = true;
      found++;
      status.textContent = `Path ${step + 1} of 3 · ${found} of ${correct.length} words`;
      setFeedback(live, `${found} of ${correct.length} path words found.`, 'good');
      board.querySelector(`[data-route-step="${found}"]`)?.classList.add('is-next');
      if (found === correct.length) setTimeout(() => { step++; step === 3 ? finish('Letter Maze Complete!') : render(); }, 450);
    }));
  }
  render();
}

function pictureMatch() {
  let index = 0;
  const rounds = shuffle(sourceFrames).slice(0, 8);
  function render() {
    const round = rounds[index];
    const options = shuffle([round.answer, ...shuffle(words.filter(word => word.word !== round.answer).map(word => word.word)).slice(0, 3)]);
    status.textContent = `Source sentence ${index + 1} of ${rounds.length}`;
    board.innerHTML = `<div class="round-card"><div class="family-badge">Short u</div><h2>Choose the picture that completes the book sentence.</h2><p class="source-sentence">${round.prompt}</p><div class="answer-grid picture-choice-grid">${options.map((option, choiceIndex) => `<button class="answer picture-answer" type="button" data-answer="${option}" aria-label="Picture choice ${choiceIndex + 1}: ${option}">${pictureVisual(option)}</button>`).join('')}</div>${liveFeedback}</div>`;
    board.querySelectorAll('.answer').forEach(button => button.addEventListener('click', () => {
      const live = board.querySelector('#feedback');
      if (button.dataset.answer !== round.answer) {
        button.classList.add('wrong');
        setFeedback(live, 'That picture does not complete the sentence. Try another.', 'try');
        return;
      }
      button.classList.add('correct');
      board.querySelectorAll('.answer').forEach(item => item.disabled = true);
      setFeedback(live, 'Source sentence matched!', 'good');
      setTimeout(() => { index++; index === rounds.length ? finish('Picture Match Complete!') : render(); }, 400);
    }));
  }
  render();
}

if (mode === 'find') findWord();
else if (mode === 'build') buildWord();
else if (mode === 'maze') maze();
else if (mode === 'phonics-picture') pictureMatch();
