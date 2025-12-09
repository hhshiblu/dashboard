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
  const [discount, setDiscount] = useState(0);
  const [newJoma, setNewJoma] = useState(0);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    if (product) {
      setStatus(product.status || "pending");
      setDeliveredAmount(""); // Start with blank, not auto-filled
      const total = product.amount || 0;
      const joma = product.joma || 0;
      setRemainingAmount(total - joma);
      setDiscount(0);
      setNewJoma(joma);
    }
  }, [product, open]);

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    if (newStatus !== "delivered") {
      setDeliveredAmount("");
      setDiscount(0);
      if (product) {
        const total = product.amount || 0;
        const joma = product.joma || 0;
        setRemainingAmount(total - joma);
        setNewJoma(joma);
      }
    }
  };

  const handleAmountChange = (value) => {
    if (product) {
      const total = product.amount || 0;
      const currentJoma = product.joma || 0;
      const currentRemaining = total - currentJoma;
      const enteredAmount = parseFloat(value) || 0;

      // If entered amount exceeds current remaining, show toast and limit to max
      if (enteredAmount > currentRemaining && currentRemaining > 0) {
        const id = toast.error(
          `সর্বোচ্চ ${currentRemaining} ৳ পর্যন্ত দেওয়া যাবে`,
          {
            action: {
              label: "ঠিক আছে",
              onClick: () => toast.dismiss(id),
            },
          }
        );
        // Limit to max amount
        const maxAmount = currentRemaining.toString();
        setDeliveredAmount(maxAmount);
        const calculatedJoma = currentJoma + currentRemaining;
        setDiscount(0);
        setNewJoma(calculatedJoma);
        setRemainingAmount(total - calculatedJoma);
        return;
      }

      setDeliveredAmount(value);

      const calculatedJoma = currentJoma + enteredAmount;

      if (calculatedJoma > total) {
        // If exceeds total, add extra as discount
        const extraAmount = calculatedJoma - total;
        setDiscount(extraAmount);
        setNewJoma(total);
        setRemainingAmount(0);
      } else {
        setDiscount(0);
        setNewJoma(calculatedJoma);
        const remaining = total - calculatedJoma;
        // If remaining becomes negative, it's actually discount
        if (remaining < 0) {
          setDiscount(Math.abs(remaining));
          setRemainingAmount(0);
        } else {
          setRemainingAmount(remaining);
        }
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!product) return;

    // Show confirmation dialog
    setShowConfirmDialog(true);
  };

  const handleConfirmUpdate = async () => {
    if (!product) return;

    setLoading(true);
    setShowConfirmDialog(false);

    try {
      // Calculate final joma: current joma + entered amount
      const currentJoma = product.joma || 0;
      const enteredAmount = parseFloat(deliveredAmount) || 0;
      const totalAmount = product.amount || 0;

      let finalJoma = currentJoma;
      let discountToSave = product.discount || 0;

      if (status === "delivered" && deliveredAmount) {
        // Add entered amount to current joma
        finalJoma = currentJoma + enteredAmount;

        // Calculate discount: মোট টাকা - মোট জমা
        const calculatedDiscount = totalAmount - finalJoma;

        // If discount is negative, it means extra payment, add to discount
        if (calculatedDiscount < 0) {
          discountToSave =
            (product.discount || 0) + Math.abs(calculatedDiscount);
          // Cap joma at total amount
          finalJoma = totalAmount;
        } else {
          // If discount is positive or zero, update discount
          discountToSave = Math.abs(calculatedDiscount);
        }
      }

      const result = await updateProductStatus(
        product.id,
        status,
        finalJoma,
        discountToSave
      );

      if (result.success) {
        const id = toast.success("স্ট্যাটাস আপডেট করা হয়েছে", {
          action: {
            label: "ঠিক আছে",
            onClick: () => toast.dismiss(id),
          },
        });
        onOpenChange(false);
        router.refresh();
      } else {
        const id = toast.error(
          result.message || "স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে",
          {
            action: {
              label: "ঠিক আছে",
              onClick: () => toast.dismiss(id),
            },
          }
        );
      }
    } catch (error) {
      const id = toast.error("একটি ত্রুটি ঘটেছে", {
        action: {
          label: "ঠিক আছে",
          onClick: () => toast.dismiss(id),
        },
      });
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
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className={`${
            isMobile
              ? "max-w-full h-full m-0 rounded-none top-0 left-0 translate-x-0 translate-y-0 w-full"
              : "max-w-md"
          } mx-auto ${isMobile ? "flex flex-col" : ""}`}
        >
          <DialogHeader className={isMobile ? "pb-4 border-b" : ""}>
            <DialogTitle className="text-lg">স্ট্যাটাস আপডেট করুন</DialogTitle>
          </DialogHeader>

          <form
            onSubmit={handleSubmit}
            className={`space-y-4 ${
              isMobile ? "flex-1 overflow-y-auto px-2" : "px-2"
            }`}
          >
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
                  <SelectTrigger id="status" className="text-sm w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">পেন্ডিং</SelectItem>
                    <SelectItem value="কাজ সম্পন্ন">কাজ সম্পন্ন</SelectItem>
                    <SelectItem value="delivered">
                      ডেলিভার করা হয়েছে
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {status === "delivered" && (
              <div>
                <Label htmlFor="deliveredAmount" className="text-sm">
                  টাকা পরিমাণ
                </Label>
                <div className="pt-1.5">
                  <Input
                    id="deliveredAmount"
                    type="number"
                    placeholder="টাকার পরিমাণ লিখুন"
                    value={deliveredAmount}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    className="text-sm"
                  />
                  {currentRemaining > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      সর্বোচ্চ: {currentRemaining} ৳ (এর বেশি হলে ছাড় হবে)
                    </p>
                  )}
                </div>
                {deliveredAmount && (
                  <div className="mt-2 space-y-1 text-xs">
                    <div className="flex justify-between text-gray-600">
                      <span>মোট পরিমাণ:</span>
                      <span className="font-semibold">{totalAmount} ৳</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>জমা:</span>
                      <span className="font-semibold">{currentJoma} ৳</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>টাকা পরিমাণ:</span>
                      <span className="font-semibold">{deliveredAmount} ৳</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>নতুন জমা:</span>
                      <span className="font-semibold">{newJoma} ৳</span>
                    </div>
                    {discount > 0 ? (
                      <div className="flex justify-between text-orange-600 font-semibold border-t pt-1">
                        <span>ছাড়:</span>
                        <span>{discount} ৳</span>
                      </div>
                    ) : (
                      <div className="flex justify-between text-teal-600 font-semibold border-t pt-1">
                        <span> ছাড়:</span>
                        <span>
                          {remainingAmount >= 0 ? remainingAmount : 0} ৳
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <div
              className={`flex gap-2 ${
                isMobile ? "pt-4 pb-6 border-t mt-auto" : "pt-4"
              }`}
            >
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

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="text-lg">নিশ্চিত করুন</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">মোট টাকা:</span>
              <span className="font-semibold">{product?.amount || 0} ৳</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">টাকা পরিমাণ:</span>
              <span className="font-semibold">{deliveredAmount} ৳</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">মোট জমা:</span>
              <span className="font-semibold">{newJoma} ৳</span>
            </div>
            <div className="flex justify-between text-sm border-t pt-2">
              <span className="text-gray-600">ছাড়:</span>
              <span className="font-semibold text-orange-600">
                {(() => {
                  const totalAmount = product?.amount || 0;
                  const totalJoma = newJoma;
                  const calculatedDiscount = totalAmount - totalJoma;
                  // Discount = মোট টাকা - মোট জমা (যদি negative হয় তাহলে absolute value)
                  return calculatedDiscount < 0
                    ? Math.abs(calculatedDiscount)
                    : calculatedDiscount;
                })()}{" "}
                ৳
              </span>
            </div>
            <div className="pt-4 border-t">
              <p className="text-sm text-gray-600">
                আপনি কি এই তথ্য দিয়ে আপডেট করতে চান?
              </p>
            </div>
          </div>
          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              onClick={handleConfirmUpdate}
              disabled={loading}
              className="flex-1 bg-teal-600 hover:bg-teal-700 text-sm cursor-pointer disabled:opacity-50"
            >
              {loading ? "আপডেট করা হচ্ছে..." : "ঠিক আছে"}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              className="flex-1 bg-transparent text-sm cursor-pointer disabled:opacity-50"
              onClick={() => setShowConfirmDialog(false)}
            >
              বাতিল
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
