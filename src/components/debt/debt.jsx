"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { BottomNav } from "@/components/bottom-nav";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/data-table";
import { AddDebtModal } from "@/components/modals/add-debt-modal";
import { UpdateDebtModal } from "@/components/modals/update-debt-modal";
import { Plus, Search } from "lucide-react";

const dummyDebts = [
  {
    id: "001",
    debtor: "ঋণগ্রহণকারী ১",
    amount: 5000,
    reason: "পণ্য ক্রয়",
    date: "२०२५-०१-१५",
    status: "বকেয়া",
  },
  {
    id: "002",
    debtor: "ঋণগ্রহণকারী २",
    amount: 3000,
    reason: "সেবা",
    date: "२०२५-०१-१६",
    status: "আংশিক",
  },
  {
    id: "003",
    debtor: "ঋণগ্রহণকারী ३",
    amount: 7000,
    reason: "পণ্য ক্রয়",
    date: "२०२५-०१-१७",
    status: "বকেয়া",
  },
];

export default function DebtPage() {
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState("");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [debts, setDebts] = useState(dummyDebts);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState(null);

  const filteredDebts = debts.filter(
    (d) =>
      d.id.includes(searchQuery) ||
      d.debtor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id) => {
    setDebts(debts.filter((d) => d.id !== id));
  };

  const handleUpdate = (id) => {
    const debt = debts.find((d) => d.id === id);
    if (debt) {
      setSelectedDebt(debt);
      setUpdateModalOpen(true);
    }
  };

  const handleUpdateSubmit = (id, updatedData) => {
    setDebts(debts.map((d) => (d.id === id ? { ...d, ...updatedData } : d)));
  };

  const columns = [
    { key: "id", label: "আইডি" },
    { key: "debtor", label: "ঋণগ্রহণকারী" },
    { key: "amount", label: "পরিমাণ" },
    { key: "reason", label: "কারণ" },
    { key: "date", label: "তারিখ" },
    { key: "status", label: "স্ট্যাটাস" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <main className={isMobile ? "pb-24 px-0" : "px-4 py-6"}>
        <div className={isMobile ? "px-4" : ""}>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">দেনা</h1>
            {!isMobile && (
              <Button
                onClick={() => setAddModalOpen(true)}
                className="bg-teal-600 hover:bg-teal-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                নতুন দেনা
              </Button>
            )}
          </div>

          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="দেনা নম্বর দিয়ে খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className={isMobile ? "border-0" : "border rounded-lg"}>
            <DataTable
              columns={columns}
              data={filteredDebts}
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
            className="fixed bottom-24 right-4 rounded-full w-14 h-14 bg-teal-600 hover:bg-teal-700 shadow-lg"
          >
            <Plus className="w-6 h-6" />
          </Button>
        </>
      )}

      <AddDebtModal open={addModalOpen} onOpenChange={setAddModalOpen} />
      <UpdateDebtModal
        open={updateModalOpen}
        onOpenChange={setUpdateModalOpen}
        debt={selectedDebt}
        onUpdate={handleUpdateSubmit}
      />
    </div>
  );
}
