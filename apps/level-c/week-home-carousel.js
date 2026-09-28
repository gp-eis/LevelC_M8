const track=document.querySelector('#learning-carousel');
if(track){
  const cards=[...track.querySelectorAll('.learning-card')];
  const dots=[...document.querySelectorAll('.carousel-dots button')];
  const previous=document.querySelector('#learning-prev');
  const next=document.querySelector('#learning-next');
  const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
  let active=0,scrollFrame=0;
  const sync=index=>{active=Math.max(0,Math.min(cards.length-1,index));cards.forEach((card,i)=>card.classList.toggle('is-active',i===active));dots.forEach((dot,i)=>dot.classList.toggle('is-active',i===active));if(previous)previous.disabled=active===0;if(next)next.disabled=active===cards.length-1};
  const show=index=>{sync(index);const card=cards[active],left=card.offsetLeft-(track.clientWidth-card.offsetWidth)/2;track.scrollTo({left:Math.max(0,left),behavior:reducedMotion.matches?'auto':'smooth'})};
  previous?.addEventListener('click',()=>show(active-1));
  next?.addEventListener('click',()=>show(active+1));
  dots.forEach((dot,index)=>dot.addEventListener('click',()=>show(index)));
  track.addEventListener('scroll',()=>{cancelAnimationFrame(scrollFrame);scrollFrame=requestAnimationFrame(()=>{const center=track.scrollLeft+track.clientWidth/2;const nearest=cards.reduce((best,card,index)=>{const distance=Math.abs(card.offsetLeft+card.offsetWidth/2-center);return distance<best.distance?{index,distance}:best},{index:active,distance:Infinity});sync(nearest.index)})},{passive:true});
  track.addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight'].includes(event.key))return;event.preventDefault();show(active+(event.key==='ArrowRight'?1:-1))});
  const restore=()=>{const section=new URLSearchParams(location.search).get('lesson'),id=section?`card-${section}`:location.hash.slice(1),found=cards.findIndex(card=>card.id===id);show(found<0?0:found)};
  addEventListener('load',restore,{once:true});addEventListener('hashchange',restore);addEventListener('resize',()=>show(active));restore();
}
