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
import { Printer } from "lucide-react";

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
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [activeFilters, setActiveFilters] = useState({
    status: searchParams.get("status") || "",
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

  const handlePrint = (id) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;

    const currentDate = new Date().toLocaleDateString("bn-BD", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const remaining =
      (product.amount || 0) - (product.joma || 0) - (product.discount || 0);

    // Create a div for printing
    const printDiv = document.createElement("div");
    printDiv.id = "invoice-print-content";
    printDiv.style.position = "fixed";
    printDiv.style.left = "0";
    printDiv.style.top = "0";
    printDiv.style.width = "100%";
    printDiv.style.height = "100%";
    printDiv.style.background = "white";
    printDiv.style.zIndex = "99999";
    printDiv.style.overflow = "auto";
    printDiv.style.padding = "20px";
    printDiv.innerHTML = `
      <style>
        @page {
          size: A4;
          margin: 15mm;
        }
        * {
          page-break-inside: avoid;
        }
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          color: #333;
        }
        .invoice-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 10px;
          background: white;
          page-break-inside: avoid;
        }
          .header {
            text-align: center;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 2px solid #333;
          }
          .header h1 {
            font-size: 32px;
            font-weight: bold;
            margin: 0 0 5px 0;
            color: #000;
          }
          .header p {
            font-size: 16px;
            color: #666;
            margin: 0;
          }
          .invoice-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 15px;
            page-break-inside: avoid;
          }
          .invoice-info h2 {
            font-size: 20px;
            margin: 0 0 10px 0;
            color: #333;
          }
          .info-item {
            font-size: 13px;
            color: #666;
            margin: 3px 0;
          }
          .info-item span {
            font-weight: 600;
          }
          .customer-info {
            background: #f5f5f5;
            padding: 12px;
            border-radius: 6px;
            border: 1px solid #ddd;
            margin-bottom: 15px;
            page-break-inside: avoid;
          }
          .customer-info h3 {
            font-size: 16px;
            margin: 0 0 10px 0;
            color: #333;
          }
          .customer-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            font-size: 13px;
          }
          .customer-grid span {
            font-weight: 600;
          }
          .product-section {
            margin-bottom: 15px;
            page-break-inside: avoid;
          }
          .product-section h3 {
            font-size: 16px;
            margin: 0 0 10px 0;
            color: #333;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            border: 1px solid #ddd;
            border-radius: 6px;
            overflow: hidden;
          }
          thead {
            background: #f0f0f0;
          }
          th {
            padding: 8px;
            text-align: left;
            font-size: 13px;
            font-weight: 600;
            color: #333;
            border-bottom: 1px solid #ddd;
          }
          th:last-child {
            text-align: right;
          }
          td {
            padding: 8px;
            font-size: 13px;
            color: #333;
            border-bottom: 1px solid #ddd;
          }
          td:last-child {
            text-align: right;
          }
          .payment-summary {
            border: 1px solid #ddd;
            border-radius: 6px;
            padding: 12px;
            margin-bottom: 15px;
            page-break-inside: avoid;
          }
          .payment-summary h3 {
            font-size: 16px;
            margin: 0 0 10px 0;
            color: #333;
          }
          .payment-row {
            display: flex;
            justify-content: space-between;
            padding: 6px 0;
            border-bottom: 1px solid #eee;
            font-size: 13px;
          }
          .payment-row:last-child {
            border-bottom: none;
            background: #f5f5f5;
            padding: 10px;
            border-radius: 4px;
            margin-top: 8px;
          }
          .payment-row span:first-child {
            font-weight: 600;
            color: #333;
          }
          .payment-row span:last-child {
            font-weight: 700;
            font-size: 15px;
            color: #000;
          }
          .footer {
            text-align: center;
            margin-top: 15px;
            padding-top: 10px;
            border-top: 1px solid #ddd;
            font-size: 13px;
            color: #666;
            page-break-inside: avoid;
          }
          .footer p:last-child {
            margin-top: 5px;
            font-weight: 600;
            color: #333;
          }
          @media print {
            @page {
              margin: 15mm;
            }
            body {
              margin: 0;
              padding: 0;
            }
            .invoice-container {
              padding: 0;
              max-height: 100vh;
            }
            .header,
            .invoice-info,
            .customer-info,
            .product-section,
            .payment-summary,
            .footer {
              page-break-inside: avoid;
            }
          }
        </style>
        <div class="invoice-container">
          <div class="header">
            <h1>নাইম ইলেকট্রনিক্স</h1>
            <p>ইলেকট্রনিক্স পণ্য বিক্রয়</p>
          </div>

          <div class="invoice-info">
            <div>
              <h2>ইনভয়েস</h2>
              <div class="info-item">
                <span>ইনভয়েস নম্বর:</span> ${product.id
                  .substring(0, 8)
                  .toUpperCase()}
              </div>
              <div class="info-item">
                <span>তারিখ:</span> ${currentDate}
              </div>
            </div>
            <div>
              <div class="info-item">
                <span>স্ট্যাটাস:</span>
              </div>
              <div class="info-item" style="font-size: 16px; margin-top: 5px;">
                ${
                  product.status === "delivered"
                    ? "ডেলিভার করা হয়েছে"
                    : product.status === "কাজ সম্পন্ন"
                    ? "কাজ সম্পন্ন"
                    : "পেন্ডিং"
                }
              </div>
            </div>
          </div>

          <div class="customer-info">
            <h3>ক্রেতার তথ্য</h3>
            <div class="customer-grid">
              <div>
                <span>নাম:</span> ${product.customerName || "-"}
              </div>
              <div>
                <span>ফোন:</span> ${product.customerPhone || "-"}
              </div>
              ${
                product.customerAddress
                  ? `<div style="grid-column: 1 / -1;"><span>ঠিকানা:</span> ${product.customerAddress}</div>`
                  : ""
              }
            </div>
          </div>

          <div class="product-section">
            <h3>পণ্যের বিবরণ</h3>
            <table>
              <thead>
                <tr>
                  <th>বিবরণ</th>
                  <th>পরিমাণ</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div>
                      <strong>${product.name || "-"}</strong>
                      ${
                        product.type
                          ? `<div style="font-size: 12px; color: #666; margin-top: 5px;">টাইপ: ${product.type}</div>`
                          : ""
                      }
                    </div>
                  </td>
                  <td>${product.amount ? `${product.amount} ৳` : "-"}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="payment-summary">
            <h3>পেমেন্ট সারাংশ</h3>
            <div class="payment-row">
              <span>মোট টাকা:</span>
              <span>${product.amount ? `${product.amount} ৳` : "0 ৳"}</span>
            </div>
            <div class="payment-row">
              <span>জমা:</span>
              <span>${product.joma ? `${product.joma} ৳` : "0 ৳"}</span>
            </div>
            ${
              product.discount > 0
                ? `
            <div class="payment-row">
              <span>ছাড়:</span>
              <span>${product.discount} ৳</span>
            </div>
            `
                : ""
            }
            <div class="payment-row">
              <span>বাকি:</span>
              <span>${remaining > 0 ? `${remaining} ৳` : "0 ৳"}</span>
            </div>
          </div>

          <div class="footer">
            <p>ধন্যবাদান্তে</p>
            <p>নাইম ইলেকট্রনিক্স</p>
          </div>
        </div>
    `;

    // Add global print styles to hide everything except invoice
    const printStyle = document.createElement("style");
    printStyle.id = "invoice-print-style";
    printStyle.textContent = `
      @media print {
        @page {
          size: A4;
          margin: 15mm;
        }
        body * {
          visibility: hidden !important;
        }
        #invoice-print-content {
          visibility: visible !important;
          position: fixed !important;
          left: 0 !important;
          top: 0 !important;
          width: 100% !important;
          height: 100% !important;
          background: white !important;
          z-index: 9999 !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        #invoice-print-content * {
          visibility: visible !important;
        }
      }
    `;
    document.head.appendChild(printStyle);

    // Make the div visible but off-screen for screen view
    printDiv.style.position = "fixed";
    printDiv.style.left = "0";
    printDiv.style.top = "0";
    printDiv.style.width = "100%";
    printDiv.style.height = "100%";
    printDiv.style.background = "white";
    printDiv.style.zIndex = "9999";
    printDiv.style.overflow = "auto";

    // Append to body and trigger print
    document.body.appendChild(printDiv);

    // Wait a bit for content to render, then print
    setTimeout(() => {
      window.print();
      // Remove the div and style after printing
      setTimeout(() => {
        if (document.body.contains(printDiv)) {
          document.body.removeChild(printDiv);
        }
        const styleEl = document.getElementById("invoice-print-style");
        if (styleEl) {
          document.head.removeChild(styleEl);
        }
      }, 100);
    }, 200);
  };

  const handleFilter = (filters) => {
    const params = new URLSearchParams(searchParams);
    if (filters.deliveryStatus) {
      params.set("status", filters.deliveryStatus);
      setActiveFilters((prev) => ({ ...prev, status: filters.deliveryStatus }));
    } else {
      params.delete("status");
      setActiveFilters((prev) => ({ ...prev, status: "" }));
    }
    params.set("page", "1");
    router.replace(`/products?${params.toString()}`);
  };

  const handleDateFilter = (dateFilter) => {
    const params = new URLSearchParams(searchParams);
    if (dateFilter) {
      params.set("dateFilter", dateFilter);
      setActiveFilters((prev) => ({ ...prev, dateFilter }));
    } else {
      params.delete("dateFilter");
      setActiveFilters((prev) => ({ ...prev, dateFilter: "" }));
    }
    params.set("page", "1");
    router.replace(`/products?${params.toString()}`);
  };

  const handleRemoveFilter = (filterType) => {
    const params = new URLSearchParams(searchParams);
    if (filterType === "status") {
      params.delete("status");
      setActiveFilters((prev) => ({ ...prev, status: "" }));
    } else if (filterType === "dateFilter") {
      params.delete("dateFilter");
      setActiveFilters((prev) => ({ ...prev, dateFilter: "" }));
    }
    params.set("page", "1");
    router.replace(`/products?${params.toString()}`);
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds(products.map((p) => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id, checked) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
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
    { key: "type", label: "প্রোডাক্ট টাইপ" },
    { key: "customerName", label: "কাস্টমার" },
    { key: "amount", label: "মূল্য" },
    { key: "joma", label: "জমা" },
    { key: "discount", label: "ছাড়" },
    { key: "status", label: "স্ট্যাটাস" },
  ];

  const formatProductData = (product) => ({
    fullId: product.id, // Keep full ID for actions
    name: product.name,
    type: product.type || "-",
    customerName: product.customerName,
    amount: product.amount ? `${product.amount} ৳` : "-",
    joma: product.joma ? `${product.joma} ৳` : "0 ৳",
    discount: product.discount ? `${product.discount} ৳` : "0 ৳",
    status:
      product.status === "delivered"
        ? "ডেলিভার করা হয়েছে"
        : product.status === "কাজ সম্পন্ন"
        ? "কাজ সম্পন্ন"
        : "পেন্ডিং",
    originalStatus: product.status, // Keep original status for checking
    date: new Date(product.createdAt).toLocaleDateString("bn-BD"),
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <main className={isMobile ? "pb-20 px-0" : "px-4 py-6"}>
        <div className={isMobile ? "px-2 py-2" : ""}>
          <div className="flex justify-between items-center mb-4 md:mb-6">
            <h1
              className={`${
                isMobile ? "text-lg" : "text-xl md:text-2xl"
              } font-bold`}
            >
              সকল পণ্য
            </h1>
            <div className="flex gap-2">
              <div className="flex border rounded-lg">
                <Button
                  type="button"
                  variant={viewMode === "table" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("table")}
                  className={`cursor-pointer ${
                    viewMode === "table" ? "bg-teal-600 hover:bg-teal-700" : ""
                  }`}
                >
                  <Table2 className="w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  className={`cursor-pointer ${
                    viewMode === "grid" ? "bg-teal-600 hover:bg-teal-700" : ""
                  }`}
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
                  নতুন পণ্য
                </Button>
              )}
            </div>
          </div>

          {/* Search and Filter */}
          <form
            onSubmit={handleSearch}
            className={`flex gap-2 ${isMobile ? "mb-4" : "mb-6"}`}
          >
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
              className="border-gray-300 cursor-pointer"
            >
              <Search className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setFilterOpen(true)}
              className="border-gray-300 cursor-pointer"
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
                    className="text-xs h-7 cursor-pointer"
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
                onPrint={handlePrint}
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
                const remaining =
                  (product.amount || 0) -
                  (product.joma || 0) -
                  (product.discount || 0);
                const isDelivered = product.status === "delivered";

                return (
                  <Card
                    key={product.id}
                    className={`bg-white ${borderClass} shadow-sm hover:shadow-md transition-all duration-200`}
                  >
                    <CardHeader className="pb-1 px-3 pt-2">
                      <div className="flex justify-between items-start gap-2">
                        <CardTitle className="text-gray-800 text-sm font-semibold line-clamp-1 flex-1">
                          {product.name}
                        </CardTitle>
                        <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 whitespace-nowrap">
                          {product.id.substring(0, 8)}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="px-3 pb-2 pt-0 space-y-1.5">
                      <div>
                        <p className="text-gray-600 text-xs mb-0.5">
                          {product.customerName}
                        </p>
                        {product.type && (
                          <p className="text-gray-500 text-xs mb-0.5">
                            {product.type}
                          </p>
                        )}
                        <p className="text-base font-bold text-gray-900">
                          {product.amount ? `${product.amount} ৳` : "-"}
                        </p>
                      </div>
                      <div className="border-t pt-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-gray-500">বাকি:</span>
                          <span className="font-semibold text-teal-600 text-xs">
                            {remaining > 0 ? `${remaining} ৳` : "0 ৳"}
                          </span>
                        </div>
                        {product.discount > 0 && (
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-gray-500">ছাড়:</span>
                            <span className="font-semibold text-orange-600 text-xs">
                              {product.discount} ৳
                            </span>
                          </div>
                        )}
                        <span
                          className={`inline-block px-1.5 py-0.5 rounded text-xs font-medium ${
                            product.status === "delivered"
                              ? "bg-green-50 text-green-700 border border-green-200"
                              : product.status === "কাজ সম্পন্ন"
                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                              : "bg-yellow-50 text-yellow-700 border border-yellow-200"
                          }`}
                        >
                          {product.status === "delivered"
                            ? "ডেলিভার করা হয়েছে"
                            : product.status === "কাজ সম্পন্ন"
                            ? "কাজ সম্পন্ন"
                            : "পেন্ডিং"}
                        </span>
                      </div>
                      <p className="text-gray-500 text-xs">
                        {new Date(product.createdAt).toLocaleDateString(
                          "bn-BD"
                        )}
                      </p>
                      <div className="flex gap-1 pt-0.5">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdate(product.id)}
                          disabled={isDelivered}
                          className={`flex-1 text-xs h-6 border-gray-200 cursor-pointer ${
                            isDelivered
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          আপডেট
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusChange(product.id)}
                          disabled={isDelivered}
                          className={`flex-1 text-xs h-6 border-gray-200 cursor-pointer ${
                            isDelivered
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          স্ট্যাটাস
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handlePrint(product.id)}
                          className="text-xs h-6 px-2 border-gray-200 hover:bg-gray-50 cursor-pointer"
                          title="প্রিন্ট করুন"
                        >
                          <Printer className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(product.id)}
                          className="text-red-600 border-red-200 hover:bg-red-50 text-xs h-6 px-2 cursor-pointer"
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
                className="cursor-pointer"
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
                className="cursor-pointer"
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
