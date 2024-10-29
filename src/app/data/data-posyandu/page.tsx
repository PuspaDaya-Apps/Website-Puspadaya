import React from "react";
import { Metadata } from "next";
import TablePosyandu from "@/components/Tables/TablePosyandu";

export const metadata: Metadata = {
  title: "Data Posyandu",
  description: "Data Posyandu Page",
};

const Page = () => {
  return (
    <>
      <div className="container mx-auto">
        <TablePosyandu />
      </div>
    </>
  );
};

export default Page;
