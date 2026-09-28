(() => {
  const video = document.querySelector('#week2-video');
  const play = document.querySelector('#week2-play');
  const status = document.querySelector('#week2-now-playing');
  const error = document.querySelector('#week2-video-error');
  const choices = [...document.querySelectorAll('[data-clip]')];
  let request = 0;
  async function start() {
    const current = ++request;
    error.hidden = true;
    try { await video.play(); }
    catch (failure) {
      if (current !== request || failure.name === 'AbortError') return;
      play.hidden = false;
      error.hidden = false;
    }
  }
  document.addEventListener('week2-watch-video', event => {
    const button = choices.find(choice => choice.dataset.clip === event.detail);
    if (!button) return;
    video.pause();
    choices.forEach(choice => {
      const selected = choice === button;
      choice.classList.toggle('is-active', selected);
      choice.setAttribute('aria-pressed', String(selected));
    });
    status.textContent = button.textContent;
    video.setAttribute('aria-label', `${button.textContent} conversation`);
    // One combined file per choice: always replay the complete shared opening.
    video.src = `https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/exports/level-a/week-2/LevelA_M8_W2_${button.dataset.clip}_music-v1.mp4`;
    video.load();
    start();
  });
  play.addEventListener('click', start);
  video.addEventListener('play', () => { play.hidden = true; });
  video.addEventListener('pause', () => { play.hidden = false; });
  video.addEventListener('ended', () => { play.hidden = false; });
  video.addEventListener('error', () => { error.hidden = false; play.hidden = false; });
})();
