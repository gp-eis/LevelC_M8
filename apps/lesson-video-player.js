const VIDEO_SELECTOR = [
  "video.literacy-opening-video",
  "video.b-opening-video",
  "video.reading-story-video"
].join(",");

function addStyles() {
  if (document.querySelector('link[data-gp-centered-video-style]')) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "/LevelC_M8/apps/lesson-video-player.css?v=20260929-2&deploy=20260929-level-ac-reading-13";
  link.dataset.gpCenteredVideoStyle = "true";
  document.head.append(link);
}

function installPlayer(video) {
  if (video.dataset.gpCenteredVideo === "true") return;
  video.dataset.gpCenteredVideo = "true";

  const shell = document.createElement("div");
  shell.className = "gp-centered-video-shell";
  video.before(shell);
  shell.append(video);

  const button = document.createElement("button");
  button.className = "gp-centered-video-play";
  button.type = "button";
  button.setAttribute("aria-label", video.getAttribute("aria-label") || "Play video");
  button.innerHTML = '<span aria-hidden="true">▶</span>';
  shell.append(button);

  const update = () => {
    button.hidden = !video.paused && !video.ended;
  };

  button.addEventListener("click", async () => {
    button.hidden = true;
    try {
      await video.play();
    } catch {
      update();
    }
  });
  video.addEventListener("play", update);
  video.addEventListener("playing", update);
  video.addEventListener("pause", update);
  video.addEventListener("ended", update);
  video.addEventListener("emptied", update);
  update();
}

function initialize() {
  const videos = document.querySelectorAll(VIDEO_SELECTOR);
  if (!videos.length) return;
  addStyles();
  videos.forEach(installPlayer);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initialize, { once: true });
} else {
  initialize();
}
