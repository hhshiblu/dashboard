"use client";

import { useEffect, useRef } from "react";

export function InvoicePrint({ product, onClose }) {
  const printRef = useRef(null);

  useEffect(() => {
    // Wait for component to render, then trigger print
    const timer = setTimeout(() => {
      if (printRef.current) {
        window.print();
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  if (!product) return null;

  const currentDate = new Date().toLocaleDateString("bn-BD", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const remaining = (product.amount || 0) - (product.joma || 0) - (product.discount || 0);

  return (
    <>
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 20mm;
          }
          body * {
            visibility: hidden;
          }
          .invoice-print-wrapper,
          .invoice-print-wrapper * {
            visibility: visible;
          }
          .invoice-print-wrapper {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white;
          }
          .no-print {
            display: none !important;
          }
        }
        @media screen {
          .invoice-print-wrapper {
            display: block;
          }
        }
      `}</style>
      <div className="fixed inset-0 z-50 bg-white overflow-auto print:relative print:z-auto">
        <div className="flex justify-end p-4 no-print">
          <button
            onClick={() => onClose?.()}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
          >
            বন্ধ করুন
          </button>
        </div>
        <div ref={printRef} className="invoice-print-wrapper max-w-4xl mx-auto bg-white p-8">
          {/* Header */}
          <div className="text-center mb-8 border-b-2 border-gray-800 pb-4">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">নাইম ইলেকট্রনিক্স</h1>
            <p className="text-lg text-gray-600">ইলেকট্রনিক্স পণ্য বিক্রয়</p>
          </div>

          {/* Invoice Info */}
          <div className="mb-6 flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">ইনভয়েস</h2>
              <div className="space-y-1 text-sm text-gray-600">
                <p><span className="font-medium">ইনভয়েস নম্বর:</span> {product.id.substring(0, 8).toUpperCase()}</p>
                <p><span className="font-medium">তারিখ:</span> {currentDate}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="space-y-1 text-sm text-gray-600">
                <p className="font-medium text-gray-800">স্ট্যাটাস:</p>
                <p className="text-base">
                  {product.status === "delivered"
                    ? "ডেলিভার করা হয়েছে"
                    : product.status === "কাজ সম্পন্ন"
                    ? "কাজ সম্পন্ন"
                    : "পেন্ডিং"}
                </p>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">ক্রেতার তথ্য</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-600"><span className="font-medium">নাম:</span> {product.customerName || "-"}</p>
              </div>
              <div>
                <p className="text-gray-600"><span className="font-medium">ফোন:</span> {product.customerPhone || "-"}</p>
              </div>
              {product.customerAddress && (
                <div className="col-span-2">
                  <p className="text-gray-600"><span className="font-medium">ঠিকানা:</span> {product.customerAddress}</p>
                </div>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">পণ্যের বিবরণ</h3>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">বিবরণ</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 border-b">পরিমাণ</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="px-4 py-3 text-sm text-gray-700">
                      <div>
                        <p className="font-medium">{product.name || "-"}</p>
                        {product.type && (
                          <p className="text-xs text-gray-500 mt-1">টাইপ: {product.type}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-gray-700">
                      {product.amount ? `${product.amount} ৳` : "-"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">পেমেন্ট সারাংশ</h3>
            <div className="border border-gray-300 rounded-lg p-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-700 font-medium">মোট টাকা:</span>
                  <span className="text-gray-900 font-semibold text-base">{product.amount ? `${product.amount} ৳` : "0 ৳"}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-700 font-medium">জমা:</span>
                  <span className="text-gray-900 font-semibold text-base">{product.joma ? `${product.joma} ৳` : "0 ৳"}</span>
                </div>
                {product.discount > 0 && (
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-700 font-medium">ছাড়:</span>
                    <span className="text-gray-900 font-semibold text-base">{product.discount} ৳</span>
                  </div>
                )}
                <div className="flex justify-between items-center py-2 bg-gray-50 rounded mt-2">
                  <span className="text-gray-800 font-bold text-base">বাকি:</span>
                  <span className="text-gray-900 font-bold text-lg">{remaining > 0 ? `${remaining} ৳` : "0 ৳"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-4 border-t border-gray-300 text-center text-sm text-gray-600">
            <p>ধন্যবাদান্তে</p>
            <p className="mt-2 font-medium">নাইম ইলেকট্রনিক্স</p>
          </div>
        </div>
      </div>
    </>
  );
}

