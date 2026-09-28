const modal = document.querySelector("#reading-activity");
const openButton = document.querySelector("#reading-activity-open");
const closeButtons = modal ? [...modal.querySelectorAll("[data-close]")] : [];
let returnFocus = null;

function openActivity() {
  if (!modal) return;
  returnFocus = document.activeElement;
  modal.hidden = false;
  document.body.classList.add("reading-modal-open");
  modal.querySelector(".reading-dialog__close")?.focus();
}

function closeActivity() {
  if (!modal) return;
  modal.hidden = true;
  document.body.classList.remove("reading-modal-open");
  if (location.hash === "#reading-activity") history.replaceState(null, "", location.pathname + location.search);
  if (returnFocus instanceof HTMLElement) returnFocus.focus();
}

openButton?.addEventListener("click", openActivity);
closeButtons.forEach(button => button.addEventListener("click", closeActivity));
modal?.addEventListener("click", event => { if (event.target === modal) closeActivity(); });
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && modal && !modal.hidden) closeActivity();
  if (event.key === "Tab" && modal && !modal.hidden) {
    const focusable = [...modal.querySelectorAll("button:not([disabled]),a[href]")];
    if (!focusable.length) return;
    const first = focusable[0]; const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
});
addEventListener("hashchange", () => { if (location.hash === "#reading-activity") openActivity(); });
if (location.hash === "#reading-activity") openActivity();
