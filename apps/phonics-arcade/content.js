const A_ROOT = "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-a/assets/media/phonics";
const B_ROOT = "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-b/assets/phonics/week-1";
const C_ROOT = "https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/assets/phonics/words";

const makeA = (week, names) => names.map(word => ({
  word,
  image: `${A_ROOT}/week-${week}/elements/${word}-3d-v1.png`,
  sound: word[0],
}));

const makeB = names => names.map(word => ({
  word,
  image: `${B_ROOT}/${word}-3d-v1.png`,
  sound: word.slice(-2),
}));

const makeC = entries => entries.map(([word, team]) => ({
  word,
  image: `${C_ROOT}/${word}.png`,
  sound: team,
  team,
}));

const aWeeks = {
  1: makeA(1, ["octopus", "olive", "omelet"]),
  2: makeA(2, ["orange", "otter", "ox"]),
  3: makeA(3, ["paint", "pen", "pencil"]),
  4: makeA(4, ["penguin", "piano", "pig"]),
};

const bFamilies = {
  ug: makeB(["bug", "mug", "rug"]),
  um: makeB(["drum", "gum", "plum"]),
  un: makeB(["bun", "nun", "sun"]),
};

const bWeeks = {
  1: bFamilies.ug,
  2: bFamilies.um,
  3: bFamilies.un,
  4: [...bFamilies.ug, ...bFamilies.um, ...bFamilies.un],
};

const cFirst = makeC([["car", "ar"], ["star", "ar"], ["fork", "or"], ["horse", "or"]]);
const cSecond = makeC([["soccer", "er"], ["water", "er"], ["bird", "ir"], ["girl", "ir"]]);
const cWeeks = { 1: cFirst, 2: cFirst, 3: cSecond, 4: cSecond };

const levelNames = { a: "Level A", b: "Level B", c: "Level C" };

function aDisplay(word, week) {
  if (week === 1 || week === 3) return word[0].toUpperCase() + word.slice(1).toLowerCase();
  return word.toLowerCase();
}

function cTokens(item) {
  const index = item.word.indexOf(item.team);
  const before = item.word.slice(0, index).split("");
  const after = item.word.slice(index + item.team.length).split("");
  return [...before, item.team, ...after];
}

export function getContent(level, week) {
  const words = level === "a" ? aWeeks[week] : level === "b" ? bWeeks[week] : cWeeks[week];
  const displayWords = words.map(item => ({
    ...item,
    display: level === "a" ? aDisplay(item.word, week) : item.word.toLowerCase(),
    tokens: level === "c" ? cTokens(item) : [...(level === "a" ? aDisplay(item.word, week) : item.word.toLowerCase())],
  }));

  let basketGroups;
  let echoSounds;
  if (level === "a") {
    basketGroups = [
      { id: "o", label: "O sound", items: [...aWeeks[1], ...aWeeks[2]].slice(0, 3) },
      { id: "p", label: "P sound", items: [...aWeeks[3], ...aWeeks[4]].slice(0, 3) },
    ];
    echoSounds = ["o", "p"];
  } else if (level === "b") {
    const pairs = { 1: ["ug", "um"], 2: ["um", "un"], 3: ["un", "ug"], 4: ["ug", "un"] }[week];
    basketGroups = pairs.map(id => ({ id, label: `${id} family`, items: bFamilies[id].slice(0, 3) }));
    echoSounds = pairs;
  } else {
    const pair = week <= 2 ? ["ar", "or"] : ["er", "ir"];
    basketGroups = pair.map(id => ({ id, label: `${id} team`, items: displayWords.filter(item => item.team === id) }));
    echoSounds = week <= 2 ? ["ar", "or", "ir"] : ["er", "ir", "ar"];
  }

  const echoLengths = level === "c" ? [3, 3, 4] : [2, 3, 3];
  return {
    level,
    levelName: levelNames[level],
    week,
    words: displayWords,
    basketGroups,
    echoSounds,
    echoLengths,
  };
}

export function shuffle(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swap]] = [copy[swap], copy[index]];
  }
  return copy;
}
