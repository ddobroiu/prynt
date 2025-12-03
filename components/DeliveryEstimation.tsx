"use client";

import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { Truck } from "lucide-react";

type Props = {
  county?: string;
};

export default function DeliveryEstimation({ county }: Props) {
  const [loading, setLoading] = useState(true);
  const [label, setLabel] = useState("");
  const [debouncedCounty] = useDebounce(county, 500);

  useEffect(() => {
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
    <div className="text-sm mt-3 flex items-center gap-2 bg-linear-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg px-3 py-2.5">
      <Truck className="w-4 h-4 text-green-600" strokeWidth={2.5} />
      <span className="text-gray-600">Livrare estimată:</span>
      {loading ? (
        <span className="animate-pulse bg-gray-200 h-4 w-20 rounded inline-block align-middle"></span>
      ) : (
        <span className="font-bold text-green-700">{label}</span>
      )}
    </div>
  );
}