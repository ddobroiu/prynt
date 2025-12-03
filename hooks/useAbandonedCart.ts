"use client";
import { useEffect, useRef, useCallback } from 'react';
import { useCart } from '@/components/CartContext';

interface UseAbandonedCartProps {
  configuratorId: string;
  email?: string;
  cartData?: any;
}

export function useAbandonedCart({ configuratorId, email, cartData }: UseAbandonedCartProps) {
  const { items } = useCart();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedRef = useRef<string>('');

  const saveAbandonedCart = useCallback(async () => {
    if (!email || !configuratorId) return;

    const sessionId = sessionStorage.getItem('session-id') || 
      (() => {
        const id = Math.random().toString(36).substring(2);
        sessionStorage.setItem('session-id', id);
        return id;
      })();

    const cartDataToSave = {
      cart: items,
      configuratorData: cartData,
      url: window.location.href,
      timestamp: new Date().toISOString()
    };

    const dataHash = JSON.stringify(cartDataToSave);
    if (dataHash === lastSavedRef.current) return; // No changes

    try {
      await fetch('/api/cart/abandoned', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          configuratorId,
          cartData: cartDataToSave,
          sessionId
        })
      });
      
      lastSavedRef.current = dataHash;
    } catch (error) {
      console.warn('[Abandoned Cart] Save failed:', error);
    }
  }, [email, configuratorId, items, cartData]);

  const trackActivity = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Save after 30 seconds of inactivity
    timeoutRef.current = setTimeout(() => {
      saveAbandonedCart();
    }, 30000);
  }, [saveAbandonedCart]);

  // Track user activity
  useEffect(() => {
    if (!email || !configuratorId) return;

    const events = ['click', 'change', 'input', 'keydown'];
    
    events.forEach(event => {
      document.addEventListener(event, trackActivity);
    });

    // Initial track
    trackActivity();

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, trackActivity);
      });
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [email, configuratorId, trackActivity]);

  // Save on page unload
  useEffect(() => {
    if (!email || !configuratorId) return;

    const handleBeforeUnload = () => {
      navigator.sendBeacon('/api/cart/abandoned', JSON.stringify({
        email,
        configuratorId,
        cartData: {
          cart: items,
          configuratorData: cartData,
          url: window.location.href,
          timestamp: new Date().toISOString()
        },
        sessionId: sessionStorage.getItem('session-id')
      }));
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [email, configuratorId, items, cartData]);

  return {
    saveAbandonedCart,
    trackActivity
  };
}

export default useAbandonedCart;