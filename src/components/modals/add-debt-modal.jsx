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
import { createDebt } from "@/actions/debtActions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function AddDebtModal({ open, onOpenChange }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    debtor: "",
    amount: "",
    reason: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await createDebt(formData);
      
      if (result.success) {
        toast.success("দেনা সফলভাবে যোগ করা হয়েছে");
        setFormData({ debtor: "", amount: "", reason: "" });
        onOpenChange(false);
        router.refresh();
      } else {
        toast.error(result.message || "দেনা যোগ করতে সমস্যা হয়েছে");
      }
    } catch (error) {
      toast.error("একটি ত্রুটি ঘটেছে");
      console.error("Error adding debt:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">নতুন দেনা যোগ করুন</DialogTitle>
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
              {loading ? "যোগ করা হচ্ছে..." : "যোগ করুন"}
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
