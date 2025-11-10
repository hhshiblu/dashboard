"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function StatusUpdateModal({ open, onOpenChange, onUpdate, product }) {
  const [deliveredAmount, setDeliveredAmount] = useState("");
  const [bakiSeash, setBakiSeash] = useState("");
  const [discountLines, setDiscountLines] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (deliveredAmount && product) {
      const amount = Number.parseFloat(deliveredAmount);
      const totalSeash =
        discountLines.reduce(
          (sum, line) => sum + (Number.parseFloat(line.amount) || 0),
          0
        ) + (bakiSeash ? Number.parseFloat(bakiSeash) : 0);
      if (amount > 0) {
        onUpdate(amount, totalSeash > 0 ? totalSeash : undefined);
        setDeliveredAmount("");
        setBakiSeash("");
        setDiscountLines([]);
      }
    }
  };

  const addDiscountLine = () => {
    setDiscountLines([
      ...discountLines,
      { id: Date.now().toString(), reason: "", amount: "" },
    ]);
  };

  const updateDiscountLine = (id, field, value) => {
    setDiscountLines(
      discountLines.map((line) =>
        line.id === id ? { ...line, [field]: value } : line
      )
    );
  };

  const removeDiscountLine = (id) => {
    setDiscountLines(discountLines.filter((line) => line.id !== id));
  };

  const remaining = product ? product.totalAmount - product.deliveredAmount : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">স্ট্যাটাস আপডেট করুন</DialogTitle>
        </DialogHeader>

        {product && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">পণ্য:</span>
                <span className="font-semibold">{product.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">মোট পরিমাণ:</span>
                <span className="font-semibold">{product.totalAmount} ৳</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">ডেলিভার করা হয়েছে:</span>
                <span className="font-semibold">
                  {product.deliveredAmount} ৳
                </span>
              </div>
              <div className="flex justify-between text-sm border-t pt-2">
                <span className="text-gray-600">বাকি পরিমাণ:</span>
                <span className="font-semibold text-teal-600">
                  {remaining} ৳
                </span>
              </div>
            </div>

            <div>
              <Label htmlFor="amount" className="text-sm">
                ডেলিভার করা পরিমাণ (টাকা)
              </Label>
              <div className="pt-1">
                <Input
                  id="amount"
                  type="number"
                  placeholder="পরিমাণ লিখুন"
                  value={deliveredAmount}
                  onChange={(e) => setDeliveredAmount(e.target.value)}
                  max={remaining}
                  required
                  className="text-sm"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                সর্বোচ্চ: {remaining} ৳
              </p>
            </div>

            <div>
              <Label className="text-sm">
                কম টাকায় ডেলিভারির জন্য ছাড়{" "}
                <span className="text-gray-500 text-xs">(ঐচ্ছিক)</span>
              </Label>
              <div className="pt-1 space-y-2">
                {discountLines.map((line) => (
                  <div key={line.id} className="flex gap-2">
                    <Input
                      placeholder="কারণ (যেমন: কম টাকায় দেওয়া)"
                      value={line.reason}
                      onChange={(e) =>
                        updateDiscountLine(line.id, "reason", e.target.value)
                      }
                      className="text-sm flex-1"
                    />
                    <Input
                      type="number"
                      placeholder="পরিমাণ"
                      value={line.amount}
                      onChange={(e) =>
                        updateDiscountLine(line.id, "amount", e.target.value)
                      }
                      className="text-sm w-20"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeDiscountLine(line.id)}
                      className="text-xs"
                    >
                      মুছুন
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addDiscountLine}
                  className="w-full text-xs bg-transparent"
                >
                  + ছাড় লাইন যোগ করুন
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="bakiSeash" className="text-sm">
                সাধারণ ছাড়{" "}
                <span className="text-gray-500 text-xs">(ঐচ্ছিক)</span>
              </Label>
              <div className="pt-1">
                <Input
                  id="bakiSeash"
                  type="number"
                  placeholder="ছাড় পরিমাণ লিখুন"
                  value={bakiSeash}
                  onChange={(e) => setBakiSeash(e.target.value)}
                  className="text-sm"
                />
              </div>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-xs text-gray-600">
                <span className="font-semibold">নোট:</span> এই পরিমাণ ডেলিভার
                করা হলে বাকি পরিমাণ স্বয়ংক্রিয়ভাবে আপডেট হবে।
              </p>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="submit"
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-sm cursor-pointer"
              >
                আপডেট করুন
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1 bg-transparent text-sm cursor-pointer"
                onClick={() => {
                  onOpenChange(false);
                  setDeliveredAmount("");
                  setBakiSeash("");
                  setDiscountLines([]);
                }}
              >
                বাতিল
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
