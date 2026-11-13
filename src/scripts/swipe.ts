export const attachSwipe = (element: HTMLElement, onSwipe: (step: number) => void, allowButton?: string) => {
  let start: { x: number; y: number } | undefined;

  const onStart = (event: TouchEvent) => {
    const target = event.target instanceof Element ? event.target : null;
    const button = target?.closest('button');
    if (!window.matchMedia('(max-width: 900px)').matches || event.touches.length !== 1 ||
        target?.closest('.is-zoomed') || (button && !(allowButton && button.matches(allowButton)))) {
      start = undefined;
      return;
    }
    start = { x: event.touches[0].clientX, y: event.touches[0].clientY };
  };

  const onEnd = (event: TouchEvent) => {
    if (!start || event.touches.length || event.changedTouches.length !== 1) {
      start = undefined;
      return;
    }
    const dx = event.changedTouches[0].clientX - start.x;
    const dy = event.changedTouches[0].clientY - start.y;
    start = undefined;
    if (Math.abs(dx) < 50 || Math.abs(dx) <= Math.abs(dy) * 1.4) return;
    if (event.cancelable) event.preventDefault();
    onSwipe(dx < 0 ? 1 : -1);
  };

  const onCancel = () => { start = undefined; };
  element.addEventListener('touchstart', onStart, { passive: true });
  element.addEventListener('touchend', onEnd, { passive: false });
  element.addEventListener('touchcancel', onCancel);
  return () => {
    element.removeEventListener('touchstart', onStart);
    element.removeEventListener('touchend', onEnd);
    element.removeEventListener('touchcancel', onCancel);
  };
};
