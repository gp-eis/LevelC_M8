const weekOneSlides=[
  {file:'01-play-outside.png',alt:'The teacher and children arrive at the playground and cheer about playing outside.'},
  {file:'02-playground-things.png',alt:'The teacher shows the children the swings, slide, and sandbox.'},
  {file:'03-want-to-swing.png',alt:'The teacher asks what the children want to do, and a child says she wants to swing.'},
  {file:'04-go-down-slide.png',alt:'A child says he wants to go down the slide.'},
  {file:'05-play-in-sandbox.png',alt:'A child says she wants to play in the sandbox.'},
  {file:'06-clean-up.png',alt:'Playtime is over, so the teacher and children clean up and line up.'}
];
const root='https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/conversation/week-1/';
const pathWeek=location.pathname.match(/week-([1-4])/i)?.[1];
const requestedWeek=new URLSearchParams(location.search).get('week')||pathWeek||'1';
const weekTwoSlides=[
  ...weekOneSlides.slice(0,3),
  {src:'https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/conversation/week-2/04-hold-on.png',alt:'The teacher shows a child how to hold the swing tightly with both hands.'},
  {src:'https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/conversation/week-2/05-push-me.png',alt:'A child politely asks the teacher to push the swing, and they get ready.'},
  weekOneSlides[5]
];
const weekThreeSlides=[
  ...weekOneSlides.slice(0,2),
  {src:'https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/conversation/week-3/03-want-slide.png',alt:'The teacher asks what the children want to do, and a child says he wants to go down the slide.'},
  {src:'https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/conversation/week-3/04-climb-steps.png',alt:'The teacher tells a child to climb the steps and hold the handrail.'},
  {src:'https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/conversation/week-3/05-feet-first.png',alt:'The teacher shows a child how to sit down and go down the slide feet first.'},
  weekOneSlides[5]
];
const weekFourSlides=[
  ...weekOneSlides.slice(0,2),
  {src:'https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/conversation/week-4/03-want-sandbox.png',alt:'The teacher asks what the children want to do, and a child says she wants to play in the sandbox.'},
  {src:'https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/conversation/week-4/04-fill-bucket.png',alt:'A child asks to use the bucket, and the teacher tells her to fill it with sand.'},
  {src:'https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/conversation/week-4/05-sandcastle.png',alt:'The child turns the bucket over, lifts it up, and proudly shows her sandcastle.'},
  weekOneSlides[5]
];
const slides=requestedWeek==='2'?weekTwoSlides:requestedWeek==='3'?weekThreeSlides:requestedWeek==='4'?weekFourSlides:weekOneSlides;
const slideSrc=slide=>slide.src||root+slide.file;
const level=(location.pathname.match(/level-([abc])/i)?.[1]||'').toUpperCase();
if(level)document.title=`Week ${requestedWeek} Conversation — Level ${level}`;
const pageMain=document.querySelector('main');
if(!document.querySelector('[data-conversation-gallery]')){
  pageMain.className='conversation-shell';
  pageMain.id='lesson-focus';
  pageMain.innerHTML=`<header class="conversation-heading"><h1>💬 Conversation</h1><p>Week ${requestedWeek} — Month 8 Conversation</p></header><section class="conversation-card" aria-label="Week ${requestedWeek} conversation video and picture gallery"><div class="conversation-video-slot" aria-label="Week ${requestedWeek} conversation video"></div><section class="conversation-gallery" aria-labelledby="gallery-title"><h2 id="gallery-title">🖼️ Conversation Picture Gallery</h2><p>Tap any picture to view the story in order.</p><div class="conversation-thumbnails" data-conversation-gallery></div></section></section>`;
  document.body.insertAdjacentHTML('beforeend',`<div class="conversation-modal" data-conversation-modal role="dialog" aria-modal="true" aria-label="Conversation picture viewer" hidden><div class="conversation-dialog"><button class="conversation-close" data-conversation-close type="button" aria-label="Close picture viewer">×</button><img class="conversation-slide-image" data-conversation-image src="" alt=""><div class="conversation-modal-nav"><button class="conversation-nav-button" data-conversation-previous type="button">⬅ Previous</button><span class="conversation-counter" data-conversation-counter>1 of 6</span><button class="conversation-nav-button" data-conversation-next type="button">Next ➡</button></div></div></div>`);
}
const gallery=document.querySelector('[data-conversation-gallery]');
const modal=document.querySelector('[data-conversation-modal]');
const modalImage=document.querySelector('[data-conversation-image]');
const counter=document.querySelector('[data-conversation-counter]');
const videoSlot=document.querySelector('.conversation-video-slot');
document.querySelector('.conversation-card')?.setAttribute('aria-label',`Week ${requestedWeek} conversation video and picture gallery`);
videoSlot.classList.add('has-video');
videoSlot.setAttribute('aria-label',`Week ${requestedWeek} Month 8 conversation video`);
videoSlot.innerHTML=`<video class="conversation-video" controls playsinline preload="metadata" aria-label="Month 8 conversation video for Week ${requestedWeek}"><source src="https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/conversation/month8-conversation.mp4" type="video/mp4">Your browser does not support the video element.</video>`;
let current=0;
let lastTrigger=null;
const render=()=>{const slide=slides[current];modalImage.src=slideSrc(slide);modalImage.alt=slide.alt;counter.textContent=`${current+1} of ${slides.length}`};
const openGallery=(index,trigger)=>{current=index;lastTrigger=trigger;render();modal.hidden=false;document.body.style.overflow='hidden';modal.querySelector('[data-conversation-close]').focus()};
const closeGallery=()=>{modal.hidden=true;document.body.style.overflow='';lastTrigger?.focus()};
if(requestedWeek!=='1') document.querySelector('.conversation-heading p').textContent=`Week ${requestedWeek} — Conversation`;
if(!['1','2','3','4'].includes(requestedWeek)){
  document.querySelector('.conversation-gallery>p').textContent=`Week ${requestedWeek} pictures will be added when they are provided.`;
  gallery.innerHTML='<div class="conversation-gallery-pending">Conversation pictures coming soon.</div>';
}else{
  gallery.innerHTML=slides.map((slide,index)=>`<button class="conversation-thumb" type="button" data-slide="${index}" aria-label="Open conversation picture ${index+1} of ${slides.length}"><img src="${slideSrc(slide)}" alt="${slide.alt}" loading="${index<3?'eager':'lazy'}"><span aria-hidden="true">${index+1}</span></button>`).join('');
}
gallery.addEventListener('click',event=>{const button=event.target.closest('[data-slide]');if(button)openGallery(Number(button.dataset.slide),button)});
modal.querySelector('[data-conversation-close]').addEventListener('click',closeGallery);
modal.querySelector('[data-conversation-previous]').addEventListener('click',()=>{current=(current-1+slides.length)%slides.length;render()});
modal.querySelector('[data-conversation-next]').addEventListener('click',()=>{current=(current+1)%slides.length;render()});
modal.addEventListener('click',event=>{if(event.target===modal)closeGallery()});
document.addEventListener('keydown',event=>{if(modal.hidden)return;if(event.key==='Escape')closeGallery();if(event.key==='ArrowLeft'){current=(current-1+slides.length)%slides.length;render()}if(event.key==='ArrowRight'){current=(current+1)%slides.length;render()}});
