"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export function FilterSidebar({ open, onOpenChange, onFilter, onDateFilter }) {
  const [deliveryStatus, setDeliveryStatus] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [dateFilter, setDateFilter] = useState(null);

  const handleApplyFilter = () => {
    onFilter({
      deliveryStatus,
      priceRange,
    });
    if (onDateFilter) {
      onDateFilter(dateFilter);
    }
    onOpenChange(false);
  };

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
        className={`fixed right-0 top-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 z-50 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold">ফিল্টার</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex-1 space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                তারিখ অনুসারে
              </label>
              <Button
                variant={dateFilter === "oneMonth" ? "default" : "outline"}
                onClick={() =>
                  setDateFilter(dateFilter === "oneMonth" ? null : "oneMonth")
                }
                className={`w-full text-sm ${
                  dateFilter === "oneMonth"
                    ? "bg-teal-600 hover:bg-teal-700 text-white"
                    : "border-gray-300"
                }`}
              >
                এক মাস হয়ে গেছে
              </Button>
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
                <option value="delivered">ডেলিভার করা হয়েছে</option>
                <option value="cancelled">বাতিল</option>
              </select>
            </div>

            {/* Price Range Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">
                মূল্য পরিসীমা
              </label>
              <div className="space-y-2">
                <Input
                  type="number"
                  placeholder="ন্যূনতম"
                  value={priceRange.min}
                  onChange={(e) =>
                    setPriceRange({ ...priceRange, min: e.target.value })
                  }
                  className="text-sm"
                />
                <Input
                  type="number"
                  placeholder="সর্বোচ্চ"
                  value={priceRange.max}
                  onChange={(e) =>
                    setPriceRange({ ...priceRange, max: e.target.value })
                  }
                  className="text-sm"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 text-sm"
            >
              বাতিল
            </Button>
            <Button
              onClick={handleApplyFilter}
              className="flex-1 bg-teal-600 hover:bg-teal-700 text-sm"
            >
              প্রয়োগ করুন
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
