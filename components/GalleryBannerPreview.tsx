"use client";

import React, { useMemo, useState } from 'react';
import { Loader2 } from 'lucide-react';

type Props = {
  width: number;
  height: number;
  hasGrommets?: boolean;
  hasWindHoles?: boolean;
  imageUrl: string; // Aici imaginea este obligatorie (componenta apare doar când avem poză)
};

export default function GalleryBannerPreview({ 
  width, 
  height, 
  hasGrommets = true, 
  hasWindHoles = false,
  imageUrl
}: Props) {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Dimensiuni de siguranță
  const bannerW = width > 0 ? width : 100;
  const bannerH = height > 0 ? height : 100;

  // Reset loading la schimbarea imaginii
  React.useEffect(() => {
      setImageLoaded(false);
  }, [imageUrl]);

  // Generare Capse
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
    <div className="w-full h-full flex flex-col bg-white rounded-xl overflow-hidden">
       {/* ZONA DE PREVIEW */}
       <div className="flex-1 w-full h-full relative flex items-center justify-center p-8 bg-[#f5f5f5]"
            style={{
                backgroundImage: 'linear-gradient(45deg, #e5e5e5 25%, transparent 25%), linear-gradient(-45deg, #e5e5e5 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e5e5 75%), linear-gradient(-45deg, transparent 75%, #e5e5e5 75%)',
                backgroundSize: '20px 20px',
                backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
            }}
       >
            {/* CONTAINER RESPONSIV CU SIZER SVG */}
            <div className="relative shadow-xl border border-zinc-400 bg-white flex items-center justify-center" 
                 style={{ maxWidth: '100%', maxHeight: '100%' }}>
                
                {/* Sizer Invizibil - Dictează forma */}
                <svg 
                    viewBox={`0 0 ${bannerW} ${bannerH}`} 
                    style={{ 
                        width: 'auto', 
                        height: 'auto', 
                        maxWidth: '100%', 
                        maxHeight: '100%', 
                        display: 'block',
                        opacity: 0,
                        pointerEvents: 'none' 
                    }}
                >
                    <rect width={bannerW} height={bannerH} />
                </svg>

                {/* Conținut Absolut Peste Sizer */}
                <div className="absolute inset-0 overflow-hidden bg-white">
                    
                    {/* Loader */}
                    {!imageLoaded && (
                        <div className="absolute inset-0 flex items-center justify-center bg-zinc-100 z-10">
                            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                        </div>
                    )}

                    {/* Imaginea */}
                    <img 
                        src={imageUrl} 
                        alt="Grafica Ta"
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                        onLoad={() => setImageLoaded(true)}
                    />

                    {/* Capse */}
                    {hasGrommets && grommets.map((style, i) => (
                        <div key={i} className="absolute z-20 w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-gradient-to-b from-gray-100 to-gray-400 shadow-sm flex items-center justify-center ring-1 ring-black/20" style={style}>
                            <div className="w-1/2 h-1/2 rounded-full bg-zinc-800 shadow-inner"></div>
                        </div>
                    ))}

                    {/* Fante Vânt */}
                    {hasWindHoles && (
                        <div className="absolute inset-0 grid place-items-center pointer-events-none p-[2%] opacity-40 z-20">
                            <div className="flex flex-wrap justify-center gap-[5%] overflow-hidden w-full h-full content-center">
                                {[...Array(Math.max(2, Math.floor((bannerW*bannerH)/6000)))].map((_, i) => (
                                    <div key={i} className="w-[8%] h-[4%] min-w-[20px] min-h-[8px] bg-zinc-900 rounded-full shadow-inner border border-white/20"></div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
       </div>
    </div>
  );
}