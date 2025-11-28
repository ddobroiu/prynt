# Sistemul de Email Marketing

## 📧 Prezentare Generală

Sistemul de email marketing implementat pentru Prynt se concentrează pe cele 14 configuratoare principale ale site-ului și include funcționalități complete pentru:

- **Newsletter cu interese specifice** - Utilizatorii se pot abona și selecta configuratoarele care îi interesează
- **Abandoned Cart Recovery** - Secvență automată de email-uri pentru coșurile abandonate
- **Recomandări inteligente** - Cross-sell bazat pe configuratorul curent al utilizatorului

## 🎯 Configuratoarele Principale (14)

Sistemul mapează toate cele 14 configuratoare principale:

### Categorii Email Marketing:
- **Outdoor**: banner, banner-verso
- **Indoor**: autocolante, afise  
- **Decor**: canvas, tapet
- **Promo**: flayere, pliante
- **Rigide**: pvc-forex, plexiglass, alucobond, carton, polipropilena
- **Pachete EU**: fonduri-eu

## 🔧 Componente Implementate

### 1. Core System (`lib/emailMarketing.ts`)
- **MAIN_CONFIGURATORS**: Maparea completă a celor 14 configuratoare cu preturi, categorii, beneficii
- **EMAIL_CATEGORIES**: Organizarea configuratoare pe categorii pentru recomandări
- **Smart Recommendations**: Logic de cross-sell între configuratoare relacionate
- **Email Templates**: Funcții pentru generare conținut email personalizat

### 2. Newsletter Signup (`components/NewsletterSignup.tsx`)
- **Moduri flexibile**: `compact` pentru configuratoare, `full` pentru footer
- **Tracking interese**: Utilizatorii selectează configuratoarele de interes
- **Validare email**: Verificare format și gestionare erori
- **UTM tracking**: Urmărește sursa înregistrărilor

### 3. API Endpoints

#### Newsletter Subscription (`/api/newsletter/subscribe`)
```typescript
POST /api/newsletter/subscribe
{
  "email": "user@example.com",
  "interests": ["banner", "canvas"],
  "source": "configurator",
  "utmParams": {
    "source": "website",
    "medium": "newsletter_signup"
  }
}
```

#### Abandoned Cart Tracking (`/api/cart/abandoned`)
```typescript
// Track abandonment
POST /api/cart/abandoned
{
  "email": "user@example.com",
  "configuratorId": "banner",
  "cartData": {...},
  "sessionId": "unique_session"
}

// Send recovery emails
PUT /api/cart/abandoned
```

### 4. React Hooks

#### `useNewsletterSignup`
- Gestionează starea formularului de newsletter
- Validare email și trimitere cereri API
- Tracking analytics pentru conversii

#### `useAbandonedCart`
- Tracking automat activitate utilizator (30s inactivity)
- Salvare automată la page unload
- Integration cu CartContext pentru sincronizare

### 5. Database Schema

#### Enhanced Subscriber Model
```prisma
model Subscriber {
  id          String   @id @default(cuid())
  email       String   @unique
  interests   String[] // Configuratoarele de interes
  utmSource   String?
  utmMedium   String?
  utmCampaign String?
  isConfirmed Boolean  @default(false)
  createdAt   DateTime @default(now())
}
```

#### AbandonedCart Model  
```prisma
model AbandonedCart {
  id           String    @id @default(cuid())
  email        String
  configuratorId String
  cartData     Json
  sessionId    String
  emailsSent   Int       @default(0)
  lastEmailSent DateTime?
  createdAt    DateTime  @default(now())
  
  @@unique([email, sessionId])
}
```

## 🔄 Fluxuri Email Automatizate

### 1. Newsletter Welcome Sequence
- **Email de confirmare** cu link de activare
- **Email de bun venit** cu recomandări personalizate pentru configuratoare
- **Sugestii cross-sell** bazate pe interesele declarate

### 2. Abandoned Cart Recovery (3-Email Sequence)

#### Email 1 - Gentle Reminder (după 1h)
- Mesaj politicos de reminder
- Link direct la configurator cu datele salvate
- Fără discount

#### Email 2 - Incentive (după 24h) 
- **10% discount** pentru finalizarea comenzii
- Testimoniale sociale
- Urgență limitată

#### Email 3 - Final Push (după 3 zile)
- **15% discount final**
- FOMO (Fear of Missing Out)
- Alternative products din aceeași categorie

### 3. Smart Recommendations
Cross-sell logic între configuratoare:
- **Banner** → autocolante, afise (outdoor campaigns)
- **Canvas** → tapet (decor upgrades)  
- **Flayere** → pliante (marketing materials)
- **PVC-Forex** → plexiglass, alucobond (material upgrades)

## 🚀 Integrare în Configuratoare

### Exemplu: BannerConfigurator.tsx
```tsx
// Import hooks și componente
import NewsletterSignup from "./NewsletterSignup";
import useAbandonedCart from "@/hooks/useAbandonedCart";

// În componentă
const [userEmail, setUserEmail] = useState<string>("");

// Tracking abandoned cart
useAbandonedCart({ 
  configuratorId: 'banner', 
  email: userEmail,
  cartData: { input, artworkUrl, textDesign, priceData }
});

// Newsletter section în UI
<NewsletterSignup 
  configuratorId="banner"
  source="configurator"
  compact={true}
/>
```

## ⚙️ Cron Job pentru Abandoned Cart

### Endpoint: `/api/cron/abandoned-cart-emails`
- **Rulează automat** (recomandare: la fiecare oră)
- **Procesează secvența** de 3 email-uri
- **Cleanup automat** - șterge coșurile abandonate > 30 zile
- **Logging complet** pentru monitoring

### Configuration în Vercel/Railway:
```bash
# Cron job configuration (Vercel Cron sau external cron)
0 * * * * curl -X POST https://yourdomain.com/api/cron/abandoned-cart-emails
```

## 📊 Tracking și Analytics

### Newsletter Metrics:
- Conversii per configurator
- Sursa înregistrărilor (UTM tracking)
- Rate de deschidere și click

### Abandoned Cart Metrics:
- Recovery rate per email din secvență  
- Revenue recuperat
- Performance per configurator

### Google Analytics Events:
```javascript
gtag('event', 'newsletter_signup', {
  event_category: 'engagement',
  event_label: 'banner,canvas',
  value: 2
});
```

## 🔒 Securitate și GDPR

- **Double opt-in** pentru newsletter
- **Unsubscribe links** în toate email-urile
- **Data retention** - cleanup automat după 30 zile
- **Consentul explicit** pentru marketing emails

## 📈 Next Steps (Opțional)

1. **A/B Testing** - Testare subiecte email și timing
2. **Advanced Segmentation** - Segmentare pe valoarea comenzii
3. **Behavioral Triggers** - Email-uri bazate pe browsing behavior
4. **Integration CRM** - Export date pentru analysis avansată
5. **SMS Marketing** - Extinderea cu SMS pentru recovery

## 🛠️ Deployment Notes

1. **Database Migration**: `npx prisma generate && npx prisma db push` ✅
2. **Environment Variables**: `RESEND_API_KEY` configurat ✅  
3. **Build Success**: Compilare fără erori ✅
4. **Cron Setup**: Configurare cron job pentru abandoned cart emails
5. **Testing**: Verificare fluxuri email în staging

---

**Status**: ✅ **Sistema este completă și deployment-ready!**