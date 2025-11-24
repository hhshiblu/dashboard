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
import { updateExpense } from "@/actions/expenseActions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function UpdateExpenseModal({ open, onOpenChange, expense }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    reason: "",
  });

  useEffect(() => {
    if (expense) {
      setFormData({
        amount: expense.amount.toString(),
        reason: expense.reason,
      });
    }
  }, [expense, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!expense) return;
    
    setLoading(true);
    try {
      const result = await updateExpense(expense.id, formData);
      if (result.success) {
        toast.success("খরচ আপডেট করা হয়েছে");
        onOpenChange(false);
        router.refresh();
      } else {
        toast.error(result.message || "খরচ আপডেট করতে সমস্যা হয়েছে");
      }
    } catch (error) {
      toast.error("একটি ত্রুটি ঘটেছে");
      console.error("Error updating expense:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">খরচ আপডেট করুন</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
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
