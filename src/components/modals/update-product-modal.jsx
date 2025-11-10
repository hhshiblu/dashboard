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

export function UpdateProductModal({ open, onOpenChange, onUpdate, product }) {
  const [formData, setFormData] = useState({
    name: "",
    customerName: "",
    customerAddress: "",
    customerPhone: "",
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        customerName: product.customerName || "",
        customerAddress: product.customerAddress || "",
        customerPhone: product.customerPhone || "",
      });
    }
  }, [product, open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">পণ্য আপডেট করুন</DialogTitle>
        </DialogHeader>

        {product && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-600">
                <span className="font-semibold">পণ্য আইডি:</span> {product.id}
              </p>
            </div>

            {/* Product Name */}
            <div>
              <Label htmlFor="name" className="text-sm">
                পণ্যের নাম
              </Label>
              <div className="pt-1">
                <Input
                  id="name"
                  placeholder="পণ্যের নাম লিখুন"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="text-sm"
                />
              </div>
            </div>

            {/* Customer Name */}
            <div>
              <Label htmlFor="customerName" className="text-sm">
                কাস্টমার নাম
              </Label>
              <div className="pt-1">
                <Input
                  id="customerName"
                  placeholder="কাস্টমারের নাম লিখুন"
                  value={formData.customerName}
                  onChange={(e) =>
                    setFormData({ ...formData, customerName: e.target.value })
                  }
                  required
                  className="text-sm"
                />
              </div>
            </div>

            {/* Customer Address */}
            <div>
              <Label htmlFor="customerAddress" className="text-sm">
                কাস্টমার টিকানা
              </Label>
              <div className="pt-1">
                <Input
                  id="customerAddress"
                  placeholder="কাস্টমারের টিকানা লিখুন"
                  value={formData.customerAddress}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      customerAddress: e.target.value,
                    })
                  }
                  className="text-sm"
                />
              </div>
            </div>

            {/* Customer Phone */}
            <div>
              <Label htmlFor="customerPhone" className="text-sm">
                কাস্টমার ফোন নাম্বার
              </Label>
              <div className="pt-1">
                <Input
                  id="customerPhone"
                  type="tel"
                  placeholder="০১৭xxxxxxxxx"
                  value={formData.customerPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, customerPhone: e.target.value })
                  }
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
        )}
      </DialogContent>
    </Dialog>
  );
}
