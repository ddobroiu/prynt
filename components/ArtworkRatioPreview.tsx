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
  // Dimensiuni de fallback pentru calcule
  const w = width > 0 ? width : 100;
  const h = height > 0 ? height : 100;
  const ratio = w / h;

  // --- LOGICA PENTRU SIMULARE CAPSE & GĂURI ---
  // Calculăm pozițiile relative (în procente) pentru a le afișa responsive peste imagine
  const grommetSpacing = 50; // cm
  const grommets = [];
  
  if (hasGrommets) {
    const countX = Math.ceil(w / grommetSpacing);
    const countY = Math.ceil(h / grommetSpacing);
    
    // Top & Bottom
    for (let i = 0; i <= countX; i++) {
        const xPerc = (i / countX) * 100;
        grommets.push({ left: `${xPerc}%`, top: '0%' });
        grommets.push({ left: `${xPerc}%`, top: '100%' });
    }
    // Left & Right (fără colțuri, că sunt deja puse)
    for (let i = 1; i < countY; i++) {
        const yPerc = (i / countY) * 100;
        grommets.push({ left: '0%', top: `${yPerc}%` });
        grommets.push({ left: '100%', top: `${yPerc}%` });
    }
  }

  const windHoles = [];
  if (hasWindHoles) {
      const rows = Math.floor(h / 50);
      const cols = Math.floor(w / 50);
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
      {/* Containerul care forțează forma corectă */}
      <div 
        style={{ aspectRatio: ratio }} 
        className="relative shadow-2xl bg-white max-w-full max-h-full flex items-center justify-center group"
      >
        {imageUrl ? (
          <>
            {/* 1. Imaginea propriu-zisă */}
            <img 
                src={imageUrl} 
                alt="Simulare Grafică" 
                className="w-full h-full object-cover z-0" 
            />

            {/* 2. Overlay Capse (Grommets) */}
            {hasGrommets && grommets.map((g, i) => (
                <div 
                    key={`sim-g-${i}`}
                    className="absolute w-3 h-3 sm:w-4 sm:h-4 border-2 border-gray-300 bg-transparent rounded-full shadow-sm z-10 transform -translate-x-1/2 -translate-y-1/2"
                    style={{ left: g.left, top: g.top }}
                    title="Capsă"
                />
            ))}

            {/* 3. Overlay Găuri Vânt */}
            {hasWindHoles && windHoles.map((wh, i) => (
                <div 
                    key={`sim-wh-${i}`}
                    className="absolute w-6 h-6 sm:w-8 sm:h-8 border border-gray-400/50 bg-black/10 rounded-full z-10 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
                    style={{ left: wh.left, top: wh.top }}
                    title="Gaură de vânt"
                >
                    {/* Mic semn de tăiere */}
                    <div className="w-full h-[1px] bg-gray-400/30 rotate-45"></div>
                </div>
            ))}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-4 text-center border-2 border-dashed border-gray-200 w-full h-full">
             <UploadCloud className="w-10 h-10 text-gray-300 mb-2" />
             <span className="text-gray-400 text-xs uppercase font-bold tracking-wider">
               Previzualizare Grafică
             </span>
          </div>
        )}
      </div>
      
      {/* Label informativ */}
      <div className="absolute bottom-2 left-0 w-full text-center text-[10px] text-gray-400 uppercase tracking-widest">
        Format: {width || 0}x{height || 0} cm
      </div>
    </div>
  );
}