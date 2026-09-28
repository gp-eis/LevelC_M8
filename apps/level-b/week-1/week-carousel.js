const track = document.querySelector('.learning-carousel');
const cards = [...document.querySelectorAll('.learning-card')];
const dots = [...document.querySelectorAll('.carousel-dot')];
const previous = document.querySelector('.carousel-arrow.prev');
const next = document.querySelector('.carousel-arrow.next');
const hashCards = { '#card-literacy': 0, '#card-reading': 1, '#card-phonics': 2, '#card-games': 3 };
let active = Math.min(hashCards[location.hash] ?? 0, cards.length - 1);

function update() {
  cards.forEach((card, index) => card.classList.toggle('is-active', index === active));
  dots.forEach((dot, index) => {
    dot.classList.toggle('is-active', index === active);
    dot.setAttribute('aria-current', index === active ? 'true' : 'false');
  });
  previous.disabled = active === 0;
  next.disabled = active === cards.length - 1;
}

function show(index, focusCard = false) {
  active = Math.max(0, Math.min(cards.length - 1, index));
  update();
  const card = cards[active];
  track.scrollTo({
    left: card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2,
    behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
  });
  if (focusCard) cards[active].focus({ preventScroll: true });
}

previous.addEventListener('click', () => show(active - 1, true));
next.addEventListener('click', () => show(active + 1, true));
dots.forEach((dot, index) => dot.addEventListener('click', () => show(index)));
track.addEventListener('keydown', event => {
  if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
  event.preventDefault();
  show(active + (event.key === 'ArrowRight' ? 1 : -1), true);
});

let scrollTimer;
track.addEventListener('scroll', () => {
  clearTimeout(scrollTimer);
  scrollTimer = window.setTimeout(() => {
    const middle = track.getBoundingClientRect().left + track.clientWidth / 2;
    active = cards.reduce((best, card, index) => {
      const distance = Math.abs(card.getBoundingClientRect().left + card.offsetWidth / 2 - middle);
      return distance < best.distance ? { index, distance } : best;
    }, { index: active, distance: Infinity }).index;
    update();
  }, 90);
}, { passive: true });

addEventListener('load', () => show(active), { once: true });
update();
