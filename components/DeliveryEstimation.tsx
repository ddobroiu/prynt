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
    fetch(`/api/eta?county=${debouncedCounty || ""}`, { signal })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok && data.label) {
          setLabel(data.label);
        } else {
          setLabel("indisponibilă");
        }
        setLoading(false);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setLabel("eroare");
        }
        setLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [debouncedCounty]);

  return (
    <div className="text-sm text-gray-600">
      Estimare livrare:{" "}
      {loading ? (
        <span className="animate-pulse">...</span>
      ) : (
        <span className="font-semibold">{label}</span>
      )}
    </div>
  );
}
