import { BottomNav } from "@/components/bottom-nav";
import { Header } from "@/components/header";
import ProductsPage from "@/components/products/products";
import React from "react";

function page() {
  return (
    <div>
      <Header />
      <div className="md:max-w-7xl mx-auto">
        <ProductsPage />
      </div>
      {/* <BottomNav /> */}
    </div>
  );
}

export default page;
