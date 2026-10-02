import './us-english-speech.js?v=20260928-1&deploy=20261003-level-c-tpr-and-lesson-tools-v11';
import '/LevelC_M8/apps/activity-focus.js?v=20260923-center-all-v2&deploy=20261003-level-c-tpr-and-lesson-tools-v11';

class GpNavigation extends HTMLElement {
  connectedCallback() {
    const mainHref = this.dataset.mainHref || "../index.html";
    const weekHref = this.dataset.weekHref || mainHref;
    let sectionHref = this.dataset.sectionHref || weekHref;
    let previousHref = this.dataset.previousHref || "";
    let nextHref = this.dataset.nextHref || "";
    const current = new URL(window.location.href);
    const path = current.pathname.toLowerCase();
    const params = current.searchParams;
    const isGamesPage = /\/level-b\/games\//.test(path);
    const isPhonicsList = /\/level-b\/games\/phonics\.html$/.test(path);
    const isPhonicsGame = /\/level-b\/games\/phonics-[^/]+\.html$/.test(path);
    const isGamesList = /\/level-b\/games\/(?:index|week-[2-4])\.html$/.test(path);
    const weekFromQuery = params.get("week")?.match(/^[1-4]$/)?.[0];
    const weekFromTrail = (this.dataset.trail || "").match(/Week\s+([1-4])/i)?.[1];
    const weekFromHref = (this.dataset.weekHref || "").match(/week-([1-4])/i)?.[1];
    const week = weekFromQuery || weekFromTrail || weekFromHref || "1";
    const origin = params.get("from") === "phonics" ? "phonics" : "games";
    const gamesHref = week === "1" ? "index.html" : `week-${week}.html`;
    let contextHref = "";
    let contextLabel = "";
    const conversationMatch = path.match(/\/level-b\/week-([1-4])\/literacy\/conversation\.html$/);
    if (conversationMatch) {
      const literacyPages = {
        1: ["page-01.html", "video-activity.html", "page-02.html", "page-03.html", "page-04.html", "page-05.html"],
        2: ["page-01.html", "video-activity.html", "page-12.html", "page-13.html", "page-14.html", "page-15.html"],
        3: ["page-01.html", "video-activity.html", "page-22.html", "page-23.html", "page-24.html", "page-25.html"],
        4: ["page-01.html", "video-activity.html", "page-32.html", "page-33.html", "page-34.html", "page-35.html"]
      }[Number(conversationMatch[1])];
      const directory = path.slice(0, path.lastIndexOf("/") + 1);
      let target = new URL("page-01.html#lesson-focus", current);
      try {
        const requested = new URL(params.get("return") || target.href, current);
        const file = requested.pathname.split("/").pop();
        if (requested.origin === current.origin && requested.pathname.slice(0, requested.pathname.lastIndexOf("/") + 1).toLowerCase() === directory && literacyPages.includes(file)) {
          target = requested;
        }
      } catch (_) { /* Keep the safe opening-page fallback. */ }
      if (!target.hash) target.hash = "lesson-focus";
      const pageIndex = Math.max(0, literacyPages.indexOf(target.pathname.split("/").pop()));
      contextHref = target.href;
      contextLabel = `Back to Page ${pageIndex + 1}`;
    } else if (isPhonicsList) {
      contextHref = origin === "phonics" ? `../week-${week}/phonics/#lesson-focus` : gamesHref;
      contextLabel = origin === "phonics" ? "Phonics Lesson" : "All Games";
    } else if (isPhonicsGame) {
      contextHref = `phonics.html?week=${week}&from=${origin}`;
      contextLabel = "Phonics Games";
    } else if (isGamesPage && !isGamesList) {
      contextHref = gamesHref;
      contextLabel = "All Games";
    }
    if (contextHref) {
      sectionHref = contextHref;
      previousHref = "";
      nextHref = "";
    }
    const logoHref = new URL("https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-b/assets/ui/giiip-eis-logo.webp?asset=693f36046438", import.meta.url).href;
    const isLiteracyPage = /\/week-[1-4]\/literacy\//.test(window.location.pathname);
    const focusHref = href => href && !href.includes("#") ? `${href}#lesson-focus` : href;

    if (isLiteracyPage) {
      const focusTarget = document.querySelector(".literacy-layout, .track-card, .lesson-card");
      if (focusTarget) focusTarget.id = "lesson-focus";
      sectionHref = focusHref(sectionHref);
      previousHref = focusHref(previousHref);
      nextHref = focusHref(nextHref);
      document.querySelectorAll("main a[href]").forEach(link => {
        const target = new URL(link.href, window.location.href);
        if (target.origin === window.location.origin && target.pathname.includes("/week-1/literacy/")) target.hash = "lesson-focus";
        link.href = target.href;
      });
    }

    this.classList.add("gp-navigation");
    this.setAttribute("role", "navigation");
    this.setAttribute("aria-label", "Lesson navigation");
    if (!document.querySelector(".site-logo-bar")) {
      const logoBar = document.createElement("div");
      logoBar.className = "site-logo-bar";
      const logo = document.createElement("img");
      logo.src = logoHref;
      logo.alt = "GIIIP EIS logo";
      logo.width = 118;
      logo.height = 118;
      logoBar.appendChild(logo);
      this.before(logoBar);
    }
    this.innerHTML = `
      <div class="gp-navigation__links">
        <a class="gp-navigation__main" href="${mainHref}" aria-label="Main Home"><span class="gp-navigation__icon" aria-hidden="true">🏠</span><span class="gp-navigation__label"><span class="gp-navigation__full">Main Home</span><span class="gp-navigation__short">Main</span></span></a>
        <a href="${weekHref}" aria-label="Week Home"><span class="gp-navigation__icon" aria-hidden="true">📅</span><span class="gp-navigation__label"><span class="gp-navigation__full">Week Home</span><span class="gp-navigation__short">Week</span></span></a>
        ${contextHref ? `<a class="gp-navigation__context" href="${sectionHref}" aria-label="${contextLabel}" title="${contextLabel}"><span class="gp-navigation__icon" aria-hidden="true">←</span><span class="gp-navigation__label"><span class="gp-navigation__full">${contextLabel}</span><span class="gp-navigation__short">Back</span></span></a>` : ""}
      </div>
      <div class="gp-navigation__stepper">
        ${previousHref ? `<a class="gp-navigation__previous" href="${previousHref}" aria-label="Previous page"><span aria-hidden="true">←</span><span>Previous</span></a>` : ""}
        ${nextHref ? `<a class="gp-navigation__next" href="${nextHref}" aria-label="Next page"><span>Next</span><span aria-hidden="true">→</span></a>` : ""}
      </div>`;

    if (contextHref) {
      document.querySelectorAll("main .baseline-home, main .match-home, main .game-list-back").forEach(element => element.remove());
    }

    if (window.location.hash === "#lesson-focus") {
      const centerLesson = () => {
        const target = document.querySelector("#lesson-focus");
        if (!target) return;
        const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
        target.scrollIntoView({
          behavior: reducedMotion ? "auto" : "smooth",
          block: "center",
          inline: "nearest"
        });
        const revealBelowNavigation = () => {
          const navBottom = this.getBoundingClientRect().bottom;
          const targetTop = target.getBoundingClientRect().top;
          if (targetTop < navBottom + 12) {
            window.scrollBy({ top: targetTop - navBottom - 12, behavior: "auto" });
          }
        };
        window.setTimeout(revealBelowNavigation, reducedMotion ? 0 : 500);
      };
      if (document.readyState === "complete") window.setTimeout(centerLesson, 120);
      else window.addEventListener("load", () => window.setTimeout(centerLesson, 120), { once: true });
    }
  }
}

customElements.define("gp-navigation", GpNavigation);

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

if (/\/level-b\/week-[1-4]\/literacy\/tpr\.html$/i.test(location.pathname)) {
  const style = document.createElement("link");
  style.rel = "stylesheet";
      style.href = "/LevelC_M8/apps/week-song-player.css?v=20260927-2&deploy=20261003-level-c-tpr-and-lesson-tools-v11";
  document.head.append(style);
      import("/LevelC_M8/apps/week-song-player.js?v=20260927-4&deploy=20261003-level-c-tpr-and-lesson-tools-v11");
}

import("/LevelC_M8/apps/lesson-video-player.js?v=20260929-2&deploy=20261003-level-c-tpr-and-lesson-tools-v11");
