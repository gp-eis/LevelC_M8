(function () {
  'use strict';

  const A = '/LevelC_M8/apps/level-a/assets/media/';
  const B = '/LevelC_M8/apps/level-b/assets/';
  const C = '/LevelC_M8/apps/level-c/assets/';
  const item = (id, label, sentence, image) => ({ id, label, sentence, image });
  const lessons = {
    a: {
      1: { title: 'Which sports?', items: [
        item('soccer','soccer','I like soccer.',`${A}games/week-1/regular/soccer-kick-boy-v2.png`),
        item('basketball','basketball','I like basketball.',`${A}games/week-1/regular/basketball-dribble-girl-v1.png`),
        item('baseball','baseball','I like baseball.',`${A}games/week-1/regular/baseball-batter-boy-v1.png`),
        item('volleyball','volleyball','I like volleyball.',`${A}games/week-1/regular/volleyball-bump-girl-v1.png`)
      ]},
      2: { title: 'Where do you exercise?', items: [
        item('bike','bike','At the gym. I use a bike.',`${A}games/week-2/bike-equipment-v1.png`),
        item('dumbbells','dumbbells','At the gym. I use dumbbells.',`${A}games/week-2/dumbbells-equipment-v1.png`),
        item('barbell','barbell','At the gym. I use a barbell.',`${A}games/week-2/barbell-equipment-v1.png`),
        item('bench','bench','At the gym. I use a bench.',`${A}games/week-2/bench-equipment-v1.png`)
      ]},
      3: { title: 'What do soccer players do?', items: [
        item('run','run','Soccer players run.',`${A}literacy/week-3-games/run-a.png`),
        item('pass','pass','Soccer players pass.',`${A}games/week-3/pass.png`),
        item('tackle','tackle','Soccer players tackle.',`${A}games/week-3/tackle.png`),
        item('kick','kick','Soccer players kick.',`${A}games/week-3/kick-red-ball-v1.png`),
        item('jump','jump','Soccer players jump.',`${A}literacy/week-3-games/jump.png`)
      ]},
      4: { title: 'What do you need?', items: [
        item('sportswear','sportswear','I need sportswear.',`${A}games/week-4/sportswear.png`),
        item('sneakers','sneakers','I need sneakers.',`${A}games/week-4/sneakers.png`),
        item('swimsuit','swimsuit','I need a swimsuit.',`${A}games/week-4/swimsuit.png`),
        item('helmet','helmet','I need a helmet.',`${A}games/week-4/helmet.png`),
        item('socks','socks','I need socks.',`${A}games/week-4/socks.png`)
      ]}
    },
    b: {
      1: { title: 'Where are the bees?', items: ['flowers','lamp','trees','bench','grass'].map(id => item(id,id,`There are bees near the ${id}.`,`${B}games/week-1/${id}-3d-v1.png`)) },
      2: { title: 'Is honey good for you?', items: ['healthy','natural','sweet','healing'].map(id => item(id,id,`Honey is ${id}.`,`${B}games/week-2/${id}-3d-v1.png`)) },
      3: { title: 'What can we make with honey?', items: ['tea','cake','pancakes','chicken'].map(id => item(id,id,`We can make honey ${id}.`,`${B}games/week-3/${id}-3d-v1.png`)) },
      4: { title: 'Why is it good?', items: ['tummy','throat','body','skin'].map(id => item(id,id,`It is good for our ${id}.`,`${B}games/week-4/${id}-3d-v1.png`)) }
    },
    c: {
      1: { title: 'Animals and things we see', items: [
        item('dog','dog sitting','There is a dog sitting on the grass.',`${C}games/cutouts/week-1/dog.png`),
        item('cat','cat yawning','There is a cat yawning on the path.',`${C}games/cutouts/week-1/cat.png`),
        item('squirrel','squirrel playing','There is a squirrel playing by the tree.',`${C}games/cutouts/week-1/squirrel.png`),
        item('deer','deer walking','There is a deer walking on the grass.',`${C}games/cutouts/week-1/deer.png`),
        item('eagle','eagle hunting','There is an eagle hunting in the sky.',`${C}games/cutouts/week-1/eagle.png`),
        item('ladybug','red ladybug','They see a red ladybug on the flower.',`${C}games/cutouts/week-1/red-ladybug.png`)
      ]},
      2: { title: 'Bee and butterfly parts', items: [
        item('abdomen','abdomen','The bee has one abdomen.',`${C}games/cutouts/week-2/bee-abdomen.png`),
        item('antennae','antennae','The bee has two antennae.',`${C}games/cutouts/week-2/bee-antennae.png`),
        item('wings','wings','The bee has four wings.',`${C}games/cutouts/week-2/bee-wings.png`),
        item('eyes','eyes','The bee has five eyes.',`${C}games/cutouts/week-2/bee-eyes.png`),
        item('legs','legs','The bee has six legs.',`${C}games/cutouts/week-2/bee-legs.png`)
      ]},
      3: { title: 'Animals that hunt and fly', items: [
        item('eagle','eagle','An eagle hunts and flies.',`${C}games/cutouts/week-3/eagle.png`),
        item('lion','lion','A lion hunts on land.',`${C}games/cutouts/week-3/lion.png`),
        item('falcon','falcon','A falcon hunts from the sky.',`${C}games/cutouts/week-3/falcon.png`),
        item('owl','owl','An owl flies in the dark.',`${C}games/cutouts/week-3/owl.png`),
        item('butterfly','butterfly','A butterfly flies in the day.',`${C}games/cutouts/week-3/butterfly.png`)
      ]},
      4: { title: 'Where animals sleep', items: [
        item('tiger','tiger','A tiger sleeps.',`${C}games/cutouts/week-4/tiger.png`),
        item('koala','koala','A koala sleeps on the branches.',`${C}games/cutouts/week-4/koala.png`),
        item('hamster','hamster','A hamster sleeps underground.',`${C}games/cutouts/week-4/hamster.png`),
        item('panda','panda','A panda sleeps on the forest floor.',`${C}games/cutouts/week-4/panda.png`),
        item('bear','bear','A bear sleeps in a den.',`${C}games/cutouts/week-4/bear.png`)
      ]}
    }
  };

  const params = new URLSearchParams(location.search);
  const level = (params.get('level') || 'a').toLowerCase();
  const week = Math.max(1, Math.min(4, Number(params.get('week')) || 1));
  const lesson = lessons[level]?.[week] || lessons.a[1];
  window.GPGeneralArcade = {
    level, week, title: lesson.title,
    items: lesson.items.map(entry => ({ ...entry })),
    returnUrl: params.get('return') || `/LevelC_M8/apps/level-${level}/games/${week === 1 ? 'index.html' : `week-${week}.html`}`,
    say(text) {
      if (!('speechSynthesis' in window)) return;
      speechSynthesis.cancel();
      const voice = new SpeechSynthesisUtterance(text);
      voice.lang = 'en-US'; voice.rate = .82; voice.pitch = 1.08;
      speechSynthesis.speak(voice);
    }
  };
})();
