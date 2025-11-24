"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/data-table";
import { FilterSidebar } from "@/components/filter-sidebar";
import { AddProductModal } from "@/components/modals/add-product-modal";
import { UpdateProductModal } from "@/components/modals/update-product-modal";
import { ProductStatusModal } from "@/components/modals/product-status-modal";
import { DeleteConfirmModal } from "@/components/modals/delete-confirm-modal";
import { Plus, Search, Filter, Table2, LayoutGrid } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { deleteProduct } from "@/actions/productActions";
import { toast } from "sonner";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BottomNav } from "@/components/bottom-nav";

export function ProductsClient({ products, pagination }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isMobile = useIsMobile();
  const [viewMode, setViewMode] = useState("table");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [isMultipleDelete, setIsMultipleDelete] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [activeFilters, setActiveFilters] = useState({
    status: searchParams.get("status") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    dateFilter: searchParams.get("dateFilter") || "",
  });

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchQuery) {
      params.set("search", searchQuery);
    } else {
      params.delete("search");
    }
    params.set("page", "1");
    router.replace(`/products?${params.toString()}`);
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
          await deleteProduct(id);
        }
        toast.success(`${selectedIds.length} টি পণ্য মুছে ফেলা হয়েছে`);
        setSelectedIds([]);
      } else {
        const result = await deleteProduct(deleteItemId);
        if (result.success) {
          toast.success("পণ্য মুছে ফেলা হয়েছে");
        } else {
          toast.error(result.message || "পণ্য মুছে ফেলতে সমস্যা হয়েছে");
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

  const handleUpdate = (id) => {
    setSelectedProductId(id);
    setUpdateModalOpen(true);
  };

  const handleStatusChange = (id) => {
    setSelectedProductId(id);
    setStatusModalOpen(true);
  };


  const handleFilter = (filters) => {
    const params = new URLSearchParams(searchParams);
    if (filters.deliveryStatus) {
      params.set("status", filters.deliveryStatus);
      setActiveFilters(prev => ({ ...prev, status: filters.deliveryStatus }));
    } else {
      params.delete("status");
      setActiveFilters(prev => ({ ...prev, status: "" }));
    }
    if (filters.priceRange.min) {
      params.set("minPrice", filters.priceRange.min);
      setActiveFilters(prev => ({ ...prev, minPrice: filters.priceRange.min }));
    } else {
      params.delete("minPrice");
      setActiveFilters(prev => ({ ...prev, minPrice: "" }));
    }
    if (filters.priceRange.max) {
      params.set("maxPrice", filters.priceRange.max);
      setActiveFilters(prev => ({ ...prev, maxPrice: filters.priceRange.max }));
    } else {
      params.delete("maxPrice");
      setActiveFilters(prev => ({ ...prev, maxPrice: "" }));
    }
    params.set("page", "1");
    router.replace(`/products?${params.toString()}`);
  };

  const handleDateFilter = (dateFilter) => {
    const params = new URLSearchParams(searchParams);
    if (dateFilter) {
      params.set("dateFilter", dateFilter);
      setActiveFilters(prev => ({ ...prev, dateFilter }));
    } else {
      params.delete("dateFilter");
      setActiveFilters(prev => ({ ...prev, dateFilter: "" }));
    }
    params.set("page", "1");
    router.replace(`/products?${params.toString()}`);
  };

  const handleRemoveFilter = (filterType) => {
    const params = new URLSearchParams(searchParams);
    if (filterType === "status") {
      params.delete("status");
      setActiveFilters(prev => ({ ...prev, status: "" }));
    } else if (filterType === "minPrice") {
      params.delete("minPrice");
      setActiveFilters(prev => ({ ...prev, minPrice: "" }));
    } else if (filterType === "maxPrice") {
      params.delete("maxPrice");
      setActiveFilters(prev => ({ ...prev, maxPrice: "" }));
    } else if (filterType === "dateFilter") {
      params.delete("dateFilter");
      setActiveFilters(prev => ({ ...prev, dateFilter: "" }));
    }
    params.set("page", "1");
    router.replace(`/products?${params.toString()}`);
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds(products.map(p => p.id));
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

  const columns = [
    { key: "name", label: "পণ্যের নাম" },
    { key: "customerName", label: "কাস্টমার" },
    { key: "amount", label: "মূল্য" },
    { key: "joma", label: "জমা" },
    { key: "status", label: "স্ট্যাটাস" },
  ];

  const formatProductData = (product) => ({
    fullId: product.id, // Keep full ID for actions
    name: product.name,
    customerName: product.customerName,
    amount: product.amount ? `${product.amount} ৳` : "-",
    joma: product.joma ? `${product.joma} ৳` : "0 ৳",
    status: product.status === "delivered" 
      ? "ডেলিভার করা হয়েছে" 
      : product.status === "কাজ সম্পন্ন"
      ? "কাজ সম্পন্ন"
      : "পেন্ডিং",
    date: new Date(product.createdAt).toLocaleDateString("bn-BD"),
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <main className={isMobile ? "pb-20 px-0" : "px-4 py-6"}>
        <div className={isMobile ? "px-4" : ""}>
          <div className="flex justify-between items-center mb-4 md:mb-6">
            <h1 className={`${isMobile ? 'text-lg' : 'text-xl md:text-2xl'} font-bold`}>সকল পণ্য</h1>
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
                  className="bg-teal-600 hover:bg-teal-700 text-sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  নতুন পণ্য
                </Button>
              )}
            </div>
          </div>

          {/* Search and Filter */}
          <form onSubmit={handleSearch} className={`flex gap-2 ${isMobile ? 'mb-4' : 'mb-6'}`}>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="পণ্যের নাম বা কাস্টমারের নাম দিয়ে খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 text-sm"
              />
            </div>
            <Button
              type="submit"
              variant="outline"
              size="icon"
              className="border-gray-300"
            >
              <Search className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setFilterOpen(true)}
              className="border-gray-300"
            >
              <Filter className="w-4 h-4" />
            </Button>
          </form>

          {/* Table View */}
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
                data={products.map(formatProductData)}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
                onStatusChange={handleStatusChange}
                actionType="product"
                selectedIds={selectedIds}
                onSelectAll={handleSelectAll}
                onSelectOne={handleSelectOne}
              />
            </div>
          )}

          {/* Grid View */}
          {viewMode === "grid" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {products.map((product, index) => {
                const borderColors = [
                  "border-l-4 border-blue-400",
                  "border-l-4 border-purple-400",
                  "border-l-4 border-pink-400",
                  "border-l-4 border-orange-400",
                  "border-l-4 border-green-400",
                  "border-l-4 border-cyan-400",
                ];
                const borderClass = borderColors[index % borderColors.length];
                const remaining = (product.amount || 0) - (product.joma || 0);
                
                return (
                  <Card key={product.id} className={`bg-white ${borderClass} shadow-sm hover:shadow-md transition-all duration-200`}>
                    <CardHeader className="pb-1 px-3 pt-2">
                      <div className="flex justify-between items-start gap-2">
                        <CardTitle className="text-gray-800 text-sm font-semibold line-clamp-1 flex-1">{product.name}</CardTitle>
                        <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 whitespace-nowrap">
                          {product.id.substring(0, 8)}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="px-3 pb-2 pt-0 space-y-1.5">
                      <div>
                        <p className="text-gray-600 text-xs mb-0.5">{product.customerName}</p>
                        <p className="text-base font-bold text-gray-900">{product.amount ? `${product.amount} ৳` : "-"}</p>
                      </div>
                      <div className="border-t pt-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-gray-500">বাকি:</span>
                          <span className="font-semibold text-teal-600 text-xs">{remaining > 0 ? `${remaining} ৳` : "0 ৳"}</span>
                        </div>
                        <span className={`inline-block px-1.5 py-0.5 rounded text-xs font-medium ${
                          product.status === "delivered" 
                            ? "bg-green-50 text-green-700 border border-green-200" 
                            : product.status === "কাজ সম্পন্ন"
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : "bg-yellow-50 text-yellow-700 border border-yellow-200"
                        }`}>
                          {product.status === "delivered" ? "ডেলিভার করা হয়েছে" : product.status === "কাজ সম্পন্ন" ? "কাজ সম্পন্ন" : "পেন্ডিং"}
                        </span>
                      </div>
                      <p className="text-gray-500 text-xs">{new Date(product.createdAt).toLocaleDateString("bn-BD")}</p>
                      <div className="flex gap-1 pt-0.5">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdate(product.id)}
                          className="flex-1 text-xs h-6 border-gray-200 hover:bg-gray-50"
                        >
                          আপডেট
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusChange(product.id)}
                          className="flex-1 text-xs h-6 border-gray-200 hover:bg-gray-50"
                        >
                          স্ট্যাটাস
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(product.id)}
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

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <Button
                variant="outline"
                disabled={pagination.page === 1}
                asChild
              >
                <Link
                  href={`/products?${new URLSearchParams({
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
                  href={`/products?${new URLSearchParams({
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

      <AddProductModal open={addModalOpen} onOpenChange={setAddModalOpen} />
      <UpdateProductModal
        open={updateModalOpen}
        onOpenChange={setUpdateModalOpen}
        product={
          selectedProductId
            ? products.find((p) => p.id === selectedProductId)
            : null
        }
      />
      <FilterSidebar
        open={filterOpen}
        onOpenChange={setFilterOpen}
        onFilter={handleFilter}
        onDateFilter={handleDateFilter}
        activeFilters={activeFilters}
        onRemoveFilter={handleRemoveFilter}
      />
      <ProductStatusModal
        open={statusModalOpen}
        onOpenChange={setStatusModalOpen}
        product={
          selectedProductId
            ? products.find((p) => p.id === selectedProductId)
            : null
        }
      />
      <DeleteConfirmModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={confirmDelete}
        title="পণ্য মুছে ফেলুন"
        description={
          isMultipleDelete
            ? `আপনি কি ${selectedIds.length} টি পণ্য মুছে ফেলতে চান? এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।`
            : "আপনি কি এই পণ্য মুছে ফেলতে চান? এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।"
        }
        itemCount={isMultipleDelete ? selectedIds.length : 1}
        loading={deleteLoading}
      />
      {isMobile && <BottomNav />}
    </div>
  );
}

