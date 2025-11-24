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
import { updateProduct } from "@/actions/productActions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function UpdateProductModal({ open, onOpenChange, product }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    customerName: "",
    customerAddress: "",
    customerPhone: "",
    amount: "",
    joma: "",
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        customerName: product.customerName || "",
        customerAddress: product.customerAddress || "",
        customerPhone: product.customerPhone || "",
        amount: product.amount || "",
        joma: product.joma || "",
      });
    }
  }, [product, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!product) return;
    
    setLoading(true);
    try {
      const result = await updateProduct(product.id, formData);
      if (result.success) {
        toast.success("পণ্য আপডেট করা হয়েছে");
        onOpenChange(false);
        router.refresh();
      } else {
        toast.error(result.message || "পণ্য আপডেট করতে সমস্যা হয়েছে");
      }
    } catch (error) {
      toast.error("একটি ত্রুটি ঘটেছে");
      console.error("Error updating product:", error);
    } finally {
      setLoading(false);
    }
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

            {/* Amount */}
            <div>
              <Label htmlFor="amount" className="text-sm">
                পরিমাণ (টাকা)
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
                  className="text-sm"
                />
              </div>
            </div>

            {/* Joma */}
            <div>
              <Label htmlFor="joma" className="text-sm">
                জমা (টাকা)
              </Label>
              <div className="pt-1">
                <Input
                  id="joma"
                  type="number"
                  placeholder="জমা পরিমাণ লিখুন"
                  value={formData.joma}
                  onChange={(e) =>
                    setFormData({ ...formData, joma: e.target.value })
                  }
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
        )}
      </DialogContent>
    </Dialog>
  );
}
