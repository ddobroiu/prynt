"use client";
import React from "react";
import { UploadCloud } from "lucide-react";

type Props = {
  width: number;
  height: number;
  imageUrl: string | null;
};

export default function ArtworkRatioPreview({ width, height, imageUrl }: Props) {
  // Calculăm raportul de aspect. Dacă dimensiunile sunt 0, folosim pătrat (1/1)
  const ratio = (width > 0 && height > 0) ? width / height : 1;

  return (
    <div className="w-full h-full flex items-center justify-center bg-zinc-100 p-6 overflow-hidden relative">
      {/* Containerul care forțează forma corectă (AspectRatio) */}
      <div 
        style={{ aspectRatio: ratio }} 
        className="relative shadow-2xl border-4 border-white bg-white max-w-full max-h-full flex items-center justify-center"
      >
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt="Simulare Grafică" 
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-4 text-center">
             <UploadCloud className="w-10 h-10 text-gray-300 mb-2" />
             <span className="text-gray-400 text-xs uppercase font-bold tracking-wider">
               Previzualizare Grafică
             </span>
          </div>
        )}
      </div>
      
      {/* Label informativ discret */}
      <div className="absolute bottom-2 left-0 w-full text-center text-[10px] text-gray-400 uppercase tracking-widest">
        Format: {width || 0}x{height || 0} cm
      </div>
    </div>
  );
}