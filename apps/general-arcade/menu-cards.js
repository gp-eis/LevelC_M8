(function(){
  'use strict';
  const grid=document.querySelector('.game-card-grid');
  if(!grid||grid.querySelector('[data-general-arcade]'))return;
  const level=(location.pathname.match(/level-([abc])/i)?.[1]||'a').toLowerCase();
  const week=Number(location.pathname.match(/week-([1-4])/i)?.[1]||new URLSearchParams(location.search).get('week')||1);
  const returnUrl=location.pathname+location.search;
  const style=document.createElement('style');
  style.textContent='.general-game-icon{position:relative;display:grid;place-items:center;width:clamp(92px,11vw,132px);height:clamp(92px,11vw,132px);margin:auto;border:5px solid #fff;border-radius:28px;background:linear-gradient(145deg,#f6ffff,#d7f4ff);box-shadow:0 8px 0 #63abd0,0 12px 18px #245b7b22;overflow:hidden}.general-game-icon img{display:block;width:94%;height:94%;object-fit:contain;filter:drop-shadow(0 6px 5px #245b7b28)}.general-game-icon--board{background:linear-gradient(145deg,#fffce1,#ffeaa0);box-shadow:0 8px 0 #d9aa35,0 12px 18px #79561d22}';
  document.head.append(style);
  const entries=[
    {game:'bubble',label:'Story Bubble Shooter',hint:'Aim, match, and clear every bubble!',icon:'https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/general-arcade/assets/story-bubble-shooter-icon-3d-v1.png'},
    {game:'board',label:'GP Adventure Board',hint:'Roll, solve clues, and find surprises!',icon:'https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/general-arcade/assets/adventure-board-icon-3d-v1.png'}
  ];
  const phonics=[...grid.querySelectorAll('a')].find(link=>link.href.includes('phonics'));
  entries.forEach(entry=>{
    const link=document.createElement('a');link.className='game-nav-card';link.dataset.generalArcade=entry.game;
    const page=entry.game==='bubble'?'story-bubble-shooter.html':'adventure-board.html';
    link.href=`/LevelC_M8/apps/general-arcade/${page}?level=${level}&week=${week}&return=${encodeURIComponent(returnUrl)}`;
    link.innerHTML=`<span class="general-game-icon general-game-icon--${entry.game}" aria-hidden="true"><img src="${entry.icon}" alt=""></span><span class="game-nav-card__label">${entry.label}</span><span class="game-nav-card__hint">${entry.hint}</span>`;
    grid.insertBefore(link,phonics||null);
  });
})();
