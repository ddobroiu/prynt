"use client";

interface NavTabItem {
  id: "orders" | "addresses" | "security";
  label: string;
  icon: React.ReactNode;
  description?: string;
}

interface AccountNavTabProps {
  activeTab: "orders" | "addresses" | "security";
  onTabChange: (tab: "orders" | "addresses" | "security") => void;
}

const NAV_ITEMS: NavTabItem[] = [
  {
    id: "orders",
    label: "Comenzile mele",
    description: "Vizualizează și gestionează comenzile",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
  },
  {
    id: "addresses",
    label: "Adrese de livrare",
    description: "Manage your delivery addresses",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    id: "security",
    label: "Securitate & Parolă",
    description: "Protejează-ți contul",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
  },
];

export default function AccountNavTab({ activeTab, onTabChange }: AccountNavTabProps) {
  return (
    <nav className="flex flex-col gap-2 bg-linear-to-b from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg">
      {/* Header */}
      <div className="px-2 py-2 mb-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">Meniul meu</h3>
      </div>

      {NAV_ITEMS.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`relative w-full text-left px-4 py-3.5 rounded-xl font-medium transition-all duration-300 flex items-start gap-3 group ${
              isActive
                ? "bg-linear-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-500/20"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700/60"
            }`}
          >
            {/* Animated background for hover */}
            {!isActive && (
              <div className="absolute inset-0 rounded-xl bg-linear-to-r from-indigo-500/10 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            )}

            {/* Content */}
            <div className="relative z-10 flex items-start gap-3 w-full">
              <span className={`pt-0.5 transition-transform duration-300 ${isActive ? "text-indigo-200 scale-110" : "text-gray-500 dark:text-gray-400 group-hover:scale-110"}`}>
                {item.icon}
              </span>
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold leading-tight">{item.label}</p>
                {item.description && (
                  <p className={`text-xs mt-1 ${isActive ? "text-indigo-200" : "text-gray-500 dark:text-gray-400"}`}>
                    {item.description}
                  </p>
                )}
              </div>
            </div>

            {/* Active indicator */}
            {isActive && (
              <div className="absolute right-0 top-0 bottom-0 w-1 bg-white rounded-l-lg shadow-lg" />
            )}
          </button>
        );
      })}
    </nav>
  );
}
