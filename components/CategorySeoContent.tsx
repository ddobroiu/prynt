import React from "react";

export default function CategorySeoContent({ kind }: { kind: string }) {
  const k = kind.toLowerCase();
  switch (k) {
    case "banner":
      return (
        <div>
          <h2 className="text-xl font-semibold mb-2">Bannere publicitare – când și cum le alegi</h2>
          <p className="mb-2">Bannerele sunt vizibile, durabile și eficiente pentru exterior. Pentru față simplă recomandăm PVC Frontlit 510 g, iar pentru print pe ambele fețe – material Blockout (opac).</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Rezoluție recomandată: 100–150 dpi la scara 1:1</li>
            <li>Finisaje: tiv, capse, buzunare pentru țevi/rame</li>
            <li>Montaj: prindere uniformă în colțuri, tensionare moderată</li>
          </ul>
        </div>
      );
    case "banner-verso":
      return (
        <div>
          <h2 className="text-xl font-semibold mb-2">Banner față–verso (blockout)</h2>
          <p className="mb-2">Material opac pentru print pe ambele fețe, ideal pentru suspendare în spații deschise sau galerii.</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Finisaje: tiv, capse, buzunare</li>
            <li>Aplicații: evenimente, galerii, spații cu trafic</li>
          </ul>
        </div>
      );
    case "autocolante":
      return (
        <div>
          <h2 className="text-xl font-semibold mb-2">Autocolante decupate la contur – alegerea materialului</h2>
          <p className="mb-2">Monomeric pentru campanii scurte, Polimeric pentru durabilitate mai bună la exterior; laminare pentru protecție UV și abraziune.</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Include un contur (cut-path) sau descrie forma dorită</li>
            <li>Rezoluție: 150–300 dpi la scara 1:1 pentru detalii fine</li>
          </ul>
        </div>
      );
    case "pliante":
      return (
        <div>
          <h2 className="text-xl font-semibold mb-2">Pliante – format, pliere, hârtie</h2>
          <p className="mb-2">Alege formatul (A6–A4) și tipul de pliere (bi/tri pli) în funcție de informația de comunicat; 170–200 g oferă un echilibru bun.</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Bleed: 3 mm; margini de siguranță: 3–5 mm</li>
            <li>Plastifiere opțională pentru aspect premium</li>
          </ul>
        </div>
      );
    case "flayere":
      return (
        <div>
          <h2 className="text-xl font-semibold mb-2">Flyere – distribuție rapidă, mesaj concis</h2>
          <p className="mb-2">Formate uzuale A6/A5, hârtie 130–300 g, finisaj lucios sau mat. Concentrează mesajul și CTA-ul.</p>
        </div>
      );
    case "afise":
      return (
        <div>
          <h2 className="text-xl font-semibold mb-2">Afișe – materiale și rezoluție</h2>
          <p className="mb-2">Blueback pentru outdoor (opac), Whiteback/Satin/Foto pentru indoor. 150–300 dpi pentru A3–A0, 100–150 dpi pentru foarte mari.</p>
        </div>
      );
    case "canvas":
      return (
        <div>
          <h2 className="text-xl font-semibold mb-2">Tablouri canvas – imagine clară și montaj gata</h2>
          <p className="mb-2">Print pe pânză de calitate, întinsă pe șasiu din lemn. Recomandăm imagini de rezoluție mare pentru claritate (min. 2000–3000 px pe latura lungă pentru formate medii-mari). Opțional, ramă decorativă pentru aspect premium.</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Întindere “gallery wrap” (imaginea pe cant) sau margine albă</li>
            <li>Ideal pentru decor acasă, birouri, horeca</li>
            <li><a className="underline" href="/canvas">Comandă tablouri canvas</a></li>
          </ul>
        </div>
      );
    case "carton":
      return (
        <div>
          <h2 className="text-xl font-semibold mb-2">Print pe carton – versatil pentru promoții</h2>
          <p className="mb-2">Cartonul este o soluție accesibilă pentru semnalistică indoor, etichete, materiale promoționale. Se poate bigui, cresta sau lamina la cerere.</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Formate personalizate, muchii curate</li>
            <li>Gramaje/grosimi în funcție de aplicație</li>
            <li><a className="underline" href="/carton">Comandă print pe carton</a></li>
          </ul>
        </div>
      );
    case "plexiglass":
      return (
        <div>
          <h2 className="text-xl font-semibold mb-2">Plexiglass – aspect premium, lucios</h2>
          <p className="mb-2">Plexiglasul (acrilicul) oferă claritate excelentă și luciu premium. Se poate printa față sau în oglindă (pe spate) pentru efect de profunzime, cu opal/white pentru opacizare uniformă.</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Găurire/decupare la formă pentru montaj</li>
            <li>Display-uri, plăcuțe, branding premium</li>
            <li><a className="underline" href="/plexiglass">Comandă plexiglass</a></li>
          </ul>
        </div>
      );
    case "polipropilena":
      return (
        <div>
          <h2 className="text-xl font-semibold mb-2">Polipropilenă celulară – panouri ușoare</h2>
          <p className="mb-2">Foarte ușoară și rigidă, polipropilena celulară (Akyplac) este ideală pentru panouri temporare, standuri și semnalistică economică.</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Grosimi uzuale: 3–5 mm</li>
            <li>Print față sau față–verso</li>
            <li><a className="underline" href="/polipropilena">Comandă panouri PP</a></li>
          </ul>
        </div>
      );
    case "pvc-forex":
      return (
        <div>
          <h2 className="text-xl font-semibold mb-2">PVC Forex – panouri rigide pentru indoor</h2>
          <p className="mb-2">PVC-ul expandat (Forex) este ușor și rigid, recomandat pentru semnalistică de interior, display-uri și panouri informative. Pentru exterior prelungit, ia în calcul alucobond sau protecții suplimentare.</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Grosimi uzuale: 3–10 mm</li>
            <li>Posibilitate de găurire/șablon pentru montaj</li>
            <li><a className="underline" href="/pvc-forex">Comandă PVC Forex</a></li>
          </ul>
        </div>
      );
    case "tapet":
      return (
        <div>
          <h2 className="text-xl font-semibold mb-2">Tapet personalizat – măsurare și montaj</h2>
          <p className="mb-2">Alege material texturat sau lavabil în funcție de încăpere. Măsoară peretele (lățime × înălțime) și adaugă o marjă pentru ajustare la montaj. Imagini de rezoluție mare recomandate.</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Aplicare pe perete curat și amorsat</li>
            <li>Îmbinări discrete, print la calitate foto</li>
            <li><a className="underline" href="/tapet">Comandă tapet</a></li>
          </ul>
        </div>
      );
    case "alucobond":
      return (
        <div>
          <h2 className="text-xl font-semibold mb-2">Alucobond – panouri compozite pentru exterior</h2>
          <p className="mb-2">Placă compozită cu fețe din aluminiu și miez PE, stabilă dimensional și rezistentă la intemperii. Ideală pentru firme, panotaj durabil și proiecte premium.</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Print direct, laminare sau branding cu folie</li>
            <li>Prelucrări: decupare, găurire, frezare</li>
            <li><a className="underline" href="/alucobond">Comandă alucobond</a></li>
          </ul>
        </div>
      );
    default:
      return (
        <div>
          <h2 className="text-xl font-semibold mb-2">Despre produs</h2>
          <p className="mb-2">Configurează dimensiunile și opțiunile, încarcă fișierele și obține prețul instant. Livrare 24–48h.</p>
        </div>
      );
  }
}
