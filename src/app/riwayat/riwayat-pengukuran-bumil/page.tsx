import DetailRiwayatIbuHamil from "@/components/DetailRiwayatIbuHamil/DetailRiwayatIbuHamil";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Monitoring | Parameter Stunting",
  description: "This is Next.js Tables page for NextAdmin Dashboard Kit",
};

const Page: React.FC = () => {
  return (
    <div className="container mx-auto">
      <div className="mb-4">
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <h2 className="pb-1 text-2xl font-bold text-black">
            Detail Riwayat Ibu Hamil
          </h2>
          <p className="text-sm font-light text-gray-500">
            Untuk melihat informasi detail data riwayat Ibu Hamil
          </p>
        </div>
      </div>
      <DetailRiwayatIbuHamil/>
    </div>
  );
};

export default Page;
