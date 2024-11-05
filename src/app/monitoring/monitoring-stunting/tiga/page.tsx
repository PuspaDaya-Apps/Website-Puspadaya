"use client";
import React from "react";
import DropdownIntervensi from "@/components/Dropdowns/DropdownIntervensi";

const Page: React.FC = () => {
  return (
    <div className="container mx-auto">
      <div className="mb-2">
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <h2 className="pb-1 text-2xl font-bold text-black">
            Intervensi Pemberian Makanan Tambahan
          </h2>
          <p className="text-sm font-light text-gray-5">
            Riwayat pemberian detail intervensi
          </p>
        </div>
      </div>
      <DropdownIntervensi />
    </div>
  );
};

export default Page;
