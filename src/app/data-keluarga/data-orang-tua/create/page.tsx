import React from "react";
import { Metadata } from "next";
import CreateOrangTua from "@/components/DataKeluarga/CreateOrangTua";

export const metadata: Metadata = {
  title: "Create Data Orang Tua",
  description: "Create Data Orang Tua Page",
};

const Page = () => {
  return (
    <>
      <div className="mt-0 px-2 md:px-10">
        <CreateOrangTua />
      </div>
    </>
  );
};

export default Page;
