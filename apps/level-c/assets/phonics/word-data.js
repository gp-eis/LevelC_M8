const WORD_IMAGE_ROOT = "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/assets/phonics/words";

const weeksOneAndTwo = [
  {
    id: "car",
    word: "car",
    before: "c",
    team: "ar",
    after: "",
    sentence: "The car is red.",
    image: `${WORD_IMAGE_ROOT}/car.png`,
  },
  {
    id: "star",
    word: "star",
    before: "st",
    team: "ar",
    after: "",
    sentence: "The star is bright.",
    image: `${WORD_IMAGE_ROOT}/star.png`,
  },
  {
    id: "fork",
    word: "fork",
    before: "f",
    team: "or",
    after: "k",
    sentence: "This is a fork.",
    image: `${WORD_IMAGE_ROOT}/fork.png`,
  },
  {
    id: "horse",
    word: "horse",
    before: "h",
    team: "or",
    after: "se",
    sentence: "The horse is brown.",
    image: `${WORD_IMAGE_ROOT}/horse.png`,
  },
];

const weeksThreeAndFour = [
  {
    id: "soccer",
    word: "soccer",
    before: "socc",
    team: "er",
    after: "",
    sentence: "The children play soccer.",
    image: `${WORD_IMAGE_ROOT}/soccer.png`,
  },
  {
    id: "water",
    word: "water",
    before: "wat",
    team: "er",
    after: "",
    sentence: "The water is cold.",
    image: `${WORD_IMAGE_ROOT}/water.png`,
  },
  {
    id: "bird",
    word: "bird",
    before: "b",
    team: "ir",
    after: "d",
    sentence: "The bird can fly.",
    image: `${WORD_IMAGE_ROOT}/bird.png`,
  },
  {
    id: "girl",
    word: "girl",
    before: "g",
    team: "ir",
    after: "l",
    sentence: "The girl is smiling.",
    image: `${WORD_IMAGE_ROOT}/girl.png`,
  },
];

export const phonicsSets = {
  1: weeksOneAndTwo,
  2: weeksOneAndTwo,
  3: weeksThreeAndFour,
  4: weeksThreeAndFour,
};

export const weekFocus = {
  1: { teams: "ar and or", words: "car, star, fork, and horse" },
  2: { teams: "ar and or", words: "car, star, fork, and horse" },
  3: { teams: "er and ir", words: "soccer, water, bird, and girl" },
  4: { teams: "er and ir", words: "soccer, water, bird, and girl" },
};

export const teamChoices = ["ar", "or", "er", "ir"];

export function getWeekNumber(pathname = window.location.pathname) {
  const match = pathname.match(/week-(\d+)/i);
  return Math.min(4, Math.max(1, Number(match?.[1]) || 1));
}

export function shuffle(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}
