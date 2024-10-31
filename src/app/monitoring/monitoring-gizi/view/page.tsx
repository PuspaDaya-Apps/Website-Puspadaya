"use client";
import DetailRiwayatBalita from "@/components/Detail Riwayat Balita/DetailRiwayatBalita";
import React from "react";

const Page: React.FC = () => {
  return (
    <div className="container mx-auto">
      <div className="mb-4">
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <h2 className="pb-1 text-2xl font-bold text-black">
            Detail Monitoring Gizi Balita
          </h2>
          <p className="text-sm font-light text-gray-500">
            Menampilkan informasi lengkap mengenai hasil status gizi dan tumbuh kembang balita
          </p>
        </div>
      </div>
      <DetailRiwayatBalita />
    </div>
  );
};

export default Page;
