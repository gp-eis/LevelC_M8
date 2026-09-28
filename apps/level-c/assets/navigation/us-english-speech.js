// Enforce American English for every browser-generated voice on Language pages.
// Device locale must never choose a Korean or non-US voice for English text.
const synthesis = window.speechSynthesis;

if (synthesis && !window.GP_US_ENGLISH) {
  const isAmerican = voice => /^en[-_]US$/i.test(voice?.lang || "")
    || /Google US English|English.*United States|Microsoft (Aria|Jenny|Zira|Guy)|Samantha|Ava|Allison|Joanna/i.test(voice?.name || "");

  const chooseAmericanVoice = () => {
    const voices = synthesis.getVoices?.() || [];
    const american = voices.filter(isAmerican);
    return american.find(voice => /Aria|Jenny|Samantha|Ava|Allison|Joanna|Zira|Google/i.test(voice.name))
      || american[0]
      || null;
  };

  const prepare = utterance => {
    if (!utterance) return utterance;
    utterance.lang = "en-US";
    if (!isAmerican(utterance.voice)) utterance.voice = chooseAmericanVoice();
    return utterance;
  };

  const nativeSpeak = synthesis.speak.bind(synthesis);
  synthesis.speak = utterance => nativeSpeak(prepare(utterance));
  window.GP_US_ENGLISH = { prepare, chooseVoice: chooseAmericanVoice, language: "en-US" };
}
