'use client';

import React from 'react';

export default function RevealBlock({
  buttonLabel,
  children,
  defaultOpen = false,
}: {
  buttonLabel: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <div className="mx-auto max-w-3xl my-6 px-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-muted"
        aria-expanded={open}
      >
        <span>{open ? 'Ascunde' : buttonLabel}</span>
        <span aria-hidden>▾</span>
      </button>
      {open && <div className="mt-4 text-sm leading-relaxed">{children}</div>}
    </div>
  );
}
