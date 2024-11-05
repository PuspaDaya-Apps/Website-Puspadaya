"use client";
import DetailRiwayatIbuHamil from "@/components/DetailRiwayatIbuHamil/DetailRiwayatIbuHamil";
import React from "react";

const Page: React.FC = () => {
  return (
    <div className="container mx-auto">
      <div className="mb-4">
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <h2 className="pb-1 text-2xl font-bold text-black">
            Detail Monitoring Ibu Hamil
          </h2>
          <p className="text-sm font-light text-gray-500">
            Menampilkan iinformasi lengkap mengenai hasil pengukuran dan perkembangan kesehatan ibu selama kehamilan
          </p>
        </div>
      </div>
      <DetailRiwayatIbuHamil />
    </div>
  );
};

export default Page;
