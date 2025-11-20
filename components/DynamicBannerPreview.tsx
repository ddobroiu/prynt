import React from 'react';

type Props = {
  width: number;
  height: number;
  hasGrommets: boolean;
  hasWindHoles: boolean;
  imageUrl: string | null;
};

export default function DynamicBannerPreview({
  width,
  height,
  hasGrommets,
  hasWindHoles,
  imageUrl,
}: Props) {
  // 1. Calculăm aspect ratio
  // Folosim un viewBox bazat pe dimensiunile reale (cm) pentru a păstra proporțiile
  // Dar adăugăm un "padding" în viewBox pentru a face loc săgeților de cotă
  const w = width > 0 ? width : 100;
  const h = height > 0 ? height : 50;
  
  const padding = Math.max(w, h) * 0.15; // 15% padding pentru cote
  const viewBoxW = w + padding * 2;
  const viewBoxH = h + padding * 2;

  // 2. Calculăm pozițiile capselor (aprox la 50cm)
  const grommetSpacing = 50; 
  const grommets = [];

  if (hasGrommets) {
    const countX = Math.ceil(w / grommetSpacing);
    const countY = Math.ceil(h / grommetSpacing);
    const stepX = w / countX;
    const stepY = h / countY;

    // Top & Bottom
    for (let i = 0; i <= countX; i++) {
      grommets.push({ x: i * stepX, y: 0 });
      grommets.push({ x: i * stepX, y: h });
    }
    // Left & Right (exclude corners already added)
    for (let i = 1; i < countY; i++) {
      grommets.push({ x: 0, y: i * stepY });
      grommets.push({ x: w, y: i * stepY });
    }
  }

  // 3. Găuri de vânt (Semicercuri tăiate - model schematic)
  const windCuts = [];
  if (hasWindHoles) {
      const rows = Math.floor(h / 50);
      const cols = Math.floor(w / 50);
      for(let r=1; r<=rows; r++) {
          for(let c=1; c<=cols; c++) {
              windCuts.push({ x: (w / (cols+1)) * c, y: (h / (rows+1)) * r });
          }
      }
  }

  return (
    <div className="w-full h-full flex items-center justify-center relative">
      <svg
        viewBox={`${-padding} ${-padding} ${viewBoxW} ${viewBoxH}`}
        className="w-full h-full drop-shadow-xl"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Marker pentru săgeți */}
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#6b7280" />
          </marker>
          <marker id="arrowhead-start" markerWidth="10" markerHeight="7" refX="1" refY="3.5" orient="auto-start-reverse">
            <polygon points="0 0, 10 3.5, 0 7" fill="#6b7280" />
          </marker>
        </defs>

        {/* -- ZONA BANNER -- */}
        <g>
            {/* Fundal Banner */}
            <rect
            x={0}
            y={0}
            width={w}
            height={h}
            fill="#f3f4f6" // Gri deschis pt schiță
            stroke="#d1d5db"
            strokeWidth={Math.max(w,h) * 0.005}
            />

            {/* Linie punctată pentru tiv (safe area) */}
            <rect
            x={Math.max(w,h) * 0.02}
            y={Math.max(w,h) * 0.02}
            width={w - Math.max(w,h) * 0.04}
            height={h - Math.max(w,h) * 0.04}
            fill="none"
            stroke="#9ca3af"
            strokeWidth={Math.max(w,h) * 0.002}
            strokeDasharray={`${Math.max(w,h) * 0.01},${Math.max(w,h) * 0.01}`}
            />

            {/* Capse */}
            {grommets.map((g, i) => (
            <circle
                key={`g-${i}`}
                cx={g.x}
                cy={g.y}
                r={Math.max(w,h) * 0.012}
                fill="white"
                stroke="#4b5563"
                strokeWidth={Math.max(w,h) * 0.003}
            />
            ))}

            {/* Găuri Vânt */}
            {windCuts.map((wc, i) => (
                <path 
                    key={`wc-${i}`}
                    d={`M ${wc.x - Math.max(w,h)*0.02} ${wc.y} A ${Math.max(w,h)*0.02} ${Math.max(w,h)*0.02} 0 0 1 ${wc.x + Math.max(w,h)*0.02} ${wc.y}`}
                    fill="none"
                    stroke="#4b5563"
                    strokeWidth={Math.max(w,h) * 0.003}
                />
            ))}
        </g>

        {/* -- LINII DE COTĂ (Dimensions) -- */}
        
        {/* Cota Lungime (Sus) */}
        <g>
            <line 
                x1={0} y1={-padding * 0.4} 
                x2={w} y2={-padding * 0.4} 
                stroke="#6b7280" 
                strokeWidth={Math.max(w,h) * 0.003}
                markerEnd="url(#arrowhead)"
                markerStart="url(#arrowhead-start)"
            />
            {/* Linii ajutătoare */}
            <line x1={0} y1={0} x2={0} y2={-padding * 0.5} stroke="#9ca3af" strokeWidth={Math.max(w,h) * 0.001} strokeDasharray="4" />
            <line x1={w} y1={0} x2={w} y2={-padding * 0.5} stroke="#9ca3af" strokeWidth={Math.max(w,h) * 0.001} strokeDasharray="4" />
            
            {/* Text Lungime */}
            <text 
                x={w / 2} 
                y={-padding * 0.55} 
                textAnchor="middle" 
                fill="#374151"
                fontSize={Math.max(w,h) * 0.04}
                fontWeight="bold"
            >
                {w} cm
            </text>
        </g>

        {/* Cota Înălțime (Stânga) */}
        <g>
            <line 
                x1={-padding * 0.4} y1={0} 
                x2={-padding * 0.4} y2={h} 
                stroke="#6b7280" 
                strokeWidth={Math.max(w,h) * 0.003}
                markerEnd="url(#arrowhead)"
                markerStart="url(#arrowhead-start)"
            />
             {/* Linii ajutătoare */}
             <line x1={0} y1={0} x2={-padding * 0.5} y2={0} stroke="#9ca3af" strokeWidth={Math.max(w,h) * 0.001} strokeDasharray="4" />
             <line x1={0} y1={h} x2={-padding * 0.5} y2={h} stroke="#9ca3af" strokeWidth={Math.max(w,h) * 0.001} strokeDasharray="4" />

            {/* Text Înălțime */}
            <text 
                x={-padding * 0.55} 
                y={h / 2} 
                textAnchor="middle" 
                dominantBaseline="middle"
                fill="#374151"
                fontSize={Math.max(w,h) * 0.04}
                fontWeight="bold"
                transform={`rotate(-90, ${-padding * 0.55}, ${h / 2})`}
            >
                {h} cm
            </text>
        </g>

      </svg>
    </div>
  );
}