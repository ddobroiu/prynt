"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");

  useEffect(() => {
    // init from localStorage or system
    const stored = typeof window !== "undefined" ? localStorage.getItem("theme") : null;
    if (stored === "light" || stored === "dark") {
      setTheme(stored);
      document.documentElement.setAttribute("data-theme", stored);
    } else {
      const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      const t = prefersDark ? "dark" : "light";
      setTheme("system");
      // do not store, just respect system but set data-theme to match
      document.documentElement.setAttribute("data-theme", t);
    }

    // listen for system changes if theme === system
    const m = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      if (localStorage.getItem("theme") !== "light" && localStorage.getItem("theme") !== "dark") {
        const newTheme = e.matches ? "dark" : "light";
        document.documentElement.setAttribute("data-theme", newTheme);
      }
    };
    if (m && m.addEventListener) m.addEventListener("change", handler);
    else if (m && m.addListener) m.addListener(handler as any);

    return () => {
      if (m && m.removeEventListener) m.removeEventListener("change", handler);
      else if (m && m.removeListener) m.removeListener(handler as any);
    };
  }, []);

  function applyTheme(t: "light" | "dark" | "system") {
    if (t === "system") {
      localStorage.removeItem("theme");
      const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.setAttribute("data-theme", prefersDark ? "dark" : "light");
      setTheme("system");
    } else {
      localStorage.setItem("theme", t);
      document.documentElement.setAttribute("data-theme", t);
      setTheme(t);
    }
  }

  return (
    <div className="inline-flex items-center gap-2">
      <button
        aria-label="Toggle theme"
        title="Comută temă"
        className="inline-flex items-center justify-center rounded-full p-2 border-1"
        onClick={() => applyTheme(theme === "dark" ? "light" : "dark")}
      >
        {theme === "dark" ? (
          // sun icon for light mode
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-yellow-400">
            <circle cx="12" cy="12" r="4"></circle>
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
          </svg>
        ) : (
          // moon icon for dark mode
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-ui">
            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
          </svg>
        )}
      </button>
    </div>
  );
}
