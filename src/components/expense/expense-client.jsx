"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/data-table";
import { AddExpenseModal } from "@/components/modals/add-expense-modal";
import { UpdateExpenseModal } from "@/components/modals/update-expense-modal";
import { DeleteConfirmModal } from "@/components/modals/delete-confirm-modal";
import { Plus, Search, Table2, LayoutGrid } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { deleteExpense } from "@/actions/expenseActions";
import { toast } from "sonner";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BottomNav } from "@/components/bottom-nav";

export function ExpenseClient({ expenses, pagination }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isMobile = useIsMobile();
  const [viewMode, setViewMode] = useState("table");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [isMultipleDelete, setIsMultipleDelete] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchQuery) {
      params.set("search", searchQuery);
    } else {
      params.delete("search");
    }
    params.set("page", "1");
    router.replace(`/expense?${params.toString()}`);
  };

  const handleDelete = (id) => {
    setDeleteItemId(id);
    setIsMultipleDelete(false);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteItemId && !isMultipleDelete) return;
    
    setDeleteLoading(true);
    try {
      if (isMultipleDelete) {
        for (const id of selectedIds) {
          await deleteExpense(id);
        }
        toast.success(`${selectedIds.length} টি খরচ মুছে ফেলা হয়েছে`);
        setSelectedIds([]);
      } else {
        const result = await deleteExpense(deleteItemId);
        if (result.success) {
          toast.success("খরচ মুছে ফেলা হয়েছে");
        } else {
          toast.error(result.message || "খরচ মুছে ফেলতে সমস্যা হয়েছে");
          setDeleteLoading(false);
          return;
        }
      }
      setDeleteModalOpen(false);
      setDeleteItemId(null);
      router.refresh();
    } catch (error) {
      toast.error("একটি ত্রুটি ঘটেছে");
      console.error("Error deleting:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds(expenses.map(e => e.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id, checked) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
    }
  };

  const handleMultipleDelete = () => {
    if (selectedIds.length === 0) return;
    setDeleteItemId(null);
    setIsMultipleDelete(true);
    setDeleteModalOpen(true);
  };

  const handleUpdate = (id) => {
    const expense = expenses.find((e) => e.id === id);
    if (expense) {
      setSelectedExpense(expense);
      setUpdateModalOpen(true);
    }
  };

  const columns = [
    { key: "amount", label: "পরিমাণ" },
    { key: "reason", label: "কারণ" },
    { key: "date", label: "তারিখ" },
  ];

  const formatExpenseData = (expense) => ({
    id: expense.id.substring(0, 8),
    fullId: expense.id,
    amount: `${expense.amount} ৳`,
    reason: expense.reason,
    date: new Date(expense.createdAt).toLocaleDateString("bn-BD"),
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <main className={isMobile ? "pb-20 px-0" : "px-4 py-6"}>
        <div className={isMobile ? "px-4" : ""}>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-bold">খরচ</h1>
            <div className="flex gap-2">
              <div className="flex border rounded-lg">
                <Button
                  type="button"
                  variant={viewMode === "table" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("table")}
                  className={viewMode === "table" ? "bg-teal-600 hover:bg-teal-700" : ""}
                >
                  <Table2 className="w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  className={viewMode === "grid" ? "bg-teal-600 hover:bg-teal-700" : ""}
                >
                  <LayoutGrid className="w-4 h-4" />
                </Button>
              </div>
              {!isMobile && (
                <Button
                  onClick={() => setAddModalOpen(true)}
                  className="bg-teal-600 hover:bg-teal-700 text-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  নতুন খরচ
                </Button>
              )}
            </div>
          </div>

          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="খরচ খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 text-sm"
              />
            </div>
          </form>

          {viewMode === "table" && (
            <div className={isMobile ? "border-0" : "border rounded-lg"}>
              {selectedIds.length > 0 && (
                <div className="p-3 bg-teal-50 border-b flex justify-between items-center">
                  <span className="text-sm text-gray-700">
                    {selectedIds.length} টি নির্বাচিত
                  </span>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={handleMultipleDelete}
                    className="text-xs h-7"
                    disabled={deleteLoading}
                  >
                    নির্বাচিত মুছুন
                  </Button>
                </div>
              )}
              <DataTable
                columns={columns}
                data={expenses.map(formatExpenseData)}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
                selectedIds={selectedIds}
                onSelectAll={handleSelectAll}
                onSelectOne={handleSelectOne}
              />
            </div>
          )}

          {viewMode === "grid" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {expenses.map((expense, index) => {
                const borderColors = [
                  "border-l-4 border-red-400",
                  "border-l-4 border-orange-400",
                  "border-l-4 border-yellow-400",
                  "border-l-4 border-lime-400",
                  "border-l-4 border-teal-400",
                  "border-l-4 border-sky-400",
                ];
                const borderClass = borderColors[index % borderColors.length];
                
                return (
                  <Card key={expense.id} className={`bg-white ${borderClass} shadow-sm hover:shadow-md transition-all duration-200`}>
                    <CardHeader className="pb-1 px-3 pt-2">
                      <div className="flex justify-between items-start gap-2">
                        <CardTitle className="text-gray-800 text-sm font-semibold line-clamp-1 flex-1">{expense.reason}</CardTitle>
                        <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 whitespace-nowrap">
                          {expense.id.substring(0, 8)}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="px-3 pb-2 pt-0 space-y-1.5">
                      <div>
                        <p className="text-base font-bold text-gray-900">{expense.amount} ৳</p>
                      </div>
                      <div className="border-t pt-1">
                        <p className="text-gray-500 text-xs">
                          {new Date(expense.createdAt).toLocaleDateString("bn-BD")}
                        </p>
                      </div>
                      <div className="flex gap-1 pt-0.5">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdate(expense.id)}
                          className="flex-1 text-xs h-6 border-gray-200 hover:bg-gray-50"
                        >
                          আপডেট
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(expense.id)}
                          className="text-red-600 border-red-200 hover:bg-red-50 text-xs h-6 px-2"
                        >
                          মুছুন
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <Button
                variant="outline"
                disabled={pagination.page === 1}
                asChild
              >
                <Link
                  href={`/expense?${new URLSearchParams({
                    ...Object.fromEntries(searchParams),
                    page: (pagination.page - 1).toString(),
                  }).toString()}`}
                >
                  পূর্ববর্তী
                </Link>
              </Button>
              <span className="text-sm">
                পাতা {pagination.page} / {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                disabled={pagination.page === pagination.totalPages}
                asChild
              >
                <Link
                  href={`/expense?${new URLSearchParams({
                    ...Object.fromEntries(searchParams),
                    page: (pagination.page + 1).toString(),
                  }).toString()}`}
                >
                  পরবর্তী
                </Link>
              </Button>
            </div>
          )}
        </div>
      </main>

      {isMobile && (
        <>
          <Button
            onClick={() => setAddModalOpen(true)}
            className="fixed bottom-20 right-4 rounded-full w-14 h-14 bg-teal-600 hover:bg-teal-700 shadow-lg cursor-pointer z-40"
          >
            <Plus className="w-6 h-6" />
          </Button>
          <BottomNav />
        </>
      )}

      <AddExpenseModal open={addModalOpen} onOpenChange={setAddModalOpen} />
      <UpdateExpenseModal
        open={updateModalOpen}
        onOpenChange={setUpdateModalOpen}
        expense={selectedExpense}
      />
      <DeleteConfirmModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={confirmDelete}
        title="খরচ মুছে ফেলুন"
        description={
          isMultipleDelete
            ? `আপনি কি ${selectedIds.length} টি খরচ মুছে ফেলতে চান? এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।`
            : "আপনি কি এই খরচ মুছে ফেলতে চান? এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।"
        }
        itemCount={isMultipleDelete ? selectedIds.length : 1}
        loading={deleteLoading}
      />
    </div>
  );
}

