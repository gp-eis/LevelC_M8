const activityRoute = /\/apps\/level-[abc]\/(?:.*\/)?(?:literacy|reading|phonics|games|lessons)\//i;

function isActivityPage() {
  return activityRoute.test(location.pathname);
}

function findActivityFocus() {
  const selectors = [
    "[data-activity-focus]",
    "#play-area .game-board",
    "#game-board",
    "#game-content .round-card",
    "#game-content",
    ".phonics-board",
    ".match-board",
    ".pick-board",
    ".memory-board",
    ".find-board",
    ".maze-board",
    ".bird-game",
    ".word-book-board",
    ".horse-label-board",
    ".moon-stage-card",
    ".moon-picture-card",
    ".reading-scene",
    ".source-pair",
    ".media-stage",
    ".video-slot",
    ".sequence-card--landscape",
    ".sequence-card",
    ".fc-board",
    ".track-card",
    ".lesson-card",
    ".game-board",
    ".phonics-grid",
    ".game-card-grid",
    ".baseline-grid",
    ".game-grid",
    ".game-list",
    "#lesson-focus"
  ];
  for (const selector of selectors) {
    const target = document.querySelector(selector);
    if (target && target.getClientRects().length) return target;
  }
  return null;
}

function centerActivity(target) {
  if (!target) return;
  const behavior = matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
  target.scrollIntoView({ behavior, block: "center", inline: "nearest" });
  requestAnimationFrame(() => {
    const navigation = document.querySelector("gp-navigation");
    const navigationBottom = navigation?.getBoundingClientRect().bottom || 0;
    const targetBox = target.getBoundingClientRect();
    const availableHeight = innerHeight - navigationBottom - 24;
    if (targetBox.height <= availableHeight && targetBox.top < navigationBottom + 12) {
      scrollBy({ top: targetBox.top - navigationBottom - 12, behavior: "auto" });
    }
  });
}

function initializeActivityFocus() {
  if (!isActivityPage() || document.documentElement.dataset.activityFocusReady) return;
  document.documentElement.dataset.activityFocusReady = "true";

  let observer;
  let finalTimer;
  let centeredTarget = null;
  const tryCenter = () => {
    const target = findActivityFocus();
    if (!target) return false;
    centeredTarget = target;
    centerActivity(target);
    return true;
  };
  const finish = () => {
    observer?.disconnect();
    clearTimeout(finalTimer);
    const target = findActivityFocus() || centeredTarget || document.querySelector("main");
    centerActivity(target);
  };

  requestAnimationFrame(() => requestAnimationFrame(tryCenter));
  observer = new MutationObserver(() => {
    const target = findActivityFocus();
    if (!target || target === centeredTarget) return;
    centeredTarget = target;
    centerActivity(target);
  });
  observer.observe(document.body, { childList: true, subtree: true });

  setTimeout(tryCenter, 120);
  setTimeout(tryCenter, 420);
  finalTimer = setTimeout(finish, 1400);
  if (document.fonts?.ready) document.fonts.ready.then(() => setTimeout(tryCenter, 50));
  addEventListener("load", () => setTimeout(finish, 100), { once: true });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeActivityFocus, { once: true });
} else {
  initializeActivityFocus();
}

addEventListener("pageshow", () => setTimeout(() => {
  if (!isActivityPage()) return;
  centerActivity(findActivityFocus() || document.querySelector("main"));
}, 80));
