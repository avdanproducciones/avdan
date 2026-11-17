import imageConfig from './image-config.json';

export const thumbnail = (src: string, width: number = 720) =>
  src.startsWith('/media/projects/') && src.endsWith('.webp')
    ? src.replace('/media/projects/', '/media/optimized/').replace('.webp', `-${width}.avif`)
    : src;

export const thumbnailSet = (src: string) =>
  imageConfig.widths.map((width) => `${thumbnail(src, width)} ${width}w`).join(', ');

export const categoryThumbnail = (src: string, width = 720) => {
  const name = src.split('/').pop()?.replace('.webp', '');
  return name && imageConfig.categoryCovers.includes(name)
    ? thumbnail(src, width).replace(`-${width}.avif`, `-card-${width}.avif`)
    : thumbnail(src, width);
};
export const categoryThumbnailSet = (src: string) =>
  imageConfig.widths.map((width) => `${categoryThumbnail(src, width)} ${width}w`).join(', ');
