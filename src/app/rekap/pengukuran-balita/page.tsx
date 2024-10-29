import React from "react";
import { Metadata } from "next";
import TableRekapBalita from "@/components/Tables/TableRekapBalita";

export const metadata: Metadata = {
  title: "Rekap Data Pengukuran Balita",
  description: "Rekap Data Pengukuran Balita Page",
};

const Page = () => {
  return (
    <>
      <div className="container mx-auto">
        <TableRekapBalita />
      </div>
    </>
  );
};

export default Page;
