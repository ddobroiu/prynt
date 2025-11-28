"use client";
import React, { useEffect, useState, useRef } from "react";
import type { Product } from "@/lib/products";
import ProductCard from "./ProductCard";
import ProductCardCompact from "./ProductCardCompact";

type Props = {
  products: Product[];
  // preferred baseline (max items to show); actual itemsPerPage is calculated responsively
  perPage?: number;
  // maximum items to allow per page when container is very wide
  maxPerPage?: number;
  // minimum card width used to calculate how many fit
  minCardWidth?: number;
  intervalMs?: number;
};

export default function InStockScroller({ products, perPage = 4, maxPerPage = 5, minCardWidth = 220, intervalMs = 3500 }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const computeResolved = () => {
    try {
      // avoid reading refs during render; use window.innerWidth as an initial approximation
      const w = typeof window !== "undefined" ? window.innerWidth : 0;
      let resolved = perPage;
      if (w < 640) resolved = 1;
      else if (w < 1024) resolved = 3;
      else if (w < 1280) resolved = 4;
      else resolved = 5;
      resolved = Math.max(1, Math.min(maxPerPage, resolved, products.length || resolved));
      return { resolved, isMobile: w < 640 };
    } catch {
      return { resolved: perPage, isMobile: false };
    }
  };

  const init = computeResolved();
  const [itemsPerPage, setItemsPerPage] = useState<number>(init.resolved);
  const [isMobileView, setIsMobileView] = useState<boolean>(init.isMobile);
  const pages = Math.max(1, Math.ceil((products?.length ?? 0) / itemsPerPage));
  const [page, setPage] = useState(0);
  const mounted = useRef(false);
  const timer = useRef<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      if (timer.current) window.clearInterval(timer.current);
    };
  }, []);

  // calculate itemsPerPage responsively using ResizeObserver
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new (window as any).ResizeObserver((entries: any[]) => {
      const w = entries[0]?.contentRect?.width ?? el.clientWidth;
      // Use explicit breakpoints for consistent counts across devices:
      // <640px => mobile: 1
      // 640px-1023px => tablet: 3
      // 1024px-1279px => laptop: 4
      // >=1280px => desktop: 5
      let resolved = perPage;
      if (w < 640) resolved = 1;
      else if (w < 1024) resolved = 3;
      else if (w < 1280) resolved = 4;
      else resolved = 5;
      // respect maxPerPage and ensure at least 1 and not more than products length
      resolved = Math.max(1, Math.min(maxPerPage, resolved, products.length || resolved));
      setIsMobileView(w < 640);
      setItemsPerPage(resolved);
    });
    ro.observe(el);
    // initial sizing handled via lazy init; ResizeObserver will update on changes
    return () => ro.disconnect();
  }, [containerRef, perPage, maxPerPage, minCardWidth]);

  useEffect(() => {
    // restart the timer whenever pages or interval change
    if (timer.current) {
      window.clearInterval(timer.current);
      timer.current = null;
    }
    if (pages <= 1) return;
    timer.current = window.setInterval(() => {
      setPage((p) => (p + 1) % pages);
    }, intervalMs) as unknown as number;
    return () => {
      if (timer.current) window.clearInterval(timer.current);
      timer.current = null;
    };
  }, [pages, intervalMs]);

  // Instead of forcing state changes inside effects, derive an effective page
  const newPages = Math.max(1, Math.ceil((products?.length ?? 0) / itemsPerPage));
  const effectivePage = Math.min(page, Math.max(0, newPages - 1));

  if (!products || products.length === 0) return null;

  const start = effectivePage * itemsPerPage;
  const slice = products.slice(start, start + itemsPerPage);

  return (
    <div
      ref={containerRef}
      className="in-stock-scroller"
      style={{ padding: 12, position: "relative", minHeight: isMobileView ? 420 : undefined }}
      onMouseEnter={() => {
        if (timer.current) {
          window.clearInterval(timer.current);
          timer.current = null;
        }
      }}
      onMouseLeave={() => {
        if (!timer.current && pages > 1) {
          timer.current = window.setInterval(() => setPage((p) => (p + 1) % pages), intervalMs) as unknown as number;
        }
      }}
      // touch handlers for mobile to pause/resume auto-advance
      onTouchStart={(e) => {
        const t = (e.changedTouches?.[0]?.clientX ?? e.touches?.[0]?.clientX) as number | undefined;
        if (typeof t === "number") touchStartX.current = t;
        if (timer.current) {
          window.clearInterval(timer.current);
          timer.current = null;
        }
      }}
      onTouchEnd={(e) => {
        const start = touchStartX.current;
        const end = (e.changedTouches?.[0]?.clientX ?? e.touches?.[0]?.clientX) as number | undefined;
        touchStartX.current = null;
        if (typeof start === "number" && typeof end === "number") {
          const dx = end - start;
          const threshold = 40;
          if (Math.abs(dx) > threshold) {
            setPage((p) => {
              if (dx > 0) return (p - 1 + pages) % pages; // swipe right -> previous
              return (p + 1) % pages; // swipe left -> next
            });
          }
        }
        if (!timer.current && pages > 1) {
          timer.current = window.setInterval(() => setPage((p) => (p + 1) % pages), intervalMs) as unknown as number;
        }
      }}
    >
      <div style={{ display: "flex", gap: 12, overflow: "hidden", alignItems: "stretch" }}>
        {/* Mobile: render only the current slice (no translate) to avoid layout/overflow issues on narrow viewports */}
        {isMobileView ? (
          <div style={{ display: "flex", gap: 12, minWidth: "100%", boxSizing: "border-box", justifyContent: "center", padding: "12px 0" }}>
            {slice.map((p) => (
              <div key={p.id} style={{ width: "92%", maxWidth: 400, boxSizing: "border-box", display: "flex", flexDirection: "column" }}>
                <ProductCardCompact product={{ ...(p as any), category: (p.metadata?.category ?? (p as any).category) }} />
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: "flex", gap: 12, transform: `translateX(-${page * 100}%)`, transition: "transform 500ms ease", alignItems: "stretch" }}>
            {/* Render each page as a group of cards so the width is consistent */}
            {Array.from({ length: pages }).map((_, pi) => {
              const s = products.slice(pi * itemsPerPage, pi * itemsPerPage + itemsPerPage);
              return (
                <div key={pi} style={{ display: "grid", gridTemplateColumns: `repeat(${itemsPerPage}, minmax(0, 1fr))`, gap: 12, minWidth: "100%", boxSizing: "border-box", alignItems: "stretch" }}>
                  {s.map((p) => (
                    <div key={p.id} style={{ width: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column" }}>
                      {/* Ensure ProductCard sees a `category` prop like shop data (fallback to metadata.category) */}
                      <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                        <ProductCard product={{ ...(p as any), category: (p.metadata?.category ?? (p as any).category) }} />
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pager dots */}
      {pages > 1 && (
        <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 10 }}>
          {Array.from({ length: pages }).map((_, i) => (
            <button key={i} onClick={() => setPage(i)} aria-label={`Pagina ${i + 1}`} style={{ width: 8, height: 8, borderRadius: 999, background: i === effectivePage ? "#4f46e5" : "#cbd5e1", border: "none" }} />
          ))}
        </div>
      )}

      {/* Prev / Next arrows */}
      {pages > 1 && (
        <>
          <button aria-label="Anterior" onClick={() => setPage((p) => (p - 1 + pages) % pages)} style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", zIndex: 40, background: "linear-gradient(180deg, rgba(99,102,241,0.95), rgba(124,58,237,0.95))", border: "none", color: "white", width: 44, height: 44, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 30px rgba(99,102,241,0.12)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <button aria-label="Următor" onClick={() => setPage((p) => (p + 1) % pages)} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", zIndex: 40, background: "linear-gradient(180deg, rgba(99,102,241,0.95), rgba(124,58,237,0.95))", border: "none", color: "white", width: 44, height: 44, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 30px rgba(99,102,241,0.12)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </>
      )}
    </div>
  );
}
