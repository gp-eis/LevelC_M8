const stage = document.querySelector('.week2-stage');
const targets = [...stage.querySelectorAll('.week2-target')];
const startLayer = stage.querySelector('.week2-start');
const startButton = startLayer.querySelector('button');
const feedback = document.querySelector('[data-feedback]');
const resetButton = document.querySelector('[data-reset]');
const completion = document.querySelector('[data-completion]');
const video = completion.querySelector('video');
const staticCelebration = completion.querySelector('[data-static-celebration]');
const lines = stage.querySelector('.week2-lines');
const kind = document.body.dataset.activity;
let active = false;
let complete = false;
let selected = null;
let previewLine = null;
let matched = new Set();
let returnFocus = null;
let celebrationTimer = 0;
window.addEventListener('pagehide', () => window.clearTimeout(celebrationTimer));
const colours = { run: '#cf438b', jump: '#267bbd', kick: '#e3ac11', tackle: '#338144' };
const matchTotal = new Set(targets.map(target => target.dataset.match).filter(Boolean)).size;
const counters = [...stage.querySelectorAll('[data-counter]')];
let mazePosition = { x: 222, y: 653 };
let mazeProgress = 0;
let movingFrame = 0;
const maze = stage.querySelector('.w34-maze');
const mazeRoute = [[222,653],[420,653],[420,475],[320,475],[320,385],[490,385],[490,455],[650,455],[650,500],[790,500]];
const mazeGuideSamples = mazeRoute.flatMap((point,index) => {
  if (!index) return [{ x: point[0], y: point[1] }];
  const previous = mazeRoute[index - 1];
  const distance = Math.hypot(point[0] - previous[0], point[1] - previous[1]);
  const steps = Math.max(1, Math.ceil(distance / 5));
  return Array.from({ length: steps }, (_, step) => ({
    x: previous[0] + (point[0] - previous[0]) * (step + 1) / steps,
    y: previous[1] + (point[1] - previous[1]) * (step + 1) / steps
  }));
});

function closeCelebration() {
  video.pause();
  completion.hidden = true;
  document.body.classList.remove('completion-open');
  (returnFocus && !returnFocus.disabled ? returnFocus : resetButton).focus({ preventScroll: true });
}
function finish() {
  if (complete) return;
  complete = true;
  stage.querySelectorAll('button:not(.week2-start button)').forEach(target => target.disabled = true);
  stopMoving();
  feedback.textContent = 'Great job!';
  returnFocus = document.activeElement;
  celebrationTimer = window.setTimeout(showCelebration, 500);
}
function showCelebration() {
  celebrationTimer = 0;
  if (!complete) return;
  completion.hidden = false;
  document.body.classList.add('completion-open');
  completion.querySelector('[data-close]').focus();
  video.hidden = false;
  staticCelebration.hidden = true;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    video.hidden = true;
    staticCelebration.hidden = false;
  } else {
    video.currentTime = 0;
    video.play().catch(() => { video.hidden = true; staticCelebration.hidden = false; });
  }
}
function reset() {
  window.clearTimeout(celebrationTimer);
  active = false;
  complete = false;
  selected = null;
  clearPreview();
  matched = new Set();
  lines?.replaceChildren();
  feedback.textContent = '';
  const answerFill = stage.querySelector('[data-answer-fill]');
  if (answerFill) answerFill.textContent = '';
  stopMoving();
  counters.forEach(counter => { counter.dataset.value = "0"; counter.classList.remove("is-correct"); counter.querySelector("output").textContent = "0"; counter.querySelectorAll("button").forEach(button => button.disabled = true); });
  stage.querySelectorAll("[data-move]").forEach(button => button.disabled = true);
  mazePosition = { x: 222, y: 653 }; mazeProgress = 0; paintMaze();
  targets.forEach(target => {
    target.disabled = true;
    target.classList.remove('is-correct', 'is-selected', 'is-wrong');
    target.setAttribute('aria-pressed', 'false');
  });
  startLayer.hidden = false;
  startButton.focus({ preventScroll: true });
}
function wrong(target) {
  feedback.textContent = 'Try again.';
  target.classList.remove('is-wrong');
  void target.offsetWidth;
  target.classList.add('is-wrong');
  setTimeout(() => target.classList.remove('is-wrong'), 450);
}
function addLine(a, b) {
  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  for (const [key, value] of Object.entries({x1:a.dataset.x, y1:a.dataset.y, x2:b.dataset.x, y2:b.dataset.y, stroke:colours[a.dataset.match]})) line.setAttribute(key, value);
  lines.append(line);
}
function clearPreview() {
  previewLine?.remove();
  previewLine = null;
}
function previewTo(x, y) {
  if (!selected || !lines || !active || complete) return;
  if (!previewLine) {
    previewLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    previewLine.style.pointerEvents = 'none';
    lines.append(previewLine);
  }
  for (const [key, value] of Object.entries({x1:selected.dataset.x, y1:selected.dataset.y, x2:x, y2:y, stroke:colours[selected.dataset.match] || '#267bbd'})) previewLine.setAttribute(key, value);
}
stage.addEventListener('pointermove', event => {
  if (kind !== 'connect' || !selected || !lines) return;
  const box = lines.getBoundingClientRect();
  if (!box.width || !box.height) return;
  previewTo(Math.max(0, Math.min(100, (event.clientX-box.left)/box.width*100)), Math.max(0, Math.min(100, (event.clientY-box.top)/box.height*100)));
});
stage.addEventListener('keydown', event => {
  if (kind === 'connect' && event.key === 'Escape') {
    selected?.classList.remove('is-selected');
    selected?.setAttribute('aria-pressed', 'false');
    selected = null; clearPreview();
  }
});
targets.forEach(target => target.addEventListener('focus', () => {
  if (kind === 'connect' && selected && target.dataset.side !== selected.dataset.side) previewTo(target.dataset.x, target.dataset.y);
}));
function connect(target) {
  if (matched.has(target.dataset.match)) return;
  if (!selected || selected.dataset.side === target.dataset.side) {
    targets.forEach(item => { item.classList.remove('is-selected'); if (!item.classList.contains('is-correct')) item.setAttribute('aria-pressed', 'false'); });
    selected = target;
    previewTo(target.dataset.x, target.dataset.y);
    target.classList.add('is-selected');
    target.setAttribute('aria-pressed', 'true');
    feedback.textContent = target.dataset.side === 'word' ? 'Choose the matching picture.' : 'Choose the matching words.';
    return;
  }
  if (selected.dataset.match !== target.dataset.match) { wrong(target); return; }
  addLine(selected, target);
  clearPreview();
  matched.add(target.dataset.match);
  [selected, target].forEach(item => { item.classList.remove('is-selected'); item.classList.add('is-correct'); item.setAttribute('aria-pressed', 'true'); item.disabled = true; });
  selected = null;
  feedback.textContent = `${matched.size} of ${matchTotal} matched!`;
  if (matched.size === matchTotal) finish();
}
targets.forEach(target => target.addEventListener('click', () => {
  if (!active || complete) return;
  if (kind === 'connect') { connect(target); return; }
  if (target.dataset.correct !== 'true') { wrong(target); return; }
  target.classList.add('is-correct');
  target.setAttribute('aria-pressed', 'true');
  target.disabled = true;
  matched.add(target.dataset.id);
  const answerFill = stage.querySelector('[data-answer-fill]');
  if (answerFill) answerFill.textContent = target.dataset.id;
  const total = targets.filter(item => item.dataset.correct === 'true').length;
  feedback.textContent = `${matched.size} of ${total}!`;
  if (matched.size === total) finish();
}));
startButton.addEventListener('click', event => {
  active = true;
  startLayer.hidden = true;
  stage.querySelectorAll('button:not(.week2-start button)').forEach(target => target.disabled = false);
  // Do not make the first answer look selected after a mouse/touch start.
  if (event.detail === 0) (targets[0] || stage.querySelector('[data-step]') || maze)?.focus({ preventScroll: true });
});
resetButton.addEventListener('click', reset);
completion.querySelector('[data-close]').addEventListener('click', closeCelebration);
completion.querySelector('[data-try-again]').addEventListener('click', () => { closeCelebration(); reset(); });
video.addEventListener('error', () => { video.hidden = true; staticCelebration.hidden = false; });
completion.addEventListener('keydown', event => {
  if (event.key === 'Escape') { event.preventDefault(); closeCelebration(); }
  if (event.key === 'Tab') {
    const buttons = [...completion.querySelectorAll('button')];
    const first = buttons[0], last = buttons.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
});
counters.forEach(counter => {
  counter.querySelectorAll('[data-step]').forEach(button => button.addEventListener('click', () => {
    if (!active || complete || counter.classList.contains('is-correct')) return;
    const value = Math.max(0, Math.min(Number(counter.dataset.max), Number(counter.dataset.value) + Number(button.dataset.step)));
    counter.dataset.value = String(value);
    counter.querySelector('output').textContent = String(value);
    feedback.textContent = '';
  }));
  counter.querySelector('[data-check]').addEventListener('click', () => {
    if (!active || complete || counter.classList.contains('is-correct')) return;
    if (Number(counter.dataset.value) !== Number(counter.dataset.answer)) { wrong(counter); return; }
    counter.classList.add('is-correct');
    counter.querySelectorAll('button').forEach(button => button.disabled = true);
    matched.add(counter.dataset.id);
    feedback.textContent = `${matched.size} of ${counters.length}!`;
    if (matched.size === counters.length) finish();
  });
});

// Original printed maze wall geometry in its 1059-by-835 coordinate space.
// Segment collision checks prevent dragging, tapping or fast keys through walls.
const mazeWalls = [
 [242,272,524,25],[242,272,26,352],[242,684,26,110],[242,769,524,25],
 [740,272,26,213],[740,553,26,241],[525,284,17,141],[589,347,163,18],
 [525,408,169,17],[676,408,18,71],[342,408,122,17],[447,408,17,326],
 [447,517,141,17],[570,517,18,137],[504,639,179,18],[504,639,18,95],
 [666,639,17,58],[640,578,111,18],[570,697,18,84],[255,718,209,16],
 [255,578,107,18],[344,504,18,92]
];
function paintMaze() {
  if (!maze) return;
  maze.querySelector('[data-maze-player]').setAttribute('transform', `translate(${mazePosition.x} ${mazePosition.y})`);
}
function canMove(x,y) {
  const radius=9;
  if (x < 220 || x > 783 || y < 285 || y > 779) return false;
  return !mazeWalls.some(([left,top,width,height]) => x+radius>left && x-radius<left+width && y+radius>top && y-radius<top+height);
}
function moveMaze(dx,dy) {
  if (!maze || !active || complete) return;
  const steps=Math.ceil(Math.max(Math.abs(dx),Math.abs(dy)));
  let moved=false;
  for(let step=0;step<steps;step++){
    const x=mazePosition.x+dx/steps,y=mazePosition.y+dy/steps;
    if(!canMove(x,y)) break;
    mazePosition={x,y};moved=true;
  }
  if(moved){
    paintMaze();
    if(mazePosition.x>=778 && mazePosition.y>493 && mazePosition.y<542) finish();
  }
}
function stopMoving(){cancelAnimationFrame(movingFrame);movingFrame=0;}
function holdMove(dx,dy){
  stopMoving();let previous=performance.now();
  function frame(now){
    const amount=Math.min(30,(now-previous)*.17);previous=now;
    moveMaze(dx*amount,dy*amount);
    if(active&&!complete) movingFrame=requestAnimationFrame(frame);
  }
  movingFrame=requestAnimationFrame(frame);
}
if(maze){
  // Image generation may distort maze walls. Draw the playable board from the
  // source geometry so the visible walls and collision model are identical.
  const ns='http://www.w3.org/2000/svg';
  const board=document.createElementNS(ns,'g');
  board.setAttribute('aria-hidden','true');
  const rectangle=(x,y,width,height,fill,rx=0)=>{
    const rect=document.createElementNS(ns,'rect');
    for(const [name,value] of Object.entries({x,y,width,height,fill,rx}))rect.setAttribute(name,value);
    board.append(rect);return rect;
  };
  rectangle(237,261,536,557,'#e4c5f5',6);
  rectangle(242,272,524,522,'#fffdfb',3);
  for(const [x,y,width,height] of mazeWalls){
    const wall=rectangle(x,y,width,height,'#333d41',2);
    wall.setAttribute('stroke','#1d2529');wall.setAttribute('stroke-width','1');
    rectangle(x+2,y+2,Math.max(1,width-4),2,'#647077',1);
  }
  maze.insertBefore(board,maze.firstChild);
  const directions={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]};
  stage.querySelectorAll('[data-move]').forEach(button=>{
    const [dx,dy]=directions[https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-a/literacy/button.dataset.move];
    button.addEventListener('pointerdown',event=>{if(!active||complete)return;event.preventDefault();button.setPointerCapture(event.pointerId);moveMaze(dx*10,dy*10);holdMove(dx,dy);});
    for(const name of ['pointerup','pointercancel','lostpointercapture'])button.addEventListener(name,stopMoving);
    button.addEventListener('click',event=>{if(event.detail===0)moveMaze(dx*15,dy*15);});
  });
  maze.addEventListener('keydown',event=>{
    const move={ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right'}[event.key];
    if(move){event.preventDefault();const [dx,dy]=directions[move];moveMaze(dx*12,dy*12);}
  });
  let dragging=false;
  function pointerPoint(event){const box=maze.getBoundingClientRect();return{x:(event.clientX-box.left)/box.width*1059,y:(event.clientY-box.top)/box.height*835};}
  function moveToward(event){
    const point=pointerPoint(event);
    const last=mazeGuideSamples.length-1;
    // Treat the store entrance as a generous finish target. Young children do
    // not need to land on the final path pixel for the activity to complete.
    if(point.x>=748&&point.y>=420&&point.y<=610){
      mazeProgress=last;mazePosition={...mazeGuideSamples[last]};paintMaze();finish();return;
    }
    const start=Math.max(0,mazeProgress-32),end=Math.min(last,mazeProgress+180);
    let nearest=mazeProgress,distance=Infinity;
    for(let index=start;index<=end;index++){
      const candidate=mazeGuideSamples[index],nextDistance=Math.hypot(point.x-candidate.x,point.y-candidate.y);
      if(nextDistance<distance){distance=nextDistance;nearest=index;}
    }
    // The wide magnetic tolerance prevents the character from sticking when a
    // finger moves quickly, while the ordered search still follows the route.
    if(distance>155)return;
    mazeProgress=nearest;mazePosition={...mazeGuideSamples[nearest]};paintMaze();
    if(nearest>=last-10)finish();
  }
  maze.addEventListener('pointerdown',event=>{
    if(!active||complete)return;
    const point=pointerPoint(event);
    // Begin dragging only from the boy-and-ball character, never teleport to a distant path.
    if(!event.target.closest?.('[data-maze-player]'))return;
    event.preventDefault();maze.focus({preventScroll:true});dragging=true;maze.setPointerCapture(event.pointerId);
  });
  maze.addEventListener('pointermove',event=>{
    if(!dragging)return;
    event.preventDefault();
    const events=event.getCoalescedEvents?.()||[event];
    for(const sample of events)moveToward(sample);
  });
  for(const name of ['pointerup','pointercancel','lostpointercapture'])maze.addEventListener(name,()=>dragging=false);
}
window.addEventListener('blur',stopMoving);
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopMoving();});

reset();
