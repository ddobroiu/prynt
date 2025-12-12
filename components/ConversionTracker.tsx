"use client";

import { useEffect } from "react";

export default function ConversionTracker({ orderNo }: { orderNo: number | null }) {
  useEffect(() => {
    if (!orderNo) return;

    window.dataLayer = window.dataLayer || [];

    window.dataLayer.push({
      event: "CE – purchase",    // numele EXACT al triggerului din GTM
      transaction_id: orderNo,   // variabila folosită în tag
      value: 1,                  // sau total comandă dacă îl ai
      currency: "RON"
    });

    console.log("Pushed CE – purchase event:", orderNo);

  }, [orderNo]);

  return null;
}
