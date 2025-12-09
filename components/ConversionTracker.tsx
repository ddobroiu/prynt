"use client";

import { useEffect, useRef } from 'react';

type ConversionTrackerProps = {
  orderNo: number | null;
};

// Extend Window interface to include dataLayer
declare global {
  interface Window {
    dataLayer?: Array<Record<string, any>>;
  }
}

export default function ConversionTracker({ orderNo }: ConversionTrackerProps) {
  const hasTracked = useRef(false);

  useEffect(() => {
    // Only track once and only if we have an order number
    if (hasTracked.current || !orderNo) return;

    const trackConversion = async () => {
      try {
        // Fetch order details from API
        const response = await fetch(`/api/order/${orderNo}`);
        
        if (!response.ok) {
          console.warn('[ConversionTracker] Failed to fetch order details');
          return;
        }

        const order = await response.json();

        // Push conversion event to Google Analytics dataLayer
        if (typeof window !== "undefined") {
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({
            event: "purchase",
            transaction_id: order.id,
            value: order.total,
            currency: "RON",
            items: order.items.map((item: any) => ({
              item_id: item.id,
              item_name: item.name,
              price: item.price,
              quantity: item.quantity
            }))
          });

          console.log('[ConversionTracker] Purchase event pushed to dataLayer:', {
            transaction_id: order.id,
            value: order.total,
            items_count: order.items.length
          });
        }

        hasTracked.current = true;
      } catch (error) {
        console.error('[ConversionTracker] Error tracking conversion:', error);
      }
    };

    // Small delay to ensure page is fully loaded
    const timeoutId = setTimeout(trackConversion, 500);

    return () => clearTimeout(timeoutId);
  }, [orderNo]);

  // This component doesn't render anything
  return null;
}
