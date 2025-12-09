# FIX DEPLOYMENT - URGENT

## Problema
Vercel rulează versiunea veche a site-ului. Trebuie redeploy manual.

## Soluție RAPIDĂ - 3 pași:

### 1. Intră în Vercel
- Du-te la: https://vercel.com/ddobroiu/prynt
- Login dacă nu ești deja

### 2. Verifică Environment Variables
- Click pe **Settings** (sus)
- Click pe **Environment Variables** (stânga)
- Verifică că ai TOATE astea (dacă lipsesc, adaugă-le):

```
DATABASE_URL = postgresql://postgres:oeirMAZvrTOBRFhOIbauCVumFmpmczbz@nozomi.proxy.rlwy.net:34120/railway
RESEND_API_KEY = re_aTdMNJHT_6iofVfxsf9C6smsn5aZbn9MU
EMAIL_FROM = contact@prynt.ro
ADMIN_EMAIL = contact@prynt.ro
SUPPORT_EMAIL = contact@prynt.ro
```

### 3. Redeploy fără cache
- Click pe **Deployments** (sus)
- Găsește ultimul deployment (cel cu "Force Vercel rebuild")
- Click pe **"..."** (3 puncte din dreapta)
- Click pe **"Redeploy"**
- **IMPORTANT:** DEBIFEAZĂ "Use existing Build Cache"
- Click pe **"Redeploy"** (butonul mare)

### 4. Așteaptă 2-3 minute
- Vercel va face rebuild complet
- După ce deployment-ul devine verde (✓ Ready)
- Testează o comandă pe site

## CE AR TREBUI SĂ MEARGĂ DUPĂ:
✅ Comanda se salvează în DB cu toate datele
✅ Primești email cu: nume, telefon, email, adresă completă
✅ Clientul primește email complet
✅ Apare în admin cu toate detaliile
✅ Se poate genera factură
✅ Se poate genera AWB
✅ Redirect la pagina corectă de succes

## Dacă tot nu merge după redeploy:
Înseamnă că Vercel nu are toate Environment Variables. Verifică din nou Settings → Environment Variables.
This document was removed because it contained sensitive environment examples. Please refer to Vercel Environment Variables and local `.env.local` for configuration.
