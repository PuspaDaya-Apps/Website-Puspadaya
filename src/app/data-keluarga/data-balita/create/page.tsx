import CreateBalita from "@/components/DataKeluarga/CreateBalita";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Create Data Balita",
  description: "Create Data Balita Page",
};

const Page = () => {
  return (
    <>
      <div className="mt-0 px-2 md:px-10">
        <CreateBalita />
      </div>
    </>
  );
};

export default Page;
