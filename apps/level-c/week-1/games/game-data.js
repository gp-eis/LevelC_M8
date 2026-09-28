export const gameMeta = { week: 1, topic: "Animals and Things We See", review: "Park, Garden, Yard, and Cave", wheelIcon: "🌳", completion: "Nature Expert!" };
const flashcardRoot = "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/assets/flashcards/week-1";
const reviewRoot = `${flashcardRoot}/review`;
const cutoutRoot = "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/assets/games/cutouts/week-1";

export const gameItems = [
  {id:"dog",label:"dog sitting",sentence:"There is a dog sitting on the grass.",group:"Park",image:`${flashcardRoot}/dog-sitting.webp`,gameImage:`${cutoutRoot}/dog.png`},
  {id:"cat",label:"cat yawning",sentence:"There is a cat yawning on the path.",group:"Park",image:`${flashcardRoot}/cat-yawning.webp`,gameImage:`${cutoutRoot}/cat.png`},
  {id:"squirrel",label:"squirrel playing",sentence:"There is a squirrel playing by the tree.",group:"Park",image:`${flashcardRoot}/squirrel-playing.webp`,gameImage:`${cutoutRoot}/squirrel.png`},
  {id:"deer",label:"deer walking",sentence:"There is a deer walking on the grass.",group:"Park",image:`${flashcardRoot}/deer-walking.webp`,gameImage:`${cutoutRoot}/deer.png`},
  {id:"eagle",label:"eagle hunting",sentence:"There is an eagle hunting in the sky.",group:"Park",image:`${flashcardRoot}/eagle-hunting.webp`,gameImage:`${cutoutRoot}/eagle.png`},
  {id:"ladybug",label:"red ladybug",sentence:"They see a red ladybug on the flower.",group:"Garden",image:`${reviewRoot}/red-ladybug.png`,gameImage:`${cutoutRoot}/red-ladybug.png`},
  {id:"ant",label:"brown ant",sentence:"They see a brown ant on the rain boots.",group:"Garden",image:`${reviewRoot}/brown-ant.png`,gameImage:`${cutoutRoot}/brown-ant.png`},
  {id:"fence",label:"tall fence",sentence:"They see a tall fence in the garden.",group:"Garden",image:`${reviewRoot}/tall-fence.png`,gameImage:`${cutoutRoot}/tall-fence.png`},
  {id:"cactus",label:"green cactus",sentence:"They see a green cactus by the fence.",group:"Garden",image:`${reviewRoot}/green-cactus.png`,gameImage:`${cutoutRoot}/green-cactus.png`},
  {id:"snail",label:"small snail",sentence:"They see a small snail on the fence.",group:"Garden",image:`${reviewRoot}/small-snail.png`,gameImage:`${cutoutRoot}/small-snail.png`},
  {id:"car",label:"blue car",sentence:"The dog is barking at the blue car.",group:"Yard",image:`${reviewRoot}/blue-car.png`,gameImage:`${cutoutRoot}/blue-car.png`},
  {id:"scooter",label:"purple scooter",sentence:"The dog is barking at the purple scooter.",group:"Yard",image:`${reviewRoot}/purple-scooter.png`,gameImage:`${cutoutRoot}/purple-scooter.png`},
  {id:"owl",label:"brown owl",sentence:"The dog is barking at the brown owl.",group:"Yard",image:`${reviewRoot}/brown-owl.png`,gameImage:`${cutoutRoot}/brown-owl.png`},
  {id:"moon",label:"white moon",sentence:"The dog is barking at the white moon.",group:"Yard",image:`${reviewRoot}/white-moon.png`,gameImage:`${cutoutRoot}/white-moon.png`},
  {id:"spiders",label:"two spiders",sentence:"The two spiders are scary.",group:"Cave",image:`${reviewRoot}/two-spiders.png`,gameImage:`${cutoutRoot}/two-spiders.png`},
  {id:"monster",label:"one monster",sentence:"The one monster is scary.",group:"Cave",image:`${reviewRoot}/one-monster.png`,gameImage:`${cutoutRoot}/one-monster.png`},
  {id:"ghosts",label:"three ghosts",sentence:"The three ghosts are scary.",group:"Cave",image:`${cutoutRoot}/three-ghosts.png`,gameImage:`${cutoutRoot}/three-ghosts.png`},
  {id:"bats",label:"four bats",sentence:"The four bats are scary.",group:"Cave",image:`${reviewRoot}/four-bats.png`,gameImage:`${cutoutRoot}/four-bats.png`}
];

export const natureItems = gameItems.map(item => ({ ...item, icon: "⭐", place: item.group }));

export const phonicsWords = [
  {id:"car",word:"car",before:"c",team:"ar",after:"",image:"https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/assets/phonics/words/car.png",sentence:"The car is red."},
  {id:"star",word:"star",before:"st",team:"ar",after:"",image:"https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/assets/phonics/words/star.png",sentence:"The star is bright."},
  {id:"fork",word:"fork",before:"f",team:"or",after:"k",image:"https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/assets/phonics/words/fork.png",sentence:"This is a fork."},
  {id:"horse",word:"horse",before:"h",team:"or",after:"se",image:"https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/assets/phonics/words/horse.png",sentence:"The horse is brown."}
];

export function shuffle(items){
  const copy=[...items];
  for(let index=copy.length-1;index>0;index-=1){const other=Math.floor(Math.random()*(index+1));[copy[index],copy[other]]=[copy[other],copy[index]];}
  return copy;
}
