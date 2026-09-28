import '../navigation/gp-sounds.js';

const tone = (right) => {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  const context = new AudioContext();
  const notes = right ? [523, 659, 784] : [220, 174];
  notes.forEach((frequency, i) => {
    const oscillator = context.createOscillator(), gain = context.createGain();
    const start = context.currentTime + i * .11;
    oscillator.type = right ? 'sine' : 'triangle'; oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(.0001, start); gain.gain.exponentialRampToValueAtTime(.18, start + .015); gain.gain.exponentialRampToValueAtTime(.0001, start + .18);
    oscillator.connect(gain); gain.connect(context.destination); oscillator.start(start); oscillator.stop(start + .2);
  });
};

const config = window.M8_READING_QUIZ;
if (config) {
  const root = document.createElement('div');
  root.className = 'm8rq'; root.hidden = true;
  root.innerHTML = `<section class="m8rq__dialog" role="dialog" aria-modal="true" aria-labelledby="m8rq-title"><header class="m8rq__head"><h2 id="m8rq-title">⭐ Reading Q&amp;A</h2><button class="m8rq__close" type="button" aria-label="Close activity">✕</button></header><div class="m8rq__body"><div class="m8rq__game"><div class="m8rq__progress"><strong></strong><div class="m8rq__dots" aria-hidden="true"></div></div><div class="m8rq__question"><button class="m8rq__speak" type="button" aria-label="Hear the question">🔊</button><h3></h3></div><div class="m8rq__visual"><img alt=""></div><div class="m8rq__choices"></div><p class="m8rq__feedback" role="status" aria-live="polite"></p></div><section class="m8rq__complete" hidden><div class="emoji">🏅📖</div><h3>Wonderful reading!</h3><p>You answered all four questions.</p><button class="m8rq__again" type="button">Play Again</button></section></div></section>`;
  document.body.append(root);
  const $ = s => root.querySelector(s), game=$('.m8rq__game'), done=$('.m8rq__complete'), qText=$('.m8rq__question h3'), visual=$('.m8rq__visual img'), choices=$('.m8rq__choices'), feedback=$('.m8rq__feedback'), progress=$('.m8rq__progress strong'), dots=$('.m8rq__dots');
  let index=0, locked=false;
  const say = text => { speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(text); u.lang='en-US'; u.rate=.86; u.pitch=1.08; speechSynthesis.speak(u); };
  const render=()=>{ locked=false; feedback.textContent=''; const q=config.questions[index]; progress.textContent=`Question ${index+1} of ${config.questions.length}`; dots.innerHTML=config.questions.map((_,i)=>`<i class="m8rq__dot ${i===index?'is-on':''}"></i>`).join(''); qText.textContent=q.question; visual.src=q.image; visual.alt=q.alt||'Picture clue'; choices.style.setProperty('--choice-count',q.choices.length); choices.innerHTML=''; q.choices.forEach((c,i)=>{const card=document.createElement('div');card.className='m8rq__choice-card';const b=document.createElement('button');b.type='button';b.className='m8rq__choice';b.setAttribute('aria-label',`Choose ${c.label}`);b.innerHTML=`<img src="${c.image}" alt=""><span>${c.label}</span>`;b.addEventListener('click',()=>choose(b,i,q));const listen=document.createElement('button');listen.type='button';listen.className='m8rq__choice-speak';listen.setAttribute('aria-label',`Hear ${c.label}`);listen.innerHTML='<span aria-hidden="true">🔊</span>';listen.addEventListener('click',event=>{event.stopPropagation();say(c.spoken||c.label);});card.append(b,listen);choices.append(card);}); };
  const choose=(button,i,q)=>{if(locked)return;if(i!==q.correct){button.classList.remove('is-wrong');void button.offsetWidth;button.classList.add('is-wrong');feedback.textContent='Try once more!';tone(false);return;}locked=true;button.classList.add('is-right');feedback.textContent=q.praise||'Great job!';tone(true);setTimeout(()=>{index++;if(index<config.questions.length)render();else{game.hidden=true;done.hidden=false;}},1050);};
  const openQuiz=()=>{index=0;game.hidden=false;done.hidden=true;root.hidden=false;render();$('.m8rq__close').focus();};
  document.querySelectorAll('[data-reading-quiz-open]').forEach(button=>button.addEventListener('click',openQuiz));
  $('.m8rq__close').addEventListener('click',()=>{root.hidden=true;speechSynthesis.cancel();}); $('.m8rq__speak').addEventListener('click',()=>say(config.questions[index].question)); $('.m8rq__again').addEventListener('click',()=>{index=0;game.hidden=false;done.hidden=true;render();}); root.addEventListener('click',e=>{if(e.target===root)root.hidden=true;}); document.addEventListener('keydown',e=>{if(e.key==='Escape')root.hidden=true;});
}
