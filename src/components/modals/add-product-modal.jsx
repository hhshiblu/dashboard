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

export function AddProductModal({ open, onOpenChange }) {
  const [formData, setFormData] = useState({
    type: "নির্বাচন করুন",
    name: "",
    customerName: "",
    customerAddress: "",
    customerPhone: "",
    deliveryDate: "",
    amount: "",
    baki: false,
    bakiDetails: {
      name: "",
      remainingAmount: "",
      note: "",
    },
  });

  const [productTypes] = useState([
    "নির্বাচন করুন",
    "ইলেকট্রনিক্স",
    "পোশাক",
    "খাদ্য",
    "আসবাবপত্র",
    "অন্যান্য",
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Product added:", formData);
    setFormData({
      type: "নির্বাচন করুন",
      name: "",
      customerName: "",
      customerAddress: "",
      customerPhone: "",
      deliveryDate: "",
      amount: "",
      baki: false,
      bakiDetails: {
        name: "",
        remainingAmount: "",
        note: "",
      },
    });
    onOpenChange(false);
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

          {/* Delivery Date */}
          <div>
            <Label htmlFor="deliveryDate" className="text-sm">
              ডেলিভারি ডেট
            </Label>
            <div className="pt-1">
              <Input
                id="deliveryDate"
                type="date"
                value={formData.deliveryDate}
                onChange={(e) =>
                  setFormData({ ...formData, deliveryDate: e.target.value })
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

          {/* Baki Option */}
          <div className="border-t pt-4">
            <div className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                id="baki"
                checked={formData.baki}
                onChange={(e) =>
                  setFormData({ ...formData, baki: e.target.checked })
                }
                className="w-4 h-4 cursor-pointer"
              />
              <Label htmlFor="baki" className="text-sm cursor-pointer">
                বাকি যোগ করুন
              </Label>
            </div>

            {formData.baki && (
              <div className="space-y-3 bg-gray-50 p-3 rounded-lg">
                <div>
                  <Label htmlFor="bakiName" className="text-sm">
                    নাম
                  </Label>
                  <div className="pt-1">
                    <Input
                      id="bakiName"
                      placeholder="নাম লিখুন"
                      value={formData.bakiDetails.name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          bakiDetails: {
                            ...formData.bakiDetails,
                            name: e.target.value,
                          },
                        })
                      }
                      className="text-sm"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="bakiAmount" className="text-sm">
                    বাকি পরিমাণ
                  </Label>
                  <div className="pt-1">
                    <Input
                      id="bakiAmount"
                      type="number"
                      placeholder="বাকি পরিমাণ লিখুন"
                      value={formData.bakiDetails.remainingAmount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          bakiDetails: {
                            ...formData.bakiDetails,
                            remainingAmount: e.target.value,
                          },
                        })
                      }
                      className="text-sm"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="bakiNote" className="text-sm">
                    নোট
                  </Label>
                  <div className="pt-1">
                    <textarea
                      id="bakiNote"
                      placeholder="নোট লিখুন"
                      value={formData.bakiDetails.note}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          bakiDetails: {
                            ...formData.bakiDetails,
                            note: e.target.value,
                          },
                        })
                      }
                      className="w-full border rounded-lg p-2 text-sm"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-teal-600 hover:bg-teal-700 text-sm cursor-pointer"
            >
              যোগ করুন
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
