(() => {
  // Las transiciones internas de Astro reutilizan el documento ya cargado.
  if (document.readyState !== 'loading') return;

  const screen = document.querySelector('.loading-screen');
  if (!screen) return;
  const root = document.documentElement;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const started = performance.now();
  const minimumDuration = 500;
  const fadeDuration = reducedMotion ? 0 : 120;
  let finished = false;
  let blockedElements = [];

  root.classList.add('is-loading');
  const blockPage = () => {
    if (finished) return;
    blockedElements = Array.from(document.body.children).filter((element) =>
      element !== screen && element.tagName !== 'SCRIPT' && !element.hasAttribute('inert'),
    );
    blockedElements.forEach((element) => element.setAttribute('inert', ''));
  };
  const finish = () => {
    if (finished) return;
    finished = true;
    window.clearTimeout(fallback);
    screen.classList.add('is-finished');
    window.setTimeout(() => {
      root.classList.remove('is-loading');
      blockedElements.forEach((element) => element.removeAttribute('inert'));
      screen.remove();
    }, fadeDuration);
  };
  const fallback = window.setTimeout(finish, 4000);
  document.addEventListener('DOMContentLoaded', async () => {
    blockPage();
    await screen.querySelector('img').decode().catch(() => {});
    if (finished) return;
    const remaining = Math.max(0, minimumDuration - (performance.now() - started));
    window.setTimeout(finish, Math.ceil(remaining));
  }, { once: true });
})();
