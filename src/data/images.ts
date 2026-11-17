export const thumbnail = (src: string, width: 360 | 720 = 720) =>
  src.startsWith('/media/projects/') && src.endsWith('.webp')
    ? src.replace('/media/projects/', '/media/optimized/').replace('.webp', `-${width}.${src.includes('/seleccion-') ? 'avif' : 'webp'}`)
    : src;

export const thumbnailSet = (src: string) =>
  `${thumbnail(src, 360)} 360w, ${thumbnail(src, 720)} 720w`;
