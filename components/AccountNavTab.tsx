"use client";

interface NavTabItem {
  id: "orders" | "addresses" | "security";
  label: string;
  icon: React.ReactNode;
  description?: string;
  color: {
    bg: string;
    icon: string;
    activeGradient: string;
  };
}

interface AccountNavTabProps {
  activeTab: "orders" | "addresses" | "security";
  onTabChange: (tab: "orders" | "addresses" | "security") => void;
}

const NAV_ITEMS: NavTabItem[] = [
  {
    id: "orders",
    label: "Comenzile mele",
    description: "Vizualizează și gestionează",
    color: {
      bg: "bg-purple-50 dark:bg-purple-900/20",
      icon: "text-purple-600 dark:text-purple-400",
      activeGradient: "from-purple-600 to-purple-700"
    },
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
  },
  {
    id: "addresses",
    label: "Adrese salvate",
    description: "Gestionează adresele tale",
    color: {
      bg: "bg-blue-50 dark:bg-blue-900/20",
      icon: "text-blue-600 dark:text-blue-400",
      activeGradient: "from-blue-600 to-blue-700"
    },
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    id: "security",
    label: "Securitate",
    description: "Parolă și confidențialitate",
    color: {
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
      icon: "text-emerald-600 dark:text-emerald-400",
      activeGradient: "from-emerald-600 to-emerald-700"
    },
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
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
