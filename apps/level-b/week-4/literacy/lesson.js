import { setupActivities } from './activities.js?v=20260916-w4-columns&deploy=20260929-resource-fix-1';
import '../../assets/navigation/gp-navigation.js?v=20260916-mobile&deploy=20260929-resource-fix-1';
import '../../assets/navigation/gp-sounds.js?deploy=20260929-resource-fix-1';
const pages=['page-01.html','video-activity.html','page-32.html','page-33.html','page-34.html','page-35.html'];
const file=location.pathname.split('/').pop(), index=pages.indexOf(file), tool=['tpr.html','flashcards.html','conversation.html'].includes(file);
const main=document.querySelector('main');
const nav=document.querySelector('gp-navigation');
nav.querySelector('[aria-label="Week Home"]').href='../#card-literacy';
const title='Week 4 — Why is it good?';
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
  const completed=new Set(),resetters=[],controls=[],starters=[];
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
  setupActivities({page,stage,layer,status,button,wrong,mark,say,controls,completed,resetters,starters,isActive:()=>started&&!finished,finish:text=>{started=false;controls.forEach(b=>b.disabled=true);const token=revision;say(text,()=>{if(token===revision)win();},true);}});
  const intro={32:'Circle the missing word. I like honey. It is blank.',33:'Draw a line through the things honey is good for. Listen and choose one picture in each column.',34:'Calculate the totals. Choose the total cost for each basket, then press Go.',35:'Match the people to what they had. Choose a dot, then the matching dot.'};  function reset(){
    revision++;clearTimeout(winTimer);clearTimeout(voiceTimer);if('speechSynthesis' in window)speechSynthesis.cancel();started=false;finished=false;completed.clear();
    controls.forEach(b=>{clearTimeout(b.wrongTimer);b.disabled=true;b.classList.remove('is-correct','is-wrong','is-linking');b.setAttribute('aria-pressed','false');});
    resetters.forEach(fn=>fn());layer.hidden=false;status.textContent='';layer.querySelector('button').disabled=false;layer.querySelector('button').focus({preventScroll:true});
  }
  layer.querySelector('button').onclick=()=>{if(layer.hidden)return;layer.hidden=true;const token=revision;say(intro[page],()=>{if(token!==revision)return;started=true;controls.forEach(b=>b.disabled=false);status.textContent='Ready.';starters.forEach(fn=>fn());});};
  document.querySelector('[data-reset]').onclick=reset;
  window.addEventListener('pagehide',()=>{revision++;clearTimeout(winTimer);clearTimeout(voiceTimer);video.pause();if('speechSynthesis' in window)speechSynthesis.cancel();});
  reset();
}
