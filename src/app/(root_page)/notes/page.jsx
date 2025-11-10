import React from "react";
import NotesPage from "@/components/notes/notes";
import { Header } from "@/components/header";
import { BottomNav } from "@/components/bottom-nav";

function page() {
  return (
    <div>
      <Header />
      <div className="md:max-w-7xl mx-auto">
        <NotesPage />
      </div>
    </div>
  );
}

export default page;
