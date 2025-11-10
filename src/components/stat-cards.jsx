"use client";

import { useIsMobile } from "@/hooks/use-mobile";

export function StatCards({ cards }) {
  const isMobile = useIsMobile();

  const colorClasses = {
    teal: "bg-teal-50 border-teal-200 text-teal-700",
    orange: "bg-orange-50 border-orange-200 text-orange-700",
    green: "bg-green-50 border-green-200 text-green-700",
    red: "bg-red-50 border-red-200 text-red-700",
    blue: "bg-blue-50 border-blue-200 text-blue-700",
    purple: "bg-purple-50 border-purple-200 text-purple-700",
  };

  return (
    <div className="flex flex-wrap gap-3 px-4">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className={`flex-1 min-w-[calc(50%-6px)] border rounded-lg p-3 ${
            colorClasses[card.color]
          }`}
        >
          <p className="text-xs font-medium">{card.title}</p>
          <p className="text-xl font-bold mt-1">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
