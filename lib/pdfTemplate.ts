import { pdfOfferConfig } from './pdfConfig';

type Item = { title: string; details: string; qty: number; unit: number; total: number };

function esc(s: any) {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function renderOfferHTML(params: {
  items: Item[];
  subtotal: number;
  shipping: number;
  total: number;
  date: string;
  logoDataUrl?: string | null;
}) {
  const cfg = pdfOfferConfig;
  const { items, subtotal, shipping, total, date, logoDataUrl } = params;
  const fmtRON = (n: number) => new Intl.NumberFormat('ro-RO', { style: 'currency', currency: 'RON', maximumFractionDigits: 2 }).format(n);

  const rows = items
    .map(
      (it) => `
        <tr>
          <td>${esc(it.title)}</td>
          <td>${esc(it.details || '-')}</td>
          <td class="num">${esc(it.qty)}</td>
          <td class="num">${esc(fmtRON(it.unit))}</td>
          <td class="num">${esc(fmtRON(it.total))}</td>
        </tr>`
    )
    .join('');

  return `<!DOCTYPE html>
  <html lang="ro">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Ofertă</title>
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
      :root {
        --primary: rgb(${cfg.layout.primary[0]}, ${cfg.layout.primary[1]}, ${cfg.layout.primary[2]});
        --muted: rgb(${cfg.layout.textMuted[0]}, ${cfg.layout.textMuted[1]}, ${cfg.layout.textMuted[2]});
        --panel: rgb(${cfg.layout.panelBg[0]}, ${cfg.layout.panelBg[1]}, ${cfg.layout.panelBg[2]});
        --border: rgb(${cfg.layout.border[0]}, ${cfg.layout.border[1]}, ${cfg.layout.border[2]});
      }
      * { box-sizing: border-box; }
      html, body { margin: 0; padding: 0; font-family: 'Inter', system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; color: #141414; }
      .page { padding: 28mm 18mm 24mm 18mm; }
      header { display: flex; align-items: center; gap: 16px; }
      header .logo { width: 56px; height: 56px; object-fit: contain; }
      header .info { line-height: 1.4; }
      header .name { font-weight: 700; font-size: 14px; }
      header .muted { color: var(--muted); font-size: 12px; }

      .row { display:flex; justify-content: space-between; align-items: baseline; margin-top: 8px; }
      .title { font-weight: 700; font-size: 20px; }
      .date { font-size: 12px; color: var(--muted); }
      .sep { height: 1px; background: var(--border); margin: 14px 0 12px; }

      table { width: 100%; border-collapse: collapse; }
      thead th { text-align: left; padding: 10px 8px; font-weight: 600; background: var(--primary); color: #fff; font-size: 12px; }
      tbody td { padding: 9px 8px; font-size: 11px; vertical-align: top; border-bottom: 1px solid var(--border); }
      .num { text-align: right; white-space: nowrap; }
      tbody tr:nth-child(even) td { background: #fafafa; }

      .totals { margin-top: 16px; display: flex; justify-content: flex-end; }
      .panel { width: 280px; background: var(--panel); border: 1px solid var(--border); border-radius: 8px; padding: 12px; }
      .panel .label { font-size: 11px; color: var(--muted); }
      .panel .row { margin: 4px 0; }
      .panel .value { font-size: 12px; font-weight: 600; }
      .panel .total { font-weight: 700; }

      footer { margin-top: 18px; font-size: 10px; color: var(--muted); }
    </style>
  </head>
  <body>
    <div class="page">
      <header>
        ${logoDataUrl ? `<img class="logo" src="${logoDataUrl}" />` : ''}
        <div class="info">
          <div class="name">${esc(cfg.company.name)}</div>
          <div class="muted">CUI: ${esc(cfg.company.cui)}</div>
          <div class="muted">Nr. Reg. Com.: ${esc(cfg.company.regCom)}</div>
        </div>
        <div style="margin-left:auto; text-align:right">
          <div class="title">Ofertă</div>
          <div class="date">Data: ${esc(date)}</div>
        </div>
      </header>

      <div class="sep"></div>

      <table>
        <thead>
          <tr>
            <th>Produs</th>
            <th>Detalii</th>
            <th class="num">Cant.</th>
            <th class="num">Preț unitar</th>
            <th class="num">Total</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>

      <div class="totals">
        <div class="panel">
          <div class="row"><span class="label">Produse</span> <span class="value" style="float:right">${esc(fmtRON(subtotal))}</span></div>
          <div class="row"><span class="label">Livrare</span>  <span class="value" style="float:right">${esc(fmtRON(shipping))}</span></div>
          <div class="row" style="border-top:1px solid var(--border); margin-top:6px; padding-top:6px"><span class="label total">Total</span> <span class="value total" style="float:right">${esc(fmtRON(total))}</span></div>
        </div>
      </div>

      <footer>
        ${esc(cfg.notes.validity)}
        ${cfg.company.email ? ` · ${esc(cfg.company.email)}` : ''}
        ${cfg.company.phone ? ` · ${esc(cfg.company.phone)}` : ''}
        ${cfg.company.website ? ` · ${esc(cfg.company.website)}` : ''}
      </footer>
    </div>
  </body>
  </html>`;
}
