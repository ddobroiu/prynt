import { useEffect, useCallback, useRef } from 'react';

interface CartData {
  configuratorId: string;
  email?: string;
  configuration: any;
  price: number;
  quantity: number;
}

export function useAbandonedCartCapture(cartData: CartData) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedRef = useRef<string>('');
  const isCapturingRef = useRef(false);

  const captureAbandonedCart = useCallback(async (data: CartData) => {
    // Don't capture if no email or already capturing
    if (!data.email || isCapturingRef.current) return;
    
    // Don't capture if data hasn't changed
    const dataHash = JSON.stringify(data);
    if (dataHash === lastSavedRef.current) return;
    
    try {
      isCapturingRef.current = true;
      
      const response = await fetch('/api/abandoned-cart/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        lastSavedRef.current = dataHash;
        console.log('🛒 Abandoned cart captured for', data.email);
      }
    } catch (error) {
      console.error('Failed to capture abandoned cart:', error);
    } finally {
      isCapturingRef.current = false;
    }
  }, []);

  const scheduleCapture = useCallback((data: CartData) => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Schedule capture after 30 seconds of inactivity
    timeoutRef.current = setTimeout(() => {
      captureAbandonedCart(data);
    }, 30000);
  }, [captureAbandonedCart]);

  const immediateCapture = useCallback((data: CartData) => {
    // Clear scheduled capture
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Capture immediately (for page unload)
    captureAbandonedCart(data);
  }, [captureAbandonedCart]);

  // Set up page unload capture
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (cartData.email) {
        // Use sendBeacon for reliability on page unload
        const data = JSON.stringify(cartData);
        navigator.sendBeacon('/api/abandoned-cart/capture', data);
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && cartData.email) {
        immediateCapture(cartData);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [cartData, immediateCapture]);

  return {
    scheduleCapture,
    immediateCapture
  };
}

// Hook for tracking user activity and triggering captures
export function useUserActivityTracking(cartData: CartData) {
  const { scheduleCapture } = useAbandonedCartCapture(cartData);
  
  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    const handleActivity = () => {
      // Reschedule capture on any user activity
      if (cartData.email && cartData.configuration) {
        scheduleCapture(cartData);
      }
    };

    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, [cartData, scheduleCapture]);
}