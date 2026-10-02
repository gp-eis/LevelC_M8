import "./us-english-speech.js?v=20260928-1&deploy=20261003-level-c-tpr-and-lesson-tools-v11";
import "./gp-sounds.js?v=20260921-1&deploy=20261003-level-c-tpr-and-lesson-tools-v11";
import "/LevelC_M8/apps/activity-focus.js?v=20260923-center-all-v2&deploy=20261003-level-c-tpr-and-lesson-tools-v11";

class GpNavigation extends HTMLElement {
  connectedCallback() {
    const mainHref = this.dataset.mainHref || "../index.html";
    const current = new URL(location.href);
    const pathname = current.pathname;
    const fromPhonics = current.searchParams.get("from") === "phonics";
    const isGame = /\/games\//.test(pathname);
    const isPhonicsGame = /\/games\/phonics(?:[-.]|$)/.test(pathname);
    const isPhonicsList = /\/games\/phonics\.html$/.test(pathname);
    const isLiteracy = /\/(?:literacy|lessons)\//.test(pathname);
    const section = isGame ? (isPhonicsGame && fromPhonics ? "phonics" : "games") : /\/phonics\//.test(pathname) ? "phonics" : /\/reading\//.test(pathname) ? "reading" : isLiteracy ? "literacy" : "";
    const weekTarget = new URL(this.dataset.weekHref || mainHref, current);
    if (section) { weekTarget.searchParams.set("lesson", section); weekTarget.hash = `card-${section}`; }
    const weekHref = weekTarget.href;
    const focusHref = href => href && !href.includes("#") ? `${href}#lesson-focus` : href;
    const previousHref = isLiteracy ? focusHref(this.dataset.previousHref || "") : "";
    const nextHref = isLiteracy ? focusHref(this.dataset.nextHref || "") : "";
    let contextHref = "", contextLabel = "", contextIcon = "←";
    const literacyTool = pathname.match(/\/level-c\/week-([1-4])\/lessons\/(?:week-song|flashcards|conversation)\.html$/i);
    const returnValue = current.searchParams.get("return");
    if (literacyTool && returnValue) {
      try {
        const target = new URL(returnValue, current);
        const toolDirectory = pathname.slice(0, pathname.lastIndexOf("/") + 1);
        const expectedPage = new RegExp(`^week-${literacyTool[1]}-page-[^/]+\\.html$`, "i");
        if (target.origin === current.origin && target.pathname.slice(0, target.pathname.lastIndexOf("/") + 1) === toolDirectory && expectedPage.test(target.pathname.split("/").pop())) {
          target.hash = "lesson-focus";
          contextHref = target.href;
          const pageFile = target.pathname.split("/").pop().toLowerCase();
          const sourceNumber = Number(pageFile.match(/page-(\d+)/i)?.[1] || 1);
          const weekOnePages = [1, 2, 4, 6, 8];
          const displayNumber = literacyTool[1] === "1" ? Math.max(1, weekOnePages.indexOf(sourceNumber) + 1) : sourceNumber;
          contextLabel = `Back to Page ${displayNumber}`;
        }
      } catch (_) { /* Ignore malformed return values and keep navigation safe. */ }
    }
    if (isPhonicsList) {
      contextHref = fromPhonics ? `../phonics/week-${pathname.match(/\/week-(\d+)\//)?.[1] || 1}.html#lesson-focus` : "./";
      contextLabel = fromPhonics ? "Phonics Lesson" : "All Games";
      document.querySelectorAll("main .launch-row").forEach(row => { row.hidden = true; });
    } else if (isPhonicsGame) {
      contextHref = `phonics.html?from=${fromPhonics ? "phonics" : "games"}`;
      contextLabel = "Phonics Games";
    } else if (isGame && !/\/games\/(?:index\.html)?$/.test(pathname)) {
      contextHref = "./"; contextLabel = "All Games";
    }
    document.querySelectorAll("main a[href]").forEach(anchor => {
      const target = new URL(anchor.href, current);
      if (target.origin !== current.origin) return;
      if (/\/phonics\//.test(pathname) && /\/games\/phonics\.html$/.test(target.pathname)) target.searchParams.set("from", "phonics");
      if (isPhonicsGame && /\/games\/phonics(?:[-.]|$)/.test(target.pathname)) target.searchParams.set("from", fromPhonics ? "phonics" : "games");
      if (isLiteracy && /\/(?:literacy|lessons)\//.test(target.pathname)) target.hash = "lesson-focus";
      anchor.href = target.href;
    });
    const logoHref = new URL("https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-c/assets/ui/giiip-eis-logo.webp?asset=693f36046438", import.meta.url).href;

    if (!document.querySelector(".site-logo-bar")) {
      const logoBar = document.createElement("div");
      logoBar.className = "site-logo-bar";
      const logo = document.createElement("img");
      logo.src = logoHref;
      logo.alt = "GIIIP EIS logo";
      logo.width = 118;
      logo.height = 118;
      logo.decoding = "async";
      logoBar.append(logo);
      this.before(logoBar);
    }

    const link = (className, href, label, icon, text) =>
      `<a class="${className}" href="${href}" aria-label="${label}" title="${label}"><span aria-hidden="true">${icon}</span><span class="gp-navigation__label">${text}</span></a>`;

    this.classList.add("gp-navigation");
    this.setAttribute("aria-label", "Lesson navigation");
    this.innerHTML = `
      <div class="gp-navigation__links">
        ${link("gp-navigation__main", mainHref, "Main Home", "🏠", "Main Home")}
        ${link("gp-navigation__week", weekHref, "Week Home", "📅", "Week Home")}
        ${contextHref ? link("gp-navigation__context", contextHref, contextLabel, contextIcon, contextLabel) : ""}
      </div>
      <div class="gp-navigation__stepper">
        ${previousHref ? link("gp-navigation__previous", previousHref, "Previous page", "←", "Previous") : ""}
        ${nextHref ? link("gp-navigation__next", nextHref, "Next page", "→", "Next") : ""}
      </div>`;

    if (literacyTool) document.querySelectorAll("main [data-tool-return], main .tool-return, main .fc-return").forEach(oldReturn => oldReturn.remove());

    const currentPath = new URL(location.href).pathname.replace(/index\.html$/, "");
    this.querySelectorAll("a").forEach(anchor => {
      const targetPath = new URL(anchor.href, location.href).pathname.replace(/index\.html$/, "");
      if (targetPath === currentPath) anchor.setAttribute("aria-current", "page");
    });

    const lessonFocus = document.querySelector('#lesson-focus, #sequence-app, [data-literacy-focus], [data-sequence-app], [data-word-app], [data-horse-label], [data-moon-activity], [data-moon-picture], .sequence-shell, .track-shell, .literacy-layout, .track-card, .lesson-card, .media-card');
    if (lessonFocus && !lessonFocus.id) lessonFocus.id = "lesson-focus";
    if (location.hash === "#lesson-focus" && lessonFocus) {
      if (isLiteracy && !document.querySelector(".gp-centering-room")) {
        const centeringRoom = document.createElement("div");
        centeringRoom.className = "gp-centering-room";
        centeringRoom.setAttribute("aria-hidden", "true");
        centeringRoom.style.cssText = "height:clamp(110px,28vh,260px);pointer-events:none";
        document.body.append(centeringRoom);
      }
      const centerLesson = () => {
        const visualSelector = ".reading-scene, .source-pair, .horse-label-scene, .moon-overview, .moon-source-picture, .moon-question-clue, .media-stage";
        const activitySelector = ".sequence-card--landscape, .sequence-card, .reading-card, .bird-game, .word-book-board, .horse-label-card, .horse-label-board, .moon-stage-card, .moon-picture-card, .media-card, .track-card, .lesson-card, .fc-board";
        const focusView = lessonFocus.querySelector(visualSelector) || (lessonFocus.matches(activitySelector) ? lessonFocus : lessonFocus.querySelector(activitySelector)) || lessonFocus;
        focusView.scrollIntoView({
          block: "center",
          inline: "nearest",
          behavior: "auto"
        });
      };
      const centerWhenReady = () => {
        const readySelector = ".reading-scene, .source-pair, .horse-label-scene, .moon-overview, .moon-source-picture, .moon-question-clue, .media-stage, .word-book-board, .bird-game";
        if (lessonFocus.querySelector(readySelector)) {
          centerLesson();
          return;
        }
        const observer = new MutationObserver(() => {
          if (!lessonFocus.querySelector(readySelector)) return;
          observer.disconnect();
          window.setTimeout(centerLesson, 40);
        });
        observer.observe(lessonFocus, { childList: true, subtree: true });
        window.setTimeout(() => { observer.disconnect(); centerLesson(); }, 900);
      };
      if (document.readyState === "complete") window.setTimeout(centerWhenReady, 120);
      else window.addEventListener("load", () => window.setTimeout(centerWhenReady, 120), { once: true });
      window.setTimeout(centerLesson, 1400);
    }
  }
}

if (!customElements.get("gp-navigation")) customElements.define("gp-navigation", GpNavigation);

function addCLiteracyPageNav() {
  const match = location.pathname.match(/\/level-c\/week-1\/lessons\/(week-1-page-[^/]+\.html)$/i);
  if (!match) return;
  const pages = ["week-1-page-01.html", "week-1-page-02.html", "week-1-page-04.html", "week-1-page-06.html", "week-1-page-08.html"];
  const index = pages.indexOf(match[1].toLowerCase());
  if (index < 0) return;
  const main = document.querySelector("main");
  if (!main || main.querySelector(".literacy-page-nav")) return;
  document.querySelectorAll(".page-progress, .c-pagination").forEach(progress => progress.remove());
  main.querySelectorAll(":scope > header > p").forEach(note => {
    if (/^Page\s+\d+\s+of\s+\d+$/i.test(note.textContent.trim())) note.remove();
  });
  const nav = document.createElement("nav");
  nav.className = "literacy-page-nav";
  nav.setAttribute("aria-label", "Week 1 literacy pages");
  nav.innerHTML = `<strong class="literacy-page-nav__status">Page ${index + 1} of ${pages.length}</strong><div class="literacy-page-nav__links">${pages.map((page, pageIndex) => `<a href="${page}#lesson-focus" aria-label="Go to literacy page ${pageIndex + 1} of ${pages.length}"${pageIndex === index ? ' aria-current="page"' : ''}>${pageIndex + 1}</a>`).join("")}</div>`;
  const heading = main.querySelector(":scope > header");
  if (heading) heading.after(nav); else main.prepend(nav);
}

function addCLiteracyTools() {
  const match = location.pathname.match(/\/level-c\/week-([1-4])\/lessons\/(week-\1-page-[^/]+\.html)$/i);
  if (!match) return;
  const week = match[1];
  const main = document.querySelector("main");
  const heading = main?.querySelector(":scope > header");
  if (!heading || main.querySelector(".week-tools, .w3-tools")) return;
  const returnTarget = `${location.pathname}${location.search}${location.hash || "#lesson-focus"}`;
  const tools = document.createElement("nav");
  tools.className = "week-tools";
  tools.setAttribute("aria-label", `Week ${week} literacy tools`);
  const returnQuery = encodeURIComponent(returnTarget);
  tools.innerHTML = `
    <a class="pill-btn orange" href="week-song.html?return=${returnQuery}">🎵 Week Song</a>
    <a class="pill-btn blue" href="flashcards.html?return=${returnQuery}">🃏 Flashcards</a>
    <a class="pill-btn green" href="conversation.html?return=${returnQuery}">💬 Conversation</a>`;
  heading.append(tools);
}

const cLiteracyMain = document.querySelector("main");
const cLiteracyWeek = location.pathname.match(/\/level-c\/week-([1-4])\/lessons\//i)?.[1];
if (cLiteracyMain && cLiteracyWeek) {
  const cLiteracyObserver = new MutationObserver(() => {
    if (cLiteracyWeek === "1") {
      cLiteracyMain.querySelectorAll(".page-progress, .c-pagination").forEach(progress => progress.remove());
      cLiteracyMain.querySelectorAll(":scope > header > p").forEach(note => {
        if (/^Page\s+\d+\s+of\s+\d+$/i.test(note.textContent.trim())) note.remove();
      });
      if (!cLiteracyMain.querySelector(".literacy-page-nav")) addCLiteracyPageNav();
    }
    addCLiteracyTools();
  });
  cLiteracyObserver.observe(cLiteracyMain, { childList: true, subtree: true });
  if (cLiteracyWeek === "1") addCLiteracyPageNav();
  addCLiteracyTools();
  addEventListener("load", () => { addCLiteracyPageNav(); addCLiteracyTools(); }, { once: true });
}

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
  import("/LevelC_M8/apps/phonics-player.js?v=20260922-v2&deploy=20261003-level-c-tpr-and-lesson-tools-v11");
}

if (/\/level-c\/week-[1-4]\/lessons\/week-song\.html$/i.test(location.pathname)) {
  const style = document.createElement("link");
  style.rel = "stylesheet";
      style.href = "/LevelC_M8/apps/week-song-player.css?v=20260927-2&deploy=20261003-level-c-tpr-and-lesson-tools-v11";
  document.head.append(style);
      import("/LevelC_M8/apps/week-song-player.js?v=20260927-4&deploy=20261003-level-c-tpr-and-lesson-tools-v11");
}

import("/LevelC_M8/apps/lesson-video-player.js?v=20261001-c-opening&deploy=20261003-level-c-tpr-and-lesson-tools-v11");
