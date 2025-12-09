# Prynt Monorepo

Acest repository conține aplicația web (Next.js) și aplicația mobilă (React Native/Expo) pentru Prynt, structurate ca monorepo cu pachete partajate.

## 📁 Structura

```
prynt/
├── app/                    # Next.js web app (app router)
├── components/             # React components pentru web
├── lib/                    # Business logic pentru web
├── mobile/                 # React Native app (Expo) - separate Git repo
│   ├── app/               # Expo Router screens
│   ├── components/        # React Native components
│   ├── lib/               # Mobile utilities
│   └── .git/              # Own Git repository
├── packages/
│   └── shared/            # Shared types, constants, utilities
│       ├── types.ts       # TypeScript types (Product, Order, etc.)
│       ├── constants.ts   # Constants (MATERIAL_OPTIONS, BUTTON_STYLES)
│       └── index.ts       # Main export
├── prisma/                # Database schema
└── package.json           # Root package with workspaces

```

## 🚀 Quick Start

### Web App
```bash
npm install
npm run dev
# Opens at http://localhost:3000
```

### Mobile App
```bash
cd mobile
npm install
npm start
# Opens Expo dev tools
```

## 📦 Packages

### `@prynt/shared`
Pachet partajat între web și mobile:
- **Types**: `Product`, `Order`, `MaterialOption`, `PriceInput*`
- **Constants**: `MATERIAL_OPTIONS`, `BUTTON_STYLES`, `CONFIGURATOR_FIRST_IMAGES`
- **API**: `API_BASE_URL`

## 🎨 Design System

### Button Styles (consistente web + mobile)
- **WhatsApp**: `from-green-600 to-emerald-600` - gradient verde
- **Cerere Ofertă**: `from-slate-600 to-slate-700` - gradient gri
- **CTA**: `from-indigo-600 to-indigo-700` - gradient indigo, full width

### Layout Desktop
```
┌─────────────────────────────────────┐
│ Preț: 250 RON    |  Livrare: 3 zile │
│ [WhatsApp] [Ofertă]                 │
│ [    Adaugă în Coș (full width)   ] │
└─────────────────────────────────────┘
```

## 🔄 Synchronization

### Web → Mobile
Aplicația mobilă folosește aceleași API-uri ca web-ul:
- `https://www.prynt.ro/api/products` - lista produse
- `https://www.prynt.ro/api/calc-price` - calcul preț
- `https://www.prynt.ro/api/order` - creare comandă

### Shared Code
Pentru a partaja cod între web și mobile:
```typescript
// În web (Next.js)
import { Product, MATERIAL_OPTIONS } from '@prynt/shared';

// În mobile (React Native)
import { Product, MATERIAL_OPTIONS } from '../../../packages/shared';
```

## 📱 Mobile Configurators

Configuratori implementați în mobile:
- ✅ **Banner** - `/mobile/app/configurator/banner.tsx`
- ✅ **Afișe** - `/mobile/app/configurator/afise.tsx`
- 🚧 **Flyere** - în dezvoltare
- 🚧 **Pliante** - în dezvoltare

## 🛠️ Development

### Add a New Configurator

1. **Web**: Creează `components/NewConfigurator.tsx`
2. **Mobile**: Creează `mobile/app/configurator/new.tsx`
3. **Shared**: Adaugă types în `packages/shared/types.ts`
4. **API**: Adaugă endpoint în `app/api/calc-price/route.ts`

### Update Shared Types
```bash
# Edit packages/shared/types.ts
# Types sunt automat disponibile în web și mobile
```

## 🗂️ Git Workflow

### Web Repository (main)
```bash
git add .
git commit -m "Update web app"
git push origin main
```

### Mobile Repository (separate)
```bash
cd mobile
git add .
git commit -m "Update mobile app"
git push origin main  # Pushes to ddobroiu/prynt-mobile
```

## 📊 Database

PostgreSQL cu Prisma:
```bash
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run migrations
npm run prisma:push      # Push schema changes
```

## 🚀 Deployment

### Web (Vercel)
```bash
npm run build
# Auto-deployed via Vercel GitHub integration
```

### Mobile (Expo)
```bash
cd mobile
npx eas build --platform android
npx eas build --platform ios
```

## 📝 Notes

- Mobile app are propriul repository Git (`ddobroiu/prynt-mobile`)
- Web și mobile partajează backend-ul (API, DB, Auth)
- NativeWind în mobile ≈ Tailwind CSS în web (same class names)
- Expo Router în mobile ≈ Next.js App Router în web
