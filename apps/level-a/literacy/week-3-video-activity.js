(() => {
 const video=document.querySelector('#week3-video');
 const play=document.querySelector('#week3-play');
 const status=document.querySelector('#week3-now-playing');
 const error=document.querySelector('#week3-video-error');
 const choices=[...document.querySelectorAll('[data-clip]')];
 let request=0;
 async function start(){
  const current=++request; error.hidden=true;
  try{await video.play();}catch(failure){
   if(current!==request || failure.name==='AbortError')return;
   play.hidden=false; error.hidden=false;
  }
 }
 function select(button){
  video.pause();
  choices.forEach(choice=>{const selected=choice===button;choice.classList.toggle('is-active',selected);choice.setAttribute('aria-pressed',String(selected));});
  status.textContent=button.textContent;
  video.setAttribute('aria-label',`${button.textContent} conversation`);
  // Always replay the complete shared opening, including on repeated selection.
  video.src=`https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/exports/level-a/week-3/LevelA_M8_W3_${button.dataset.clip}_music-v1.mp4`;
  video.load();start();
 }
 // Sentence buttons open their game. Watch Video reuses this player.
 document.addEventListener('week3-watch-video',event=>{const button=choices.find(choice=>choice.dataset.clip===event.detail);if(button)select(button);});
 play.addEventListener('click',start);
 video.addEventListener('play',()=>{play.hidden=true;error.hidden=true;});
 video.addEventListener('pause',()=>{play.hidden=false;});
 video.addEventListener('ended',()=>{play.hidden=false;});
 video.addEventListener('error',()=>{error.hidden=false;play.hidden=false;});
})();
