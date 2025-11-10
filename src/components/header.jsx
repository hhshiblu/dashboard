"use client";

import { LogOut, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter, usePathname } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";

export function Header({ onSearch }) {
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState("");

  const navLinks = [
    { label: "পণ্য", href: "/products" },
    { label: "খরচ", href: "/expense" },
    { label: "দেনা", href: "/debt" },
    { label: "নোট", href: "/notes" },
  ];

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch?.(query);
  };

  return (
    <header className="sticky top-0 z-50 bg-blue-600 text-white">
      <div className="flex items-center justify-between px-4 py-4 md:px-6 gap-4">
        <div className="flex items-center gap-8">
          <h1
            className="text-2xl md:text-3xl font-bold cursor-pointer font-sans"
            onClick={() => router.push("/")}
          >
            ড্যাশবোর্ড
          </h1>
          {!isMobile && (
            <nav className="flex gap-6">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => router.push(link.href)}
                  className={`text-sm md:text-base cursor-pointer font-medium transition-colors font-sans ${
                    pathname === link.href
                      ? "text-white border-b-2 border-white"
                      : "text-blue-100 hover:text-white"
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </nav>
          )}
        </div>

        {!isMobile && (
          <div className="relative w-48 md:w-72 lg:w-80">
            <Search className="absolute left-3 top-2.5 w-4 h-4 md:w-5 md:h-5 text-gray-300" />
            <Input
              placeholder="খুঁজুন..."
              value={searchQuery}
              onChange={handleSearch}
              className="pl-10 bg-blue-500 border-blue-400 text-white placeholder:text-blue-200 text-sm md:text-base lg:text-lg font-sans py-2 md:py-3"
            />
          </div>
        )}

        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-blue-700"
          onClick={() => router.push("/")}
        >
          <LogOut className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
}
