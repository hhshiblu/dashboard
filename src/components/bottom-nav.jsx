"use client";

import { useRouter, usePathname } from "next/navigation";
import { Package, DollarSign, FileText, Home } from "lucide-react";

export function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { icon: Home, label: "হোম", href: "/" },
    { icon: Package, label: "পণ্য", href: "/products" },
    { icon: DollarSign, label: "খরচ", href: "/expense" },
    { icon: FileText, label: "দেনা", href: "/debt" },
    { icon: FileText, label: "নোট", href: "/notes" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center h-20 md:hidden">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <button
            key={item.href}
            onClick={() => router.push(item.href)}
            className={`flex flex-col cursor-pointer items-center justify-center w-full h-full gap-1 transition-colors ${
              isActive ? "text-teal-600" : "text-gray-600 hover:text-teal-600"
            }`}
          >
            <item.icon className="w-6 h-6" />
            <span className="text-xs">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
