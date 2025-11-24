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
import { updateDebt } from "@/actions/debtActions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function UpdateDebtModal({ open, onOpenChange, debt }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    debtor: "",
    amount: "",
    reason: "",
  });

  useEffect(() => {
    if (debt) {
      setFormData({
        debtor: debt.debtor,
        amount: debt.amount.toString(),
        reason: debt.reason,
      });
    }
  }, [debt, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!debt) return;
    
    setLoading(true);
    try {
      const result = await updateDebt(debt.id, formData);
      if (result.success) {
        toast.success("দেনা আপডেট করা হয়েছে");
        onOpenChange(false);
        router.refresh();
      } else {
        toast.error(result.message || "দেনা আপডেট করতে সমস্যা হয়েছে");
      }
    } catch (error) {
      toast.error("একটি ত্রুটি ঘটেছে");
      console.error("Error updating debt:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">দেনা আপডেট করুন</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="debtor" className="text-sm">
              ঋণগ্রহণকারীর নাম
            </Label>
            <div className="pt-1">
              <Input
                id="debtor"
                placeholder="ঋণগ্রহণকারীর নাম লিখুন"
                value={formData.debtor}
                onChange={(e) =>
                  setFormData({ ...formData, debtor: e.target.value })
                }
                required
                className="text-sm"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="amount" className="text-sm">
              পরিমাণ
            </Label>
            <div className="pt-1">
              <Input
                id="amount"
                type="number"
                placeholder="পরিমাণ লিখুন"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                required
                className="text-sm"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="reason" className="text-sm">
              কারণ
            </Label>
            <div className="pt-1">
              <Input
                id="reason"
                placeholder="কারণ লিখুন"
                value={formData.reason}
                onChange={(e) =>
                  setFormData({ ...formData, reason: e.target.value })
                }
                required
                className="text-sm"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-teal-600 hover:bg-teal-700 text-sm cursor-pointer disabled:opacity-50"
            >
              {loading ? "আপডেট করা হচ্ছে..." : "আপডেট করুন"}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              className="flex-1 bg-transparent text-sm cursor-pointer disabled:opacity-50"
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
