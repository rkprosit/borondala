const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'images');
const maxWidth = 1920;
const quality = 80;
const supported = ['.jpg', '.jpeg', '.png'];

async function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== '.originals') await walk(full);
    } else if (supported.includes(path.extname(entry.name).toLowerCase())) {
      if (entry.name.toLowerCase().includes('copy')) continue;
      await compress(full);
    }
  }
}

async function compress(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  try {
    const img = sharp(filePath);
    const meta = await img.metadata();
    const basePath = filePath.slice(0, -ext.length);

    let pipeline = img;
    if (meta.width > maxWidth) {
      pipeline = pipeline.resize({ width: maxWidth, withoutEnlargement: true });
    }

    const originalSize = fs.statSync(filePath).size;

    if (ext === '.png') {
      await pipeline.png({ compressionLevel: 9, palette: true }).toFile(filePath + '.tmp');
      fs.unlinkSync(filePath);
      fs.renameSync(filePath + '.tmp', filePath);
    } else {
      await pipeline.jpeg({ quality, mozjpeg: true }).toFile(filePath + '.tmp');
      fs.unlinkSync(filePath);
      fs.renameSync(filePath + '.tmp', filePath);
      const webpPath = basePath + '.webp';
      if (!fs.existsSync(webpPath)) {
        await pipeline.webp({ quality }).toFile(webpPath);
      }
    }

    const newSize = fs.statSync(filePath).size;
    console.log(`${path.relative(srcDir, filePath)}: ${(originalSize / 1024).toFixed(0)}KB → ${(newSize / 1024).toFixed(0)}KB (${((1 - newSize / originalSize) * 100).toFixed(0)}% saved)`);
  } catch (err) {
    console.error(`Error compressing ${filePath}: ${err.message}`);
  }
}

console.log('Compressing images...');
walk(srcDir).then(() => console.log('Done!'));
