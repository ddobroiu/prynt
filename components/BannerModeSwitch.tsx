"use client";

import { usePathname, useRouter } from "next/navigation";

export default function BannerModeSwitch() {
  const pathname = usePathname();
  const router = useRouter();

  const isDouble = pathname?.startsWith("/banner-verso");

  const goSingle = () => {
    if (isDouble) router.push("/banner");
  };
  const goDouble = () => {
    if (!isDouble) router.push("/banner-verso");
  };

  return (
    <div className="inline-flex rounded-lg border border-white/10 bg-white/5 p-1">
      <button
        type="button"
        onClick={goSingle}
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${
          !isDouble ? "bg-indigo-600 text-white" : "text-white/80 hover:bg-white/10"
        }`}
        aria-pressed={!isDouble}
      >
        O față
      </button>
      <button
        type="button"
        onClick={goDouble}
        className={`ml-1 px-3 py-1.5 rounded-md text-sm font-medium transition ${
          isDouble ? "bg-indigo-600 text-white" : "text-white/80 hover:bg-white/10"
        }`}
        aria-pressed={isDouble}
      >
        Față-verso
      </button>
    </div>
  );
}