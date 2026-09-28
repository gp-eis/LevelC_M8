const stylesheetId = "shared-phonics-player-style";

if (!document.querySelector(`#${stylesheetId}`)) {
  const link = document.createElement("link");
  link.id = stylesheetId;
  link.rel = "stylesheet";
  link.href = "/LevelC_M8/apps/phonics-player.css?v=20260922-v2&deploy=20260929-resource-fix-1";
  document.head.append(link);
}

function centerVideo(target) {
  if (!target) return;
  target.scrollIntoView({ block: "center", inline: "nearest", behavior: "auto" });
}

function addPlayButton(host, video) {
  if (!host || !video || host.querySelector(".phonics-center-play")) return;
  host.classList.add("phonics-video-focus");
  const button = document.createElement("button");
  button.className = "phonics-center-play";
  button.type = "button";
  button.setAttribute("aria-label", video.getAttribute("aria-label") ? `Play ${video.getAttribute("aria-label")}` : "Play the phonics video");
  button.textContent = "▶";
  host.append(button);

  const show = () => { button.hidden = false; };
  const hide = () => { button.hidden = true; };
  button.addEventListener("click", async () => {
    hide();
    try { await video.play(); }
    catch (_) { show(); }
  });
  video.addEventListener("play", hide);
  video.addEventListener("pause", () => { if (!video.ended) show(); });
  video.addEventListener("ended", show);
  video.addEventListener("error", show);
}

function initializePhonicsPlayer() {
  if (!/\/phonics(?:\/|\.html)/i.test(location.pathname)) return;
  const video = document.querySelector("video.phonics-video, .video-slot video, .media-stage video");
  const target = video?.closest(".video-slot, .media-stage, .media-card")
    || document.querySelector(".video-slot, .media-stage, .media-card");
  if (!target) return;
  if (video) addPlayButton(target, video);

  const center = () => centerVideo(target);
  requestAnimationFrame(() => requestAnimationFrame(center));
  setTimeout(center, 100);
  if (document.fonts?.ready) document.fonts.ready.then(() => setTimeout(center, 40));
  video?.addEventListener("loadedmetadata", center, { once: true });
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initializePhonicsPlayer, { once: true });
else initializePhonicsPlayer();
addEventListener("pageshow", () => setTimeout(initializePhonicsPlayer, 40));
