export const gameMeta = { week: 4, topic: "Animals That Sleep", review: "Where Animals Sleep", wheelIcon: "🌙", completion: "Sleeping Animals Expert!" };
const animalRoot = "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/assets/literacy/week-4/reading";
const catRoot = "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/assets/literacy/week-4/cats";
export const gameItems = [
  { id: "tiger", label: "tiger sleeps", sentence: "A tiger sleeps.", group: "Animal", wheelIcon: "🐯", image: `${catRoot}/tiger-sleeping-v2.png`, gameImage: "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/assets/games/cutouts/week-4/tiger.png?asset=23d3e047e738" },
  { id: "koala", label: "koala sleeps on branches", sentence: "A koala sleeps on the branches.", group: "Animal", wheelIcon: "🐨", image: `${animalRoot}/koala-landscape-v1.png`, gameImage: "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/assets/games/cutouts/week-4/koala.png?asset=b0bfc3fdce83" },
  { id: "hamster", label: "hamster sleeps underground", sentence: "A hamster sleeps underground.", group: "Animal", wheelIcon: "🐹", image: `${animalRoot}/hamster-landscape-v1.png`, gameImage: "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/assets/games/cutouts/week-4/hamster.png?asset=cabffdbda9e3" },
  { id: "panda", label: "panda sleeps on the forest floor", sentence: "A panda sleeps on the forest floor.", group: "Animal", wheelIcon: "🐼", image: `${animalRoot}/panda-landscape-v1.png`, gameImage: "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/assets/games/cutouts/week-4/panda.png?asset=80682caa3731" },
  { id: "bear", label: "bear sleeps in a den", sentence: "A bear sleeps in a den.", group: "Animal", wheelIcon: "🐻", image: `${animalRoot}/bear-landscape-v1.png`, gameImage: "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/assets/games/cutouts/week-4/bear.png?asset=ed790f07fbdc" }
];
export function shuffle(items) { const copy = [...items]; for (let index = copy.length - 1; index > 0; index -= 1) { const other = Math.floor(Math.random() * (index + 1)); [copy[index], copy[other]] = [copy[other], copy[index]]; } return copy; }
// Memory and wheel review Speech Book; matching games retain the literacy deck.
export const speechMeta = { topic: "Times of the Day", wheelIcon: "🌅" };
const speechGameRoot = "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/assets/games/cutouts/speech/";
const speechCards = [
  {"id":"sunrise","label":"sunrise","sentence":"When the sun rises in the morning, it is sunrise.","image":"https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/assets/literacy/week-2/page-04-clues/sunrise.png?asset=b9c2a5c9f9b8"},
  {"id":"sunset","label":"sunset","sentence":"When the sun sets in the evening, it is sunset.","image":"https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/assets/literacy/week-2/page-04-clues/evening.png?asset=f05f5f84e2c3"},
  {"id":"midday","label":"midday","sentence":"It is midday when it is twelve o’clock in the day.","image":"https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/assets/flashcards/week-2/literacy/midday-v1.png?asset=7c5cd7526366"},
  {"id":"midnight","label":"midnight","sentence":"It is midnight when it is twelve o’clock at night.","image":"https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/assets/flashcards/week-2/literacy/midnight-v1.png?asset=f2c440aa6b2c"},
];
export const speechItems = speechCards.map(item => ({ ...item, gameImage: speechGameRoot + item.id + "-v1.png" }));
