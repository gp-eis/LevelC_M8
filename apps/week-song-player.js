const match=location.pathname.match(/\/level-([abc])\//i);
const level=(match?.[1]||'a').toLowerCase();
const pathWeek=location.pathname.match(/\/week-([1-4])\//i)?.[1];
const week=Math.max(1,Math.min(4,Number(new URLSearchParams(location.search).get('week')||pathWeek||1)));
const topics={a:['Which sports?','Where do you exercise?','What do soccer players do?','What do you need?'],b:['Where are the bees?','Is honey good for you?','What can we make with honey?','Why is honey good?'],c:['Animals and Things We See','Insect Parts','Animals That Hunt and Fly','Animals That Sleep']};
const main=document.querySelector('main');
if(main){
  document.title=`Week Song — Level ${level.toUpperCase()} Month 8 Week ${week}`;
  main.className='week-song-shell';main.id='lesson-focus';
  const mediaBase=`https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-${level}/assets/video/week-song/week-${week}`;
  main.innerHTML=`<header class="week-song-heading"><h1>🎵 Week Song</h1><p>Level ${level.toUpperCase()} · Month 8 · Week ${week} — ${topics[level][week-1]}</p></header><section class="week-song-card" aria-label="Level ${level.toUpperCase()} Week ${week} song video"><div class="week-song-video-shell"><video class="week-song-video" controls playsinline preload="metadata" src="${mediaBase}.mp4" aria-label="Level ${level.toUpperCase()} Month 8 Week ${week} song"></video><button class="week-song-play" type="button" aria-label="Play the Week ${week} song">▶</button></div><p class="week-song-note">Press play, sing, and move along!</p></section>`;
  const video=main.querySelector('video'),play=main.querySelector('.week-song-play');
  const sync=()=>{play.hidden=!video.paused&&!video.ended};
  play.addEventListener('click',()=>video.play().catch(()=>{}));video.addEventListener('play',sync);video.addEventListener('pause',sync);video.addEventListener('ended',sync);sync();
}
