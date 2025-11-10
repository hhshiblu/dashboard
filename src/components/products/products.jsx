// "use client";

// import { useState } from "react";
// import { Header } from "@/components/header";
// import { BottomNav } from "@/components/bottom-nav";
// import { useIsMobile } from "@/hooks/use-mobile";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { DataTable } from "@/components/data-table";
// import { FilterSidebar } from "@/components/filter-sidebar";
// import { AddProductModal } from "@/components/modals/add-product-modal";
// import { UpdateProductModal } from "@/components/modals/update-product-modal";
// import { StatusUpdateModal } from "@/components/modals/status-update-modal";
// import { Plus, Search, Filter } from "lucide-react";

// const dummyProducts = [
//   {
//     id: "001",
//     name: "পণ্য ১",
//     quantity: 10,
//     price: 500,
//     date: "२०२५-०१-१५",
//     status: "pending",
//     totalAmount: 500,
//     deliveredAmount: 0,
//     customerName: "রহিম",
//     customerAddress: "ঢাকা",
//     customerPhone: "01712345678",
//   },
//   {
//     id: "002",
//     name: "পণ্য ২",
//     quantity: 5,
//     price: 1000,
//     date: "२०२५-०१-१६",
//     status: "delivered",
//     totalAmount: 1000,
//     deliveredAmount: 1000,
//     customerName: "করিম",
//     customerAddress: "চট্টগ্রাম",
//     customerPhone: "01812345678",
//   },
//   {
//     id: "003",
//     name: "পণ্য ৩",
//     quantity: 8,
//     price: 750,
//     date: "२०२५-०१-१७",
//     status: "pending",
//     totalAmount: 750,
//     deliveredAmount: 0,
//     customerName: "আলী",
//     customerAddress: "সিলেট",
//     customerPhone: "01912345678",
//   },
//   {
//     id: "004",
//     name: "পণ্য ৪",
//     quantity: 12,
//     price: 600,
//     date: "२०२५-०१-१८",
//     status: "delivered",
//     totalAmount: 600,
//     deliveredAmount: 600,
//     customerName: "ফারুক",
//     customerAddress: "খুলনা",
//     customerPhone: "01612345678",
//   },
//   {
//     id: "005",
//     name: "পণ্য ৫",
//     quantity: 7,
//     price: 900,
//     date: "२०२५-०१-१९",
//     status: "pending",
//     totalAmount: 900,
//     deliveredAmount: 0,
//     customerName: "সালিম",
//     customerAddress: "রাজশাহী",
//     customerPhone: "01512345678",
//   },
// ];

// export default function ProductsPage() {
//   const isMobile = useIsMobile();
//   const [searchQuery, setSearchQuery] = useState("");
//   const [addModalOpen, setAddModalOpen] = useState(false);
//   const [updateModalOpen, setUpdateModalOpen] = useState(false);
//   const [filterOpen, setFilterOpen] = useState(false);
//   const [statusModalOpen, setStatusModalOpen] = useState(false);
//   const [selectedProductId, setSelectedProductId] = useState(null);
//   const [products, setProducts] = useState(dummyProducts);
//   const [filters, setFilters] = useState({
//     deliveryStatus: "",
//     priceRange: { min: "", max: "" },
//   });
//   const [dateFilter, setDateFilter] = useState(null);

//   const filteredProducts = products.filter((p) => {
//     const matchesSearch =
//       p.id.includes(searchQuery) ||
//       p.name.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesStatus =
//       !filters.deliveryStatus || p.status === filters.deliveryStatus;
//     const matchesPrice =
//       (!filters.priceRange.min ||
//         p.price >= Number.parseInt(filters.priceRange.min)) &&
//       (!filters.priceRange.max ||
//         p.price <= Number.parseInt(filters.priceRange.max));

//     let matchesDate = true;
//     if (dateFilter === "oneMonth") {
//       const productDate = new Date(p.date);
//       const oneMonthAgo = new Date();
//       oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
//       matchesDate = productDate <= oneMonthAgo;
//     }

//     return matchesSearch && matchesStatus && matchesPrice && matchesDate;
//   });

//   const columns = [
//     { key: "id", label: "আইডি" },
//     { key: "name", label: "পণ্যের নাম" },
//     { key: "quantity", label: "পরিমাণ" },
//     { key: "price", label: "মূল্য" },
//     { key: "date", label: "তারিখ" },
//     { key: "status", label: "স্ট্যাটাস" },
//   ];

//   const handlePrint = (id) => {
//     const product = products.find((p) => p.id === id);
//     if (product) {
//       const remaining = product.totalAmount - product.deliveredAmount;
//       const invoiceContent = `
//         <!DOCTYPE html>
//         <html>
//         <head>
//           <meta charset="UTF-8">
//           <style>
//             body { font-family: Arial, sans-serif; margin: 20px; }
//             .invoice-container { max-width: 600px; margin: 0 auto; border: 2px solid #0066cc; padding: 20px; }
//             .header { text-align: center; border-bottom: 2px solid #0066cc; padding-bottom: 15px; margin-bottom: 20px; }
//             .header h1 { margin: 0; color: #0066cc; font-size: 28px; }
//             .header p { margin: 5px 0; color: #666; }
//             .details { margin: 20px 0; }
//             .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
//             .detail-label { font-weight: bold; color: #333; }
//             .detail-value { color: #666; }
//             .amount-section { background: #f5f5f5; padding: 15px; margin: 20px 0; border-radius: 5px; }
//             .amount-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; }
//             .total-row { display: flex; justify-content: space-between; padding: 10px 0; border-top: 2px solid #0066cc; font-weight: bold; font-size: 16px; color: #0066cc; }
//             .footer { text-align: center; margin-top: 30px; padding-top: 15px; border-top: 1px solid #eee; color: #999; font-size: 12px; }
//           </style>
//         </head>
//         <body>
//           <div class="invoice-container">
//             <div class="header">
//               <h1>ইনভয়েস</h1>
//               <p>পণ্য ডেলিভারি সিস্টেম</p>
//             </div>

//             <div class="details">
//               <div class="detail-row">
//                 <span class="detail-label">ইনভয়েস নম্বর:</span>
//                 <span class="detail-value">${product.id}</span>
//               </div>
//               <div class="detail-row">
//                 <span class="detail-label">পণ্যের নাম:</span>
//                 <span class="detail-value">${product.name}</span>
//               </div>
//               <div class="detail-row">
//                 <span class="detail-label">পরিমাণ:</span>
//                 <span class="detail-value">${product.quantity} টি</span>
//               </div>
//               <div class="detail-row">
//                 <span class="detail-label">তারিখ:</span>
//                 <span class="detail-value">${product.date}</span>
//               </div>
//               <div class="detail-row">
//                 <span class="detail-label">স্ট্যাটাস:</span>
//                 <span class="detail-value">${
//                   product.status === "delivered"
//                     ? "ডেলিভার করা হয়েছে"
//                     : "পেন্ডিং"
//                 }</span>
//               </div>
//             </div>

//             <div class="amount-section">
//               <div class="amount-row">
//                 <span>মোট পরিমাণ:</span>
//                 <span>${product.totalAmount} ৳</span>
//               </div>
//               <div class="amount-row">
//                 <span>ডেলিভার করা হয়েছে:</span>
//                 <span>${product.deliveredAmount} ৳</span>
//               </div>
//               <div class="amount-row">
//                 <span>বাকি পরিমাণ:</span>
//                 <span>${remaining} ৳</span>
//               </div>
//               <div class="total-row">
//                 <span>মোট বাকি:</span>
//                 <span>${remaining} ৳</span>
//               </div>
//             </div>

//             <div class="footer">
//               <p>এই ইনভয়েস প্রিন্ট করা হয়েছে: ${new Date().toLocaleDateString(
//                 "bn-BD"
//               )}</p>
//             </div>
//           </div>
//         </body>
//         </html>
//       `;
//       const printWindow = window.open("", "", "width=800,height=600");
//       if (printWindow) {
//         printWindow.document.write(invoiceContent);
//         printWindow.print();
//       }
//     }
//   };

//   const handleDelete = (id) => {
//     setProducts(products.filter((p) => p.id !== id));
//   };

//   const handleUpdate = (id) => {
//     setSelectedProductId(id);
//     setUpdateModalOpen(true);
//   };

//   const handleUpdateSubmit = (data) => {
//     if (selectedProductId) {
//       setProducts(
//         products.map((p) => {
//           if (p.id === selectedProductId) {
//             return { ...p, ...data };
//           }
//           return p;
//         })
//       );
//       setUpdateModalOpen(false);
//       setSelectedProductId(null);
//     }
//   };

//   const handleStatusUpdate = (amount, bakiSeash) => {
//     if (selectedProductId) {
//       setProducts(
//         products.map((p) => {
//           if (p.id === selectedProductId) {
//             const newDeliveredAmount = p.deliveredAmount + amount;
//             let remaining = p.totalAmount - newDeliveredAmount;
//             if (bakiSeash) {
//               remaining -= bakiSeash;
//             }
//             return {
//               ...p,
//               deliveredAmount: newDeliveredAmount,
//               status: remaining <= 0 ? "delivered" : "pending",
//             };
//           }
//           return p;
//         })
//       );
//       setStatusModalOpen(false);
//       setSelectedProductId(null);
//     }
//   };

//   const handleStatusChange = (id) => {
//     setSelectedProductId(id);
//     setStatusModalOpen(true);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Header />

//       <main className={isMobile ? "pb-24 px-0" : "px-4 py-6"}>
//         <div className={isMobile ? "px-4" : ""}>
//           <div className="flex justify-between items-center mb-6">
//             <h1 className="text-xl md:text-2xl font-bold">সকল পণ্য</h1>
//             {!isMobile && (
//               <Button
//                 onClick={() => setAddModalOpen(true)}
//                 className="bg-teal-600 hover:bg-teal-700 text-sm"
//               >
//                 <Plus className="w-4 h-4 mr-2" />
//                 নতুন পণ্য
//               </Button>
//             )}
//           </div>

//           {/* Search and Filter */}
//           <div className="flex gap-2 mb-6">
//             <div className="relative flex-1">
//               <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
//               <Input
//                 placeholder="পণ্য নম্বর দিয়ে খুঁজুন..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="pl-10 text-sm"
//               />
//             </div>
//             <Button
//               variant="outline"
//               size="icon"
//               onClick={() => setFilterOpen(true)}
//               className="border-gray-300"
//             >
//               <Filter className="w-4 h-4" />
//             </Button>
//           </div>

//           {/* Data Table */}
//           <div className={isMobile ? "border-0" : "border rounded-lg"}>
//             <DataTable
//               columns={columns}
//               data={filteredProducts}
//               onPrint={handlePrint}
//               onDelete={handleDelete}
//               onUpdate={handleUpdate}
//               onStatusChange={handleStatusChange}
//               actionType="product"
//             />
//           </div>
//         </div>
//       </main>

//       {isMobile && (
//         <>
//           <BottomNav />
//           <Button
//             onClick={() => setAddModalOpen(true)}
//             className="fixed bottom-24 right-4 rounded-full w-14 h-14 bg-teal-600 hover:bg-teal-700 shadow-lg"
//           >
//             <Plus className="w-6 h-6" />
//           </Button>
//         </>
//       )}

//       <AddProductModal open={addModalOpen} onOpenChange={setAddModalOpen} />
//       <UpdateProductModal
//         open={updateModalOpen}
//         onOpenChange={setUpdateModalOpen}
//         onUpdate={handleUpdateSubmit}
//         product={
//           selectedProductId
//             ? products.find((p) => p.id === selectedProductId)
//             : null
//         }
//       />
//       <FilterSidebar
//         open={filterOpen}
//         onOpenChange={setFilterOpen}
//         onFilter={setFilters}
//         onDateFilter={setDateFilter}
//       />
//       <StatusUpdateModal
//         open={statusModalOpen}
//         onOpenChange={setStatusModalOpen}
//         onUpdate={handleStatusUpdate}
//         product={
//           selectedProductId
//             ? products.find((p) => p.id === selectedProductId)
//             : null
//         }
//       />
//     </div>
//   );
// }
"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { BottomNav } from "@/components/bottom-nav";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/data-table";
import { FilterSidebar } from "@/components/filter-sidebar";
import { AddProductModal } from "@/components/modals/add-product-modal";
import { UpdateProductModal } from "@/components/modals/update-product-modal";
import { StatusUpdateModal } from "@/components/modals/status-update-modal";
import { Plus, Search, Filter } from "lucide-react";

const dummyProducts = [
  {
    id: "001",
    name: "পণ্য ১",
    quantity: 10,
    price: 500,
    date: "२०२५-०१-१५",
    status: "pending",
    totalAmount: 500,
    deliveredAmount: 0,
    customerName: "রহিম",
    customerAddress: "ঢাকা",
    customerPhone: "01712345678",
  },
  {
    id: "002",
    name: "পণ্য ২",
    quantity: 5,
    price: 1000,
    date: "२०२५-०१-१६",
    status: "delivered",
    totalAmount: 1000,
    deliveredAmount: 1000,
    customerName: "করিম",
    customerAddress: "চট্টগ্রাম",
    customerPhone: "01812345678",
  },
  {
    id: "003",
    name: "পণ্য ৩",
    quantity: 8,
    price: 750,
    date: "२०२५-०१-१७",
    status: "pending",
    totalAmount: 750,
    deliveredAmount: 0,
    customerName: "আলী",
    customerAddress: "সিলেট",
    customerPhone: "01912345678",
  },
  {
    id: "004",
    name: "পণ্য ৪",
    quantity: 12,
    price: 600,
    date: "२०२५-०१-१८",
    status: "delivered",
    totalAmount: 600,
    deliveredAmount: 600,
    customerName: "ফারুক",
    customerAddress: "খুলনা",
    customerPhone: "01612345678",
  },
  {
    id: "005",
    name: "পণ্য ৫",
    quantity: 7,
    price: 900,
    date: "२०२५-०१-१९",
    status: "pending",
    totalAmount: 900,
    deliveredAmount: 0,
    customerName: "সালিম",
    customerAddress: "রাজশাহী",
    customerPhone: "01512345678",
  },
];

export default function Page() {
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState("");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [products, setProducts] = useState(dummyProducts);
  const [filters, setFilters] = useState({
    deliveryStatus: "",
    priceRange: { min: "", max: "" },
  });
  const [dateFilter, setDateFilter] = useState(null);

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.id.includes(searchQuery) ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      !filters.deliveryStatus || p.status === filters.deliveryStatus;
    const matchesPrice =
      (!filters.priceRange.min ||
        p.price >= Number.parseInt(filters.priceRange.min)) &&
      (!filters.priceRange.max ||
        p.price <= Number.parseInt(filters.priceRange.max));

    let matchesDate = true;
    if (dateFilter === "oneMonth") {
      const productDate = new Date(p.date);
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      matchesDate = productDate <= oneMonthAgo;
    }

    return matchesSearch && matchesStatus && matchesPrice && matchesDate;
  });

  const columns = [
    { key: "id", label: "আইডি" },
    { key: "name", label: "পণ্যের নাম" },
    { key: "quantity", label: "পরিমাণ" },
    { key: "price", label: "মূল্য" },
    { key: "date", label: "তারিখ" },
    { key: "status", label: "স্ট্যাটাস" },
  ];

  const handlePrint = (id) => {
    const product = products.find((p) => p.id === id);
    if (product) {
      const remaining = product.totalAmount - product.deliveredAmount;
      const invoiceContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .invoice-container { max-width: 600px; margin: 0 auto; border: 2px solid #0066cc; padding: 20px; }
            .header { text-align: center; border-bottom: 2px solid #0066cc; padding-bottom: 15px; margin-bottom: 20px; }
            .header h1 { margin: 0; color: #0066cc; font-size: 28px; }
            .header p { margin: 5px 0; color: #666; }
            .details { margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
            .detail-label { font-weight: bold; color: #333; }
            .detail-value { color: #666; }
            .amount-section { background: #f5f5f5; padding: 15px; margin: 20px 0; border-radius: 5px; }
            .amount-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; }
            .total-row { display: flex; justify-content: space-between; padding: 10px 0; border-top: 2px solid #0066cc; font-weight: bold; font-size: 16px; color: #0066cc; }
            .footer { text-align: center; margin-top: 30px; padding-top: 15px; border-top: 1px solid #eee; color: #999; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <div class="header">
              <h1>ইনভয়েস</h1>
              <p>পণ্য ডেলিভারি সিস্টেম</p>
            </div>
            
            <div class="details">
              <div class="detail-row">
                <span class="detail-label">ইনভয়েস নম্বর:</span>
                <span class="detail-value">${product.id}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">পণ্যের নাম:</span>
                <span class="detail-value">${product.name}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">পরিমাণ:</span>
                <span class="detail-value">${product.quantity} টি</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">তারিখ:</span>
                <span class="detail-value">${product.date}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">স্ট্যাটাস:</span>
                <span class="detail-value">${
                  product.status === "delivered"
                    ? "ডেলিভার করা হয়েছে"
                    : "পেন্ডিং"
                }</span>
              </div>
            </div>

            <div class="amount-section">
              <div class="amount-row">
                <span>মোট পরিমাণ:</span>
                <span>${product.totalAmount} ৳</span>
              </div>
              <div class="amount-row">
                <span>ডেলিভার করা হয়েছে:</span>
                <span>${product.deliveredAmount} ৳</span>
              </div>
              <div class="amount-row">
                <span>বাকি পরিমাণ:</span>
                <span>${remaining} ৳</span>
              </div>
              <div class="total-row">
                <span>মোট বাকি:</span>
                <span>${remaining} ৳</span>
              </div>
            </div>

            <div class="footer">
              <p>এই ইনভয়েস প্রিন্ট করা হয়েছে: ${new Date().toLocaleDateString(
                "bn-BD"
              )}</p>
            </div>
          </div>
        </body>
        </html>
      `;
      const printWindow = window.open("", "", "width=800,height=600");
      if (printWindow) {
        printWindow.document.write(invoiceContent);
        printWindow.print();
      }
    }
  };

  const handleDelete = (id) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const handleUpdate = (id) => {
    setSelectedProductId(id);
    setUpdateModalOpen(true);
  };

  const handleUpdateSubmit = (data) => {
    if (selectedProductId) {
      setProducts(
        products.map((p) => {
          if (p.id === selectedProductId) {
            return { ...p, ...data };
          }
          return p;
        })
      );
      setUpdateModalOpen(false);
      setSelectedProductId(null);
    }
  };

  const handleStatusUpdate = (amount, bakiSeash) => {
    if (selectedProductId) {
      setProducts(
        products.map((p) => {
          if (p.id === selectedProductId) {
            const newDeliveredAmount = p.deliveredAmount + amount;
            let remaining = p.totalAmount - newDeliveredAmount;
            if (bakiSeash) {
              remaining -= bakiSeash;
            }
            return {
              ...p,
              deliveredAmount: newDeliveredAmount,
              status: remaining <= 0 ? "delivered" : "pending",
            };
          }
          return p;
        })
      );
      setStatusModalOpen(false);
      setSelectedProductId(null);
    }
  };

  const handleStatusChange = (id) => {
    setSelectedProductId(id);
    setStatusModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className={isMobile ? "pb-24 px-0" : "px-4 py-6"}>
        <div className={isMobile ? "px-4" : ""}>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl md:text-2xl font-bold">সকল পণ্য</h1>
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

          {/* Search and Filter */}
          <div className="flex gap-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="পণ্য নম্বর দিয়ে খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 text-sm"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setFilterOpen(true)}
              className="border-gray-300"
            >
              <Filter className="w-4 h-4" />
            </Button>
          </div>

          {/* Data Table */}
          <div className={isMobile ? "border-0" : "border rounded-lg"}>
            <DataTable
              columns={columns}
              data={filteredProducts}
              onPrint={handlePrint}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
              onStatusChange={handleStatusChange}
              actionType="product"
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

      <AddProductModal open={addModalOpen} onOpenChange={setAddModalOpen} />
      <UpdateProductModal
        open={updateModalOpen}
        onOpenChange={setUpdateModalOpen}
        onUpdate={handleUpdateSubmit}
        product={
          selectedProductId
            ? products.find((p) => p.id === selectedProductId)
            : null
        }
      />
      <FilterSidebar
        open={filterOpen}
        onOpenChange={setFilterOpen}
        onFilter={setFilters}
        onDateFilter={setDateFilter}
      />
      <StatusUpdateModal
        open={statusModalOpen}
        onOpenChange={setStatusModalOpen}
        onUpdate={handleStatusUpdate}
        product={
          selectedProductId
            ? products.find((p) => p.id === selectedProductId)
            : null
        }
      />
    </div>
  );
}
