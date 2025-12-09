#!/usr/bin/env node

/**
 * Sync Verification Script
 * Verifică dacă web și mobile sunt sincronizate
 */

const fs = require('fs');
const path = require('path');

const errors = [];
const warnings = [];
const success = [];

console.log('🔍 Verificare sincronizare Web ↔ Mobile...\n');

// 1. Verifică dacă packages/shared există
if (fs.existsSync('packages/shared/types.ts')) {
  success.push('✅ packages/shared/types.ts există');
} else {
  errors.push('❌ packages/shared/types.ts lipsește!');
}

if (fs.existsSync('packages/shared/constants.ts')) {
  success.push('✅ packages/shared/constants.ts există');
} else {
  errors.push('❌ packages/shared/constants.ts lipsește!');
}

// 2. Verifică mobile components
if (fs.existsSync('mobile/components/ActionButtons.tsx')) {
  success.push('✅ mobile/components/ActionButtons.tsx există');
} else {
  warnings.push('⚠️  mobile/components/ActionButtons.tsx lipsește');
}

// 3. Verifică mobile configuratori
const mobileConfigurators = [
  'banner.tsx',
  'afise.tsx',
  'flayere.tsx',
];

mobileConfigurators.forEach(file => {
  const filePath = `mobile/app/configurator/${file}`;
  if (fs.existsSync(filePath)) {
    success.push(`✅ mobile/app/configurator/${file} există`);
  } else {
    warnings.push(`⚠️  mobile/app/configurator/${file} lipsește`);
  }
});

// 4. Verifică button colors în web configuratori
const webConfigPath = 'components';
if (fs.existsSync(webConfigPath)) {
  const files = fs.readdirSync(webConfigPath).filter(f => f.includes('Configurator.tsx'));
  
  files.forEach(file => {
    const content = fs.readFileSync(path.join(webConfigPath, file), 'utf-8');
    
    // Check for new button colors
    const hasGreenWhatsApp = content.includes('from-green-600 to-emerald-600');
    const hasSlateQuote = content.includes('from-slate-600 to-slate-700');
    const hasIndigoCTA = content.includes('from-indigo-600 to-indigo-700') || content.includes('btn-primary');
    
    if (hasGreenWhatsApp && hasSlateQuote && hasIndigoCTA) {
      success.push(`✅ ${file} - button colors actualizate`);
    } else {
      const missing = [];
      if (!hasGreenWhatsApp) missing.push('WhatsApp green');
      if (!hasSlateQuote) missing.push('Quote slate');
      if (!hasIndigoCTA) missing.push('CTA indigo');
      warnings.push(`⚠️  ${file} - lipsesc culori: ${missing.join(', ')}`);
    }
    
    // Check for desktop layout (lg:ml-auto)
    if (content.includes('lg:ml-auto')) {
      // OK
    } else {
      warnings.push(`⚠️  ${file} - lipsește lg:ml-auto pentru layout desktop`);
    }
  });
}

// 5. Verifică workspace configuration
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
if (packageJson.workspaces && packageJson.workspaces.includes('packages/*')) {
  success.push('✅ Workspace configurat corect în package.json');
} else {
  warnings.push('⚠️  Workspace configuration lipsește din package.json');
}

// 6. Verifică mobile/lib/productsService.ts
if (fs.existsSync('mobile/lib/productsService.ts')) {
  const content = fs.readFileSync('mobile/lib/productsService.ts', 'utf-8');
  
  const categories = [
    'banner',
    'afise',
    'flayere',
    'pliante',
    'autocolante',
    'canvas',
    'rollup',
  ];
  
  const missingCategories = categories.filter(cat => !content.includes(`'${cat}'`));
  
  if (missingCategories.length === 0) {
    success.push('✅ mobile/lib/productsService.ts - toate categoriile prezente');
  } else {
    warnings.push(`⚠️  mobile/lib/productsService.ts - categorii lipsă: ${missingCategories.join(', ')}`);
  }
} else {
  warnings.push('⚠️  mobile/lib/productsService.ts lipsește');
}

// 7. Raport final
console.log('\n📊 RAPORT SINCRONIZARE\n');
console.log('═'.repeat(60));

if (success.length > 0) {
  console.log('\n✅ SUCCES:');
  success.forEach(msg => console.log(`  ${msg}`));
}

if (warnings.length > 0) {
  console.log('\n⚠️  AVERTISMENTE:');
  warnings.forEach(msg => console.log(`  ${msg}`));
}

if (errors.length > 0) {
  console.log('\n❌ ERORI:');
  errors.forEach(msg => console.log(`  ${msg}`));
}

console.log('\n' + '═'.repeat(60));
console.log(`\n📈 Scor: ${success.length} succese, ${warnings.length} avertismente, ${errors.length} erori\n`);

if (errors.length > 0) {
  console.log('❌ Sincronizarea EȘUATĂ - rezolvă erorile!\n');
  process.exit(1);
} else if (warnings.length > 0) {
  console.log('⚠️  Sincronizarea OK cu avertismente - verifică manual\n');
  process.exit(0);
} else {
  console.log('✅ Sincronizarea COMPLETĂ - totul e la zi!\n');
  process.exit(0);
}
