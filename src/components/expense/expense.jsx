"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { BottomNav } from "@/components/bottom-nav";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/data-table";
import { AddExpenseModal } from "@/components/modals/add-expense-modal";
import { UpdateExpenseModal } from "@/components/modals/update-expense-modal";
import { Plus, Search } from "lucide-react";

const dummyExpenses = [
  { id: "001", amount: 500, reason: "অফিস খরচ", date: "२०२५-०१-१५" },
  { id: "002", amount: 1000, reason: "পরিবহন", date: "२०२५-०१-१६" },
  { id: "003", amount: 750, reason: "সরঞ্জাম", date: "२०२५-०१-१७" },
  { id: "004", amount: 300, reason: "খাবার", date: "२०२५-०१-१८" },
];

export default function ExpensePage() {
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState("");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [expenses, setExpenses] = useState(dummyExpenses);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);

  const filteredExpenses = expenses.filter(
    (e) =>
      e.id.includes(searchQuery) ||
      e.reason.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id) => {
    setExpenses(expenses.filter((e) => e.id !== id));
  };

  const handleUpdate = (id) => {
    const expense = expenses.find((e) => e.id === id);
    if (expense) {
      setSelectedExpense(expense);
      setUpdateModalOpen(true);
    }
  };

  const handleUpdateSubmit = (id, updatedData) => {
    setExpenses(
      expenses.map((e) => (e.id === id ? { ...e, ...updatedData } : e))
    );
  };

  const columns = [
    { key: "id", label: "আইডি" },
    { key: "amount", label: "পরিমাণ" },
    { key: "reason", label: "কারণ" },
    { key: "date", label: "তারিখ" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <main className={isMobile ? "pb-24 px-0" : "px-4 py-6"}>
        <div className={isMobile ? "px-4" : ""}>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-bold">খরচ</h1>
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

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="খরচ নম্বর দিয়ে খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 text-sm"
              />
            </div>
          </div>

          {/* Data Table */}
          <div className={isMobile ? "border-0" : "border rounded-lg"}>
            <DataTable
              columns={columns}
              data={filteredExpenses}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          </div>
        </div>
      </main>

      {isMobile && (
        <>
          <BottomNav />
          <Button
            onClick={() => setAddModalOpen(true)}
            className="fixed bottom-24 right-4 rounded-full w-14 h-14 bg-teal-600 hover:bg-teal-700 shadow-lg cursor-pointer"
          >
            <Plus className="w-6 h-6" />
          </Button>
        </>
      )}

      <AddExpenseModal open={addModalOpen} onOpenChange={setAddModalOpen} />
      <UpdateExpenseModal
        open={updateModalOpen}
        onOpenChange={setUpdateModalOpen}
        expense={selectedExpense}
        onUpdate={handleUpdateSubmit}
      />
    </div>
  );
}
