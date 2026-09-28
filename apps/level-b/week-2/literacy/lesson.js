import '../../assets/navigation/gp-navigation.js?v=20260916-mobile&deploy=20260929-asset-fix-4';
import '../../assets/navigation/gp-sounds.js?deploy=20260929-asset-fix-4';
const pages=['page-01.html','video-activity.html','page-12.html','page-13.html','page-14.html','page-15.html'];
const file=location.pathname.split('/').pop(), index=pages.indexOf(file), tool=['tpr.html','flashcards.html','conversation.html'].includes(file);
const main=document.querySelector('main');
const nav=document.querySelector('gp-navigation');
nav.querySelector('[aria-label="Week Home"]').href='../#card-literacy';
const title='Week 2 — Is honey good for you?';
const head=document.createElement('header');head.className='b-heading';
const heading=document.createElement('h1');heading.textContent=title;head.append(heading);
if(!tool){const tools=document.createElement('nav');tools.className='b-tools';tools.setAttribute('aria-label','Literacy tools');[['tpr.html','🎵 Week Song'],['flashcards.html','🃏 Flashcards'],['conversation.html','💬 Conversation']].forEach(([f,label])=>{const a=document.createElement('a');a.className='b-pill';a.textContent=label;a.href=f+'?return='+encodeURIComponent(file+'#lesson-focus');tools.append(a)});head.append(tools)}
main.prepend(head);
if(index>=0){const pager=document.createElement('nav');pager.className='b-pages';pager.setAttribute('aria-label','Literacy pages');pager.innerHTML=`<strong>Page ${index+1} of 6</strong><div>${pages.map((p,i)=>`<a href="${p}#lesson-focus" aria-label="Page ${i+1} of 6" ${i===index?'aria-current="page"':''}>${i+1}</a>`).join('')}</div>`;head.after(pager)}
if(tool){let back='page-01.html';try{const u=new URL(new URLSearchParams(location.search).get('return')||back,location.href);if(u.origin===location.origin&&u.pathname.slice(0,u.pathname.lastIndexOf('/')+1)===location.pathname.slice(0,location.pathname.lastIndexOf('/')+1)&&pages.includes(u.pathname.split('/').pop()))back=u.pathname.split('/').pop()}catch{}const a=document.createElement('a');a.className='b-pill b-return';a.textContent='← Back to Page '+(pages.indexOf(back)+1);a.href=back+'#lesson-focus';const marker=document.createComment('mobile return');main.prepend(marker);const mq=matchMedia('(min-width:721px)');function place(){a.classList.toggle('b-return-mobile',!mq.matches);if(mq.matches)nav.querySelector('.gp-navigation__links').append(a);else marker.after(a)}mq.addEventListener('change',place);place()}
const stage=document.querySelector('.b-stage');
if(stage){const frame=document.createElement('section');frame.className='b-workbook-frame';frame.id='lesson-focus';stage.removeAttribute('id');stage.before(frame);frame.append(stage,document.querySelector('.b-controls'));}
function centerWorkbook(){if(location.hash!=='#lesson-focus')return;const frame=document.getElementById('lesson-focus');if(!frame)return;frame.scrollIntoView({block:'center',behavior:'auto'});const bottom=nav.getBoundingClientRect().bottom;if(frame.getBoundingClientRect().top<bottom+12)window.scrollBy(0,frame.getBoundingClientRect().top-bottom-12)}
addEventListener('load',centerWorkbook);addEventListener('pageshow',centerWorkbook);addEventListener('hashchange',centerWorkbook);document.fonts?.ready.then(centerWorkbook);

if(stage){
  const page=Number(document.body.dataset.page),layer=stage.querySelector('.b-start'),status=stage.querySelector('.b-status');
  let started=false,finished=false,revision=0,winTimer=0,voiceTimer=0,lastFocus=null;
  const completed=new Set(),resetters=[],controls=[];
  const dialog=document.querySelector('[data-completion]'),video=dialog.querySelector('video'),close=dialog.querySelector('[data-close]'),retry=dialog.querySelector('[data-try-again]');
  function say(text,done,waitForEnd=false){
    if(!('speechSynthesis' in window)){done?.();return;}
    speechSynthesis.cancel();clearTimeout(voiceTimer);
    const utterance=new SpeechSynthesisUtterance(text);utterance.lang='en-US';utterance.rate=.85;
    let called=false;const finish=()=>{if(called)return;called=true;clearTimeout(voiceTimer);done?.();};
    utterance.onend=utterance.onerror=finish;if(done&&!waitForEnd)voiceTimer=setTimeout(finish,9000);speechSynthesis.speak(utterance);
  }
  function button(label,x,y,w,h,cls='b-hotspot'){
    const b=document.createElement('button');b.type='button';b.className=cls;b.setAttribute('aria-label',label);b.setAttribute('aria-pressed','false');
    Object.assign(b.style,{left:x+'%',top:y+'%',width:w+'%',height:h+'%'});stage.insertBefore(b,layer);controls.push(b);return b;
  }
  function wrong(b){const token=revision;clearTimeout(b.wrongTimer);b.classList.remove('is-wrong');void b.offsetWidth;b.classList.add('is-wrong');status.textContent='Try again.';say('Try again.');b.wrongTimer=setTimeout(()=>{if(token===revision)b.classList.remove('is-wrong');},550);}
  function mark(b){clearTimeout(b.wrongTimer);b.classList.remove('is-wrong');b.classList.add('is-correct');b.setAttribute('aria-pressed','true');}
  function dismiss(){video.pause();dialog.hidden=true;document.body.classList.remove('completion-open');lastFocus?.focus({preventScroll:true});}
  function win(){if(finished)return;finished=true;const token=revision;winTimer=setTimeout(()=>{if(token!==revision)return;lastFocus=document.activeElement;dialog.hidden=false;document.body.classList.add('completion-open');video.currentTime=0;video.controls=true;video.play().catch(()=>{});close.focus();},500);}
  close.onclick=dismiss;retry.onclick=()=>{dismiss();reset();};
  dialog.addEventListener('keydown',e=>{if(e.key==='Escape')dismiss();if(e.key==='Tab'){const available=[close,video,retry];const at=available.indexOf(document.activeElement);if(e.shiftKey&&at<=0){e.preventDefault();retry.focus();}else if(!e.shiftKey&&(at===available.length-1||at<0)){e.preventDefault();close.focus();}}});
  video.tabIndex=0;
  if(page===12){
    const answer=document.createElement('span');answer.className='b-honey-answer';answer.setAttribute('aria-live','polite');stage.insertBefore(answer,layer);
    [['hive',49.1,54.7],['making',72.8,54.7],['garden',49.1,71.7],['honey',72.8,71.7]].forEach(([word,x,y])=>{
      const b=button('Choose '+word,x,y,21.2,12.9,'b-hotspot b-word-choice');b.dataset.word=word;
      b.onclick=()=>{if(!started||finished)return;say(word);if(word!=='honey'){wrong(b);return;}mark(b);answer.textContent='honey';status.textContent='Bees make honey.';win();};
    });
    resetters.push(()=>answer.textContent='');
  }
  function matching(pairs){
    const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');svg.classList.add('b-trace');svg.setAttribute('viewBox','0 0 100 100');svg.setAttribute('preserveAspectRatio','none');svg.setAttribute('aria-hidden','true');stage.insertBefore(svg,layer);
    const lines=document.createElementNS(ns,'g'),preview=document.createElementNS(ns,'line');svg.append(lines,preview);preview.setAttribute('class','b-match-preview');preview.style.display='none';
    let selectedDot=null;const dots=[];
    function setLine(line,a,b){line.setAttribute('x1',a.x);line.setAttribute('y1',a.y);line.setAttribute('x2',b.x);line.setAttribute('y2',b.y);}
    function clearPreview(){selectedDot?.button.classList.remove('is-linking');selectedDot=null;preview.style.display='none';}
    pairs.forEach(({id,label,left,right})=>[['left',left],['right',right]].forEach(([side,point])=>{
      const b=button((side==='left'?'First dot: ':'Matching dot: ')+label,point[0],point[1],5,6.36,'b-hotspot b-match-dot');
      const dot={id,side,x:point[0],y:point[1],button:b};dots.push(dot);b.dataset.match=id;b.dataset.side=side;
      if(page===15&&side==='left')b.classList.add('bee-part');
      b.onclick=()=>{
        if(!started||finished||completed.has(id))return;
        if(!selectedDot){selectedDot=dot;b.classList.add('is-linking');setLine(preview,dot,dot);preview.style.display='';status.textContent='Choose the matching dot.';say(label);return;}
        if(selectedDot===dot){clearPreview();return;}
        if(selectedDot.side===side){selectedDot.button.classList.remove('is-linking');selectedDot=dot;b.classList.add('is-linking');setLine(preview,dot,dot);say(label);return;}
        if(selectedDot.id!==id){wrong(b);return;}
        const line=document.createElementNS(ns,'line');line.classList.add('b-match-line');setLine(line,selectedDot,dot);lines.append(line);mark(b);mark(selectedDot.button);completed.add(id);clearPreview();status.textContent=completed.size+' of '+pairs.length+' matched.';say(label);if(completed.size===pairs.length)win();
      };
    }));
    stage.addEventListener('pointermove',event=>{if(!started||finished||!selectedDot)return;const r=stage.getBoundingClientRect();setLine(preview,selectedDot,{x:(event.clientX-r.left-stage.clientLeft)/stage.clientWidth*100,y:(event.clientY-r.top-stage.clientTop)/stage.clientHeight*100});});
    stage.addEventListener('keydown',e=>{if(e.key==='Escape')clearPreview();});
    resetters.push(()=>{clearPreview();lines.replaceChildren();});
  }
  if(page===13)matching([
    {id:'sweet',label:'sweet',left:[27.7,41.9],right:[79.6,77.7]},
    {id:'healthy',label:'healthy',left:[27.7,56.9],right:[63.7,79.0]},
    {id:'natural',label:'natural',left:[27.7,71.7],right:[79.6,55.6]},
    {id:'healing',label:'healing',left:[27.7,86.1],right:[61.4,47.1]}
  ]);
  if(page===14){
    // Reuse Month 7's recorded letter name + classroom phoneme.
    let letterAudio=null,audioRevision=0;
    function stopLetter(){audioRevision++;if(letterAudio){letterAudio.onended=letterAudio.onerror=null;letterAudio.pause();letterAudio=null;}}
    function playLetter(letter,done){
      stopLetter();if('speechSynthesis' in window)speechSynthesis.cancel();
      const token=audioRevision,lessonRevision=revision;
      const audio=new Audio(new URL(`https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-b/assets/audio/letter-sounds/${letter}.mp3`,import.meta.url));letterAudio=audio;
      let ended=false;
      const finish=()=>{if(ended||token!==audioRevision||lessonRevision!==revision)return;ended=true;done?.();};
      audio.onended=finish;
      const failed=()=>{if(token!==audioRevision||lessonRevision!==revision||ended)return;status.textContent='Letter sound could not play. Please reset and try again.';};
      audio.onerror=failed;audio.play().catch(failed);
    }
    resetters.push(stopLetter);window.addEventListener('pagehide',stopLetter);
    const sequence=[...'flowers'],letters=[];
    const ns='http://www.w3.org/2000/svg',trace=document.createElementNS(ns,'svg');
    trace.classList.add('b-trace','b-letter-trace');trace.setAttribute('viewBox','0 0 100 100');trace.setAttribute('preserveAspectRatio','none');trace.setAttribute('aria-hidden','true');stage.insertBefore(trace,layer);
    let previousLetter=null;
    function connectLetter(x,y){
      if(previousLetter){
        // Leave the letter bubbles themselves unobscured by the connecting line.
        const dx=x-previousLetter.x,dy=(y-previousLetter.y)*834/1061,length=Math.hypot(dx,dy),inset=Math.min(.45,5.2/length);
        const segment=document.createElementNS(ns,'line');segment.classList.add('b-letter-link');
        segment.setAttribute('x1',previousLetter.x+(x-previousLetter.x)*inset);segment.setAttribute('y1',previousLetter.y+(y-previousLetter.y)*inset);
        segment.setAttribute('x2',x-(x-previousLetter.x)*inset);segment.setAttribute('y2',y-(y-previousLetter.y)*inset);trace.append(segment);
      }
      previousLetter={x,y};
    }
    resetters.push(()=>{previousLetter=null;trace.replaceChildren();});
    const word=document.createElement('span');word.className='b-flowers-word';word.setAttribute('aria-label','flowers');
    const wordLetters=[...'flowers'].map(letter=>{const span=document.createElement('span');span.textContent=letter;span.dataset.letter=letter;word.append(span);return span;});
    stage.insertBefore(word,layer);
    resetters.push(()=>wordLetters.forEach(span=>span.classList.remove('is-found')));
    [['f',26.1,36.4,true],['w',23.0,49.7,false],['l',22.4,63.5,true],['o',25.3,76.8,true],['y',74.0,36.4,false],['s',77.0,50.0,false],['r',77.7,63.7,true],['t',75.0,76.8,false],['j',32.5,88.2,false],['w',44.4,89.7,true],['s',55.8,90.0,true],['e',67.6,88.1,true]].forEach(([letter,x,y,isTarget])=>{
      const b=button('Choose letter '+letter,x-4.75,y-5.85,9.5,11.7,'b-hotspot b-letter-choice');b.dataset.letter=letter;letters.push(b);
      b.onclick=()=>{
        if(!started||finished||completed.has(letter))return;
        if(!isTarget||letter!==sequence[completed.size]){wrong(b);status.textContent='Choose '+sequence[completed.size]+' next.';playLetter(letter);return;}
        completed.add(letter);
        connectLetter(x,y);
        wordLetters.filter(span=>span.dataset.letter===letter).forEach(span=>span.classList.add('is-found'));
        mark(b);b.disabled=true;
        status.textContent=completed.size+' of 7 letters found.'+(completed.size<sequence.length?' Choose '+sequence[completed.size]+' next.':'');
        if(completed.size===sequence.length){
          started=false;controls.forEach(control=>control.disabled=true);
          const token=revision;
          playLetter(letter,()=>{if(token===revision)win();});
        }else playLetter(letter);
      };
    });
  }
  if(page===15)matching([
    {id:'wings',label:'four wings',left:[50.1,40.0],right:[68.8,41.1]},
    {id:'black',label:'black stripes',left:[38.6,66.7],right:[68.8,56.9]},
    {id:'yellow',label:'yellow stripes',left:[40.8,78.5],right:[68.8,72.6]},
    {id:'legs',label:'six legs',left:[37.7,91.0],right:[68.8,88.0]}
  ]);
  const intro={12:'Circle the missing word. Bees make what?',13:'Connect the dots. Match each word to its picture.',14:'Find the letters of flowers in order. Start with F, then follow the word.',15:'Connect the dots. Match the parts of the honeybee.'};
  function reset(){
    revision++;clearTimeout(winTimer);clearTimeout(voiceTimer);if('speechSynthesis' in window)speechSynthesis.cancel();started=false;finished=false;completed.clear();
    controls.forEach(b=>{clearTimeout(b.wrongTimer);b.disabled=true;b.classList.remove('is-correct','is-wrong','is-linking');b.setAttribute('aria-pressed','false');});
    resetters.forEach(fn=>fn());layer.hidden=false;status.textContent='';layer.querySelector('button').disabled=false;layer.querySelector('button').focus({preventScroll:true});
  }
  layer.querySelector('button').onclick=()=>{if(layer.hidden)return;layer.hidden=true;const token=revision;say(intro[page],()=>{if(token!==revision)return;started=true;controls.forEach(b=>b.disabled=false);status.textContent='Ready.';});};
  document.querySelector('[data-reset]').onclick=reset;
  window.addEventListener('pagehide',()=>{revision++;clearTimeout(winTimer);clearTimeout(voiceTimer);video.pause();if('speechSynthesis' in window)speechSynthesis.cancel();});
  reset();
}
