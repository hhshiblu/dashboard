"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { BottomNav } from "@/components/bottom-nav";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/data-table";
import { AddNoteModal } from "@/components/modals/add-note-modal";
import { UpdateNoteModal } from "@/components/modals/update-note-modal";
import { Plus, Search } from "lucide-react";

const dummyNotes = [
  {
    id: "001",
    title: "গুরুত্বপূর্ণ নোট ১",
    content: "এটি একটি গুরুত্বপূর্ণ নোট",
    date: "२०२५-०१-१५",
    status: "সক্রিয়",
  },
  {
    id: "002",
    title: "গুরুত্বপূর্ণ নোট २",
    content: "এটি আরেকটি নোট",
    date: "२०२५-०१-१६",
    status: "সক্রিয়",
  },
  {
    id: "003",
    title: "গুরুত্বপূর্ণ নোট ३",
    content: "তৃতীয় নোট",
    date: "२०२५-०१-१७",
    status: "আর্কাইভ",
  },
];

export default function NotesPage() {
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState("");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [notes, setNotes] = useState(dummyNotes);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  const filteredNotes = notes.filter(
    (n) =>
      n.id.includes(searchQuery) ||
      n.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id) => {
    setNotes(notes.filter((n) => n.id !== id));
  };

  const handleUpdate = (id) => {
    const note = notes.find((n) => n.id === id);
    if (note) {
      setSelectedNote(note);
      setUpdateModalOpen(true);
    }
  };

  const handleUpdateSubmit = (id, updatedData) => {
    setNotes(notes.map((n) => (n.id === id ? { ...n, ...updatedData } : n)));
  };

  const columns = [
    { key: "id", label: "আইডি" },
    { key: "title", label: "শিরোনাম" },
    { key: "content", label: "বিষয়বস্তু" },
    { key: "date", label: "তারিখ" },
    { key: "status", label: "স্ট্যাটাস" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <main className={isMobile ? "pb-24 px-0" : "px-4 py-6"}>
        <div className={isMobile ? "px-4" : ""}>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">নোট</h1>
            {!isMobile && (
              <Button
                onClick={() => setAddModalOpen(true)}
                className="bg-teal-600 hover:bg-teal-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                নতুন নোট
              </Button>
            )}
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="নোট নম্বর দিয়ে খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Data Table */}
          <div className={isMobile ? "border-0" : "border rounded-lg"}>
            <DataTable
              columns={columns}
              data={filteredNotes}
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

      <AddNoteModal open={addModalOpen} onOpenChange={setAddModalOpen} />
      <UpdateNoteModal
        open={updateModalOpen}
        onOpenChange={setUpdateModalOpen}
        note={selectedNote}
        onUpdate={handleUpdateSubmit}
      />
    </div>
  );
}
