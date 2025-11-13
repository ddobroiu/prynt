
'use client';

import React from 'react';
import { useCart } from './CartContext';

type ChatRole = 'user' | 'assistant' | 'system';

type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
};

// Simple guided flow for banners using the existing /api/calc-price endpoint
type BannerWizardState = {
  active: boolean;
  step: number; // 0..5 questions
  data: {
    widthCm?: number;
    heightCm?: number;
    quantity?: number;
    materialId?: 'frontlit_440' | 'frontlit_510';
    want_hem_and_grommets?: boolean;
    want_wind_holes?: boolean;
    designOption?: 'upload' | 'pro';
  };
  result?: {
    price: number;
    pricePerUnit: number;
    pricePerSqm: number;
    sqmPerUnit: number;
    totalSqm: number;
  } | null;
  loading?: boolean;
};

// Guided flow for Tapet (Dreamscape Vinilic)
type TapetWizardState = {
  active: boolean;
  step: number; // 0..3
  data: {
    widthCm?: number;
    heightCm?: number;
    quantity?: number;
    want_adhesive?: boolean;
    designOption?: 'upload' | 'pro';
  };
  result?: {
    price: number;
    pricePerUnit: number;
    pricePerSqm: number;
    sqmPerUnit: number;
    totalSqm: number;
  } | null;
  loading?: boolean;
};

// Guided flow for Autocolante
type AutocolanteWizardState = {
  active: boolean;
  step: number; // 0..5
  data: {
    widthCm?: number;
    heightCm?: number;
    quantity?: number;
    material?: 'paper_gloss' | 'paper_matte' | 'vinyl';
    laminated?: boolean;
    shape_diecut?: boolean;
    designOption?: 'upload' | 'text_only' | 'pro';
  };
  result?: {
    price: number;
    pricePerUnit: number;
    sqmPerUnit: number;
    totalSqm: number;
  } | null;
  loading?: boolean;
};

// Guided flow for rigid panels (PVC Forex, Alucobond, Polipropilenă)
type PanelWizardState = {
  active: boolean;
  step: number; // 0..3
  data: {
    widthCm?: number;
    heightCm?: number;
    quantity?: number;
    productType?: 'pvc-forex' | 'alucobond' | 'polipropilena';
    thicknessMm?: number;
  };
  result?: {
    price: number;
    pricePerUnit: number;
    pricePerSqm: number;
    sqmPerUnit: number;
    totalSqm: number;
  } | null;
  loading?: boolean;
};

export default function AssistantWidget() {
  const [open, setOpen] = React.useState(false);
  const { addItem } = useCart();
  const [loading, setLoading] = React.useState(false);
  const [input, setInput] = React.useState('');
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Salut! Sunt asistentul Prynt. Spune-mi pe scurt ce ai nevoie (ex: banner exterior 3×1 m cu capse, autocolante decupate, pliante A5 etc.) și te ghidez către produsul potrivit.',
    },
  ]);

  const [bannerWizard, setBannerWizard] = React.useState<BannerWizardState>({
    active: false,
    step: 0,
    data: {},
    result: null,
    loading: false,
  });

  const [tapetWizard, setTapetWizard] = React.useState<TapetWizardState>({
    active: false,
    step: 0,
    data: {},
    result: null,
    loading: false,
  });

  const [autocolanteWizard, setAutocolanteWizard] = React.useState<AutocolanteWizardState>({
    active: false,
    step: 0,
    data: {},
    result: null,
    loading: false,
  });

  const [panelWizard, setPanelWizard] = React.useState<PanelWizardState>({
    active: false,
    step: 0,
    data: {},
    result: null,
    loading: false,
  });

  async function sendMessage(e?: React.FormEvent) {
    e?.preventDefault();
    const text = input.trim();
    if (!text) return;
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: text,
    };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    // If banner wizard is active, consume the message as an answer
    if (bannerWizard.active) {
      handleBannerWizardAnswer(text);
      return;
    }

    // If tapet wizard is active
    if (tapetWizard.active) {
      handleTapetWizardAnswer(text);
      return;
    }

    // If autocolante wizard is active
    if (autocolanteWizard.active) {
      handleAutocolanteWizardAnswer(text);
      return;
    }

    if (panelWizard.active) {
      handlePanelWizardAnswer(text);
      return;
    }

    // If user intent looks like banner, start the wizard
    if (/banner|baner/i.test(text)) {
      startBannerWizard();
      return;
    }

    // Detect tapet intent
    if (/tapet|wallpaper/i.test(text)) {
      startTapetWizard();
      return;
    }

    // Detect autocolante intent
    if (/autocolant|autocolante|sticker|stickere/i.test(text)) {
      startAutocolanteWizard();
      return;
    }

    // Detect rigid panels
    if (/pvc|forex|alucobond|polipropilen[aă]/i.test(text)) {
      startPanelWizard();
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg].map(({ role, content }) => ({ role, content })) }),
      });
      if (!res.ok) throw new Error('Network error');
      const data = (await res.json()) as { reply: string };
      setMessages((m) => [
        ...m,
        { id: `a-${Date.now()}`, role: 'assistant', content: data.reply },
      ]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        {
          id: `e-${Date.now()}`,
          role: 'assistant',
          content:
            'Îmi pare rău, a apărut o problemă. Încearcă din nou sau folosește meniul pentru a alege produsul.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  // Quick prompts removed to avoid overlaying the conversation

  function startBannerWizard() {
    setBannerWizard({ active: true, step: 0, data: {}, result: null, loading: false });
    setMessages((m) => [
      ...m,
      {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content:
          'Hai să calculăm prețul pentru un banner. 1) Ce dimensiuni ai? Scrie lățime×înălțime în cm (ex: 300×100).',
      },
    ]);
  }

  function handleBannerWizardAnswer(text: string) {
    const s = { ...bannerWizard };
    const next = (content: string) =>
      setMessages((m) => [...m, { id: `a-${Date.now()}`, role: 'assistant', content }]);

    if (s.step === 0) {
      // parse dims like 300x100 / 300×100 / "300 100"
      const m = text.match(/(\d{2,4})\s*[x×]\s*(\d{2,4})/) || text.match(/(\d{2,4})\s+(\d{2,4})/);
      if (!m) {
        next('Nu am înțeles dimensiunile. Te rog folosește formatul 300×100 (cm).');
        return;
      }
      s.data.widthCm = Number(m[1]);
      s.data.heightCm = Number(m[2]);
      s.step = 1;
      setBannerWizard(s);
      next('2) Câte bucăți dorești? (scrie un număr întreg)');
      return;
    }

    if (s.step === 1) {
      const q = Math.max(1, Math.floor(Number(text)) || 0);
      if (!q) {
        next('Te rog scrie un număr valid (ex: 2).');
        return;
      }
      s.data.quantity = q;
      s.step = 2;
      setBannerWizard(s);
      next('3) Material: Frontlit 440g sau 510g? (scrie 440 sau 510)');
      return;
    }

    if (s.step === 2) {
      s.data.materialId = /510/.test(text) ? 'frontlit_510' : 'frontlit_440';
      s.step = 3;
      setBannerWizard(s);
      next('4) Vrei tiv și capse? (da/nu)');
      return;
    }

    if (s.step === 3) {
      s.data.want_hem_and_grommets = isYes(text);
      s.step = 4;
      setBannerWizard(s);
      next('5) Vrei găuri pentru vânt? (da/nu)');
      return;
    }

    if (s.step === 4) {
      s.data.want_wind_holes = isYes(text);
      s.step = 5;
      setBannerWizard(s);
      next('6) Grafică: ai fișier sau dorești Pro? (scrie: upload sau pro)');
      return;
    }

    if (s.step === 5) {
      s.data.designOption = /pro/i.test(text) ? 'pro' : 'upload';
      // compute
      setBannerWizard((bw) => ({ ...bw, loading: true }));
      fetch('/api/calc-price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          widthCm: s.data.widthCm,
          heightCm: s.data.heightCm,
          quantity: s.data.quantity,
          materialId: s.data.materialId,
          want_hem_and_grommets: s.data.want_hem_and_grommets,
          want_wind_holes: s.data.want_wind_holes,
          designOption: s.data.designOption,
        }),
      })
        .then(async (r) => {
          if (!r.ok) throw new Error('calc failed');
          const j = await r.json();
          setBannerWizard((bw) => ({
            ...bw,
            result: {
              price: j.price,
              pricePerUnit: j.pricePerUnit,
              pricePerSqm: j.pricePerSqm,
              sqmPerUnit: j.sqmPerUnit,
              totalSqm: j.totalSqm,
            },
            loading: false,
          }));
          next(
            `Preț total: ${formatRON(j.price)} (${formatRON(j.pricePerUnit)}/buc). Suprafață: ${j.totalSqm} m². Vrei să adaug în coș sau deschidem configuratorul?`
          );
        })
        .catch(() => {
          setBannerWizard((bw) => ({ ...bw, loading: false }));
          next('A apărut o eroare la calcul. Te rog încearcă din nou sau folosește configuratorul de pe pagina Banner.');
        });
      s.step = 6; // done
      setBannerWizard(s);
      return;
    }
  }

  function startTapetWizard() {
    // reset other flows
    setBannerWizard((s) => ({ ...s, active: false }));
    setAutocolanteWizard((s) => ({ ...s, active: false }));
    setTapetWizard({ active: true, step: 0, data: {}, result: null, loading: false });
    setMessages((m) => [
      ...m,
      { id: `a-${Date.now()}`, role: 'assistant', content: 'Hai să calculăm prețul pentru tapet. 1) Ce dimensiuni ai? Scrie lățime×înălțime în cm (ex: 300×270).' },
    ]);
  }

  function handleTapetWizardAnswer(text: string) {
    const s = { ...tapetWizard };
    const next = (content: string) => setMessages((m) => [...m, { id: `a-${Date.now()}`, role: 'assistant', content }]);

    if (s.step === 0) {
      const m = text.match(/(\d{2,4})\s*[x×]\s*(\d{2,4})/) || text.match(/(\d{2,4})\s+(\d{2,4})/);
      if (!m) {
        next('Nu am înțeles dimensiunile. Te rog folosește formatul 300×270 (cm).');
        return;
      }
      s.data.widthCm = Number(m[1]);
      s.data.heightCm = Number(m[2]);
      s.step = 1;
      setTapetWizard(s);
      next('2) Câte bucăți dorești? (scrie un număr întreg)');
      return;
    }

    if (s.step === 1) {
      const q = Math.max(1, Math.floor(Number(text)) || 0);
      if (!q) {
        next('Te rog scrie un număr valid (ex: 2).');
        return;
      }
      s.data.quantity = q;
      s.step = 2;
      setTapetWizard(s);
      next('3) Vrei varianta cu adeziv? (da/nu)');
      return;
    }

    if (s.step === 2) {
      s.data.want_adhesive = isYes(text);
      s.step = 3;
      setTapetWizard(s);
      next('4) Grafică: ai fișier sau dorești Pro? (scrie: upload sau pro)');
      return;
    }

    if (s.step === 3) {
      s.data.designOption = /pro/i.test(text) ? 'pro' : 'upload';
      setTapetWizard((tw) => ({ ...tw, loading: true }));
      fetch('/api/calc-price/tapet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          widthCm: s.data.widthCm,
          heightCm: s.data.heightCm,
          quantity: s.data.quantity,
          want_adhesive: s.data.want_adhesive,
          designOption: s.data.designOption,
        }),
      })
        .then(async (r) => {
          if (!r.ok) throw new Error('calc failed');
          const j = await r.json();
          setTapetWizard((tw) => ({
            ...tw,
            result: {
              price: j.price,
              pricePerUnit: j.pricePerUnit,
              pricePerSqm: j.pricePerSqm,
              sqmPerUnit: j.sqmPerUnit,
              totalSqm: j.totalSqm,
            },
            loading: false,
          }));
          next(`Preț total: ${formatRON(j.price)} (${formatRON(j.pricePerUnit)}/buc). Suprafață: ${j.totalSqm} m². Vrei să adaug în coș sau deschidem configuratorul Tapet?`);
        })
        .catch(() => {
          setTapetWizard((tw) => ({ ...tw, loading: false }));
          next('A apărut o eroare la calcul. Te rog încearcă din nou sau folosește configuratorul Tapet.');
        });
      s.step = 4; // done
      setTapetWizard(s);
      return;
    }
  }

  function startAutocolanteWizard() {
    // reset other flows
    setBannerWizard((s) => ({ ...s, active: false }));
    setTapetWizard((s) => ({ ...s, active: false }));
    setAutocolanteWizard({ active: true, step: 0, data: {}, result: null, loading: false });
    setMessages((m) => [
      ...m,
      { id: `a-${Date.now()}`, role: 'assistant', content: 'Hai să calculăm autocolantele. 1) Ce dimensiuni are un autocolant? Scrie lățime×înălțime în cm (ex: 10×10).' },
    ]);
  }

  function handleAutocolanteWizardAnswer(text: string) {
    const s = { ...autocolanteWizard };
    const next = (content: string) => setMessages((m) => [...m, { id: `a-${Date.now()}`, role: 'assistant', content }]);

    if (s.step === 0) {
      const m = text.match(/(\d{1,4})\s*[x×]\s*(\d{1,4})/) || text.match(/(\d{1,4})\s+(\d{1,4})/);
      if (!m) {
        next('Nu am înțeles dimensiunile. Te rog folosește formatul 10×10 (cm).');
        return;
      }
      s.data.widthCm = Number(m[1]);
      s.data.heightCm = Number(m[2]);
      s.step = 1;
      setAutocolanteWizard(s);
      next('2) Câte bucăți dorești? (scrie un număr întreg)');
      return;
    }

    if (s.step === 1) {
      const q = Math.max(1, Math.floor(Number(text)) || 0);
      if (!q) {
        next('Te rog scrie un număr valid (ex: 100).');
        return;
      }
      s.data.quantity = q;
      s.step = 2;
      setAutocolanteWizard(s);
      next('3) Material: hârtie lucioasă, hârtie mată sau vinyl?');
      return;
    }

    if (s.step === 2) {
      const t = text.toLowerCase();
      if (t.includes('vinyl')) s.data.material = 'vinyl';
      else if (t.includes('mat')) s.data.material = 'paper_matte';
      else s.data.material = 'paper_gloss';
      s.step = 3;
      setAutocolanteWizard(s);
      next('4) Laminare? (da/nu)');
      return;
    }

    if (s.step === 3) {
      s.data.laminated = isYes(text);
      s.step = 4;
      setAutocolanteWizard(s);
      next('5) Tăiere la contur (die-cut)? (da/nu)');
      return;
    }

    if (s.step === 4) {
      s.data.shape_diecut = isYes(text);
      s.step = 5;
      setAutocolanteWizard(s);
      next('6) Grafică: ai fișier, doar text sau Pro? (scrie: upload / text / pro)');
      return;
    }

    if (s.step === 5) {
      const t = text.toLowerCase();
      if (t.includes('pro')) s.data.designOption = 'pro';
      else if (t.includes('text')) s.data.designOption = 'text_only';
      else s.data.designOption = 'upload';

      setAutocolanteWizard((aw) => ({ ...aw, loading: true }));
      fetch('/api/calc-price/autocolante', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          widthCm: s.data.widthCm,
          heightCm: s.data.heightCm,
          quantity: s.data.quantity,
          material: s.data.material,
          laminated: s.data.laminated,
          shape_diecut: s.data.shape_diecut,
          designOption: s.data.designOption,
        }),
      })
        .then(async (r) => {
          if (!r.ok) throw new Error('calc failed');
          const j = await r.json();
          setAutocolanteWizard((aw) => ({
            ...aw,
            result: {
              price: j.price,
              pricePerUnit: j.pricePerUnit,
              sqmPerUnit: j.sqmPerUnit,
              totalSqm: j.totalSqm,
            },
            loading: false,
          }));
          next(`Preț total: ${formatRON(j.price)} (${formatRON(j.pricePerUnit)}/buc). Vrei să adaug în coș sau deschidem configuratorul Autocolante?`);
        })
        .catch(() => {
          setAutocolanteWizard((aw) => ({ ...aw, loading: false }));
          next('A apărut o eroare la calcul. Te rog încearcă din nou sau folosește configuratorul Autocolante.');
        });
      s.step = 6; // done
      setAutocolanteWizard(s);
      return;
    }
  }

  function startPanelWizard() {
    // reset other flows
    setBannerWizard((s) => ({ ...s, active: false }));
    setTapetWizard((s) => ({ ...s, active: false }));
    setAutocolanteWizard((s) => ({ ...s, active: false }));
    setPanelWizard({ active: true, step: 0, data: {}, result: null, loading: false });
    setMessages((m) => [
      ...m,
      { id: `a-${Date.now()}`, role: 'assistant', content: 'Hai să configurăm panouri rigide. 1) Ce dimensiuni ai? Scrie lățime×înălțime în cm (ex: 100×100).' },
    ]);
  }

  function handlePanelWizardAnswer(text: string) {
    const s = { ...panelWizard };
    const next = (content: string) => setMessages((m) => [...m, { id: `a-${Date.now()}`, role: 'assistant', content }]);

    if (s.step === 0) {
      const m = text.match(/(\d{2,4})\s*[x×]\s*(\d{2,4})/) || text.match(/(\d{2,4})\s+(\d{2,4})/);
      if (!m) {
        next('Nu am înțeles dimensiunile. Te rog folosește formatul 100×100 (cm).');
        return;
      }
      s.data.widthCm = Number(m[1]);
      s.data.heightCm = Number(m[2]);
      s.step = 1;
      setPanelWizard(s);
      next('2) Câte bucăți dorești? (scrie un număr întreg)');
      return;
    }

    if (s.step === 1) {
      const q = Math.max(1, Math.floor(Number(text)) || 0);
      if (!q) {
        next('Te rog scrie un număr valid (ex: 2).');
        return;
      }
      s.data.quantity = q;
      s.step = 2;
      setPanelWizard(s);
      next('3) Tip material: PVC Forex, Alucobond sau Polipropilenă?');
      return;
    }

    if (s.step === 2) {
      const t = text.toLowerCase();
      if (/(alu|alucobond)/.test(t)) s.data.productType = 'alucobond';
      else if (/(pp|polipropilen)/.test(t)) s.data.productType = 'polipropilena';
      else s.data.productType = 'pvc-forex';
      s.step = 3;
      setPanelWizard(s);
      const options = s.data.productType === 'alucobond' ? '3mm, 4mm' : s.data.productType === 'polipropilena' ? '3mm, 5mm' : '1mm, 2mm, 3mm, 4mm, 5mm, 6mm, 8mm, 10mm';
      next(`4) Grosime disponibilă (${s.data.productType}): alege una din ${options}`);
      return;
    }

    if (s.step === 3) {
      const mm = Number((text.match(/\d{1,2}/) || [])[0] || 0);
      const valid = s.data.productType === 'alucobond' ? [3, 4] : s.data.productType === 'polipropilena' ? [3, 5] : [1, 2, 3, 4, 5, 6, 8, 10];
      if (!valid.includes(mm)) {
        next(`Te rog alege o grosime validă (${valid.join(', ')} mm).`);
        return;
      }
      s.data.thicknessMm = mm;
      setPanelWizard((pw) => ({ ...pw, loading: true }));
      fetch('/api/calc-price/panel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          widthCm: s.data.widthCm,
          heightCm: s.data.heightCm,
          quantity: s.data.quantity,
          productType: s.data.productType,
          thicknessMm: s.data.thicknessMm,
        }),
      })
        .then(async (r) => {
          if (!r.ok) throw new Error('calc failed');
          const j = await r.json();
          setPanelWizard((pw) => ({
            ...pw,
            result: {
              price: j.price,
              pricePerUnit: j.pricePerUnit,
              pricePerSqm: j.pricePerSqm,
              sqmPerUnit: j.sqmPerUnit,
              totalSqm: j.totalSqm,
            },
            loading: false,
          }));
          next(`Preț total: ${formatRON(j.price)} (${formatRON(j.pricePerUnit)}/buc). Suprafață: ${j.totalSqm} m². Vrei să adaug în coș sau deschidem configuratorul?`);
        })
        .catch(() => {
          setPanelWizard((pw) => ({ ...pw, loading: false }));
          next('A apărut o eroare la calcul. Te rog încearcă din nou sau folosește configuratorul de pe pagină.');
        });
      s.step = 4; // done
      setPanelWizard(s);
      return;
    }
  }

  React.useEffect(() => {
    function onOpen() {
      setOpen(true);
    }
    function onToggle() {
      setOpen((v) => !v);
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('assistant:open', onOpen as EventListener);
      window.addEventListener('assistant:toggle', onToggle as EventListener);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('assistant:open', onOpen as EventListener);
        window.removeEventListener('assistant:toggle', onToggle as EventListener);
      }
    };
  }, []);

  return (
    <div className="fixed bottom-20 right-4 z-40">
      {/* Panel only (no floating toggle button). Opened via Contact button events. */}
      {open && (
        <div className="mt-2 w-[360px] sm:w-[420px] max-h-[70vh] overflow-hidden rounded-xl border border-white/10 bg-[#0b0b0b] text-white shadow-xl">
          <div className="p-3 border-b border-white/10 flex items-center justify-between gap-2">
            <div>
              <div className="font-semibold">Asistent Prynt</div>
              <div className="text-xs text-white/60">Recomandări pentru servicii de print</div>
            </div>
            <div className="flex items-center gap-2">
              <a href="https://wa.me/40750473111" target="_blank" rel="noopener noreferrer" className="px-2 py-1 rounded-md text-xs bg-green-600 hover:bg-green-500">WhatsApp</a>
              <a href="mailto:contact@prynt.ro" className="px-2 py-1 rounded-md text-xs bg-blue-600 hover:bg-blue-500">Email</a>
              <button
                aria-label="Închide asistentul"
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-1 text-sm hover:bg-white/10"
              >
                ×
              </button>
            </div>
          </div>

          <div className="p-3 space-y-3 overflow-y-auto max-h-[50vh]">
            {messages.map((m) => (
              <div key={m.id} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                <div
                  className={
                    'inline-block px-3 py-2 rounded-lg whitespace-pre-wrap ' +
                    (m.role === 'user'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-[#1a1a1a] text-white')
                  }
                  dangerouslySetInnerHTML={{ __html: linkify(m.content) }}
                />
              </div>
            ))}
          </div>

          {bannerWizard.active && bannerWizard.loading && (
            <div className="p-2 text-center text-xs text-muted-foreground">Se calculează…</div>
          )}

          {bannerWizard.active && bannerWizard.result && (
            <div className="p-3 border-t flex flex-wrap gap-2">
              <button
                className="px-3 py-2 rounded-md bg-primary text-white text-sm"
                onClick={() => {
                  const d = bannerWizard.data;
                  const r = bannerWizard.result!;
                  const qty = d.quantity || 1;
                  const title = `Banner ${d.materialId === 'frontlit_510' ? 'Frontlit 510g' : 'Frontlit 440g'} - ${d.widthCm}x${d.heightCm} cm`;
                  addItem({
                    id: `banner-${d.materialId}-${d.widthCm}x${d.heightCm}-${d.want_hem_and_grommets?'capse':''}-${Date.now()}`,
                    productId: 'banner',
                    slug: 'banner',
                    title,
                    width: d.widthCm,
                    height: d.heightCm,
                    price: r.pricePerUnit,
                    quantity: qty,
                    currency: 'RON',
                    metadata: {
                      materialId: d.materialId,
                      want_hem_and_grommets: d.want_hem_and_grommets,
                      want_wind_holes: d.want_wind_holes,
                      designOption: d.designOption,
                      totalSqm: r.totalSqm,
                      sqmPerUnit: r.sqmPerUnit,
                      pricePerSqm: r.pricePerSqm,
                    },
                  });
                  setMessages((m) => [...m, { id: `a-${Date.now()}`, role: 'assistant', content: 'Am adăugat în coș. Poți continua cumpărăturile sau finaliza comanda.' }]);
                }}
              >
                Adaugă în coș
              </button>
              <a
                href={`/banner?w=${bannerWizard.data.widthCm}&h=${bannerWizard.data.heightCm}&qty=${bannerWizard.data.quantity || 1}&mat=${bannerWizard.data.materialId}`}
                className="px-3 py-2 rounded-md border text-sm"
              >
                Deschide configuratorul
              </a>
            </div>
          )}

          {tapetWizard.active && tapetWizard.loading && (
            <div className="p-2 text-center text-xs text-muted-foreground">Se calculează…</div>
          )}

          {tapetWizard.active && tapetWizard.result && (
            <div className="p-3 border-t flex flex-wrap gap-2">
              <button
                className="px-3 py-2 rounded-md bg-primary text-white text-sm"
                onClick={() => {
                  const d = tapetWizard.data;
                  const r = tapetWizard.result!;
                  const qty = d.quantity || 1;
                  const title = `Tapet Dreamscape Vinilic${d.want_adhesive ? ' (cu adeziv)' : ''} - ${d.widthCm}x${d.heightCm} cm`;
                  addItem({
                    id: `tapet-${d.want_adhesive?'adh':'noadh'}-${d.widthCm}x${d.heightCm}-${Date.now()}`,
                    productId: 'tapet',
                    slug: 'tapet',
                    title,
                    width: d.widthCm,
                    height: d.heightCm,
                    price: r.pricePerUnit,
                    quantity: qty,
                    currency: 'RON',
                    metadata: {
                      want_adhesive: d.want_adhesive,
                      designOption: d.designOption,
                      totalSqm: r.totalSqm,
                      sqmPerUnit: r.sqmPerUnit,
                      pricePerSqm: r.pricePerSqm,
                    },
                  });
                  setMessages((m) => [...m, { id: `a-${Date.now()}`, role: 'assistant', content: 'Am adăugat în coș. Poți continua cumpărăturile sau finaliza comanda.' }]);
                }}
              >
                Adaugă în coș
              </button>
              <a
                href={`/tapet?w=${tapetWizard.data.widthCm}&h=${tapetWizard.data.heightCm}&qty=${tapetWizard.data.quantity || 1}&adh=${tapetWizard.data.want_adhesive ? '1' : '0'}`}
                className="px-3 py-2 rounded-md border text-sm"
              >
                Deschide configuratorul
              </a>
            </div>
          )}

          {autocolanteWizard.active && autocolanteWizard.loading && (
            <div className="p-2 text-center text-xs text-muted-foreground">Se calculează…</div>
          )}

          {autocolanteWizard.active && autocolanteWizard.result && (
            <div className="p-3 border-t flex flex-wrap gap-2">
              <button
                className="px-3 py-2 rounded-md bg-primary text-white text-sm"
                onClick={() => {
                  const d = autocolanteWizard.data;
                  const r = autocolanteWizard.result!;
                  const qty = d.quantity || 1;
                  const title = `Autocolant ${d.material === 'vinyl' ? 'Vinyl' : d.material === 'paper_matte' ? 'Hârtie Mată' : 'Hârtie Lucioasă'} - ${d.widthCm}x${d.heightCm} cm`;
                  addItem({
                    id: `autocolant-${d.material}-${d.widthCm}x${d.heightCm}-${d.laminated?'lam':''}-${d.shape_diecut?'die':''}-${Date.now()}`,
                    productId: 'autocolante',
                    slug: 'autocolante',
                    title,
                    width: d.widthCm,
                    height: d.heightCm,
                    price: r.pricePerUnit,
                    quantity: qty,
                    currency: 'RON',
                    metadata: {
                      material: d.material,
                      laminated: d.laminated,
                      shape_diecut: d.shape_diecut,
                      designOption: d.designOption,
                      totalSqm: r.totalSqm,
                      sqmPerUnit: r.sqmPerUnit,
                    },
                  });
                  setMessages((m) => [...m, { id: `a-${Date.now()}`, role: 'assistant', content: 'Am adăugat în coș. Poți continua cumpărăturile sau finaliza comanda.' }]);
                }}
              >
                Adaugă în coș
              </button>
              <a
                href={`/autocolante?w=${autocolanteWizard.data.widthCm}&h=${autocolanteWizard.data.heightCm}&qty=${autocolanteWizard.data.quantity || 1}`}
                className="px-3 py-2 rounded-md border text-sm"
              >
                Deschide configuratorul
              </a>
            </div>
          )}

          {panelWizard.active && panelWizard.loading && (
            <div className="p-2 text-center text-xs text-muted-foreground">Se calculează…</div>
          )}

          {panelWizard.active && panelWizard.result && (
            <div className="p-3 border-t flex flex-wrap gap-2">
              <button
                className="px-3 py-2 rounded-md bg-primary text-white text-sm"
                onClick={() => {
                  const d = panelWizard.data;
                  const r = panelWizard.result!;
                  const qty = d.quantity || 1;
                  const slug = d.productType || 'pvc-forex';
                  const title = `${slug === 'alucobond' ? 'Alucobond' : slug === 'polipropilena' ? 'Polipropilenă' : 'PVC Forex'} ${d.thicknessMm}mm - ${d.widthCm}x${d.heightCm} cm`;
                  addItem({
                    id: `panel-${slug}-${d.thicknessMm}-${d.widthCm}x${d.heightCm}-${Date.now()}`,
                    productId: slug,
                    slug: slug,
                    title,
                    width: d.widthCm,
                    height: d.heightCm,
                    price: r.pricePerUnit,
                    quantity: qty,
                    currency: 'RON',
                    metadata: {
                      productType: slug,
                      thickness_mm: d.thicknessMm,
                      totalSqm: r.totalSqm,
                      sqmPerUnit: r.sqmPerUnit,
                      pricePerSqm: r.pricePerSqm,
                    },
                  });
                  setMessages((m) => [...m, { id: `a-${Date.now()}`, role: 'assistant', content: 'Am adăugat în coș. Poți continua cumpărăturile sau finaliza comanda.' }]);
                }}
              >
                Adaugă în coș
              </button>
              <a
                href={`/${panelWizard.data.productType || 'pvc-forex'}?w=${panelWizard.data.widthCm}&h=${panelWizard.data.heightCm}&qty=${panelWizard.data.quantity || 1}&t=${panelWizard.data.thicknessMm}`}
                className="px-3 py-2 rounded-md border text-sm"
              >
                Deschide configuratorul
              </a>
            </div>
          )}

          <form onSubmit={sendMessage} className="p-3 border-t border-white/10 flex gap-2 bg-[#0f0f0f]">
            <input
              type="text"
              className="flex-1 rounded-md border border-white/10 bg-[#0b0b0b] text-white px-3 py-2 text-sm focus:outline-none"
              placeholder="Scrie mesajul tău..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              className="px-3 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-sm disabled:opacity-60"
              disabled={loading}
            >
              {loading ? '...' : 'Trimite'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

function linkify(text: string) {
  // Very small helper to keep links clickable in assistant replies
  return text.replace(/(https?:\/\/[^\s<]+)/g, '<a class="underline" target="_blank" rel="noopener" href="$1">$1</a>');
}

function isYes(text: string) {
  return /^(da|yes|y|ok|sigur)/i.test(text.trim());
}

function formatRON(n: number) {
  try {
    return new Intl.NumberFormat('ro-RO', { style: 'currency', currency: 'RON', maximumFractionDigits: 2 }).format(n);
  } catch {
    return `${n.toFixed(2)} RON`;
  }
}
