// Script temporar pentru generare Google Merchant Feed
const fs = require('fs');
const path = require('path');

// Încarcă produsele (TypeScript → CommonJS workaround)
const tsNodePath = path.join(__dirname, '..', 'lib', 'extraProducts.ts');
const tsCode = fs.readFileSync(tsNodePath, 'utf8');

// Extrage EXTRA_PRODUCTS_RAW din fișierul TS prin evaluare
// Simplificat: citim până la EXTRA_CANVAS_LABELS și extragem BASE_EXTRA_PRODUCTS_RAW
const match = tsCode.match(/const BASE_EXTRA_PRODUCTS_RAW: any\[\] = (\[[\s\S]*?\n\];)/);
if (!match) {
  console.error('❌ Nu am putut extrage produsele din extraProducts.ts');
  process.exit(1);
}

let productsCode = match[1];
// Evaluare JavaScript
const BASE_EXTRA_PRODUCTS_RAW = eval(productsCode);

console.log(`✅ Încărcate ${BASE_EXTRA_PRODUCTS_RAW.length} produse de bază`);

// Filtrează doar produsele cu poze
const productsWithImages = BASE_EXTRA_PRODUCTS_RAW.filter(p => p.images && p.images.length > 0);

console.log(`Găsite ${productsWithImages.length} produse cu imagini din ${BASE_EXTRA_PRODUCTS_RAW.length} total`);

// Header CSV conform Google Merchant Center
const headers = [
  'id',
  'title',
  'description',
  'link',
  'image_link',
  'price',
  'availability',
  'condition',
  'brand',
  'google_product_category',
  'product_type',
  'gtin',
  'mpn'
];

// Mapare categorii la Google Product Categories
const categoryMap = {
  'bannere': 'Arts & Entertainment > Party & Celebration > Banners',
  'afise': 'Media > Posters',
  'autocolante': 'Business & Industrial > Signage > Decals & Stickers',
  'canvas': 'Home & Garden > Decor > Artwork > Posters & Prints',
  'pliante': 'Business & Industrial > Advertising & Marketing > Brochures',
  'flayere': 'Business & Industrial > Advertising & Marketing > Flyers',
  'tapet': 'Home & Garden > Decor > Wallpaper',
  'rollup': 'Business & Industrial > Signage > Trade Show Displays',
  'window-graphics': 'Business & Industrial > Signage > Window Graphics',
  'materiale': 'Business & Industrial > Signage > Sign Boards'
};

// Generare Product Type din categorie
const getProductType = (category) => {
  const typeMap = {
    'bannere': 'Bannere Publicitare',
    'afise': 'Afișe & Postere',
    'autocolante': 'Autocolante',
    'canvas': 'Tablouri Canvas',
    'pliante': 'Pliante',
    'flayere': 'Flyere',
    'tapet': 'Tapet Personalizat',
    'rollup': 'Rollup Banner',
    'window-graphics': 'Window Graphics',
    'materiale': 'Materiale Rigide'
  };
  return typeMap[category] || 'Produse Publicitare';
};

// Escape CSV
const escapeCsv = (str) => {
  if (!str) return '';
  const s = String(str);
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
};

// Generare rânduri CSV
const rows = [headers.join(',')];

for (const product of productsWithImages) {
  const category = product.metadata?.category || 'bannere';
  const slug = product.slug || product.routeSlug || product.id;
  // Use original image extension (mostly .jpg) without forcing .webp
  const image = product.images[0];
  
  // Preț minim 55 RON pentru bannere (format Google Merchant: decimal cu 2 zecimale)
  const price = '55.00';
  
  const row = [
    escapeCsv(product.id),
    escapeCsv(product.title),
    escapeCsv(product.description || ''),
    escapeCsv(`https://prynt.ro/${category}/${slug}`),
    escapeCsv(`https://prynt.ro${image}`),
    `${price} RON`, // Format corect: "55.00 RON"
    'in stock',
    'new',
    'Prynt',
    escapeCsv(categoryMap[category] || 'Business & Industrial > Signage'),
    escapeCsv(getProductType(category)),
    '', // gtin
    ''  // mpn
  ];
  
  rows.push(row.join(','));
}

// Salvare CSV
const csvContent = rows.join('\n');
const outputPath = path.join(__dirname, '..', 'public', 'google-merchant-feed.csv');

fs.writeFileSync(outputPath, csvContent, 'utf8');
console.log(`✅ Feed generat cu succes: ${outputPath}`);
console.log(`📊 Total produse în feed: ${productsWithImages.length}`);

// Statistici pe categorii
const stats = {};
for (const p of productsWithImages) {
  const cat = p.metadata?.category || 'unknown';
  stats[cat] = (stats[cat] || 0) + 1;
}
console.log('\n📈 Distribuție pe categorii:');
Object.entries(stats).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
  console.log(`  ${cat}: ${count} produse`);
});
