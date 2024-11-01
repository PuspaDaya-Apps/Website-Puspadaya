import React from "react";
import { Metadata } from "next";
import TableRiwayatPengukuranBalita from "@/components/Tables/TableRiwayatPengukuranBalita";

export const metadata: Metadata = {
  title: "Riwayat Data Pengukuran Balita",
  description: "Riwayat Data Pengukuran Balita Page",
};

const Page = () => {
  return (
    <>
      <div className="container mx-auto">
        <TableRiwayatPengukuranBalita />
      </div>
    </>
  );
};

export default Page;
