export const gameMeta = { week: 4, topic: "Animals That Sleep", review: "Where Animals Sleep", wheelIcon: "🌙", completion: "Sleeping Animals Expert!" };
const animalRoot = "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/assets/literacy/week-4/reading";
const catRoot = "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/assets/literacy/week-4/cats";
export const gameItems = [
  { id: "tiger", label: "tiger sleeps", sentence: "A tiger sleeps.", group: "Animal", wheelIcon: "🐯", image: `${catRoot}/tiger-sleeping-v2.png`, gameImage: "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/assets/games/cutouts/week-4/tiger.png" },
  { id: "koala", label: "koala sleeps on branches", sentence: "A koala sleeps on the branches.", group: "Animal", wheelIcon: "🐨", image: `${animalRoot}/koala-landscape-v1.png`, gameImage: "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/assets/games/cutouts/week-4/koala.png" },
  { id: "hamster", label: "hamster sleeps underground", sentence: "A hamster sleeps underground.", group: "Animal", wheelIcon: "🐹", image: `${animalRoot}/hamster-landscape-v1.png`, gameImage: "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/assets/games/cutouts/week-4/hamster.png" },
  { id: "panda", label: "panda sleeps on the forest floor", sentence: "A panda sleeps on the forest floor.", group: "Animal", wheelIcon: "🐼", image: `${animalRoot}/panda-landscape-v1.png`, gameImage: "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/assets/games/cutouts/week-4/panda.png" },
  { id: "bear", label: "bear sleeps in a den", sentence: "A bear sleeps in a den.", group: "Animal", wheelIcon: "🐻", image: `${animalRoot}/bear-landscape-v1.png`, gameImage: "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/assets/games/cutouts/week-4/bear.png" }
];
export function shuffle(items) { const copy = [...items]; for (let index = copy.length - 1; index > 0; index -= 1) { const other = Math.floor(Math.random() * (index + 1)); [copy[index], copy[other]] = [copy[other], copy[index]]; } return copy; }
