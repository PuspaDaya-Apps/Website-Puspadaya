import React from "react";
import { Metadata } from "next";
import { SvgFilter } from "@/components/ui/Svg";
import TableBalita from "@/components/Tables/TableBalita";

export const metadata: Metadata = {
  title: "Data Balita",
  description: "Data Balita Page",
};

const Page = () => {
  return (
    <>
      <div className="container mx-auto">
        <TableBalita />
      </div>
    </>
  );
};

export default Page;
