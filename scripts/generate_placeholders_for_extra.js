const fs = require('fs');
const path = require('path');

const EXTRA_FILE = path.join(__dirname, '..', 'lib', 'extraProducts.ts');

function readText(p) {
  return fs.readFileSync(p, 'utf8');
}

function extractFirstImages(text) {
  // crude: find images: [ ... ] blocks and capture first string inside
  const imagesBlockRegex = /images:\s*\[([\s\S]*?)\]/g;
  const strRegex = /"([^"\\]+)"/g;
  const firstImages = [];
  let m;
  while ((m = imagesBlockRegex.exec(text)) !== null) {
    const block = m[1];
    const s = strRegex.exec(block);
    if (s) firstImages.push(s[1]);
  }
  return firstImages;
}

function makePlaceholder(filePath, title) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const svg = `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='400' viewBox='0 0 1200 400'>\n  <rect width='100%' height='100%' fill='#eee'/>\n  <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='Arial, Helvetica, sans-serif' font-size='36' fill='#666'>${escapeXml(title)}</text>\n</svg>`;
  try {
    fs.writeFileSync(filePath, svg, 'utf8');
    return true;
  } catch (e) {
    console.error('FAIL write', filePath, e && e.message);
    return false;
  }
}

function escapeXml(str) {
  return String(str).replace(/[<>&'\"]/g, (c) => ({'<':'&lt;','>':'&gt;','&':'&amp;',"'":"&apos;", '"':'&quot;' }[c]));
}

function main() {
  const txt = readText(EXTRA_FILE);
  const imgs = extractFirstImages(txt);
  console.log('Found images:', imgs.length);
  const missing = [];
  for (const im of imgs) {
    const rel = im.replace(/^\//, '');
    const full = path.join(__dirname, '..', 'public', rel);
    if (!fs.existsSync(full)) missing.push({ image: im, path: full });
  }
  if (!missing.length) {
    console.log('No missing images for extraProducts.');
    return;
  }
  console.log('Missing images count:', missing.length);
  for (const m of missing) {
    const ok = makePlaceholder(m.path, m.image);
    console.log('Created', m.path, ok ? 'OK' : 'FAIL');
  }
}

if (require.main === module) main();
