import { readdir, mkdir, readFile, writeFile, stat } from 'node:fs/promises';
import sharp from 'sharp';
import subsetFont from 'subset-font';

const generatorTime = (await stat(new URL(import.meta.url))).mtimeMs;
const fresh = async (source, target) => {
  try { return (await stat(target)).mtimeMs > Math.max(generatorTime, (await stat(source)).mtimeMs); }
  catch { return false; }
};

// Keep full-resolution originals for zoom; cards use smaller, separately cached copies.
await mkdir('public/media/optimized', { recursive: true });
for (const file of await readdir('public/media/projects')) {
  if (!file.endsWith('.webp')) continue;
  const selection = file.startsWith('seleccion-');
  for (const width of [360, 720]) {
    const source = `public/media/projects/${file}`;
    const target = `public/media/optimized/${file.replace('.webp', '')}-${width}.${selection ? 'avif' : 'webp'}`;
    if (await fresh(source, target)) continue;
    const image = sharp(source).resize({ width, withoutEnlargement: true });
    await (selection ? image.avif({ quality: 50, effort: 4 }) : image.webp({ quality: 72 })).toFile(target);
  }
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
