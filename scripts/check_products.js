const fs = require('fs');
const path = require('path');

const PRODUCTS_FILE = path.join(__dirname, '..', 'lib', 'products.ts');
const PUBLIC_PRODUCTS_BANNER = path.join(__dirname, '..', 'public', 'products', 'banner');

function readProductsFile() {
  return fs.readFileSync(PRODUCTS_FILE, 'utf8');
}

function parseProducts(text) {
  // crude heuristic: find all object literals with id / slug / routeSlug / images
  const productRegex = /\{\s*id:\s*"([^"]+)"[\s\S]*?slug:\s*"([^"]+)"[\s\S]*?routeSlug:\s*"([^"]+)"[\s\S]*?images:\s*\[([\s\S]*?)\][\s\S]*?\}/g;
  const imgsRegex = /"([^"]+)"/g;
  const products = [];
  let m;
  while ((m = productRegex.exec(text)) !== null) {
    const id = m[1];
    const slug = m[2];
    const routeSlug = m[3];
    const imagesBlock = m[4];
    const images = [];
    let im;
    while ((im = imgsRegex.exec(imagesBlock)) !== null) images.push(im[1]);
    products.push({ id, slug, routeSlug, images });
  }
  return products;
}

function findDuplicates(products) {
  const maps = { id: {}, slug: {}, routeSlug: {} };
  const dupes = { id: [], slug: [], routeSlug: [] };
  for (const p of products) {
    for (const k of ['id','slug','routeSlug']) {
      const v = p[k];
      if (!v) continue;
      if (maps[k][v]) dupes[k].push({ value: v, first: maps[k][v], second: p });
      else maps[k][v] = p;
    }
  }
  return dupes;
}

function checkImages(products) {
  const missing = [];
  for (const p of products) {
    const firstImage = (p.images && p.images.length) ? p.images[0] : null;
    if (!firstImage) {
      missing.push({ product: p, reason: 'no-first-image' });
      continue;
    }
  const rel = firstImage.replace(/^\//, '');
  // ensure we check under the public folder
  const full = path.join(__dirname, '..', 'public', rel);
    if (!fs.existsSync(full)) missing.push({ product: p, firstImage: firstImage, path: full });
  }
  return missing;
}

function makePlaceholder(filePath, title) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const svg = `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='400' viewBox='0 0 1200 400'>\n  <rect width='100%' height='100%' fill='#eee'/>\n  <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='Arial, Helvetica, sans-serif' font-size='36' fill='#666'>${escapeXml(title)}</text>\n</svg>`;
  try {
    fs.writeFileSync(filePath, svg, 'utf8');
    return true;
  } catch (e) {
    return false;
  }
}

function escapeXml(str) {
  return String(str).replace(/[<>&'\"]/g, (c) => ({'<':'&lt;','>':'&gt;','&':'&amp;',"'":"&apos;", '"':'&quot;' }[c]));
}

function main() {
  const argv = process.argv.slice(2);
  const generate = argv.includes('--generate');
  const text = readProductsFile();
  const products = parseProducts(text);
  console.log('Found products:', products.length);

  const dupes = findDuplicates(products);
  const anyDupes = Object.values(dupes).some((arr) => arr.length > 0);
  if (anyDupes) {
    console.log('\nDuplicates detected:');
    for (const k of Object.keys(dupes)) {
      if (dupes[k].length) console.log(`  ${k}:`, dupes[k].map(d=>d.value));
    }
  } else console.log('\nNo duplicate ids/slugs/routeSlugs found.');

  const missing = checkImages(products);
  if (!missing.length) console.log('\nAll first images exist under public/products/banner.');
  else {
    console.log('\nMissing first-image files for', missing.length, 'products:');
    for (const m of missing) console.log(' -', m.product.slug, '=>', m.firstImage || '(none)');
    if (generate) {
      console.log('\nGenerating placeholder SVG files for missing images...');
      for (const m of missing) {
  const target = path.join(__dirname, '..', 'public', m.firstImage.replace(/^\//, ''));
        const ok = makePlaceholder(target, m.product.slug);
        console.log('  Created', target, ok ? 'OK' : 'FAIL');
      }
    } else {
      console.log('\nRun with --generate to create simple SVG placeholders for these missing files.');
    }
  }
}

if (require.main === module) main();
