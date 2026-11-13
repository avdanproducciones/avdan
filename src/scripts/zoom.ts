const MIN_SCALE = 1;
const MAX_SCALE = 4;
const CLICK_SCALE = 2.5;

const readScale = (frame: HTMLElement) => Number(frame.dataset.scale ?? 1);

const setScale = (frame: HTMLElement, scale: number) => {
  frame.dataset.scale = String(scale);
  frame.style.setProperty('--zoom', String(scale));
  frame.classList.toggle('is-zoomed', scale > MIN_SCALE);
};

const setOrigin = (frame: HTMLElement, event: { clientX: number; clientY: number }) => {
  const rect = frame.getBoundingClientRect();
  frame.style.setProperty('--ox', `${((event.clientX - rect.left) / rect.width) * 100}%`);
  frame.style.setProperty('--oy', `${((event.clientY - rect.top) / rect.height) * 100}%`);
};

export const resetZoom = (frame: HTMLElement) => setScale(frame, MIN_SCALE);

// Devuelve true si el punto cae sobre la imagen visible (descontando las bandas de object-fit: contain).
const isOverImage = (frame: HTMLElement, event: { clientX: number; clientY: number }) => {
  const img = frame.querySelector('img');
  if (!img) return false;
  const box = img.getBoundingClientRect();
  const ratio = img.naturalWidth && img.naturalHeight ? img.naturalWidth / img.naturalHeight : box.width / box.height;
  const width = Math.min(box.width, box.height * ratio);
  const height = width / ratio;
  const left = box.left + (box.width - width) / 2;
  const top = box.top + (box.height - height) / 2;
  return event.clientX >= left && event.clientX <= left + width && event.clientY >= top && event.clientY <= top + height;
};

export const attachZoom = (frame: HTMLElement, onOutside?: () => void) => {
  if (frame.dataset.zoomReady === 'true') return () => {};
  frame.dataset.zoomReady = 'true';

  let touchStart: { x: number; y: number } | undefined;
  let panTouch: { x: number; y: number } | undefined;
  let lastTap: { x: number; y: number; time: number; src: string | null } | undefined;
  let lastTouchTime = 0;

  const onClick = (event: MouseEvent) => {
    if (Date.now() - lastTouchTime < 700) return;
    if (!isOverImage(frame, event)) {
      onOutside?.();
      return;
    }
    setOrigin(frame, event);
    setScale(frame, readScale(frame) > MIN_SCALE ? MIN_SCALE : CLICK_SCALE);
  };

  const onTouchStart = (event: TouchEvent) => {
    lastTouchTime = Date.now();
    if (event.touches.length !== 1) {
      touchStart = undefined;
      panTouch = undefined;
      lastTap = undefined;
      frame.classList.remove('is-panning');
      return;
    }
    touchStart = { x: event.touches[0].clientX, y: event.touches[0].clientY };
    panTouch = readScale(frame) > MIN_SCALE ? { ...touchStart } : undefined;
  };

  const onTouchMove = (event: TouchEvent) => {
    if (!touchStart || !panTouch || event.touches.length !== 1 || readScale(frame) <= MIN_SCALE) return;
    const touch = event.touches[0];
    if (Math.hypot(touch.clientX - touchStart.x, touch.clientY - touchStart.y) <= 5 && !frame.classList.contains('is-panning')) return;
    const img = frame.querySelector('img');
    if (!img || !img.offsetWidth || !img.offsetHeight) return;
    const scale = readScale(frame) - 1;
    const originX = parseFloat(frame.style.getPropertyValue('--ox')) || 0;
    const originY = parseFloat(frame.style.getPropertyValue('--oy')) || 0;
    frame.style.setProperty('--ox', `${Math.max(0, Math.min(100, originX - (touch.clientX - panTouch.x) / (img.offsetWidth * scale) * 100))}%`);
    frame.style.setProperty('--oy', `${Math.max(0, Math.min(100, originY - (touch.clientY - panTouch.y) / (img.offsetHeight * scale) * 100))}%`);
    frame.classList.add('is-panning');
    panTouch = { x: touch.clientX, y: touch.clientY };
    if (event.cancelable) event.preventDefault();
  };

  const onTouchEnd = (event: TouchEvent) => {
    lastTouchTime = Date.now();
    const wasPanning = frame.classList.contains('is-panning');
    panTouch = undefined;
    frame.classList.remove('is-panning');
    if (!touchStart || event.touches.length || event.changedTouches.length !== 1) {
      touchStart = undefined;
      lastTap = undefined;
      return;
    }
    const touch = event.changedTouches[0];
    const moved = Math.hypot(touch.clientX - touchStart.x, touch.clientY - touchStart.y);
    touchStart = undefined;
    if (wasPanning || moved > 20) {
      lastTap = undefined;
      return;
    }
    if (!isOverImage(frame, touch)) {
      lastTap = undefined;
      if (onOutside) {
        if (event.cancelable) event.preventDefault();
        onOutside();
      }
      return;
    }
    const now = Date.now();
    const src = frame.querySelector('img')?.getAttribute('src') ?? null;
    if (lastTap && lastTap.src === src && now - lastTap.time < 350 &&
        Math.hypot(touch.clientX - lastTap.x, touch.clientY - lastTap.y) < 40) {
      if (event.cancelable) event.preventDefault();
      setOrigin(frame, touch);
      setScale(frame, readScale(frame) > MIN_SCALE ? MIN_SCALE : CLICK_SCALE);
      lastTap = undefined;
    } else {
      lastTap = { x: touch.clientX, y: touch.clientY, time: now, src };
    }
  };

  const onTouchCancel = () => { touchStart = undefined; panTouch = undefined; lastTap = undefined; frame.classList.remove('is-panning'); };
  const onMove = (event: MouseEvent) => {
    if (readScale(frame) > MIN_SCALE && isOverImage(frame, event)) setOrigin(frame, event);
  };

  const onWheel = (event: WheelEvent) => {
    event.preventDefault();
    if (!isOverImage(frame, event)) return;
    setOrigin(frame, event);
    const next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, readScale(frame) - event.deltaY * 0.0025));
    setScale(frame, next);
  };

  frame.addEventListener('click', onClick);
  frame.addEventListener('mousemove', onMove);
  frame.addEventListener('wheel', onWheel, { passive: false });
  frame.addEventListener('touchstart', onTouchStart, { passive: true });
  frame.addEventListener('touchmove', onTouchMove, { passive: false });
  frame.addEventListener('touchend', onTouchEnd, { passive: false });
  frame.addEventListener('touchcancel', onTouchCancel);

  return () => {
    frame.removeEventListener('click', onClick);
    frame.removeEventListener('mousemove', onMove);
    frame.removeEventListener('wheel', onWheel);
    frame.removeEventListener('touchstart', onTouchStart);
    frame.removeEventListener('touchmove', onTouchMove);
    frame.removeEventListener('touchend', onTouchEnd);
    frame.removeEventListener('touchcancel', onTouchCancel);
    delete frame.dataset.zoomReady;
  };
};
