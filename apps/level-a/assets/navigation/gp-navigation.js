import './us-english-speech.js?v=20260928-1&deploy=20260929-asset-fix-4';
import './gp-sounds.js?v=20260911-1&deploy=20260929-asset-fix-4';
import '/LevelC_M8/apps/activity-focus.js?v=20260923-center-all-v2&deploy=20260929-asset-fix-4';

class GpNavigation extends HTMLElement {
  connectedCallback() {
    const mainHref = this.dataset.mainHref || "../index.html";
    const weekHref = getContextualWeekHref(this.dataset.weekHref || mainHref, this.dataset.trail || "");
    let previousHref = this.dataset.previousHref || "";
    let nextHref = this.dataset.nextHref || "";
    const literacyStep = getLiteracyStep();
    if (literacyStep) {
      previousHref = literacyStep.previousHref;
      nextHref = literacyStep.nextHref;
    }
    // Reading and Phonics use the activity button beneath their lesson,
    // rather than a duplicate upper-right Next shortcut.
    if (/\/(reading|phonics)\/week-[1-4]\.html$/.test(window.location.pathname)) nextHref = "";
    this.classList.add("gp-navigation");
    this.setAttribute("aria-label", "Lesson navigation");
    const pageMain = document.querySelector("main");
    if (pageMain && !pageMain.id) pageMain.id = "gp-main-content";
    const mainTarget = pageMain?.id || "gp-main-content";
    const logoHref = new URL("https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-a/assets/ui/giiip-eis-logo.webp", import.meta.url).href;
    if (!document.querySelector(".site-logo-bar")) {
      const logoBar = document.createElement("div");
      logoBar.className = "site-logo-bar";
      logoBar.innerHTML = `<img src="${logoHref}" width="108" height="108" alt="GIIIP EIS logo" decoding="async">`;
      this.before(logoBar);
    }
    this.innerHTML = `
      <a class="gp-navigation__skip" href="#${mainTarget}">Skip to activity</a>
      <div class="gp-navigation__links">
        <a class="gp-navigation__main" data-nav-kind="main" href="${mainHref}" aria-label="Main Home" title="Main Home"><span class="gp-navigation__icon" aria-hidden="true">🏠</span><span>Main Home</span></a>
        <a class="gp-navigation__week" data-nav-kind="week" href="${weekHref}" aria-label="Week Home" title="Week Home"><span class="gp-navigation__icon" aria-hidden="true">📅</span><span>Week Home</span></a>
      </div>
      <div class="gp-navigation__stepper">
        ${previousHref ? `<a class="gp-navigation__previous" href="${previousHref}" aria-label="Previous page" title="Previous page">← <span>Previous</span></a>` : ""}
        ${nextHref ? `<a class="gp-navigation__next" href="${nextHref}" aria-label="Next page" title="Next page"><span>Next</span> →</a>` : ""}
      </div>`;

    const currentUrl = new URL(window.location.href);
    const samePage = link => {
      const target = new URL(link.href, currentUrl);
      return target.origin === currentUrl.origin && target.pathname === currentUrl.pathname;
    };
    const homeLinks = Object.fromEntries(
      [...this.querySelectorAll("[data-nav-kind]")].map(link => [link.dataset.navKind, link])
    );
    const mainIsCurrent = homeLinks.main && samePage(homeLinks.main);
    const weekIsCurrent = homeLinks.week && samePage(homeLinks.week);
    const weekDiffersFromMain = homeLinks.week?.href !== homeLinks.main?.href;
    const currentHome = weekIsCurrent && weekDiffersFromMain
        ? homeLinks.week
        : mainIsCurrent
          ? homeLinks.main
          : null;
    currentHome?.setAttribute("aria-current", "page");
  }
}

function getContextualWeekHref(fallbackHref, trail = "") {
  const path = window.location.pathname.toLowerCase();
  const sectionMatch = path.match(/\/level-a\/(literacy|reading|phonics|games)\//);
  if (!sectionMatch) return fallbackHref;

  const sectionAnchors = {
    literacy: "card-literacy",
    reading: "card-reading",
    phonics: "card-phonics",
    games: "card-games"
  };
  const params = new URLSearchParams(window.location.search);
  const weekFromQuery = params.get("week")?.match(/^[1-4]$/)?.[0];
  const weekFromTrail = trail.match(/Week\s+([1-4])/i)?.[1];
  const weekFromFallback = fallbackHref.match(/week-([1-4])\.html/i)?.[1];
  const weekFromPath = path.match(/week-([1-4])/i)?.[1];
  // The current route is more trustworthy than legacy data-week-href values.
  // Several later-week phonics pages were originally scaffolded with a Week 1
  // fallback, so only consult that fallback after the URL and trail.
  const week = weekFromQuery || weekFromTrail || weekFromPath || weekFromFallback || "1";
  const levelRoot = new URL("../../", import.meta.url);
  const target = new URL(`week-${week}.html`, levelRoot);
  const fromPhonics = sectionMatch[1] === 'games' && /\/phonics(?:-[a-z-]+)?\.html$/.test(path) && params.get('from') === 'phonics';
  target.hash = fromPhonics ? 'card-phonics' : sectionAnchors[sectionMatch[1]];
  return target.href;
}

const literacySequences = {
  1: ["video.html", "video-activity.html", "page-01.html", "page-02.html", "page-03.html", "page-04.html"],
  2: ["week-2.html", "week-2-video-activity.html", "week-2-page-12.html", "week-2-page-13.html", "week-2-page-14.html", "week-2-page-15.html"],
  3: ["week-3.html", "week-3-video-activity.html", "week-3-page-22.html", "week-3-page-23.html", "week-3-page-24.html", "week-3-page-25.html"],
  4: ["week-4.html", "week-4-video-activity.html", "week-4-page-32.html", "week-4-page-33.html", "week-4-page-34.html", "week-4-page-35.html"]
};

function getLiteracyStep() {
  const path = window.location.pathname.toLowerCase();
  if (!path.includes('/level-a/literacy/')) return null;
  const file = path.split('/').pop() || '';
  for (const [week, pages] of Object.entries(literacySequences)) {
    const index = pages.indexOf(file);
    if (index < 0) continue;
    return {
      week,
      pages,
      index,
      previousHref: index > 0 ? `${pages[index - 1]}#literacy-start` : `../week-${week}.html#card-literacy`,
      nextHref: index < pages.length - 1 ? `${pages[index + 1]}#literacy-start` : `../week-${week}.html#card-literacy`
    };
  }
  return null;
}

customElements.define("gp-navigation", GpNavigation);

function addLiteracySequenceNav() {
  const step = getLiteracyStep();
  if (!step) return;
  document.querySelectorAll('.sequence-nav, .week2-sequence, .section-home-link').forEach(element => element.remove());
  const pageMain = document.querySelector('main');
  if (!pageMain || pageMain.querySelector('.literacy-page-nav')) return;
  const nav = document.createElement('nav');
  nav.className = 'literacy-page-nav';
  nav.setAttribute('aria-label', `Week ${step.week} literacy pages`);
  const links = step.pages.map((file, index) => {
    const current = index === step.index;
    return `<a href="${file}#literacy-start" aria-label="Go to literacy page ${index + 1} of 6"${current ? ' aria-current="page"' : ''}>${index + 1}</a>`;
  }).join('');
  nav.innerHTML = `<strong class="literacy-page-nav__status" aria-live="polite">Page ${step.index + 1} of ${step.pages.length}</strong><div class="literacy-page-nav__links">${links}</div>`;
  const heading = pageMain.querySelector('.literacy-week-heading');
  if (heading) {
    heading.id = 'literacy-start';
    heading.after(nav);
    if (['#lesson-focus', '#gp-main-content', '#literacy-start'].includes(location.hash)) {
      const alignLiteracyHeader = () => {
        history.replaceState(null, '', `${location.pathname}${location.search}#literacy-start`);
        heading.scrollIntoView({ block: 'start' });
      };
      if (document.readyState === 'complete') setTimeout(alignLiteracyHeader, 100);
      else addEventListener('load', () => setTimeout(alignLiteracyHeader, 100), { once: true });
    }
  } else pageMain.prepend(nav);
}

function addLiteracyTools() {
  const path = window.location.pathname.toLowerCase();
  if (!path.includes('/literacy/')) return;
  if (/(?:tpr|conversation|flashcards(?:-week-[1-4])?)\.html$/.test(path)) return;
  const navigation = document.querySelector('gp-navigation');
  const pageMain = document.querySelector('main');
  if (!navigation || !pageMain) return;

  // Month 7 puts these three small candy buttons directly beneath the lesson
  // heading.  Reuse that structure instead of presenting them as a separate
  // floating toolbar between the global navigation and the page.
  const trail = navigation.dataset.trail || '';
  const weekFromTrail = trail.match(/Week\s+([1-4])/i)?.[1];
  const weekFromFile = path.match(/week-([1-4])/i)?.[1];
  const week = weekFromTrail || weekFromFile || '1';
  const returnTarget = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  const withReturn = (file) => {
    const url = new URL(file, window.location.href);
    url.searchParams.set('week', week);
    url.searchParams.set('return', returnTarget);
    return `${url.pathname.split('/').pop()}${url.search}`;
  };

  let tools = document.querySelector('.literacy-tools, .week-tools');
  if (!tools) tools = document.createElement('nav');
  tools.className = 'week-tools';
  tools.setAttribute('aria-label', `Week ${week} literacy tools`);
  tools.innerHTML = `
    <a class="pill-btn orange" href="${withReturn('tpr.html')}">🎵 Week Song</a>
    <a class="pill-btn blue" href="${withReturn(week === '1' ? 'flashcards.html' : `flashcards-week-${week}.html`)}">🃏 Flashcards</a>
    <a class="pill-btn green" href="${withReturn('conversation.html')}">💬 Conversation</a>`;

  const lessonTitles = {
    1: 'Which sports?',
    2: 'Where do you exercise?',
    3: 'What do soccer players do?',
    4: 'What do you need?'
  };
  // Only reuse the page's own header, never an activity or pop-up header.
  let heading = pageMain.querySelector(':scope > header, :scope > .hero.center');
  if (!heading) {
    heading = document.createElement('header');
    heading.className = 'hero center';
    const lesson = pageMain.querySelector('#lesson-focus');
    if (lesson) lesson.before(heading);
    else pageMain.prepend(heading);
  }
  heading.classList.add('literacy-week-heading');
  let title = heading.querySelector('h1');
  if (!title) {
    title = document.createElement('h1');
    title.className = 'title';
  }
  title.textContent = `Week ${week} — ${lessonTitles[week]}`;
  heading.querySelectorAll(':scope > .subtitle').forEach(element => element.remove());
  heading.append(title, tools);
}

function addLiteracyToolReturn() {
  const file = location.pathname.split('/').pop();
  if (!location.pathname.includes('/level-a/literacy/') || !/^(tpr|conversation|flashcards(?:-week-[1-4])?)\.html$/.test(file)) return;
  const params = new URLSearchParams(location.search);
  const week = /^[1-4]$/.test(params.get('week') || '') ? params.get('week') : (file.match(/week-([1-4])/)?.[1] || '1');
  const root = new URL('./', location.href);
  let target = new URL(literacySequences[week][0], root);
  let pageNumber = 1;
  try {
    const candidate = new URL(params.get('return') || target.href, root);
    for (const pages of Object.values(literacySequences)) {
      const index = pages.findIndex(page => new URL(page, root).pathname === candidate.pathname);
      if (candidate.origin === root.origin && index >= 0) {
        target = candidate;
        pageNumber = index + 1;
        break;
      }
    }
  } catch (_) { /* Invalid return links fall back to this week's first page. */ }
  if (!target.hash) target.hash = 'lesson-focus';
  const link = document.createElement('a');
  link.className = 'primary literacy-tool-return';
  link.href = target.href;
  link.textContent = `← Back to Page ${pageNumber}`;
  link.style.cssText = 'display:inline-flex;margin:0 0 22px;';
  document.querySelector('main')?.prepend(link);
}

addLiteracyToolReturn();
addLiteracyTools();
addLiteracySequenceNav();

// Keep one return link: grouped with Home on desktop, in content on phones.
function placeContextReturn() {
  const fromPhonics = new URLSearchParams(location.search).get('from') === 'phonics';
  const link = document.querySelector('.literacy-tool-return') ||
    (fromPhonics && document.querySelector('[data-phonics-context-return]'));
  const navLinks = document.querySelector('.gp-navigation__links');
  if (!link || !navLinks) return;
  const originalParent = link.parentNode;
  const marker = document.createComment('Context return mobile position');
  originalParent.insertBefore(marker, link);
  const desktop = matchMedia('(min-width:721px)');
  const position = () => {
    link.classList.toggle('gp-navigation__section', desktop.matches);
    link.classList.toggle('gp-context-return', desktop.matches);
    if (desktop.matches) navLinks.append(link);
    else marker.after(link);
    if (originalParent.classList.contains('game-list-back')) originalParent.hidden = desktop.matches;
  };
  desktop.addEventListener('change', position);
  position();
}
placeContextReturn();

function centerLessonFocus() {
  if (window.location.hash !== "#lesson-focus") return;
  const activity = document.querySelector("#lesson-focus");
  if (!activity) return;
  const behavior = matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
  const center = () => {
    activity.scrollIntoView({ behavior, block: "center", inline: "nearest" });
    requestAnimationFrame(() => {
      const nav = document.querySelector("gp-navigation");
      const navBottom = nav?.getBoundingClientRect().bottom || 0;
      const activityTop = activity.getBoundingClientRect().top;
      if (activityTop < navBottom + 12) window.scrollBy({ top: activityTop - navBottom - 12, behavior: "auto" });
    });
  };
  requestAnimationFrame(() => requestAnimationFrame(center));
  if (document.fonts?.ready) document.fonts.ready.then(() => setTimeout(center, 80));
}

addEventListener("load", () => setTimeout(centerLessonFocus, 80), { once: true });
addEventListener("pageshow", centerLessonFocus);
addEventListener("hashchange", centerLessonFocus);

export function revealNextAction(button) {
  if (!button) return;
  button.dataset.visible = "true";
  button.removeAttribute("hidden");
}

export function hideNextAction(button) {
  if (!button) return;
  button.dataset.visible = "false";
  button.hidden = true;
}

if (/\/phonics(?:\/|\.html)/i.test(location.pathname)) {
  import("/LevelC_M8/apps/phonics-player.js?v=20260922-v2&deploy=20260929-asset-fix-4");
}

if (/\/level-a\/literacy\/tpr\.html$/i.test(location.pathname)) {
  const style = document.createElement("link");
  style.rel = "stylesheet";
      style.href = "/LevelC_M8/apps/week-song-player.css?v=20260927-2&deploy=20260929-asset-fix-4";
  document.head.append(style);
      import("/LevelC_M8/apps/week-song-player.js?v=20260927-4&deploy=20260929-asset-fix-4");
}

if (/\/level-a\/literacy\//i.test(location.pathname) && !/\/tpr\.html$/i.test(location.pathname)) {
  const addWeekSongLink = () => {
    const pathnameWeek = location.pathname.match(/week-([234])/i)?.[1];
    const weekHref = document.querySelector("gp-navigation")?.dataset.weekHref || "";
    const week = Number(pathnameWeek || weekHref.match(/week-([1-4])/i)?.[1] || 1);
    const current = location.pathname.split("/").pop() + location.search + "#lesson-focus";
    const href = `tpr.html?week=${week}&return=${encodeURIComponent(current)}`;
    document.querySelectorAll("button.literacy-tool.song").forEach(button => {
      const link = document.createElement("a");
      link.className = button.className;
      link.href = href;
      link.innerHTML = button.innerHTML;
      button.replaceWith(link);
    });
    if (!document.querySelector('a[href^="tpr.html"]')) {
      const header = document.querySelector("main header");
      if (!header) return;
      const tools = document.createElement("nav");
      tools.className = "literacy-tools";
      tools.setAttribute("aria-label", "Literacy tools");
      tools.innerHTML = `<a class="literacy-tool song" href="${href}">🎵 Week Song</a>`;
      header.append(tools);
    }
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", addWeekSongLink, { once: true });
  else addWeekSongLink();
}
