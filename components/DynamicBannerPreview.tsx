"use client";

import React, { useMemo } from 'react';

type Props = {
  width: number;
  height: number;
  hasGrommets?: boolean;
  hasWindHoles?: boolean;
  label?: string;
  imageUrl?: string | null;
};

export default function DynamicBannerPreview({ 
  width, 
  height, 
  hasGrommets = true, 
  hasWindHoles = false,
  label = "Raport Scară Umană" 
}: Props) {
  // --- 1. CONFIGURĂRI ---
  const bannerW = width > 0 ? width : 100;
  const bannerH = height > 0 ? height : 100;
  
  const humanH = 175; 
  const humanW = 45;  
  const gap = 50; 

  // Calcul Scenă
  const sceneWidthUnits = humanW + gap + bannerW;
  const maxH = Math.max(humanH, bannerH);
  const sceneHeightUnits = maxH * 1.25; 

  const humanWidthPct = (humanW / sceneWidthUnits) * 100;
  const humanHeightPct = (humanH / sceneHeightUnits) * 100;
  const bannerWidthPct = (bannerW / sceneWidthUnits) * 100;
  const bannerHeightPct = (bannerH / sceneHeightUnits) * 100;

  // --- 2. GENERARE CAPSE ---
  const grommetSpacing = 50; 
  const grommets = useMemo(() => {
    if (!hasGrommets) return [];
    const list: React.CSSProperties[] = [];
    const add = (p: React.CSSProperties) => list.push(p);

    const cols = Math.floor(bannerW / grommetSpacing);
    for (let i = 0; i <= cols; i++) {
        const pos = (i * grommetSpacing / bannerW) * 100;
        if (pos > 98) continue;
        add({ top: '1.5%', left: `${pos}%`, transform: 'translate(-50%, -50%)' });
        add({ bottom: '1.5%', left: `${pos}%`, transform: 'translate(-50%, 50%)' });
    }
    add({ top: '1.5%', right: '1.5%', transform: 'translate(50%, -50%)' });
    add({ bottom: '1.5%', right: '1.5%', transform: 'translate(50%, 50%)' });

    const rows = Math.floor(bannerH / grommetSpacing);
    for (let i = 1; i < rows; i++) { 
        const pos = (i * grommetSpacing / bannerH) * 100;
        if (pos > 98) continue;
        add({ left: '1.5%', top: `${pos}%`, transform: 'translate(-50%, -50%)' });
        add({ right: '1.5%', top: `${pos}%`, transform: 'translate(50%, -50%)' });
    }
    return list;
  }, [bannerW, bannerH, hasGrommets]);

  return (
    <div className="w-full h-full flex flex-col bg-white rounded-xl overflow-hidden border border-zinc-200 shadow-sm font-sans select-none">
      {/* HEADER */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100 bg-white z-20 shrink-0">
        <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-zinc-900 rounded-full"></div>
            <span className="text-xs font-bold text-zinc-800 uppercase tracking-wider">{label}</span>
        </div>
      </div>

      {/* VIEWPORT */}
      <div className="flex-1 w-full bg-zinc-50 relative flex items-center justify-center p-6 overflow-hidden">
        {/* Decoruri */}
        <div className="absolute inset-0 opacity-[0.4]" style={{ backgroundImage: 'radial-gradient(#94a3b8 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }}></div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-black/40 to-transparent pointer-events-none"></div>
        <div className="absolute bottom-12 left-0 right-0 h-px bg-zinc-400/50 shadow-sm w-full"></div>

        {/* SCENA SCALABILĂ */}
        <div 
            className="relative z-10 flex items-end justify-center transition-all duration-500 ease-out"
            style={{
                aspectRatio: `${sceneWidthUnits} / ${sceneHeightUnits}`,
                width: '100%',
                height: 'auto',
                maxHeight: '100%',
                marginBottom: '24px'
            }}
        >
            {/* A. OMUL */}
            <div className="absolute left-0 bottom-0 z-20" style={{ width: `${humanWidthPct}%`, height: `${humanHeightPct}%` }}>
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 -translate-y-full flex flex-col items-center mb-1">
                    <span className="text-[10px] font-bold text-white bg-black/50 backdrop-blur-md px-1.5 py-0.5 rounded shadow-sm border border-white/20 whitespace-nowrap scale-90 origin-bottom">1.75m</span>
                    <div className="h-2 w-px border-l border-white/50 border-dashed"></div>
                </div>
                <svg viewBox="0 0 80 290" className="w-full h-full drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] block" preserveAspectRatio="none">
                    <circle cx="40" cy="30" r="22" fill="#52525b" />
                    <path d="M15,65 Q40,55 65,65 L62,150 L75,150 L72,180 L60,170 L50,290 L30,290 L20,170 L8,180 L5,150 L18,150 Z" fill="#3f3f46" />
                </svg>
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-white/80 uppercase tracking-widest whitespace-nowrap drop-shadow-md">Ref.</div>
            </div>

            {/* B. BANNERUL DE REFERINȚĂ (Alb + Text) */}
            <div 
                className="absolute right-0 bottom-0 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5)] border border-zinc-300 bg-white"
                style={{ width: `${bannerWidthPct}%`, height: `${bannerHeightPct}%` }}
            >
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
                    <div className="border-2 border-dashed border-zinc-300 w-full h-full flex flex-col items-center justify-center rounded opacity-60">
                        <span className="text-zinc-400 font-bold text-[10px] sm:text-xs uppercase tracking-widest mb-1">Grafica Ta</span>
                        <div className="bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded text-[9px] font-mono font-bold">
                            {bannerW} x {bannerH} cm
                        </div>
                    </div>
                </div>

                {/* Capse */}
                {hasGrommets && grommets.map((style, i) => (
                    <div key={i} className="absolute z-20 w-[3%] min-w-1.5 max-w-3 aspect-square rounded-full bg-linear-to-b from-gray-100 to-gray-400 shadow-sm flex items-center justify-center ring-1 ring-black/20" style={style}>
                        <div className="w-1/2 h-1/2 rounded-full bg-zinc-800 shadow-inner"></div>
                    </div>
                ))}

                {/* Cote */}
                <div className="absolute -top-[15%] left-0 w-full h-[15%] flex justify-center items-end z-30">
                   <div className="w-px h-full bg-white/80 drop-shadow-md absolute left-0 bottom-0"></div>
                   <div className="w-px h-full bg-white/80 drop-shadow-md absolute right-0 bottom-0"></div>
                   <div className="w-full h-px bg-white/80 drop-shadow-md absolute bottom-[10%]"></div>
                   <span className="absolute top-0 text-[8px] font-mono text-zinc-800 bg-white/90 px-1 rounded border border-white shadow-sm transform -translate-y-1/2">{bannerW} cm</span>
                </div>
                <div className="absolute -right-[5%] top-0 h-full w-[5%] flex items-center justify-start z-30">
                   <div className="h-px w-full bg-white/80 drop-shadow-md absolute top-0 left-0"></div>
                   <div className="h-px w-full bg-white/80 drop-shadow-md absolute bottom-0 left-0"></div>
                   <div className="h-full w-px bg-white/80 drop-shadow-md absolute left-[10%]"></div>
                   <span className="absolute right-0 rotate-90 text-[8px] font-mono text-zinc-800 bg-white/90 px-1 rounded border border-white shadow-sm whitespace-nowrap transform translate-x-1/2">{bannerH} cm</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}