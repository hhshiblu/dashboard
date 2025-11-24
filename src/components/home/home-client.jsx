"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { BottomNav } from "@/components/bottom-nav";
import { StatCards } from "@/components/stat-cards";
import { Card, CardContent } from "@/components/ui/card";
import { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { Button } from "@/components/ui/button";

export function HomeClient({ stats }) {
  const isMobile = useIsMobile();
  const [chartFilter, setChartFilter] = useState("3");
  const chartData = stats.chartData || [];

  const statCards = [
    { title: "ডেলিভারির অপেক্ষায় আছে", value: `${stats.pendingCount}টা`, color: "teal" },
    { title: "এক মাস হয়ে গেছে", value: `${stats.oneMonthOldCount}টা`, color: "orange" },
    { title: "এই মাসের আয়", value: `${stats.monthlyIncome} টাকা`, color: "green" },
    { title: "এই মাসের ব্যয়", value: `${stats.monthlyExpenses} টাকা`, color: "red" },
    { title: "এই মাসের ব্যালেন্স", value: `${stats.monthlyBalance} টাকা`, color: "blue" },
    { title: "এই মাসে মোট কাজ", value: `${stats.totalWork}টা`, color: "purple" },
    { title: "কাজ সম্পন্ন", value: `${stats.kajComplateCount}টা`, color: "indigo" },
  ];

  const additionalStats = [
    { title: "মাসে মোট খরচ", value: `${stats.monthlyExpenses} ৳`, color: "red" },
    { title: "দেনা", value: `${stats.totalDebts} ৳`, color: "orange" },
    { title: "বাকি পাওনা", value: `${stats.totalPending} ৳`, color: "green" },
  ];

  const allStats = isMobile ? [...statCards, ...additionalStats] : statCards;

  const filteredChartData = useMemo(() => {
    if (!chartData.length) return [];
    if (chartFilter === "1") return chartData.slice(-1);
    if (chartFilter === "2") return chartData.slice(-2);
    if (chartFilter === "3") return chartData.slice(-3);
    return chartData;
  }, [chartData, chartFilter]);

  const renderChart = (content) => {
    if (!filteredChartData.length) {
      return (
        <div className="py-12 text-center text-sm text-gray-500">
          এই সময়ের জন্য কোন তথ্য নেই
        </div>
      );
    }
    return content;
  };

  return (
    <>
      <main className={isMobile ? "pb-20 px-0" : "px-4 py-6 max-w-7xl mx-auto"}>
        <div className={isMobile ? "" : "mb-8"}>
          <div className={`text-lg font-bold mb-4 ${isMobile ? "px-4" : ""}`}>
            পরিসংখ্যান
          </div>
          <StatCards cards={allStats} />
        </div>

        {/* Charts Section */}
        <div className={`mt-8 ${isMobile ? "px-4" : ""}`}>
          <h2 className="text-lg font-bold mb-4">রিপোর্ট</h2>

          <div className="flex gap-2 mb-4 flex-wrap">
            <Button
              variant={chartFilter === "1" ? "default" : "outline"}
              onClick={() => setChartFilter("1")}
              className="text-xs"
            >
              ১ মাস
            </Button>
            <Button
              variant={chartFilter === "2" ? "default" : "outline"}
              onClick={() => setChartFilter("2")}
              className="text-xs"
            >
              ২ মাস
            </Button>
            <Button
              variant={chartFilter === "3" ? "default" : "outline"}
              onClick={() => setChartFilter("3")}
              className="text-xs"
            >
              ৩ মাস
            </Button>
            <Button
              variant={chartFilter === "all" ? "default" : "outline"}
              onClick={() => setChartFilter("all")}
              className="text-xs"
            >
              সব
            </Button>
          </div>

          <div className={isMobile ? "space-y-4" : "grid grid-cols-2 gap-4"}>
            <Card>
              <CardContent className="p-4 sm:p-5">
                <p className="text-sm font-semibold text-gray-700 mb-2">মাসিক পণ্য</p>
                {renderChart(
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={filteredChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="products" fill="#1abc9c" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 sm:p-5">
                <p className="text-sm font-semibold text-gray-700 mb-2">ডেলিভারি ট্রেন্ড</p>
                {renderChart(
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={filteredChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="delivery" stroke="#ff8c00" />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 sm:p-5">
                <p className="text-sm font-semibold text-gray-700 mb-2">খরচ ট্রেন্ড</p>
                {renderChart(
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={filteredChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="expense" stroke="#ef4444" />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Summary Section */}
        <div className={`mt-8 ${isMobile ? "px-4" : ""}`}>
          <h2 className="text-lg font-bold mb-4">সারসংক্ষেপ</h2>

          <div className={isMobile ? "space-y-3" : "grid grid-cols-3 gap-4"}>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">মোট পণ্য</p>
                  <p className="text-2xl font-bold text-teal-600">{stats.totalProducts}টা</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">মোট ডেলিভারি</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.deliveredCount}টা</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">মোট আয়</p>
                  <p className="text-2xl font-bold text-green-600">{stats.totalIncome} টাকা</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {isMobile && <BottomNav />}
    </>
  );
}

