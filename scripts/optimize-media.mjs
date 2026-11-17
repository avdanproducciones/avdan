import { readdir, mkdir, readFile, writeFile, stat } from 'node:fs/promises';
import sharp from 'sharp';
import subsetFont from 'subset-font';
import imageConfig from '../src/data/image-config.json' with { type: 'json' };

const generatorTime = Math.max((await stat(new URL(import.meta.url))).mtimeMs,
  (await stat(new URL('../src/data/image-config.json', import.meta.url))).mtimeMs);
const fresh = async (source, target) => {
  try { return (await stat(target)).mtimeMs > Math.max(generatorTime, (await stat(source)).mtimeMs); }
  catch { return false; }
};

// Keep full-resolution originals for zoom; cards use smaller, separately cached copies.
await mkdir('public/media/optimized', { recursive: true });
const files = (await readdir('public/media/projects')).filter((file) => file.endsWith('.webp'));
const optimizePhoto = async (file) => {
  for (const width of imageConfig.widths) {
    const source = `public/media/projects/${file}`;
    const name = file.replace('.webp', '');
    const target = `public/media/optimized/${name}-${width}.avif`;
    if (!(await fresh(source, target))) {
      await sharp(source).resize({ width, withoutEnlargement: true }).avif({ quality: 48, effort: 4 }).toFile(target);
    }
    if (imageConfig.categoryCovers.includes(name)) {
      const cover = `public/media/optimized/${name}-card-${width}.avif`;
      if (!(await fresh(source, cover))) {
        await sharp(source).resize({ width, height: Math.round(width * .75), fit: 'cover' })
          .avif({ quality: 48, effort: 4 }).toFile(cover);
      }
    }
  }
};
// Bound parallelism to avoid exhausting memory when encoding AVIF during builds.
for (let index = 0; index < files.length; index += 4) {
  await Promise.all(files.slice(index, index + 4).map(optimizePhoto));
}
// Latin, accented Spanish characters, punctuation, arrows and UI symbols.
const characters = [[0x20, 0x24f], [0x2000, 0x206f], [0x2190, 0x21ff], [0x25a0, 0x25ff], [0x20ac, 0x20ac]]
  .flatMap(([start, end]) => Array.from({ length: end - start + 1 }, (_, index) => String.fromCodePoint(start + index))).join('');
for (const file of ['akira-expanded-demo.otf', 'montserrat-variable.ttf']) {
  const source = `public/fonts/${file}`;
  const target = `public/fonts/${file.replace(/\.(otf|ttf)$/, '.woff2')}`;
  if (await fresh(source, target)) continue;
  await writeFile(target, await subsetFont(await readFile(source), characters, { targetFormat: 'woff2' }));
}
console.log('Responsive thumbnails and WOFF2 fonts generated.');
