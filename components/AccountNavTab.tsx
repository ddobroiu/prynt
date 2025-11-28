"use client";

interface NavTabItem {
  id: "profile" | "orders" | "billing" | "addresses" | "payment-methods" | "favorites" | "security";
  label: string;
  icon: React.ReactNode;
  description?: string;
  badge?: string;
  color: {
    bg: string;
    icon: string;
    activeGradient: string;
  };
  category: "account" | "orders" | "preferences";
}

interface AccountNavTabProps {
  activeTab: "profile" | "orders" | "billing" | "addresses" | "payment-methods" | "favorites" | "security";
  onTabChange: (tab: "profile" | "orders" | "billing" | "addresses" | "payment-methods" | "favorites" | "security") => void;
}

const NAV_ITEMS: NavTabItem[] = [
  // CONT
  {
    id: "profile",
    label: "Profilul meu",
    description: "Detalii personale",
    category: "account",
    color: {
      bg: "bg-indigo-50 dark:bg-indigo-900/20",
      icon: "text-indigo-600 dark:text-indigo-400",
      activeGradient: "from-indigo-600 to-indigo-700"
    },
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    id: "security",
    label: "Securitate",
    description: "Parolă și autentificare",
    category: "account",
    color: {
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
      icon: "text-emerald-600 dark:text-emerald-400",
      activeGradient: "from-emerald-600 to-emerald-700"
    },
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
  },
  
  // COMENZI
  {
    id: "orders",
    label: "Comenzile mele",
    description: "Istoric și status",
    badge: "Nou",
    category: "orders",
    color: {
      bg: "bg-purple-50 dark:bg-purple-900/20",
      icon: "text-purple-600 dark:text-purple-400",
      activeGradient: "from-purple-600 to-purple-700"
    },
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
  },
  {
    id: "billing",
    label: "Facturi & Plăți",
    description: "Istoric financiar",
    category: "orders",
    color: {
      bg: "bg-amber-50 dark:bg-amber-900/20",
      icon: "text-amber-600 dark:text-amber-400",
      activeGradient: "from-amber-600 to-amber-700"
    },
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
      </svg>
    ),
  },

  // PREFERINȚE
  {
    id: "addresses",
    label: "Adrese livrare",
    description: "Adrese salvate",
    category: "preferences",
    color: {
      bg: "bg-blue-50 dark:bg-blue-900/20",
      icon: "text-blue-600 dark:text-blue-400",
      activeGradient: "from-blue-600 to-blue-700"
    },
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    id: "payment-methods",
    label: "Metode de plată",
    description: "Carduri salvate",
    category: "preferences",
    color: {
      bg: "bg-cyan-50 dark:bg-cyan-900/20",
      icon: "text-cyan-600 dark:text-cyan-400",
      activeGradient: "from-cyan-600 to-cyan-700"
    },
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
  },
  {
    id: "favorites",
    label: "Favorite",
    description: "Produse preferate",
    category: "preferences",
    color: {
      bg: "bg-rose-50 dark:bg-rose-900/20",
      icon: "text-rose-600 dark:text-rose-400",
      activeGradient: "from-rose-600 to-rose-700"
    },
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
];

export default function AccountNavTab({ activeTab, onTabChange }: AccountNavTabProps) {
  const categories = {
    account: { 
      label: "Cont", 
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    orders: { 
      label: "Comenzi", 
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      )
    },
    preferences: { 
      label: "Preferințe", 
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    }
  };

  const groupedItems = NAV_ITEMS.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, NavTabItem[]>);

  return (
    <nav className="flex flex-col gap-6 bg-linear-to-br from-white via-gray-50/80 to-indigo-50/30 dark:from-slate-800 dark:via-slate-800/90 dark:to-slate-900 p-6 rounded-3xl border border-gray-200/60 dark:border-gray-700/60 shadow-xl backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center gap-3 px-1 pb-2 border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="w-8 h-8 bg-linear-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Meniul meu</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">Gestionează contul tău</p>
        </div>
      </div>

      {/* Navigation Groups */}
      {Object.entries(groupedItems).map(([categoryKey, items]) => {
        const category = categories[categoryKey as keyof typeof categories];
        return (
          <div key={categoryKey} className="space-y-2">
            {/* Category Header */}
            <div className="flex items-center gap-2 px-2 py-1">
              <div className="text-indigo-600 dark:text-indigo-400">{category.icon}</div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                {category.label}
              </h4>
              <div className="flex-1 h-px bg-linear-to-r from-gray-300/60 to-transparent dark:from-gray-600/60"></div>
            </div>

            {/* Category Items */}
            <div className="space-y-1">
              {items.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    className={`relative w-full text-left px-4 py-3 rounded-2xl font-medium transition-all duration-300 flex items-center gap-3 group ${
                      isActive
                        ? `bg-linear-to-r ${item.color.activeGradient} text-white shadow-lg shadow-${item.color.activeGradient.split('-')[1]}-500/25 transform scale-[1.02]`
                        : "text-gray-700 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-slate-700/60 hover:shadow-md"
                    }`}
                  >
                    {/* Animated background for hover */}
                    {!isActive && (
                      <div className={`absolute inset-0 rounded-2xl ${item.color.bg} opacity-0 group-hover:opacity-100 transition-all duration-300 scale-95 group-hover:scale-100`} />
                    )}

                    {/* Content */}
                    <div className="relative z-10 flex items-center gap-3 w-full">
                      <div className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 ${
                        isActive 
                          ? "bg-white/20 scale-110" 
                          : `${item.color.bg} group-hover:scale-110 ${item.color.icon}`
                      }`}>
                        {item.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold leading-tight truncate">{item.label}</p>
                          {item.badge && !isActive && (
                            <span className="px-2 py-0.5 text-xs font-medium bg-indigo-500 text-white rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        {item.description && (
                          <p className={`text-xs mt-0.5 leading-tight ${
                            isActive ? "text-white/80" : "text-gray-500 dark:text-gray-400"
                          }`}>
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                        <div className="w-2 h-2 bg-white rounded-full shadow-lg animate-pulse" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </nav>
  );
}
