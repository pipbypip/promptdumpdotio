import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, '..', 'public');

async function generateFavicons() {
  const logo = path.join(publicDir, 'logo.png');

  // Generate favicon.ico (16x16)
  await sharp(logo)
    .resize(16, 16)
    .toFile(path.join(publicDir, 'favicon-16x16.png'));

  // Generate favicon-32x32.png
  await sharp(logo)
    .resize(32, 32)
    .toFile(path.join(publicDir, 'favicon-32x32.png'));

  // Generate apple-touch-icon.png (180x180)
  await sharp(logo)
    .resize(180, 180)
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));

  // Generate og-image.png (1200x630 - optimal for social sharing)
  await sharp(logo)
    .resize(1200, 630, {
      fit: 'contain',
      background: { r: 45, g: 47, b: 50, alpha: 1 } // #2d2f32
    })
    .toFile(path.join(publicDir, 'og-image.png'));

  console.log('All favicons generated successfully!');
}

generateFavicons().catch(console.error);
