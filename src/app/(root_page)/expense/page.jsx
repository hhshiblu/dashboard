import ExpensePage from "@/components/expense/expense";
import { Header } from "@/components/header";
import React from "react";

function page() {
  return (
    <div>
      <Header />
      <div className="md:max-w-7xl mx-auto">
        <ExpensePage />
      </div>
    </div>
  );
}

export default page;
