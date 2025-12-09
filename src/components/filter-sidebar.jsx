"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

export function FilterSidebar({ open, onOpenChange, onFilter, onDateFilter, activeFilters, onRemoveFilter }) {
  const [deliveryStatus, setDeliveryStatus] = useState(activeFilters?.status || "");
  const [dateFilter, setDateFilter] = useState(activeFilters?.dateFilter || "");

  useEffect(() => {
    setDeliveryStatus(activeFilters?.status || "");
    setDateFilter(activeFilters?.dateFilter || "");
  }, [activeFilters]);

  const handleApplyFilter = () => {
    onFilter({
      deliveryStatus,
    });
    if (onDateFilter) {
      onDateFilter(dateFilter || null);
    }
    onOpenChange(false);
  };

  const activeFilterList = [];
  if (activeFilters?.status) {
    const statusLabel = activeFilters.status === "pending" ? "পেন্ডিং" : 
                       activeFilters.status === "কাজ সম্পন্ন" ? "কাজ সম্পন্ন" : 
                       activeFilters.status === "delivered" ? "ডেলিভার করা হয়েছে" : activeFilters.status;
    activeFilterList.push({ type: "status", label: `স্ট্যাটাস: ${statusLabel}`, value: activeFilters.status });
  }
  if (activeFilters?.dateFilter) {
    const dateLabels = {
      "oneMonth": "এক মাস হয়ে গেছে",
      "thisMonth": "এই মাসের পণ্য",
      "lastSixMonths": "গত ৬ মাস"
    };
    activeFilterList.push({ type: "dateFilter", label: dateLabels[activeFilters.dateFilter] || activeFilters.dateFilter, value: activeFilters.dateFilter });
  }

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={() => onOpenChange(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 h-full w-[70%] max-w-[280px] md:w-96 bg-white shadow-lg transform transition-transform duration-300 z-50 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">ফিল্টার</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Active Filters */}
          {activeFilterList.length > 0 && (
            <div className="mb-4 pb-4 border-b">
              <h3 className="text-sm font-medium mb-2 text-gray-700">সক্রিয় ফিল্টার:</h3>
              <div className="flex flex-wrap gap-2">
                {activeFilterList.map((filter, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-1 bg-teal-50 text-teal-700 px-2 py-1 rounded text-xs border border-teal-200"
                  >
                    <span>{filter.label}</span>
                    <button
                      onClick={() => onRemoveFilter && onRemoveFilter(filter.type)}
                      className="hover:bg-teal-100 rounded p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex-1 space-y-6 overflow-y-auto">
            {/* Date Filters */}
            <div>
              <label className="block text-sm font-medium mb-2">
                তারিখ অনুসারে
              </label>
              <div className="space-y-2">
                <Button
                  variant={dateFilter === "oneMonth" ? "default" : "outline"}
                  onClick={() =>
                    setDateFilter(dateFilter === "oneMonth" ? "" : "oneMonth")
                  }
                  className={`w-full text-sm ${
                    dateFilter === "oneMonth"
                      ? "bg-teal-600 hover:bg-teal-700 text-white"
                      : "border-gray-300"
                  }`}
                >
                  এক মাস হয়ে গেছে
                </Button>
                <Button
                  variant={dateFilter === "thisMonth" ? "default" : "outline"}
                  onClick={() =>
                    setDateFilter(dateFilter === "thisMonth" ? "" : "thisMonth")
                  }
                  className={`w-full text-sm ${
                    dateFilter === "thisMonth"
                      ? "bg-teal-600 hover:bg-teal-700 text-white"
                      : "border-gray-300"
                  }`}
                >
                  এই মাসের পণ্য
                </Button>
                <Button
                  variant={dateFilter === "lastSixMonths" ? "default" : "outline"}
                  onClick={() =>
                    setDateFilter(dateFilter === "lastSixMonths" ? "" : "lastSixMonths")
                  }
                  className={`w-full text-sm ${
                    dateFilter === "lastSixMonths"
                      ? "bg-teal-600 hover:bg-teal-700 text-white"
                      : "border-gray-300"
                  }`}
                >
                  গত ৬ মাস
                </Button>
              </div>
            </div>

            {/* Delivery Status Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">
                ডেলিভারি স্ট্যাটাস
              </label>
              <select
                value={deliveryStatus}
                onChange={(e) => setDeliveryStatus(e.target.value)}
                className="w-full border rounded-lg p-2 text-sm"
              >
                <option value="">সব</option>
                <option value="pending">পেন্ডিং</option>
                <option value="কাজ সম্পন্ন">কাজ সম্পন্ন</option>
                <option value="delivered">ডেলিভার করা হয়েছে</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2 pt-4 pb-20 md:pb-6 border-t">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 text-sm h-10"
            >
              বাতিল
            </Button>
            <Button
              onClick={handleApplyFilter}
              className="flex-1 bg-teal-600 hover:bg-teal-700 text-sm h-10 font-semibold"
            >
              প্রয়োগ করুন
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
