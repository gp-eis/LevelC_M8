window.FlashcardItems=['tea','cake','pancakes','chicken'].map(id=>({
  id,label:'Honey '+id[0].toUpperCase()+id.slice(1),phrase:id,
  image:`https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-b/assets/flashcards/week-3/${id}-flashcard-v1.png`,
  sentence:`We can make honey ${id}.`
}));
