export const gameMeta = { week: 3, topic: "Animals That Hunt and Fly", review: "Animals That Hunt and Fly", wheelIcon: "🦅", completion: "Wildlife Expert!" };
const animalRoot = "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/assets/literacy/week-3/reading";
export const gameItems = [
  { id: "eagle", label: "eagle hunts and flies", sentence: "An eagle hunts and flies.", group: "Wildlife", wheelIcon: "🦅", image: `${animalRoot}/eagle-landscape-v1.png`, gameImage: "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/assets/games/cutouts/week-3/eagle.png?asset=4ef08b214e4c" },
  { id: "lion", label: "lion hunts on land", sentence: "A lion hunts on land.", group: "Wildlife", wheelIcon: "🦁", image: `${animalRoot}/lion-landscape-v1.png`, gameImage: "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/assets/games/cutouts/week-3/lion.png?asset=2531e5d1a493" },
  { id: "falcon", label: "falcon hunts from the sky", sentence: "A falcon hunts from the sky.", group: "Wildlife", wheelIcon: "🦅", image: `${animalRoot}/falcon-landscape-v1.png`, gameImage: "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/assets/games/cutouts/week-3/falcon.png?asset=824c69f41f86" },
  { id: "owl", label: "owl flies in the dark", sentence: "An owl flies in the dark.", group: "Wildlife", wheelIcon: "🦉", image: `${animalRoot}/owl-landscape-v1.png`, gameImage: "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/assets/games/cutouts/week-3/owl.png?asset=bacfba6dd821" },
  { id: "butterfly", label: "butterfly flies in the day", sentence: "A butterfly flies in the day.", group: "Wildlife", wheelIcon: "🦋", image: `${animalRoot}/butterfly-landscape-v1.png`, gameImage: "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/assets/games/cutouts/week-3/butterfly.png?asset=fbd156cf6aee" }
];
export function shuffle(items) { const copy = [...items]; for (let index = copy.length - 1; index > 0; index -= 1) { const other = Math.floor(Math.random() * (index + 1)); [copy[index], copy[other]] = [copy[other], copy[index]]; } return copy; }
// Memory and wheel review Speech Book; matching games retain the literacy deck.
export const speechMeta = { topic: "Moon Phases", wheelIcon: "🌙" };
const speechGameRoot = "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/assets/games/cutouts/speech/";
const speechCards = [
  {"id":"full-moon","label":"full moon","sentence":"It is a full moon. It looks like a bright circle.","image":"https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/assets/literacy/week-2/page-05-choices/full-moon-v2.png?asset=95f249cdd0c4"},
  {"id":"new-moon","label":"new moon","sentence":"It is a new moon. We cannot see the moon.","image":"https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/assets/literacy/week-2/page-05-choices/new-moon-v2.png?asset=00ab518f47d2"},
  {"id":"waxing-moon","label":"waxing moon","sentence":"It is a waxing moon. The bright part is getting bigger.","image":"https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/assets/literacy/week-2/page-05-choices/waxing-moon-v2.png?asset=f966d054cb74"},
  {"id":"waning-moon","label":"waning moon","sentence":"It is a waning moon. The bright part is getting smaller.","image":"https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/assets/literacy/week-2/page-05-choices/waning-moon-v2.png?asset=d2b96c0f493b"},
];
export const speechItems = speechCards.map(item => ({ ...item, gameImage: speechGameRoot + item.id + "-v1.png" }));
