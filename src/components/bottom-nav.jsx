"use client";

import { useRouter, usePathname } from "next/navigation";
import { Package, DollarSign, FileText, Home, StickyNote } from "lucide-react";

export function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { icon: Home, label: "হোম", href: "/" },
    { icon: Package, label: "পণ্য", href: "/products" },
    { icon: DollarSign, label: "খরচ", href: "/expense" },
    { icon: FileText, label: "দেনা", href: "/debt" },
    { icon: StickyNote, label: "নোট", href: "/notes" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center h-16 md:hidden z-50 shadow-lg">
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
        return (
          <button
            key={item.href}
            onClick={() => router.push(item.href)}
            className={`flex flex-col cursor-pointer items-center justify-center w-full h-full gap-0.5 transition-colors ${
              isActive 
                ? "text-teal-600 bg-teal-50" 
                : "text-gray-600 hover:text-teal-600"
            }`}
          >
            <item.icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
