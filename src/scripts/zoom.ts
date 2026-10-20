const MIN_SCALE = 1;
const MAX_SCALE = 4;
const CLICK_SCALE = 2.5;

const readScale = (frame: HTMLElement) => Number(frame.dataset.scale ?? 1);

const setScale = (frame: HTMLElement, scale: number) => {
  frame.dataset.scale = String(scale);
  frame.style.setProperty('--zoom', String(scale));
  frame.classList.toggle('is-zoomed', scale > MIN_SCALE);
};

const setOrigin = (frame: HTMLElement, event: MouseEvent) => {
  const rect = frame.getBoundingClientRect();
  frame.style.setProperty('--ox', `${((event.clientX - rect.left) / rect.width) * 100}%`);
  frame.style.setProperty('--oy', `${((event.clientY - rect.top) / rect.height) * 100}%`);
};

export const resetZoom = (frame: HTMLElement) => setScale(frame, MIN_SCALE);

// Click alterna el zoom, la rueda lo ajusta y el puntero desplaza el encuadre.
// Devuelve true si el punto cae sobre la imagen visible (descontando las bandas de object-fit: contain).
const isOverImage = (frame: HTMLElement, event: MouseEvent) => {
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

  const onClick = (event: MouseEvent) => {
    if (!isOverImage(frame, event)) {
      onOutside?.();
      return;
    }
    setOrigin(frame, event);
    setScale(frame, readScale(frame) > MIN_SCALE ? MIN_SCALE : CLICK_SCALE);
  };

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

  return () => {
    frame.removeEventListener('click', onClick);
    frame.removeEventListener('mousemove', onMove);
    frame.removeEventListener('wheel', onWheel);
    delete frame.dataset.zoomReady;
  };
};
