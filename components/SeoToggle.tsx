"use client";
import React, { useState } from "react";

export default function SeoToggle({ content, collapsedHeight = 300 }: { content: string; collapsedHeight?: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <div style={{ maxHeight: open ? "none" : collapsedHeight, overflow: "hidden", transition: "max-height .25s ease" }} dangerouslySetInnerHTML={{ __html: content }} />
      <div style={{ marginTop: 12 }}>
        <button
          onClick={() => setOpen((v) => !v)}
          className="px-4 py-2 rounded bg-indigo-600 text-white text-sm"
          aria-expanded={open}
        >
          {open ? "Ascunde" : "Citește mai mult"}
        </button>
      </div>
    </div>
  );
}