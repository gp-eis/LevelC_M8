(() => {
  const modal = document.querySelector('#week2-game');
  const board = modal.querySelector('#w2-game-board');
  const feedback = modal.querySelector('#w2-game-feedback');
  let launch = document.querySelector('[data-clip="bike"]');
  const lessonVideo = document.querySelector('#week2-video');
  const celebration = modal.querySelector('[data-week2-completion]');
  const goodJob = celebration.querySelector('video');
  const base = 'https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-a/assets/media/literacy/week-2-games';
  const names = {bike:'Bike',dumbbells:'Dumbbells',barbell:'Barbell',bench:'Bench'};
  let selected = 'bike', game = 'bike', done = false, version = 0;
  const timers = new Set();
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  function later(fn, ms) { const stamp=version; const id=setTimeout(()=>{timers.delete(id);if(stamp===version&&modal.open)fn();},ms);timers.add(id); }
  function cleanup(){version++;timers.forEach(clearTimeout);timers.clear();goodJob.pause();goodJob.currentTime=0;celebration.hidden=true;}
  function shuffle(items){for(let i=items.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[items[i],items[j]]=[items[j],items[i]];}return items;}
  function img(name, alt, extra=''){return `<img class="w2-art ${extra}" src="https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-a/literacy/${base}${name}.png" alt="${alt}" draggable="false">`;}
  function wrong(el){feedback.textContent='Try again!';el.classList.remove('w2-wrong');void el.offsetWidth;el.classList.add('w2-wrong');later(()=>el.classList.remove('w2-wrong'),400);}
  function complete(){if(done)return;done=true;feedback.textContent='Great job!';later(()=>{celebration.hidden=false;goodJob.hidden=reducedMotion.matches;celebration.querySelector('p').hidden=!reducedMotion.matches;if(!reducedMotion.matches)goodJob.play().catch(()=>{goodJob.hidden=true;celebration.querySelector('p').hidden=false;});celebration.querySelector('button').focus();},500);}
  function close(){cleanup();modal.close();launch.focus();}
  function build(){cleanup();done=false;feedback.textContent='';board.replaceChildren();modal.querySelector('h2').textContent=`I use ${game==='dumbbells'?'':'a '}${game}.`;const prompt=modal.querySelector('#w2-game-prompt');
    if(game==='bike'){
      prompt.textContent='Pedal left, then right. Collect five stars!';let next='left',steps=0;
      board.innerHTML=`<div class="w2-stars" aria-label="0 of 5 stars">${'<span class="w2-star" aria-hidden="true">★</span>'.repeat(5)}</div>${img('bike-rider','Man riding an exercise bike','w2-bike')}<div class="w2-pedals"><button data-pedal="left">Left pedal</button><button data-pedal="right">Right pedal</button></div>`;
      board.querySelectorAll('[data-pedal]').forEach(b=>b.onclick=()=>{if(done)return;if(b.dataset.pedal!==next){wrong(b);return;}steps++;next=next==='left'?'right':'left';const stars=Math.floor(steps/2);board.querySelectorAll('.w2-star').forEach((s,i)=>s.classList.toggle('earned',i<stars));board.querySelector('.w2-stars').setAttribute('aria-label',`${stars} of 5 stars`);feedback.textContent=`${stars} of 5 stars — ${next} pedal!`;const rider=board.querySelector('.w2-bike');rider.src=`${base}${steps%2?'bike-rider-alt':'bike-rider'https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-a/literacy/}.png`;rider.alt=`Man pedaling with ${steps%2?'left':'right'} leg forward`;if(steps===10)complete();});
    } else if(game==='dumbbells'){
      prompt.textContent='Find the three matching pairs!';let first=null,locked=false,pairs=0;
      board.innerHTML='<div class="w2-memory"></div>';const grid=board.firstElementChild;
      shuffle([0,0,1,1,2,2]).forEach((pair,index)=>{const b=document.createElement('button');b.type='button';b.setAttribute('aria-label',`Hidden dumbbell card ${index+1}`);b.innerHTML=img('dumbbell','Dumbbell',`w2-tone-${pair}`);grid.append(b);b.onclick=()=>{if(done||locked||b===first||b.disabled)return;b.classList.add('revealed');b.setAttribute('aria-label',`${['Turquoise','Purple','Gold'][pair]} dumbbell`);if(!first){first=b;b.dataset.pair=pair;return;}if(Number(first.dataset.pair)===pair){first.disabled=b.disabled=true;first.classList.add('matched');b.classList.add('matched');first=null;pairs++;feedback.textContent=`${pairs} of 3 pairs!`;if(pairs===3){locked=true;later(()=>{board.innerHTML=img('dumbbell-curl','Man curling the dumbbells','w2-pose-demonstration');feedback.textContent='Great matching! Lift the dumbbells!';later(complete,1000);},500);}}else{locked=true;const previous=first;wrong(b);later(()=>{[previous,b].forEach(c=>{c.classList.remove('revealed');c.setAttribute('aria-label','Hidden dumbbell card');});first=null;locked=false;},800);}};});
    } else if(game==='barbell'){
      prompt.textContent='Put one gold plate on each end. Tap a plate, then an end—or drag it!';let plate=null,placed=0;
      board.innerHTML=`<div class="w2-bar-stage">${img('barbell','Barbell')}<button class="w2-drop left" data-side="left" aria-label="Left barbell end">Left</button><button class="w2-drop right" data-side="right" aria-label="Right barbell end">Right</button></div><div class="w2-plates"><button draggable="true" data-plate="0" aria-label="Gold plate 1">${img('plate','Gold plate')}</button><button draggable="true" data-plate="1" aria-label="Gold plate 2">${img('plate','Gold plate')}</button><button draggable="true" data-plate="2" aria-label="Purple plate">${img('plate','Purple plate','w2-tone-1')}</button></div>`;
      const plates=[...board.querySelectorAll('[data-plate]')];
      plates.forEach(p=>p.setAttribute('aria-pressed','false'));
      function setSelection(b){plate=b;plates.forEach(p=>{p.classList.toggle('selected',p===b);p.setAttribute('aria-pressed',String(p===b));});}
      function choose(b){if(done||b.disabled)return;setSelection(b);feedback.textContent='Choose an end of the barbell.';}
      let draggedPlate=null;
      plates.forEach(b=>{b.onclick=()=>choose(b);b.ondragstart=e=>{if(done||b.disabled){e.preventDefault();return;}choose(b);draggedPlate=b;e.dataTransfer.setData('text/plain',`w2-plate-${b.dataset.plate}`);};b.ondragend=()=>{draggedPlate=null;setSelection(null);};});
      board.querySelectorAll('[data-side]').forEach(end=>{function place(){if(done||end.disabled)return;if(!plate){feedback.textContent='Choose a gold plate first.';return;}if(plate.dataset.plate==='2'){wrong(plate);return;}end.innerHTML=img('plate','Gold plate attached');end.disabled=true;plate.disabled=true;plate.draggable=false;setSelection(null);placed++;feedback.textContent=`${placed} of 2 plates!`;if(placed===2)complete();}end.onclick=place;end.ondragover=e=>{if(draggedPlate&&!draggedPlate.disabled)e.preventDefault();};end.ondrop=e=>{e.preventDefault();if(!draggedPlate||draggedPlate.disabled||e.dataTransfer.getData('text/plain')!==`w2-plate-${draggedPlate.dataset.plate}`)return;setSelection(draggedPlate);place();draggedPlate=null;};});
    } else {
      prompt.textContent='Put the moves in order: Ready, Lower, Push up!';let step=0;const poses=['ready','lower','pushup'],labels=['Ready','Lower','Push up'];
      board.innerHTML=`<div class="w2-bench-slots">${poses.map((p,i)=>`<div aria-label="Move ${i+1}">${i+1}</div>`).join('')}</div><div class="w2-bench-options"></div>`;
      shuffle([0,1,2]).forEach(i=>{const b=document.createElement('button');b.type='button';b.innerHTML=img(`bench-${poses[i]}`,labels[i])+`<span>${labels[i]}</span>`;board.querySelector('.w2-bench-options').append(b);b.onclick=()=>{if(done||b.disabled)return;if(i!==step){wrong(b);return;}board.querySelectorAll('.w2-bench-slots>div')[step].innerHTML=img(`bench-${poses[i]}`,labels[i]);b.disabled=true;step++;feedback.textContent=`${step} of 3 moves!`;if(step===3){board.querySelectorAll('.w2-bench-options button').forEach(x=>x.disabled=true);if(reducedMotion.matches){complete();return;}feedback.textContent='Watch your moves!';later(()=>{board.innerHTML=img('bench-ready','Ready','w2-pose-demonstration');const pose=board.querySelector('img');[0,1,2,1,2].forEach((p,n)=>later(()=>{pose.src=`${base}bench-${poses[p]https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-a/literacy/}.png`;pose.alt=labels[p];feedback.textContent=labels[p]+'!';},n*750));later(complete,3750);},500);}};});
    }
  }
  document.querySelectorAll('[data-clip]').forEach(b=>b.addEventListener('click',()=>{
    launch=b;selected=b.dataset.clip;game=selected;lessonVideo.pause();
    modal.showModal();build();modal.querySelector('[data-game-close]').focus();
  }));
  modal.querySelectorAll('[data-game-watch]').forEach(button=>button.addEventListener('click',()=>{
    close();document.dispatchEvent(new CustomEvent('week2-watch-video',{detail:selected}));
  }));
  modal.querySelector('[data-game-close]').onclick=close;modal.querySelector('[data-game-done]').onclick=close;
  function replay(){build();modal.querySelector('[data-game-close]').focus();}
  modal.querySelector('[data-game-reset]').onclick=replay;modal.querySelector('[data-game-again]').onclick=replay;
  modal.addEventListener('keydown',e=>{if(e.key!=='Tab'||celebration.hidden)return;const buttons=[...celebration.querySelectorAll('button')];const first=buttons[0],last=buttons.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}});
  modal.addEventListener('cancel',e=>{e.preventDefault();close();});modal.addEventListener('close',cleanup);window.addEventListener('pagehide',cleanup);
})();
