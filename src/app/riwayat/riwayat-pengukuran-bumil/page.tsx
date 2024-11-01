import React from "react";
import { Metadata } from "next";
import TableRiwayatPengukuranBumil from "@/components/Tables/TableRiwayatPengukuranBumil";

export const metadata: Metadata = {
  title: "Riwayat Data Pengukuran Ibu Hamil",
  description: "Riwayat Data Pengukuran Ibu Hamil Page",
};

const Page = () => {
  return (
    <>
      <div className="container mx-auto">
        <TableRiwayatPengukuranBumil />
      </div>
    </>
  );
};

export default Page;
