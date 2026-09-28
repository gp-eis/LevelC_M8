(() => {
  'use strict';
  // The PDF covers the MONTH. Weekly sequence confirmed by the user.
  const weeklyFamilies={1:['ug'],2:['um'],3:['un'],4:['ug','um','un']};
  const requested=Number(new URLSearchParams(location.search).get('week'));
  const week=Number.isInteger(requested)&&requested>=1&&requested<=4?requested:1;
  const families=weeklyFamilies[week];
  // Keep existing shared artwork paths; moving files is unnecessary.
  const words=['bug','mug','rug','drum','gum','plum','bun','nun','sun']
    .filter(id=>families.includes(id.slice(-2)))
    .map(id=>({id,label:id,word:id,family:id.slice(-2),prefix:id.slice(0,-2),suffix:id.slice(-2),sentence:id==='gum'?'I see gum.':`I see a ${id}.`,image:`https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-b/assets/phonics/week-1/${id}-3d-v1.png`}));
  window.PHONICS_WEEK={week,families,review:week===4,lowercase:true,words};
  window.configurePhonicsWeek=()=>{
    const origin=new URLSearchParams(location.search).get('from')==='phonics'?'phonics':'games';
    document.querySelectorAll('a[href]').forEach(link=>{const url=new URL(link.href);if(url.origin===location.origin&&/\/phonics(?:-[a-z-]+)?\.html$/.test(url.pathname)){url.searchParams.set('from',origin);url.searchParams.set('week',week);link.href=url.href;}});
    const nav=document.querySelector('gp-navigation');if(nav){nav.dataset.weekHref=`../week-${week}/#card-${origin}`;delete nav.dataset.previousHref;nav.dataset.sectionHref=`phonics.html?week=${week}&from=${origin}`;nav.dataset.trail=`Level B · Week ${week} · Phonics`;}
  };
  window.addEventListener('pagehide',()=>{if('speechSynthesis' in window)speechSynthesis.cancel();window._phonemeAudio?.pause();});
})();
