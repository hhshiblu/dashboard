"use client";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { BottomNav } from "@/components/bottom-nav";
import { StatCards } from "@/components/stat-cards";
import { useIsMobile } from "@/hooks/use-mobile";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const chartData = [
  { month: "জানু", products: 12, delivery: 8, expense: 5 },
  { month: "ফেব্রু", products: 15, delivery: 10, expense: 6 },
  { month: "মার্চ", products: 18, delivery: 12, expense: 7 },
  { month: "এপ্রিল", products: 14, delivery: 9, expense: 5 },
  { month: "মে", products: 20, delivery: 15, expense: 8 },
  { month: "জুন", products: 22, delivery: 18, expense: 9 },
];

export default function Home() {
  const isMobile = useIsMobile();
  const router = useRouter();
  const [chartFilter, setChartFilter] = useState("3");

  const statCards = [
    { title: "ডেলিভারির অপেক্ষায় আছে", value: "0টা", color: "teal" },
    { title: "এক মাস হয়ে গেছে", value: "0টা", color: "orange" },
    { title: "এই মাসের আয়", value: "0 টাকা", color: "green" },
    { title: "এই মাসের ব্যয়", value: "0 টাকা", color: "red" },
    { title: "এই মাসের ব্যালেন্স", value: "0 টাকা", color: "blue" },
    { title: "এই মাসে মোট কাজ", value: "0টা", color: "purple" },
  ];

  const additionalStats = [
    { title: "মাসে মোট খরচ", value: "0 ৳", color: "red" },
    { title: "দেনা", value: "0 ৳", color: "orange" },
    { title: "বাকি পাওনা", value: "0 ৳", color: "green" },
  ];

  const allStats = isMobile ? [...statCards, ...additionalStats] : statCards;

  const getFilteredChartData = () => {
    const monthlyData = chartData;
    if (chartFilter === "1") return monthlyData.slice(-1);
    if (chartFilter === "2") return monthlyData.slice(-2);
    if (chartFilter === "3") return monthlyData.slice(-3);
    return monthlyData;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className={isMobile ? "pb-24 px-0" : "px-4 py-6 max-w-7xl mx-auto"}>
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
              २ মাস
            </Button>
            <Button
              variant={chartFilter === "3" ? "default" : "outline"}
              onClick={() => setChartFilter("3")}
              className="text-xs"
            >
              ३ মাস
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
              <CardHeader>
                <CardTitle className="text-base">মাসিক পণ্য</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={getFilteredChartData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="products" fill="#1abc9c" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">ডেলিভারি ট্রেন্ড</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={getFilteredChartData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="delivery" stroke="#ff8c00" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">খরচ ট্রেন্ড</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={getFilteredChartData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="expense" stroke="#ef4444" />
                  </LineChart>
                </ResponsiveContainer>
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
                  <p className="text-2xl font-bold text-teal-600">0টা</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">মোট ডেলিভারি</p>
                  <p className="text-2xl font-bold text-blue-600">0টা</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">মোট আয়</p>
                  <p className="text-2xl font-bold text-green-600">0 টাকা</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {isMobile && <BottomNav />}
    </div>
  );
}
