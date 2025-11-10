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

export function UpdateDebtModal({ open, onOpenChange, debt, onUpdate }) {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (debt) {
      onUpdate(debt.id, {
        debtor: formData.debtor,
        amount: Number(formData.amount),
        reason: formData.reason,
      });
      onOpenChange(false);
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
              className="flex-1 bg-teal-600 hover:bg-teal-700 text-sm cursor-pointer"
            >
              আপডেট করুন
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1 bg-transparent text-sm cursor-pointer"
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
