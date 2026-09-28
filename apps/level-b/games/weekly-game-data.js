(() => {
  'use strict';
  const requestedWeek=Number(new URLSearchParams(location.search).get('week'));
  const week=[2,3,4].includes(requestedWeek)?requestedWeek:1;
  const items=week===4
    ? ['tummy','throat','body','skin'].map(id=>({id,label:id,sentence:`It's good for our ${id}.`,image:`https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-b/assets/games/week-4/${id}-3d-v1.png`,questionImage:`https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-b/assets/flashcards/week-4/${id}-flashcard-v1.png`}))
    : week===3
    ? ['tea','cake','pancakes','chicken'].map(id=>({id,label:id,sentence:`We can make honey ${id}.`,image:`https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-b/assets/games/week-3/${id}-3d-v1.png`,questionImage:`https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-b/assets/flashcards/week-3/${id}-flashcard-v1.png`}))
    : week===2
    ? ['healthy','natural','sweet','healing'].map(id=>({id,label:id,sentence:`Honey is ${id}.`,image:`https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-b/assets/games/week-2/${id}-3d-v1.png`,questionImage:`https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-b/assets/flashcards/week-2/${id}-flashcard-v1.png`}))
    : ['flowers','lamp','trees','bench','grass'].map(id=>({id,label:id,sentence:`There are bees near the ${id}.`,image:`https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-b/assets/games/week-1/${id}-3d-v1.png`,questionImage:`https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-b/assets/flashcards/week-1/${id}-flashcard-v1.png`}));
  window.WeeklyGames={week,title:week===4?'Why is it good?':week===3?'What can we make with honey?':week===2?'Is honey good for you?':'Where are the bees?',question:week===4?'Why is it good?':week===3?'What can we make with honey?':week===2?'What is honey like?':'Where are the bees?',items};
  if(week>1){
    const navigation=document.querySelector('gp-navigation');
    navigation.dataset.weekHref=`../week-${week}/#card-games`;navigation.dataset.sectionHref=`week-${week}.html`;
    navigation.dataset.trail=(navigation.dataset.trail||'').replace('Week 1',`Week ${week}`);
    document.querySelectorAll('a.match-home').forEach(link=>link.href=`week-${week}.html`);
    const weekHome=navigation.querySelector('[aria-label="Week Home"]');if(weekHome)weekHome.href=`../week-${week}/#card-games`;
    document.title=document.title.replace('Month 8',`Week ${week} · Month 8`);
    document.querySelector('#wheel')?.setAttribute('aria-label','Honey picture wheel');
    document.querySelector('#selected-area')?.setAttribute('aria-label','Selected honey picture card');
  }
  if(document.body.classList.contains('memory-game')){
    document.querySelector('.m7-game-header p').textContent=`Look carefully, then find the ${items.length} matching pairs!`;
    document.querySelector('#pairs').parentElement.lastChild.textContent=` / ${items.length}`;
    document.querySelector('#board').classList.toggle('five-pairs',items.length===5);
  }
  // Keep contextual return out from under the floating home controls.
  if(week>=3){
    customElements.whenDefined('gp-navigation').then(()=>{
      const back=document.querySelector('a.match-home'),links=document.querySelector('gp-navigation .gp-navigation__links');
      if(!back||!links)return;
      const marker=document.createComment('inline All Games');back.before(marker);
      const desktop=matchMedia('(min-width:721px)');
      const place=()=>desktop.matches?links.append(back):marker.after(back);
      desktop.addEventListener('change',place);place();
    });
  }
})();
