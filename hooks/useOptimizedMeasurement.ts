import { useCallback, useRef } from 'react';

/**
 * Hook pentru optimizarea măsurătorilor DOM și prevenirea rearanjărilor forțate
 */
export const useOptimizedMeasurement = () => {
  const rafId = useRef<number | null>(null);
  
  /**
   * Execută o funcție care necesită măsurători DOM într-un requestAnimationFrame
   * pentru a evita rearanjările forțate
   */
  const measure = useCallback((callback: () => void) => {
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
    }
    
    rafId.current = requestAnimationFrame(() => {
      callback();
      rafId.current = null;
    });
  }, []);

  /**
   * Citește proprietăți geometrice într-un mod optimizat
   */
  const readGeometry = useCallback((element: Element | null, properties: string[]) => {
    if (!element) return {};
    
    return new Promise(resolve => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
      
      rafId.current = requestAnimationFrame(() => {
        const result: Record<string, number> = {};
        
        // Citește toate proprietățile într-o singură fază pentru a minimiza reflow-urile
        properties.forEach(prop => {
          switch (prop) {
            case 'width':
              result.width = element.clientWidth;
              break;
            case 'height':
              result.height = element.clientHeight;
              break;
            case 'scrollTop':
              result.scrollTop = element.scrollTop;
              break;
            case 'scrollHeight':
              result.scrollHeight = element.scrollHeight;
              break;
            case 'offsetWidth':
              result.offsetWidth = (element as HTMLElement).offsetWidth;
              break;
            case 'offsetHeight':
              result.offsetHeight = (element as HTMLElement).offsetHeight;
              break;
            default:
              // Pentru alte proprietăți, folosește getBoundingClientRect
              const rect = element.getBoundingClientRect();
              result[prop] = (rect as any)[prop] || 0;
          }
        });
        
        resolve(result);
        rafId.current = null;
      });
    });
  }, []);

  /**
   * Throttled scroll handler pentru performance optimă
   */
  const createThrottledScrollHandler = useCallback((handler: () => void) => {
    let ticking = false;
    
    return () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handler();
          ticking = false;
        });
        ticking = true;
      }
    };
  }, []);

  /**
   * Cleanup pentru cancelarea RAF-urilor pending
   */
  const cleanup = useCallback(() => {
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }
  }, []);

  return {
    measure,
    readGeometry,
    createThrottledScrollHandler,
    cleanup
  };
};

export default useOptimizedMeasurement;