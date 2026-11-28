import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const targetFiles = [
  'public/media/anchialo/anchialo-oil-arnica-promo.webp',
  'public/media/blog-classifieds.webp',
  'public/media/blog-salon.webp',
  'public/media/blog-news.webp',
  'public/media/blog-corporate.webp',
  'public/media/mockup-aeterna.webp',
  'public/media/brands/cpt-mark.webp',
];

const showcaseDir = 'public/media/showcase';
if (fs.existsSync(showcaseDir)) {
  for (const file of fs.readdirSync(showcaseDir)) {
    if (file.endsWith('.webp')) {
      targetFiles.push(path.join(showcaseDir, file).replace(/\\/g, '/'));
    }
  }
}

for (const relPath of targetFiles) {
  const fullPath = path.resolve(relPath);
  if (!fs.existsSync(fullPath)) continue;

  const initialSize = fs.statSync(fullPath).size;
  const tempPath = fullPath + '.opt.webp';

  try {
    execSync(
      `ffmpeg -v error -i "${fullPath}" -vf "scale='min(800,iw)':-1" -quality 78 -y "${tempPath}"`,
      { stdio: 'inherit' }
    );
    if (fs.existsSync(tempPath)) {
      const newSize = fs.statSync(tempPath).size;
      if (newSize < initialSize) {
        fs.renameSync(tempPath, fullPath);
        console.log(`Optimized ${relPath}: ${(initialSize / 1024).toFixed(1)}KB -> ${(newSize / 1024).toFixed(1)}KB`);
      } else {
        fs.unlinkSync(tempPath);
        console.log(`Skipped ${relPath} (already optimal)`);
      }
    }
  } catch (err) {
    if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
    console.error(`Failed to optimize ${relPath}:`, err.message);
  }
}
