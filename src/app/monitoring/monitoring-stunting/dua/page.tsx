"use client";
import FaktorStunting from "@/components/Dropdowns/FaktorStunting";
import React from "react";

const Page: React.FC = () => {
  return (
    <div className="container mx-auto">
      <div className="mb-2">
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <h2 className="pb-1 text-2xl font-bold text-black">
            Faktor Stunting
          </h2>
          <p className="text-sm font-light text-gray-5">
            Untuk menambahkan informasi detail data Faktor Stunting
          </p>
        </div>
      </div>
      <FaktorStunting />
    </div>
  );
};

export default Page;
