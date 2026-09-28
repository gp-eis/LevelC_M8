(() => {
  const link = document.querySelector("[data-tool-return]");
  const value = new URLSearchParams(location.search).get("return");
  if (!link || !value) return;
  try {
    const target = new URL(value, location.href);
    if (target.origin === location.origin && /\/level-c\/week-1\/lessons\/week-1-page-/.test(target.pathname)) link.href = target.href;
  } catch (_) { /* Keep the safe Week 1 fallback. */ }
})();
