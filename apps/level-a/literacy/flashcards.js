(() => {
  const cards=[
    {id:'ball-sports',label:'Ball sports',phrase:'ball sports',image:'https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-a/assets/media/flashcards/week-1/ball-sports-flashcard-v2.png?asset=e5c63a00214b',sentence:'I like ball sports.'},
    {id:'soccer',label:'Soccer',phrase:'soccer',image:'https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-a/assets/media/flashcards/week-1/soccer-flashcard-v2.png?asset=31087110e170',sentence:'I like soccer.'},
    {id:'basketball',label:'Basketball',phrase:'basketball',image:'https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-a/assets/media/flashcards/week-1/basketball-flashcard-v2.png?asset=d33ed2f093a1',sentence:'I like basketball.'},
    {id:'baseball',label:'Baseball',phrase:'baseball',image:'https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-a/assets/media/flashcards/week-1/baseball-flashcard-v2.png?asset=9cc1efc62fdc',sentence:'I like baseball.'},
    {id:'volleyball',label:'Volleyball',phrase:'volleyball',image:'https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-a/assets/media/flashcards/week-1/volleyball-flashcard-v2.png?asset=77f33c6b923a',sentence:'I like volleyball.'}
  ];
  const byId=id=>cards.find(card=>card.id===id),random=()=>cards[Math.floor(Math.random()*cards.length)];
  const shuffle=list=>[...list].map(value=>({value,sort:Math.random()})).sort((a,b)=>a.sort-b.sort).map(({value})=>value);
  const utter=(text,done)=>{if(!('speechSynthesis' in window)){done?.();return}speechSynthesis.cancel();const voice=new SpeechSynthesisUtterance(text);voice.lang='en-US';voice.rate=.86;voice.pitch=1.08;voice.onend=()=>done?.();speechSynthesis.speak(voice)};
  const sayLesson=card=>utter(card.label,()=>setTimeout(()=>utter(card.sentence),350));
  const image=(card,alt=true)=>`<img src="${card.image}" alt="${alt?`Flashcard: ${card.label}`:''}">`;

  const feature=document.querySelector('[data-feature-card]'),thumbs=document.querySelector('[data-card-list]');let current=cards[0];
  function showLesson(card=current,speak=false){current=card;feature.innerHTML=image(card);feature.dataset.card=card.id;thumbs.innerHTML=cards.map(item=>`<button class="fc-thumb${item.id===card.id?' is-active':''}" type="button" data-card="${item.id}" aria-label="Show ${item.label}">${image(item,false)}</button>`).join('');thumbs.querySelectorAll('[data-card]').forEach(button=>button.onclick=()=>showLesson(byId(button.dataset.card),true));if(speak)sayLesson(card)}
  feature.onclick=()=>sayLesson(current);

  document.querySelectorAll('[data-tab]').forEach(tab=>tab.onclick=()=>{document.querySelectorAll('[data-tab]').forEach(button=>{const active=button===tab;button.classList.toggle('is-active',active);button.setAttribute('aria-pressed',active)});document.querySelectorAll('[data-panel]').forEach(panel=>{const active=panel.dataset.panel===tab.dataset.tab;panel.hidden=!active;panel.classList.toggle('is-active',active)});if(tab.dataset.tab==='fast')newFast();if(tab.dataset.tab==='spot')newSpot();if(tab.dataset.tab==='sentence')newSentence()});

  const fastStage=document.querySelector('[data-fast-stage]');let fastCard=null,fastTimer=0;
  function coverFast(){fastStage.querySelector('.fc-curtain')?.classList.remove('is-hidden')}
  function flashFast(){clearTimeout(fastTimer);const curtain=fastStage.querySelector('.fc-curtain');curtain.classList.add('is-hidden');fastTimer=setTimeout(coverFast,300)}
  function newFast(){clearTimeout(fastTimer);fastCard=random();fastStage.innerHTML=`${image(fastCard,false)}<div class="fc-curtain">?</div>`;setTimeout(flashFast,250)}
  document.querySelector('[data-fast-peek]').onclick=flashFast;document.querySelector('[data-fast-show]').onclick=()=>{clearTimeout(fastTimer);fastStage.querySelector('.fc-curtain').classList.add('is-hidden');utter(fastCard.label)};document.querySelector('[data-fast-new]').onclick=newFast;

  const spot=document.querySelector('[data-spot-stage]');let spotCard,spotX=50,spotY=50;
  const setSpot=()=>{spot.style.setProperty('--spot-x',`${spotX}%`);spot.style.setProperty('--spot-y',`${spotY}%`)};
  function newSpot(){spotCard=random();spot.className='fc-spot-stage';spot.innerHTML=image(spotCard,false);spotX=spotY=50;setSpot()}
  function revealSpot(){spot.classList.add('is-revealed');utter(spotCard.label)}
  const moveSpot=event=>{const rect=spot.getBoundingClientRect(),point=event.touches?.[0]||event;spotX=Math.max(0,Math.min(100,(point.clientX-rect.left)/rect.width*100));spotY=Math.max(0,Math.min(100,(point.clientY-rect.top)/rect.height*100));setSpot()};
  spot.addEventListener('pointermove',moveSpot);spot.addEventListener('touchmove',moveSpot,{passive:true});spot.addEventListener('keydown',event=>{const moves={ArrowLeft:[-8,0],ArrowRight:[8,0],ArrowUp:[0,-8],ArrowDown:[0,8]};if(moves[event.key]){event.preventDefault();spotX=Math.max(0,Math.min(100,spotX+moves[event.key][0]));spotY=Math.max(0,Math.min(100,spotY+moves[event.key][1]));setSpot()}else if(event.key==='Enter'||event.key===' '){event.preventDefault();revealSpot()}});document.querySelector('[data-spot-reveal]').onclick=revealSpot;document.querySelector('[data-spot-new]').onclick=newSpot;

  const scatter=document.querySelector('[data-sentence-choices]'),blank=document.querySelector('[data-sentence-blank]'),status=document.querySelector('[data-sentence-status]');
  function place(card){blank.textContent=card.phrase;scatter.querySelectorAll('.fc-mini').forEach(node=>node.classList.toggle('is-used',node.dataset.card===card.id));status.textContent=card.sentence;utter(card.sentence)}
  function newSentence(){blank.textContent='______';status.textContent='Drag or tap any card into the blank.';scatter.innerHTML=shuffle(cards).map(card=>`<button class="fc-mini" type="button" draggable="true" data-card="${card.id}" aria-label="Use ${card.label}">${image(card,false)}</button>`).join('');scatter.querySelectorAll('.fc-mini').forEach(button=>{button.onclick=()=>place(byId(button.dataset.card));button.addEventListener('dragstart',event=>event.dataTransfer.setData('text/plain',button.dataset.card))})}
  blank.addEventListener('dragover',event=>{event.preventDefault();blank.classList.add('is-over')});blank.addEventListener('dragleave',()=>blank.classList.remove('is-over'));blank.addEventListener('drop',event=>{event.preventDefault();blank.classList.remove('is-over');const card=byId(event.dataTransfer.getData('text/plain'));if(card)place(card)});document.querySelector('[data-sentence-new]').onclick=newSentence;
  showLesson();newSpot();newSentence();
})();
