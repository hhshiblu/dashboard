import DebtPage from "@/components/debt/debt";
import { Header } from "@/components/header";
import React from "react";

function page() {
  return (
    <div>
      <Header />
      <div className="md:max-w-7xl mx-auto">
        <DebtPage />
      </div>
    </div>
  );
}

export default page;
