# 🔄 Sync Guide - Web ↔ Mobile

Ghid pentru menținerea sincronizării între aplicația web și cea mobilă.

## 📋 Checklist pentru Noi Features

Când adaugi un feature nou pe web, urmează pașii:

### 1. ✅ Adaugă Types în `packages/shared/types.ts`
```typescript
export type NewProductInput = {
  width: number;
  height: number;
  material: string;
  // ...
};
```

### 2. ✅ Adaugă Constants în `packages/shared/constants.ts`
```typescript
export const NEW_MATERIALS = [
  { id: 'material-1', label: 'Material 1', priceModifier: 1 },
  // ...
];
```

### 3. ✅ Actualizează Web Configurator
- `components/NewConfigurator.tsx`
- Layout: Desktop (price | delivery side-by-side)
- Buttons: WhatsApp (green), Ofertă (slate), CTA (indigo full-width)

### 4. ✅ Actualizează Mobile Configurator
- `mobile/app/configurator/new.tsx`
- Import `PriceSection` component
- Folosește aceleași culori ca web (NativeWind classes)

### 5. ✅ Actualizează API Routes
- `app/api/calc-price/route.ts` - adaugă noul tip de produs
- `app/api/products/route.ts` - adaugă produsul în listă

### 6. ✅ Actualizează Services
- Web: `lib/pricing.ts` - adaugă funcție calcul
- Mobile: `mobile/lib/productsService.ts` - adaugă categorie

## 🎨 Design System Sync

### Button Colors (OBLIGATORIU)
```typescript
// Web (Tailwind)
WhatsApp: "bg-gradient-to-r from-green-600 to-emerald-600"
Ofertă:   "bg-gradient-to-r from-slate-600 to-slate-700"
CTA:      "bg-gradient-to-r from-indigo-600 to-indigo-700"

// Mobile (NativeWind - same classes!)
WhatsApp: "bg-gradient-to-r from-green-600 to-emerald-600"
Ofertă:   "bg-gradient-to-r from-slate-600 to-slate-700"
CTA:      "bg-gradient-to-r from-indigo-600 to-indigo-700"
```

### Layout Desktop Web
```tsx
<div className="flex flex-col lg:flex-row lg:justify-between lg:items-center">
  <div>Preț: {price} RON</div>
  <div className="lg:ml-auto">Livrare: {days} zile</div>
</div>
```

### Layout Mobile
```tsx
<View className="flex-row justify-between items-center">
  <View><Text>Preț: {price} RON</Text></View>
  <View className="items-end"><Text>Livrare: {days} zile</Text></View>
</View>
```

## 📱 Mobile Components Usage

### Import PriceSection
```tsx
import { PriceSection } from '../../components/ActionButtons';

// În configurator
<PriceSection
  price={calculatedPrice}
  deliveryDays={deliveryDays}
  onWhatsAppPress={handleWhatsApp}
  onQuotePress={handleQuote}
  onAddToCart={handleAddToCart}
/>
```

## 🔧 Common Tasks

### Update Button Styles Everywhere
```bash
# 1. Update packages/shared/constants.ts
export const BUTTON_STYLES = {
  whatsapp: { gradient: 'from-green-600 to-emerald-600', ... },
  // ...
};

# 2. Web: Update all configurators in components/
# 3. Mobile: Update mobile/components/ActionButtons.tsx
```

### Add New Material Option
```typescript
// 1. packages/shared/constants.ts
export const MATERIAL_OPTIONS = [
  // ... existing
  { 
    id: 'new-material', 
    label: 'New Material', 
    priceModifier: 1.2,
    recommendedFor: ['category-name']
  },
];

// 2. Web: Auto-available via import
// 3. Mobile: Auto-available via import
```

### Add New Product Category
```typescript
// 1. packages/shared/constants.ts
export const CONFIGURATOR_FIRST_IMAGES = {
  // ... existing
  'new-category': '/products/new-category/image-1.webp',
};

// 2. mobile/lib/productsService.ts
export const PRODUCT_CATEGORIES = [
  // ... existing
  { id: 'new-category', name: 'New Category', route: '/new-category', icon: 'icon-name' },
];

// 3. mobile/app/(tabs)/home.tsx - add to configurators array
// 4. Create mobile/app/configurator/new-category.tsx
```

## 🚀 Testing Sync

### Verify Button Colors
```bash
# Web
grep -r "from-green-600 to-emerald-600" components/

# Mobile
grep -r "from-green-600 to-emerald-600" mobile/components/
```

### Verify Types
```bash
# Both should have same types
cat packages/shared/types.ts
```

### Test Price Calculation
```bash
# Web API
curl -X POST http://localhost:3000/api/calc-price \
  -H "Content-Type: application/json" \
  -d '{"productType":"banner","widthCm":100,"heightCm":200,...}'

# Mobile uses same endpoint
```

## 📝 Pre-Commit Checklist

Înainte de commit, verifică:
- [ ] Types actualizate în `packages/shared/types.ts`
- [ ] Constants actualizate în `packages/shared/constants.ts`
- [ ] Web configurator folosește button styles corecte
- [ ] Mobile configurator folosește `PriceSection` component
- [ ] Layout-ul desktop are `lg:ml-auto` pentru delivery
- [ ] Toate butoanele au culorile noi (green WhatsApp, slate Ofertă, indigo CTA)
- [ ] API route acceptă noul tip de produs
- [ ] Mobile home screen include noul configurator

## 🔍 Quick Reference

### File Locations
```
Types:       packages/shared/types.ts
Constants:   packages/shared/constants.ts
Web Config:  components/*Configurator.tsx
Mobile Cfg:  mobile/app/configurator/*.tsx
API Price:   app/api/calc-price/route.ts
Mobile API:  mobile/lib/api.ts
```

### Import Patterns
```typescript
// Web
import { Product, MATERIAL_OPTIONS } from '@prynt/shared';

// Mobile
import { Product, MATERIAL_OPTIONS } from '../../../packages/shared';
// OR use relative path based on file location
```

## 🎯 Priority Levels

### 🔴 HIGH (Must sync immediately)
- Button colors and styles
- Types and interfaces
- API endpoints
- Price calculation logic

### 🟡 MEDIUM (Sync within sprint)
- New product categories
- Material options
- UI layout improvements

### 🟢 LOW (Can be async)
- Copy text changes
- Image updates
- Non-critical styling

---

**Remember**: Web și Mobile partajează același backend, deci orice schimbare în API sau DB afectează ambele aplicații!
