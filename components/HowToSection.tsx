import React from "react";

export default function HowToSection({ title, steps }: { title: string; steps: string[] }) {
  if (!steps?.length) return null;
  return (
    <section className="mx-auto max-w-3xl my-10 px-4">
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <ol className="list-decimal pl-6 space-y-2 text-sm leading-relaxed">
        {steps.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ol>
    </section>
  );
}
