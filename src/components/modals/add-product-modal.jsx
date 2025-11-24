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
import { createProduct } from "@/actions/productActions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function AddProductModal({ open, onOpenChange }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: "নির্বাচন করুন",
    name: "",
    customerName: "",
    customerAddress: "",
    customerPhone: "",
    amount: "",
    joma: "",
  });

  const [productTypes] = useState([
    "নির্বাচন করুন",
    "এলইডি টিভি",
    "এলইডি টিভির প্যানেল",
    "এলইডি টিভির সার্কিট",
    "ওভেন",
    "ওভেনের সার্কিট",
    "এসির সার্কিট",
    "ওয়াশিং মেশিনের সার্কিট",
    "অন্যান্য পণ্য",
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        type: formData.type,
        name: formData.name,
        customerName: formData.customerName,
        customerAddress: formData.customerAddress,
        customerPhone: formData.customerPhone,
        amount: formData.amount,
        joma: formData.joma,
      };

      const result = await createProduct(productData);

      if (result.success) {
        toast.success("পণ্য সফলভাবে যোগ করা হয়েছে");
        setFormData({
          type: "নির্বাচন করুন",
          name: "",
          customerName: "",
          customerAddress: "",
          customerPhone: "",
          amount: "",
          joma: "",
        });
        onOpenChange(false);
        router.refresh();
      } else {
        toast.error(result.message || "পণ্য যোগ করতে সমস্যা হয়েছে");
      }
    } catch (error) {
      toast.error("একটি ত্রুটি ঘটেছে");
      console.error("Error adding product:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">নতুন পণ্য যোগ করুন</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Product Type */}
          <div>
            <Label htmlFor="type" className="text-sm">
              প্রোডাক্ট টাইপ
            </Label>
            <div className="pt-1">
              <select
                id="type"
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                className="w-full border rounded-lg p-2 text-sm"
              >
                {productTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Product Name */}
          <div>
            <Label htmlFor="name" className="text-sm">
              প্রোডাক্ট নাম
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
                  setFormData({ ...formData, customerAddress: e.target.value })
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

          {/* Amount - Optional */}
          <div>
            <Label htmlFor="amount" className="text-sm">
              পরিমাণ (টাকা){" "}
              <span className="text-gray-500 text-xs">(ঐচ্ছিক)</span>
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

          {/* Joma (Deposit) */}
          <div>
            <Label htmlFor="joma" className="text-sm">
              জমা (টাকা) <span className="text-gray-500 text-xs">(ঐচ্ছিক)</span>
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
