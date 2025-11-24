"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/data-table";
import { AddNoteModal } from "@/components/modals/add-note-modal";
import { UpdateNoteModal } from "@/components/modals/update-note-modal";
import { DeleteConfirmModal } from "@/components/modals/delete-confirm-modal";
import { Plus, Search, Table2, LayoutGrid } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { deleteNote } from "@/actions/noteActions";
import { toast } from "sonner";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BottomNav } from "@/components/bottom-nav";

export function NotesClient({ notes, pagination }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isMobile = useIsMobile();
  const [viewMode, setViewMode] = useState("table");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
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
    router.replace(`/notes?${params.toString()}`);
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
          await deleteNote(id);
        }
        toast.success(`${selectedIds.length} টি নোট মুছে ফেলা হয়েছে`);
        setSelectedIds([]);
      } else {
        const result = await deleteNote(deleteItemId);
        if (result.success) {
          toast.success("নোট মুছে ফেলা হয়েছে");
        } else {
          toast.error(result.message || "নোট মুছে ফেলতে সমস্যা হয়েছে");
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
      setSelectedIds(notes.map(n => n.id));
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
    const note = notes.find((n) => n.id === id);
    if (note) {
      setSelectedNote(note);
      setUpdateModalOpen(true);
    }
  };

  const columns = [
    { key: "title", label: "শিরোনাম" },
    { key: "content", label: "বিষয়বস্তু" },
    { key: "date", label: "তারিখ" },
    { key: "status", label: "স্ট্যাটাস" },
  ];

  const formatNoteData = (note) => ({
    id: note.id.substring(0, 8),
    fullId: note.id,
    title: note.title || "-",
    content: note.content.substring(0, 50) + (note.content.length > 50 ? "..." : ""),
    date: new Date(note.createdAt).toLocaleDateString("bn-BD"),
    status: note.status,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <main className={isMobile ? "pb-20 px-0" : "px-4 py-6"}>
        <div className={isMobile ? "px-4" : ""}>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">নোট</h1>
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
                  className="bg-teal-600 hover:bg-teal-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  নতুন নোট
                </Button>
              )}
            </div>
          </div>

          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="নোট খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
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
                data={notes.map(formatNoteData)}
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
              {notes.map((note, index) => {
                const borderColors = [
                  "border-l-4 border-indigo-400",
                  "border-l-4 border-violet-400",
                  "border-l-4 border-fuchsia-400",
                  "border-l-4 border-rose-400",
                  "border-l-4 border-amber-400",
                  "border-l-4 border-emerald-400",
                ];
                const borderClass = borderColors[index % borderColors.length];
                
                return (
                  <Card key={note.id} className={`bg-white ${borderClass} shadow-sm hover:shadow-md transition-all duration-200`}>
                    <CardHeader className="pb-1 px-3 pt-2">
                      <div className="flex justify-between items-start gap-2">
                        <CardTitle className="text-gray-800 text-sm font-semibold line-clamp-1 flex-1">
                          {note.title || "নোট"}
                        </CardTitle>
                        <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 whitespace-nowrap">
                          {note.id.substring(0, 8)}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="px-3 pb-2 pt-0 space-y-1.5">
                      <p className="text-gray-700 text-xs line-clamp-2 leading-relaxed">
                        {note.content}
                      </p>
                      <div className="border-t pt-1">
                        <span className={`inline-block px-1.5 py-0.5 rounded text-xs font-medium mb-1 ${
                          note.status === "সক্রিয়" 
                            ? "bg-green-50 text-green-700 border border-green-200" 
                            : "bg-gray-50 text-gray-700 border border-gray-200"
                        }`}>
                          {note.status}
                        </span>
                        <p className="text-gray-500 text-xs">
                          {new Date(note.createdAt).toLocaleDateString("bn-BD")}
                        </p>
                      </div>
                      <div className="flex gap-1 pt-0.5">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdate(note.id)}
                          className="flex-1 text-xs h-6 border-gray-200 hover:bg-gray-50"
                        >
                          আপডেট
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(note.id)}
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
                  href={`/notes?${new URLSearchParams({
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
                  href={`/notes?${new URLSearchParams({
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
            className="fixed bottom-20 right-4 rounded-full w-14 h-14 bg-teal-600 hover:bg-teal-700 shadow-lg z-40"
          >
            <Plus className="w-6 h-6" />
          </Button>
          <BottomNav />
        </>
      )}

      <AddNoteModal open={addModalOpen} onOpenChange={setAddModalOpen} />
      <UpdateNoteModal
        open={updateModalOpen}
        onOpenChange={setUpdateModalOpen}
        note={selectedNote}
      />
    </div>
  );
}

