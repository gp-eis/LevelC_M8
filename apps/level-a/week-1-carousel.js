const track = document.querySelector(".learning-carousel");
const cards = [...document.querySelectorAll(".learning-card")];
const dots = [...document.querySelectorAll(".carousel-dot")];
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
const returnCards = { "#card-literacy": 0, "#card-reading": 1, "#card-phonics": 2, "#card-games": 3 };
let active = returnCards[location.hash] ?? 0;
let scrollTimer;

function updateState(index) {
  active = Math.max(0, Math.min(cards.length - 1, index));
  cards.forEach((card, position) => card.classList.toggle("is-active", position === active));
  dots.forEach((dot, position) => {
    const current = position === active;
    dot.classList.toggle("is-active", current);
    current ? dot.setAttribute("aria-current", "true") : dot.removeAttribute("aria-current");
  });
}

function show(index) {
  updateState(index);
  const card = cards[active];
  if (!track || !card) return;
  const centeredLeft = card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2;
  track.scrollTo({ left: Math.max(0, centeredLeft), behavior: reducedMotion.matches ? "auto" : "smooth" });
}

document.querySelector(".carousel-arrow.prev")?.addEventListener("click", () => show(active - 1));
document.querySelector(".carousel-arrow.next")?.addEventListener("click", () => show(active + 1));
dots.forEach((dot, index) => dot.addEventListener("click", () => show(index)));
track?.addEventListener("scroll", () => {
  clearTimeout(scrollTimer);
  scrollTimer = setTimeout(() => {
    const middle = track.getBoundingClientRect().left + track.clientWidth / 2;
    const closest = cards.reduce((best, card, index) => {
      const distance = Math.abs(card.getBoundingClientRect().left + card.offsetWidth / 2 - middle);
      return distance < best.distance ? { index, distance } : best;
    }, { index: active, distance: Infinity });
    updateState(closest.index);
  }, 90);
}, { passive: true });
addEventListener("load", () => show(active), { once: true });
