window.FlashcardItems=['tummy','throat','body','skin'].map(id=>({
  id,label:id[0].toUpperCase()+id.slice(1),phrase:id,
  image:`https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-b/assets/flashcards/week-4/${id}-flashcard-v1.png`,
  sentence:`It's good for our ${id}.`
}));
