"use client";
import React from "react";
import { UploadCloud } from "lucide-react";

type Props = {
  width: number;
  height: number;
  imageUrl: string | null;
  hasGrommets: boolean;
  hasWindHoles: boolean;
};

export default function ArtworkRatioPreview({ width, height, imageUrl, hasGrommets, hasWindHoles }: Props) {
  const w = width > 0 ? width : 100;
  const h = height > 0 ? height : 100;
  const ratio = w / h;

  const grommetSpacing = 25; // cm
  const windHoleSpacing = 30; // cm

  // Definire OFFSET procentual (aproximativ) pentru simulare
  // 3cm offset la un banner de 100cm înseamnă 3%. 
  // Calculăm dinamic un mic padding ca să fie mereu "inauntru".
  const offsetPerc = 3; // 3% de la margine (aprox)
  const startP = offsetPerc; 
  const endP = 100 - offsetPerc;
  
  const grommets = [];
  if (hasGrommets) {
    const safeW = w; // simplificare pt simulare
    const safeH = h;
    const countX = Math.ceil(safeW / grommetSpacing);
    const countY = Math.ceil(safeH / grommetSpacing);
    
    // Top & Bottom Row
    for (let i = 0; i <= countX; i++) {
        // Interpolăm între startP și endP
        const progress = i / countX; 
        const leftPos = startP + progress * (endP - startP);
        
        grommets.push({ left: `${leftPos}%`, top: `${startP}%` });     // Sus
        grommets.push({ left: `${leftPos}%`, top: `${endP}%` });       // Jos
    }
    
    // Left & Right Row (excludem capetele i=0 și i=max ca să nu dublăm colțurile, dar aici e simulare vizuală, dublarea nu deranjează vizual așa tare, dar e mai curat fără)
    for (let i = 1; i < countY; i++) {
        const progress = i / countY;
        const topPos = startP + progress * (endP - startP);

        grommets.push({ left: `${startP}%`, top: `${topPos}%` });      // Stânga
        grommets.push({ left: `${endP}%`, top: `${topPos}%` });        // Dreapta
    }
  }

  const windHoles = [];
  if (hasWindHoles) {
      const rows = Math.floor(h / windHoleSpacing);
      const cols = Math.floor(w / windHoleSpacing);
      for(let r=1; r<=rows; r++) {
          for(let c=1; c<=cols; c++) {
              windHoles.push({ 
                  left: `${(c / (cols+1)) * 100}%`, 
                  top: `${(r / (rows+1)) * 100}%` 
              });
          }
      }
  }

  return (
    <div className="w-full h-full flex items-center justify-center bg-zinc-100 p-6 overflow-hidden relative">
      <div 
        style={{ aspectRatio: ratio }} 
        className="relative shadow-2xl bg-white max-w-full max-h-full flex items-center justify-center group border border-gray-200"
      >
        {imageUrl ? (
          <>
            <img 
                src={imageUrl} 
                alt="Simulare Grafică" 
                className="w-full h-full object-cover z-0" 
            />

            {/* Overlay Capse (Inside & Black Contour) */}
            {hasGrommets && grommets.map((g, i) => (
                <div 
                    key={`sim-g-${i}`}
                    className="absolute w-3 h-3 sm:w-4 sm:h-4 border-2 border-black bg-white rounded-full shadow-sm z-10 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
                    style={{ left: g.left, top: g.top }}
                >
                  {/* Punctul găurii */}
                  <div className="w-1.5 h-1.5 bg-gray-300 rounded-full border border-black/10"></div>
                </div>
            ))}

            {/* Overlay Găuri Vânt */}
            {hasWindHoles && windHoles.map((wh, i) => (
                <div 
                    key={`sim-wh-${i}`}
                    className="absolute z-10 transform -translate-x-1/2 -translate-y-1/2"
                    style={{ left: wh.left, top: wh.top }}
                >
                    <svg width="24" height="12" viewBox="0 0 24 12" className="opacity-80 drop-shadow-sm">
                       <path d="M 2 2 A 10 10 0 0 0 22 2" fill="none" stroke="black" strokeWidth="2" />
                    </svg>
                </div>
            ))}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-4 text-center w-full h-full bg-gray-50">
             <UploadCloud className="w-10 h-10 text-gray-300 mb-2" />
             <span className="text-gray-400 text-xs uppercase font-bold tracking-wider">
               Previzualizare Grafică
             </span>
          </div>
        )}
      </div>
      
      <div className="absolute bottom-2 left-0 w-full text-center text-[10px] text-gray-400 uppercase tracking-widest">
        Format: {width || 0}x{height || 0} cm
      </div>
    </div>
  );
}