(() => {
  document.querySelector('.game-list-back')?.remove();
  const from=new URLSearchParams(location.search).get('from')==='phonics'?'phonics':'games';
  const week=window.PHONICS_WEEK?.week||1;
  const subtitle=document.querySelector('.game-list-subtitle');
  if(subtitle)subtitle.textContent=`Week ${week} — ${week===4?'Review: ug, um, un':window.PHONICS_WEEK.families.join(', ')}`;
  document.title=`Phonics Games — Level B Week ${week}`;
  const nav=document.querySelector('gp-navigation');
  if(nav)nav.dataset.weekHref=`../week-${week}/#card-${from}`;
  const back=document.querySelector('[data-phonics-context-return]');
  if(back){
    back.href=from==='phonics'?`../week-${week}/phonics/#lesson-focus`:(week===1?'index.html':`week-${week}.html`);back.textContent=from==='phonics'?'← Phonics Lesson':'← All Games';
    if(from==='phonics'){
      const original=back.parentElement,desktop=matchMedia('(min-width:721px)');
      const position=()=>{const links=nav?.querySelector('.gp-navigation__links');if(desktop.matches&&links){links.append(back);original.hidden=true;}else{original.append(back);original.hidden=false;}};
      customElements.whenDefined('gp-navigation').then(position);desktop.addEventListener('change',position);
    }
  }
  document.querySelectorAll('.game-nav-card').forEach(link=>{const url=new URL(link.href);url.searchParams.set('from',from);url.searchParams.set('week',week);link.href=url.href;});
  document.querySelectorAll('[data-phonics-arcade]').forEach(link=>{const url=new URL(link.href);url.searchParams.set('level','b');url.searchParams.set('week',week);url.searchParams.set('return',`/LevelC_M8/apps/level-b/games/phonics.html?week=${week}&from=${from}`);link.href=url.href;});
  if(nav&&nav.dataset.previousHref){nav.dataset.previousHref=`phonics.html?week=${week}&from=${from}`;nav.dataset.sectionHref=nav.dataset.previousHref;}
})();
