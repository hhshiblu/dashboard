"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { BottomNav } from "@/components/bottom-nav";
import { StatCards } from "@/components/stat-cards";
import { Card, CardContent } from "@/components/ui/card";

export function HomeClient({ stats }) {
  const isMobile = useIsMobile();

  const statCards = [
    {
      title: "কাজ বাকি আছে",
      value: `${stats.pendingCount}টা`,
      color: "teal",
    },
    {
      title: "কাজ সম্পন্ন",
      value: `${stats.kajComplateCount}টা`,
      color: "indigo",
    },
    {
      title: "এক মাস হয়ে গেছে",
      value: `${stats.oneMonthOldCount}টা`,
      color: "orange",
    },
    {
      title: "এই মাসে মোট কাজ",
      value: `${stats.totalWork}টা`,
      color: "purple",
    },
    {
      title: "এই মাসের আয়",
      value: `${stats.monthlyIncome} টাকা`,
      color: "green",
    },
    {
      title: "এই মাসের ব্যয়",
      value: `${stats.monthlyExpenses} টাকা`,
      color: "red",
    },

    {
      title: "মোট দেনা",
      value: `${stats.totalDebts} টাকা`,
      color: "orange",
    },
    {
      title: "মোট খরচ",
      value: `${stats.totalExpenses} টাকা`,
      color: "red",
    },
  ];

  const allStats = statCards;
  const summaryCards = [
    {
      title: "মোট পণ্য",
      value: `${stats.totalProducts}টা`,
      color: "purple",
      accent: "bg-purple-200 border-purple-500 text-purple-900",
    },
    {
      title: "মোট ডেলিভারি",
      value: `${stats.deliveredCount}টা`,
      color: "orange",
      accent: "bg-orange-200 border-orange-500 text-orange-900",
    },
    {
      title: "মোট আয়",
      value: `${stats.totalIncome} টাকা`,
      color: "emerald",
      accent: "bg-emerald-200 border-emerald-500 text-emerald-900",
    },
  ];

  return (
    <>
      <main
        className={isMobile ? "pb-20 px-0 py-4" : "px-4 py-6 max-w-7xl mx-auto"}
      >
        <div className={isMobile ? "" : "mb-8"}>
          <StatCards cards={allStats} />
        </div>
        {/* Summary Section */}
        <div className={`mt-8 ${isMobile ? "px-3" : ""} max-w-5xl mx-auto`}>
          <div
            className={
              isMobile
                ? "flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none]"
                : "grid grid-cols-3 gap-4"
            }
          >
            {summaryCards.map((card) => (
              <Card
                key={card.title}
                className={`${
                  isMobile ? "min-w-[180px] shrink-0" : ""
                } border ${card.accent}`}
              >
                <CardContent className="p-4">
                  <div className="text-center space-y-1">
                    <p className="text-xs text-gray-600">{card.title}</p>
                    <p className="text-xl font-semibold">{card.value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      {isMobile && <BottomNav />}
    </>
  );
}
