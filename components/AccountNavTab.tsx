"use client";

interface NavTabItem {
  id: "orders" | "addresses" | "security";
  label: string;
  icon: React.ReactNode;
}

interface AccountNavTabProps {
  activeTab: "orders" | "addresses" | "security";
  onTabChange: (tab: "orders" | "addresses" | "security") => void;
}

const NAV_ITEMS: NavTabItem[] = [
  {
    id: "orders",
    label: "Comenzile mele",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
  },
  {
    id: "addresses",
    label: "Adrese de livrare",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    id: "security",
    label: "Securitate & Parolă",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
  },
];

export default function AccountNavTab({ activeTab, onTabChange }: AccountNavTabProps) {
  return (
    <nav className="flex flex-col gap-1 bg-white dark:bg-slate-800 p-3 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          onClick={() => onTabChange(item.id)}
          className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-3 ${
            activeTab === item.id
              ? "bg-indigo-600 text-white shadow-md"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
          }`}
        >
          <span className={`${activeTab === item.id ? "text-white" : "text-gray-500 dark:text-gray-400"}`}>
            {item.icon}
          </span>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
