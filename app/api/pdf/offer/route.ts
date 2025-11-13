import { NextRequest } from 'next/server';
// Use dynamic imports to allow a lightweight system-Chrome path on local,
// and a reliable fallback to bundled Chromium in production when needed.
import path from 'path';
import fs from 'fs';
import { renderOfferHTML } from '../../../../lib/pdfTemplate';
import { pdfOfferConfig } from '../../../../lib/pdfConfig';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function buildItems(raw: any[]): { title: string; details: string; qty: number; unit: number; total: number }[] {
  return (raw || []).map((it: any) => {
    const title = it.title ?? it.name ?? it.slug ?? 'Produs';
    const qty = Number(it.quantity ?? 1) || 1;
    const unit = Number(it.price ?? it.unitAmount ?? it.metadata?.price ?? 0) || 0;
    const total = unit > 0 ? unit * qty : Number(it.totalAmount ?? 0) || 0;

    // details from metadata, similar to client buildItemDetailsText
    const meta = it.metadata ?? {};
    const width = it.width ?? it.width_cm ?? meta.width_cm ?? meta.width;
    const height = it.height ?? it.height_cm ?? meta.height_cm ?? meta.height;
    const parts: string[] = [];
    if (width || height) parts.push(`Dimensiune: ${width ?? '—'} x ${height ?? '—'} cm`);
    // Generic selections/summary across all configuratoare
    if (typeof meta.selectedReadable === 'string' && meta.selectedReadable.trim()) {
      parts.push(`Opțiuni selectate: ${meta.selectedReadable}`);
    }
    const sel = (meta as any).selections;
    if (sel && typeof sel === 'object') {
      try {
        const isNoneish = (v: any): boolean => {
          if (v === false) return true;
          if (v && typeof v === 'object' && 'value' in v) return isNoneish((v as any).value);
          if (typeof v === 'string') {
            const t = v.trim().toLowerCase();
            return t === 'none' || t === 'niciuna' || t === 'nicio' || t === 'nu' || t === 'no' || t === 'false' || t === '0' || t === 'n/a';
          }
          if (typeof v === 'number') return v === 0;
          return false;
        };
        const fmtEntry = (x: any) => {
          if (typeof x === 'string') return x;
          if (x && typeof x === 'object') {
            if ('label' in x && 'value' in x) return `${x.label}: ${x.value}`;
            if ('name' in x && 'value' in x) return `${x.name}: ${x.value}`;
            if ('name' in x) return String((x as any).name);
          }
          return JSON.stringify(x);
        };
        if (Array.isArray(sel)) {
          const list = sel
            .filter((x) => !isNoneish(x))
            .map(fmtEntry)
            .filter((s) => typeof s === 'string' && s.trim() !== '')
            .join('; ');
          if (list) parts.push(`Detalii configurare: ${list}`);
        } else {
          const entries = Object.entries(sel as Record<string, any>)
            .filter(([_, v]) => v !== null && v !== undefined && !isNoneish(v) && String(v).trim() !== '')
            .map(([k,v]) => `${k}: ${typeof v === 'string' ? v : fmtEntry(v)}`);
          if (entries.length) parts.push(`Detalii configurare: ${entries.join('; ')}`);
        }
      } catch {}
    }
    const labelForKey: Record<string, string> = {
      width: 'Lățime (cm)', height: 'Înălțime (cm)', width_cm: 'Lățime (cm)', height_cm: 'Înălțime (cm)',
      totalSqm: 'Suprafață totală (m²)', sqmPerUnit: 'm²/buc', pricePerSqm: 'Preț pe m² (RON)',
      materialId: 'Material', material: 'Material', laminated: 'Laminare', designOption: 'Grafică',
      proDesignFee: 'Taxă grafică Pro (RON)', want_adhesive: 'Adeziv', want_hem_and_grommets: 'Tiv și capse',
      want_wind_holes: 'Găuri pentru vânt', shape_diecut: 'Tăiere la contur', productType: 'Tip panou',
      thickness_mm: 'Grosime (mm)', sameGraphicFrontBack: 'Aceeași grafică față/spate', framed: 'Șasiu',
      sizeKey: 'Dimensiune preset', mode: 'Mod canvas', orderNotes: 'Observații',
    };
    const pretty = (k: string, v: any) => {
      if (k === 'materialId') return v === 'frontlit_510' ? 'Frontlit 510g' : v === 'frontlit_440' ? 'Frontlit 440g' : String(v);
      if (k === 'productType') return v === 'alucobond' ? 'Alucobond' : v === 'polipropilena' ? 'Polipropilenă' : v === 'pvc-forex' ? 'PVC Forex' : String(v);
      if (k === 'designOption') return v === 'pro' ? 'Pro' : v === 'upload' ? 'Am fișier' : v === 'text_only' ? 'Text' : String(v);
      if (typeof v === 'boolean') return v ? 'Da' : 'Nu';
      return String(v);
    };
    const exclude = new Set(['price','totalAmount','qty','quantity','artwork','artworkUrl','artworkLink','text','textDesign','selectedReadable','selections','title','name']);
    Object.keys(meta).forEach((k) => {
      if (exclude.has(k)) return;
      if (k === 'proDesignFee') {
        const num = Number(meta[k]);
        if (!isFinite(num) || num <= 0) return;
      }
      const val = meta[k];
      if (val === null || val === undefined) return;
      if (typeof val === 'number' && val === 0) return;
      if (typeof val === 'string' && val.trim() === '') return;
      const label = labelForKey[k] ?? k;
      parts.push(`${label}: ${pretty(k, val)}`);
    });

    return { title, details: parts.join(' • '), qty, unit, total };
  });
}

async function getLogoDataUrl(): Promise<string | null> {
  try {
    const rel = (pdfOfferConfig.logoPath || '').replace(/^\//, '');
    if (!rel) return null;
    const p = path.join(process.cwd(), 'public', rel);
    if (!fs.existsSync(p)) return null;
    const buf = await fs.promises.readFile(p);
    const ext = path.extname(p).toLowerCase();
    const mime = ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 'image/png';
    return `data:${mime};base64,${buf.toString('base64')}`;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const items = buildItems(body?.items || body?.cart || []);
    const subtotal = items.reduce((s, it) => s + (Number(it.total) || 0), 0);
    const shipping = typeof body?.shipping === 'number' ? body.shipping : 19.99;
    const total = subtotal + shipping;
    const date = new Date().toLocaleDateString('ro-RO');

    const logoDataUrl = await getLogoDataUrl();
    const html = renderOfferHTML({ items, subtotal, shipping, total, date, logoDataUrl });

    // Launch Chrome via puppeteer-core if system Chrome exists; otherwise fallback to puppeteer (bundled Chromium)
    const core = (await import('puppeteer-core')).default;
    const candidates = [
      process.env.CHROME_PATH,
      process.env.PUPPETEER_EXECUTABLE_PATH,
      process.platform === 'win32' ? 'C:/Program Files/Google/Chrome/Application/chrome.exe' : undefined,
      '/usr/bin/chromium',
      '/usr/bin/chromium-browser',
      '/usr/bin/google-chrome',
      '/usr/bin/google-chrome-stable',
    ].filter(Boolean) as string[];

    let executablePath: string | undefined;
    for (const p of candidates) {
      try { if (p && fs.existsSync(p)) { executablePath = p; break; } } catch {}
    }

    let browser;
    const commonArgs = [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--no-zygote',
      '--single-process'
    ];

    if (executablePath) {
      browser = await core.launch({ headless: true, executablePath, args: commonArgs });
    } else {
      const puppeteerFallback = (await import('puppeteer')).default;
      browser = await puppeteerFallback.launch({ headless: true, args: commonArgs });
    }

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '12mm', right: '10mm', bottom: '14mm', left: '10mm' },
    });
    await browser.close();

    // Convert Buffer -> Uint8Array (detached ArrayBuffer) for Response
    const u8 = Uint8Array.from(pdf);
    return new Response(u8, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="oferta-${date}.pdf"`,
      },
    });
  } catch (e: any) {
    console.error('[PDF Offer] error:', e?.message || e);
    return new Response(JSON.stringify({ error: 'Nu s-a putut genera PDF-ul.' }), { status: 500 });
  }
}
