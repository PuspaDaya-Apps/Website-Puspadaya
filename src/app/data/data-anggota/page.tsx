import React from "react";
import { Metadata } from "next";
import TableAnggota from "@/components/Tables/TableAnggota";

export const metadata: Metadata = {
  title: "Data Anggota",
  description: "Data Anggota Page",
};

const Page = () => {
  return (
    <>
      <div className="container mx-auto">
        <TableAnggota />
      </div>
    </>
  );
};

export default Page;
