(() => {
  'use strict';
  const pathWeek = location.pathname.match(/week-([234])\.html$/)?.[1];
  const requested = Number(new URLSearchParams(location.search).get('week') || pathWeek || 1);
  const week = [1, 2, 3, 4].includes(requested) ? requested : 1;
  const media = '../assets/media/';
  const item = (id, sentence, image, questionImage) => ({id, label:id, sentence, image:media+image, questionImage:questionImage ? media+questionImage : media+image});
  const lessons = {
    1: {title:'Which sports?', question:'Which sport do you like?', items:[
      item('soccer','I like soccer.','https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-a/games/games/week-1/regular/soccer-kick-boy-v2.png'),
      item('basketball','I like basketball.','https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-a/games/games/week-1/regular/basketball-dribble-girl-v1.png'),
      item('baseball','I like baseball.','https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-a/games/games/week-1/regular/baseball-batter-boy-v1.png'),
      item('volleyball','I like volleyball.','https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-a/games/games/week-1/regular/volleyball-bump-girl-v1.png')
    ]},
    2: {title:'Where do you exercise?', question:'Where do you exercise?', items:[
      item('bike','At the gym. I use a bike.','https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-a/games/games/week-2/bike-equipment-v1.png','https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-a/games/literacy/week-2-games/bike-rider.png'),
      item('dumbbells','At the gym. I use dumbbells.','https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-a/games/games/week-2/dumbbells-equipment-v1.png','https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-a/games/literacy/week-2-games/dumbbell-curl.png'),
      item('barbell','At the gym. I use a barbell.','https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-a/games/games/week-2/barbell-equipment-v1.png'),
      item('bench','At the gym. I use a bench.','https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-a/games/games/week-2/bench-equipment-v1.png','https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-a/games/literacy/week-2-games/bench-ready.png')
    ]},
    3: {title:'What do soccer players do?', question:'What do soccer players do?', items:[
      item('run','Soccer players run.','https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-a/games/literacy/week-3-games/run-a.png'),
      item('pass','Soccer players pass.','https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-a/games/games/week-3/pass.png'),
      item('tackle','Soccer players tackle.','https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-a/games/games/week-3/tackle.png'),
      item('kick','Soccer players kick.','https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-a/games/games/week-3/kick-red-ball-v1.png'),
      item('jump','Soccer players jump.','https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-a/games/literacy/week-3-games/jump.png')
    ]},
    4: {title:'What do you need?', question:'What do you need?', items:[
      item('sportswear','I need sportswear.','https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-a/games/games/week-4/sportswear.png'),
      item('sneakers','I need sneakers.','https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-a/games/games/week-4/sneakers.png'),
      item('swimsuit','I need a swimsuit.','https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-a/games/games/week-4/swimsuit.png'),
      item('helmet','I need a helmet.','https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-a/games/games/week-4/helmet.png'),
      item('socks','I need socks.','https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-a/games/games/week-4/socks.png')
    ]}
  };
  const lesson = lessons[week];
  window.WeeklyGames = {...lesson, week};
  if (week > 1 && !document.body.classList.contains('game-list-page')) document.title += ` — Week ${week}`;
  const home = week === 1 ? 'index.html' : `week-${week}.html`;
  const navigation = document.querySelector('gp-navigation');
  if (navigation) {
    navigation.dataset.weekHref = `../week-${week}.html#card-games`;
    navigation.dataset.sectionHref = home;
    if (navigation.hasAttribute('data-previous-href')) navigation.dataset.previousHref = home;
    navigation.dataset.trail = `Level A · Week ${week} · Games`;
  }
  document.querySelectorAll('a.match-home').forEach(link => {link.href=home;});
  if (document.body.classList.contains('game-list-page')) {
    document.title = `Games — Level A Week ${week}`;
    document.querySelector('.game-list-subtitle').textContent = `Week ${week} — ${lesson.title}`;
    document.querySelector('.week-games-panel').setAttribute('aria-label',`Week ${week} games`);
    document.querySelector('.week-games-heading').innerHTML = `<span class="week-games-number">${week}</span> ${lesson.title}`;
    document.querySelectorAll('.game-nav-card').forEach(link => {
      const url = new URL(link.href); url.searchParams.set('week',week); link.href=url.href;
    });
  }
  if (document.body.classList.contains('memory-game')) {
    document.querySelector('.m7-game-header p').textContent = `Look carefully, then find the ${lesson.items.length} matching pairs!`;
    const status = document.querySelector('#pairs')?.parentElement;
    if (status) status.lastChild.textContent = ` / ${lesson.items.length}`;
    if (lesson.items.length === 5) {
      const board = document.querySelector('#board');
      board.style.gridTemplateColumns = 'repeat(5,minmax(0,1fr))';
      board.style.maxWidth = '900px';
    }
  }
})();
