"use client";

import React, { useMemo, useState } from 'react';
import { Grid, BrickWall, Construction } from 'lucide-react';

type Props = {
  width: number;
  height: number;
  hasGrommets?: boolean;
  hasWindHoles?: boolean;
  imageUrl?: string | null;
  label?: string;
};

export default function DynamicBannerPreview({ 
  width, 
  height, 
  hasGrommets = true, 
  hasWindHoles = false,
  imageUrl = null,
  label = "Previzualizare" 
}: Props) {
  // --- STATE PENTRU FUNDAL ---
  const [bgType, setBgType] = useState<'tech' | 'wall' | 'concrete'>('wall');

  // --- 1. DIMENSIUNI & SCARĂ ---
  const bannerW = width > 0 ? width : 100;
  const bannerH = height > 0 ? height : 100;
  const humanH = 175; 
  const humanW = 45;  
  const gap = 50;     
  
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

  // --- 3. STYLE PENTRU FUNDALURI ---
  const getBackgroundStyle = () => {
    switch (bgType) {
        case 'wall': 
            return {
                // Asigură-te că poza din public/textures se numește wall.jpg
                backgroundImage: `url('/textures/wall.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center bottom',
                backgroundRepeat: 'no-repeat',
                backgroundColor: '#f1f5f9' // Fallback color
            };
        case 'concrete': 
            return {
                // MODIFICAT: Folosim .png dacă asta ai încărcat
                backgroundImage: `url('/textures/concrete.jpg')`, 
                backgroundSize: 'cover',
                backgroundPosition: 'center bottom',
                backgroundRepeat: 'no-repeat',
                backgroundColor: '#cbd5e1' // Fallback color
            };
        default: // Tech Grid
            return {
                backgroundImage: 'radial-gradient(#94a3b8 1.5px, transparent 1.5px)',
                backgroundSize: '24px 24px',
                backgroundColor: '#f8fafc'
            };
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-white rounded-xl overflow-hidden border border-zinc-200 shadow-sm font-sans select-none">
      
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2 border-b border-zinc-100 bg-white z-30 gap-2">
        <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${imageUrl ? 'bg-green-500 animate-pulse' : 'bg-zinc-900'}`}></div>
            <span className="text-xs font-bold text-zinc-800 uppercase tracking-wider">{label}</span>
        </div>

        {/* SELECTOR */}
        <div className="flex bg-zinc-100 p-1 rounded-lg">
            <button 
                onClick={() => setBgType('tech')}
                className={`p-1.5 rounded-md transition-all ${bgType === 'tech' ? 'bg-white shadow text-indigo-600' : 'text-zinc-400 hover:text-zinc-600'}`}
                title="Tehnic"
            >
                <Grid size={14} />
            </button>
            <button 
                onClick={() => setBgType('wall')}
                className={`p-1.5 rounded-md transition-all ${bgType === 'wall' ? 'bg-white shadow text-indigo-600' : 'text-zinc-400 hover:text-zinc-600'}`}
                title="Cărămidă"
            >
                <BrickWall size={14} />
            </button>
            <button 
                onClick={() => setBgType('concrete')}
                className={`p-1.5 rounded-md transition-all ${bgType === 'concrete' ? 'bg-white shadow text-indigo-600' : 'text-zinc-400 hover:text-zinc-600'}`}
                title="Beton"
            >
                <Construction size={14} />
            </button>
        </div>
      </div>

      {/* VIEWPORT */}
      <div className="flex-1 w-full relative flex items-center justify-center p-6 overflow-hidden transition-all duration-500"
           style={getBackgroundStyle()} 
      >
        
        {/* Umbră Podea pentru realism */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
        
        {/* Linie podea doar la Tech */}
        {bgType === 'tech' && (
            <div className="absolute bottom-12 left-0 right-0 h-px bg-zinc-400/50 shadow-sm w-full"></div>
        )}

        {/* SCENA */}
        <div 
            className="relative z-10 flex items-end transition-all duration-500 ease-out"
            style={{
                aspectRatio: `${sceneWidthUnits} / ${sceneHeightUnits}`,
                width: '100%',
                height: 'auto',
                maxHeight: '100%',
                marginBottom: '24px'
            }}
        >
            {/* A. OMUL */}
            <div 
                className="absolute left-0 bottom-0"
                style={{ width: `${humanWidthPct}%`, height: `${humanHeightPct}%` }}
            >
                 <div className="absolute -top-1 left-1/2 -translate-x-1/2 -translate-y-full flex flex-col items-center mb-1">
                    <span className="text-[10px] font-bold text-white bg-black/50 backdrop-blur-md px-1.5 py-0.5 rounded shadow-sm border border-white/20 whitespace-nowrap scale-90 origin-bottom">1.75m</span>
                    <div className="h-2 w-px border-l border-white/50 border-dashed"></div>
                 </div>
                 <svg viewBox="0 0 80 290" className="w-full h-full drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] block" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="clothes" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="#52525b" /> 
                            <stop offset="100%" stopColor="#27272a" />
                        </linearGradient>
                    </defs>
                    <circle cx="40" cy="30" r="22" fill="#52525b" />
                    <path d="M15,65 Q40,55 65,65 L62,150 L75,150 L72,180 L60,170 L50,290 L30,290 L20,170 L8,180 L5,150 L18,150 Z" fill="url(#clothes)" />
                 </svg>
                 <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-white/80 uppercase tracking-widest whitespace-nowrap drop-shadow-md">Ref.</div>
            </div>

            {/* B. BANNERUL */}
            <div 
                className="absolute right-0 bottom-0 bg-white shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5)] border border-zinc-200 overflow-hidden"
                style={{
                    width: `${bannerWidthPct}%`,
                    height: `${bannerHeightPct}%`,
                }}
            >
                {/* IMAGINE */}
                {imageUrl ? (
                    <div 
                        className="absolute inset-0 z-0 transition-all duration-500"
                        style={{
                            backgroundImage: `url(${imageUrl})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat'
                        }}
                    />
                ) : (
                    <div className="absolute inset-0 bg-zinc-50/30"></div>
                )}

                {/* Shine */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-30 pointer-events-none z-10"></div>

                {/* CAPSE */}
                {hasGrommets && grommets.map((style, i) => (
                    <div key={i} className="absolute z-20" style={style}>
                        <div className="w-[3%] min-w-[6px] max-w-[12px] aspect-square rounded-full bg-gradient-to-b from-gray-100 to-gray-400 shadow-[0_1px_2px_rgba(0,0,0,0.5)] flex items-center justify-center ring-1 ring-black/20">
                            <div className="w-1/2 h-1/2 rounded-full bg-zinc-800 shadow-inner"></div>
                        </div>
                    </div>
                ))}

                {/* FANTE */}
                {hasWindHoles && (
                    <div className="absolute inset-0 grid place-items-center pointer-events-none p-[2%] opacity-50 z-10">
                         <div className="flex flex-wrap justify-center gap-[5%] overflow-hidden w-full h-full content-center">
                            {[...Array(Math.max(2, Math.floor((bannerW*bannerH)/6000)))].map((_, i) => (
                                <div key={i} className="w-[8%] h-[4%] min-w-[20px] min-h-[8px] bg-zinc-900/40 rounded-full shadow-inner border border-white/10"></div>
                            ))}
                         </div>
                    </div>
                )}

                {/* ETICHETĂ DIMENSIUNI (Doar fara poza) */}
                {!imageUrl && (
                    <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                        <div className="bg-zinc-900/80 backdrop-blur text-white px-2 py-1 rounded shadow-md border border-zinc-700/50 max-w-[90%] overflow-hidden">
                            <span className="text-[10px] sm:text-sm font-bold tracking-tight whitespace-nowrap block truncate">
                                {bannerW} x {bannerH} cm
                            </span>
                        </div>
                    </div>
                )}

                {/* COTE */}
                <div className="absolute -top-[15%] left-0 w-full h-[15%] flex justify-center items-end z-30">
                   <div className="w-px h-full bg-white/80 drop-shadow-md absolute left-0 bottom-0"></div>
                   <div className="w-px h-full bg-white/80 drop-shadow-md absolute right-0 bottom-0"></div>
                   <div className="w-full h-px bg-white/80 drop-shadow-md absolute bottom-[10%]"></div>
                   <span className="absolute top-0 text-[8px] font-mono text-zinc-800 bg-white/90 px-1 rounded border border-white shadow-sm transform -translate-y-1/2">
                       {bannerW} cm
                   </span>
                </div>

                <div className="absolute -right-[5%] top-0 h-full w-[5%] flex items-center justify-start z-30">
                   <div className="h-px w-full bg-white/80 drop-shadow-md absolute top-0 left-0"></div>
                   <div className="h-px w-full bg-white/80 drop-shadow-md absolute bottom-0 left-0"></div>
                   <div className="h-full w-px bg-white/80 drop-shadow-md absolute left-[10%]"></div>
                   <span className="absolute right-0 rotate-90 text-[8px] font-mono text-zinc-800 bg-white/90 px-1 rounded border border-white shadow-sm whitespace-nowrap transform translate-x-1/2">
                       {bannerH} cm
                   </span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}