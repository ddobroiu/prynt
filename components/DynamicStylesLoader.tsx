"use client";

import { useEffect } from 'react';

export default function DynamicStylesLoader() {
  useEffect(() => {
    // Încarcă CSS-ul non-critic după primul paint
    const loadNonCriticalCSS = () => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '/non-critical.css';
      link.media = 'print';
      link.onload = function() {
        (this as HTMLLinkElement).media = 'all';
      };
      document.head.appendChild(link);

      // Fallback pentru browsere mai vechi
      const noscript = document.createElement('noscript');
      const noscriptLink = document.createElement('link');
      noscriptLink.rel = 'stylesheet';
      noscriptLink.href = '/non-critical.css';
      noscript.appendChild(noscriptLink);
      document.head.appendChild(noscript);
    };

    // Încarcă după primul paint
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', loadNonCriticalCSS);
    } else {
      // Document deja încărcat
      setTimeout(loadNonCriticalCSS, 0);
    }

    return () => {
      document.removeEventListener('DOMContentLoaded', loadNonCriticalCSS);
    };
  }, []);

  return null;
}