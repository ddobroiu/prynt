import React from "react";
import type { QA } from "./FaqJsonLd";

export default function FaqAccordion() {
  return null;
}

/*

{
  qa,
  title = "Întrebări frecvente",
  fullWidth = false,
}: {
  qa: QA[];
  title?: string;
  fullWidth?: boolean;
}) {
  if (!qa || qa.length === 0) return null;
  return (
    <section className="mt-6">
      <div className={(fullWidth ? "" : "mx-auto max-w-3xl ") + "card p-4"}>
        <h2 className="text-lg font-bold mb-2">{title}</h2>
        <div className="divide-y divide-white/10">
          {qa.map((q, i) => (
            <details key={i} className="py-2 group">
              <summary className="cursor-pointer list-none flex items-center justify-between py-2">
                <span className="font-medium text-ui">{q.question}</span>
                <span className="ml-3 text-muted group-open:rotate-180 transition-transform">▾</span>
              </summary>
              <div className="pl-1 pr-1 pb-2 text-sm text-muted leading-relaxed">{q.answer}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

*/
