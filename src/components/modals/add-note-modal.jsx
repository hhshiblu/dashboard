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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function AddNoteModal({ open, onOpenChange }) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    status: "সক্রিয়",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Note added:", formData);
    setFormData({ title: "", content: "", status: "সক্রিয়" });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">নতুন নোট যোগ করুন</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-sm">
              শিরোনাম
            </Label>
            <div className="pt-1">
              <Input
                id="title"
                placeholder="শিরোনাম লিখুন"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
                className="text-sm"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="content" className="text-sm">
              মন্তব্য
            </Label>
            <div className="pt-1">
              <Textarea
                id="content"
                placeholder="মন্তব্য লিখুন"
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                required
                rows={4}
                className="text-sm"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="status" className="text-sm">
              আপডেশন
            </Label>
            <div className="pt-1">
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger id="status" className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="সক্রিয়">সক্রিয়</SelectItem>
                  <SelectItem value="আর্কাইভ">আর্কাইভ</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
