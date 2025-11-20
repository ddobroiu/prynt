"use client";

import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

type Props = {
  county?: string;
};

export default function DeliveryEstimation({ county }: Props) {
  const [loading, setLoading] = useState(true);
  const [label, setLabel] = useState("");
  const [debouncedCounty] = useDebounce(county, 500);

  useEffect(() => {
    setLoading(true);
    const controller = new AbortController();
    const signal = controller.signal;

    // Apelăm API-ul de estimare (presupunând că există ruta /api/eta)
    fetch(`/api/eta?county=${debouncedCounty || ""}`, { signal })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok && data.label) {
          setLabel(data.label);
        } else {
          // Fallback dacă nu primim un răspuns clar
          setLabel("2-3 zile lucrătoare");
        }
        setLoading(false);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          // În caz de eroare, afișăm un termen standard
          setLabel("2-4 zile lucrătoare");
        }
        setLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [debouncedCounty]);

  return (
    <div className="text-sm text-gray-600 mt-2 flex items-center gap-2">
      <span>Estimare livrare:</span>
      {loading ? (
        <span className="animate-pulse bg-gray-200 h-4 w-20 rounded inline-block align-middle"></span>
      ) : (
        <span className="font-semibold text-gray-900">{label}</span>
      )}
    </div>
  );
}