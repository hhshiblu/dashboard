"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateProductStatus } from "@/actions/productActions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

export function ProductStatusModal({ open, onOpenChange, product }) {
  const isMobile = useIsMobile();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("pending");
  const [deliveredAmount, setDeliveredAmount] = useState("");
  const [remainingAmount, setRemainingAmount] = useState(0);

  useEffect(() => {
    if (product) {
      setStatus(product.status || "pending");
      setDeliveredAmount(product.joma ? product.joma.toString() : "");
      const total = product.amount || 0;
      const joma = product.joma || 0;
      setRemainingAmount(total - joma);
    }
  }, [product, open]);

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    if (newStatus !== "delivered") {
      setDeliveredAmount("");
    }
  };

  const handleAmountChange = (value) => {
    setDeliveredAmount(value);
    if (product) {
      const total = product.amount || 0;
      const newJoma = parseFloat(value) || 0;
      setRemainingAmount(total - newJoma);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!product) return;

    setLoading(true);
    try {
      const amount = status === "delivered" && deliveredAmount ? parseFloat(deliveredAmount) : 0;
      const result = await updateProductStatus(product.id, status, amount);
      
      if (result.success) {
        toast.success("স্ট্যাটাস আপডেট করা হয়েছে");
        onOpenChange(false);
        router.refresh();
      } else {
        toast.error(result.message || "স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে");
      }
    } catch (error) {
      toast.error("একটি ত্রুটি ঘটেছে");
      console.error("Error updating status:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!product) return null;

  const totalAmount = product.amount || 0;
  const currentJoma = product.joma || 0;
  const currentRemaining = totalAmount - currentJoma;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${isMobile ? 'max-w-full h-full m-0 rounded-none top-0 left-0 translate-x-0 translate-y-0 w-full' : 'max-w-md'} mx-auto ${isMobile ? 'flex flex-col' : ''}`}>
        <DialogHeader className={isMobile ? 'pb-4 border-b' : ''}>
          <DialogTitle className="text-lg">স্ট্যাটাস আপডেট করুন</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className={`space-y-4 ${isMobile ? 'flex-1 overflow-y-auto px-4' : 'px-2'}`}>
          <div className="bg-gray-50 p-3 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">পণ্য:</span>
              <span className="font-semibold">{product.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">মোট পরিমাণ:</span>
              <span className="font-semibold">{totalAmount} ৳</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">বর্তমান জমা:</span>
              <span className="font-semibold">{currentJoma} ৳</span>
            </div>
            <div className="flex justify-between text-sm border-t pt-2">
              <span className="text-gray-600">বর্তমান বাকি:</span>
              <span className="font-semibold text-teal-600">
                {currentRemaining} ৳
              </span>
            </div>
          </div>

          <div>
            <Label htmlFor="status" className="text-sm">
              স্ট্যাটাস
            </Label>
            <div className="pt-1.5">
              <Select value={status} onValueChange={handleStatusChange}>
                <SelectTrigger id="status" className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">পেন্ডিং</SelectItem>
                  <SelectItem value="কাজ সম্পন্ন">কাজ সম্পন্ন</SelectItem>
                  <SelectItem value="delivered">ডেলিভার করা হয়েছে</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {status === "delivered" && (
            <div>
              <Label htmlFor="deliveredAmount" className="text-sm">
                দেওয়া টাকা (৳)
              </Label>
              <div className="pt-1.5">
                <Input
                  id="deliveredAmount"
                  type="number"
                  placeholder="টাকার পরিমাণ লিখুন"
                  value={deliveredAmount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  max={totalAmount}
                  className="text-sm"
                />
              </div>
              {deliveredAmount && (
                <div className="mt-2 space-y-1 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>মোট পরিমাণ:</span>
                    <span className="font-semibold">{totalAmount} ৳</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>দেওয়া টাকা:</span>
                    <span className="font-semibold">{deliveredAmount} ৳</span>
                  </div>
                  <div className="flex justify-between text-teal-600 font-semibold border-t pt-1">
                    <span>বাকি:</span>
                    <span>{remainingAmount >= 0 ? remainingAmount : 0} ৳</span>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className={`flex gap-2 ${isMobile ? 'pt-4 pb-6 border-t mt-auto' : 'pt-4'}`}>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-teal-600 hover:bg-teal-700 text-sm cursor-pointer disabled:opacity-50 h-11"
            >
              {loading ? "আপডেট করা হচ্ছে..." : "আপডেট করুন"}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              className="flex-1 bg-transparent text-sm cursor-pointer disabled:opacity-50 h-11"
              onClick={() => onOpenChange(false)}
            >
              বাতিল
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

