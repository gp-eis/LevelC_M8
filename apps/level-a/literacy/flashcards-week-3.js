(() => {
  const cards=[
  {
    "id": "run",
    "label": "Run",
    "phrase": "run",
    "image": "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-a/assets/media/flashcards/week-3/run-flashcard-v1.png?asset=10bfa0eab4e6",
    "sentence": "Soccer players run."
  },
  {
    "id": "pass",
    "label": "Pass",
    "phrase": "pass",
    "image": "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-a/assets/media/flashcards/week-3/pass-flashcard-v1.png?asset=5d5ac07bc28b",
    "sentence": "Soccer players pass."
  },
  {
    "id": "tackle",
    "label": "Tackle",
    "phrase": "tackle",
    "image": "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-a/assets/media/flashcards/week-3/tackle-flashcard-v1.png?asset=ffdc045c5ec2",
    "sentence": "Soccer players tackle."
  },
  {
    "id": "kick",
    "label": "Kick",
    "phrase": "kick",
    "image": "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-a/assets/media/flashcards/week-3/kick-flashcard-v1.png?asset=5dfaa04c53b4",
    "sentence": "Soccer players kick."
  },
  {
    "id": "jump",
    "label": "Jump",
    "phrase": "jump",
    "image": "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-a/assets/media/flashcards/week-3/jump-flashcard-v1.png?asset=b933411261f4",
    "sentence": "Soccer players jump."
  }
];
  const byId=id=>cards.find(card=>card.id===id),random=()=>cards[Math.floor(Math.random()*cards.length)];
  const shuffle=list=>[...list].map(value=>({value,sort:Math.random()})).sort((a,b)=>a.sort-b.sort).map(({value})=>value);
  // Recorded narration will be connected when supplied; no synthetic voice fallback.
  const utter=(text,done)=>{done?.()};
  const sayLesson=card=>utter(card.label,()=>setTimeout(()=>utter(card.sentence),350));
  const image=(card,alt=true)=>`<img src="${card.image}" alt="${alt?`Flashcard: ${card.label}`:''}">`;

  const feature=document.querySelector('[data-feature-card]'),thumbs=document.querySelector('[data-card-list]');let current=cards[0];
  function showLesson(card=current,speak=false){current=card;feature.innerHTML=image(card);feature.dataset.card=card.id;thumbs.innerHTML=cards.map(item=>`<button class="fc-thumb${item.id===card.id?' is-active':''}" type="button" data-card="${item.id}" aria-label="Show ${item.label}">${image(item,false)}</button>`).join('');thumbs.querySelectorAll('[data-card]').forEach(button=>button.onclick=()=>showLesson(byId(button.dataset.card),true));if(speak)sayLesson(card)}
  feature.disabled=true; // Display only until recorded audio is available.

  document.querySelectorAll('[data-tab]').forEach(tab=>tab.onclick=()=>{document.querySelectorAll('[data-tab]').forEach(button=>{const active=button===tab;button.classList.toggle('is-active',active);button.setAttribute('aria-pressed',active)});document.querySelectorAll('[data-panel]').forEach(panel=>{const active=panel.dataset.panel===tab.dataset.tab;panel.hidden=!active;panel.classList.toggle('is-active',active)});if(tab.dataset.tab==='fast')newFast();if(tab.dataset.tab==='spot')newSpot();if(tab.dataset.tab==='sentence')newSentence()});

  const fastStage=document.querySelector('[data-fast-stage]');let fastCard=null,fastTimer=0;
  function coverFast(){fastStage.querySelector('.fc-curtain')?.classList.remove('is-hidden')}
  function flashFast(){clearTimeout(fastTimer);const curtain=fastStage.querySelector('.fc-curtain');curtain.classList.add('is-hidden');fastTimer=setTimeout(coverFast,300)}
  function newFast(){clearTimeout(fastTimer);fastCard=random();fastStage.innerHTML=`${image(fastCard,false)}<div class="fc-curtain">?</div>`;fastTimer=setTimeout(flashFast,250)}
  document.querySelector('[data-fast-peek]').onclick=flashFast;document.querySelector('[data-fast-show]').onclick=()=>{clearTimeout(fastTimer);fastStage.querySelector('.fc-curtain').classList.add('is-hidden');fastStage.querySelector('img').alt=`Flashcard: ${fastCard.label}`;utter(fastCard.label)};document.querySelector('[data-fast-new]').onclick=newFast;

  const spot=document.querySelector('[data-spot-stage]');let spotCard,spotX=50,spotY=50;
  const setSpot=()=>{spot.style.setProperty('--spot-x',`${spotX}%`);spot.style.setProperty('--spot-y',`${spotY}%`)};
  function newSpot(){spotCard=random();spot.className='fc-spot-stage';spot.innerHTML=image(spotCard,false);spotX=spotY=50;setSpot()}
  function revealSpot(){spot.classList.add('is-revealed');spot.querySelector('img').alt=`Flashcard: ${spotCard.label}`;utter(spotCard.label)}
  const moveSpot=event=>{const rect=spot.getBoundingClientRect(),point=event.touches?.[0]||event;spotX=Math.max(0,Math.min(100,(point.clientX-rect.left)/rect.width*100));spotY=Math.max(0,Math.min(100,(point.clientY-rect.top)/rect.height*100));setSpot()};
  spot.addEventListener('pointermove',moveSpot);spot.addEventListener('touchmove',moveSpot,{passive:true});spot.addEventListener('keydown',event=>{const moves={ArrowLeft:[-8,0],ArrowRight:[8,0],ArrowUp:[0,-8],ArrowDown:[0,8]};if(moves[event.key]){event.preventDefault();spotX=Math.max(0,Math.min(100,spotX+moves[event.key][0]));spotY=Math.max(0,Math.min(100,spotY+moves[event.key][1]));setSpot()}else if(event.key==='Enter'||event.key===' '){event.preventDefault();revealSpot()}});document.querySelector('[data-spot-reveal]').onclick=revealSpot;document.querySelector('[data-spot-new]').onclick=newSpot;

  const scatter=document.querySelector('[data-sentence-choices]'),blank=document.querySelector('[data-sentence-blank]'),status=document.querySelector('[data-sentence-status]');
  function place(card){blank.textContent=card.phrase;scatter.querySelectorAll('.fc-mini').forEach(node=>node.classList.toggle('is-used',node.dataset.card===card.id));status.textContent=card.sentence;utter(card.sentence)}
  function newSentence(){blank.textContent='______';status.textContent='Drag or tap any card into the blank.';scatter.innerHTML=shuffle(cards).map(card=>`<button class="fc-mini" type="button" draggable="true" data-card="${card.id}" aria-label="Use ${card.label}">${image(card,false)}</button>`).join('');scatter.querySelectorAll('.fc-mini').forEach(button=>{button.onclick=()=>place(byId(button.dataset.card));button.addEventListener('dragstart',event=>event.dataTransfer.setData('text/plain',button.dataset.card))})}
  blank.addEventListener('dragover',event=>{event.preventDefault();blank.classList.add('is-over')});blank.addEventListener('dragleave',()=>blank.classList.remove('is-over'));blank.addEventListener('drop',event=>{event.preventDefault();blank.classList.remove('is-over');const card=byId(event.dataTransfer.getData('text/plain'));if(card)place(card)});document.querySelector('[data-sentence-new]').onclick=newSentence;
  showLesson();newSpot();newSentence();
})();
