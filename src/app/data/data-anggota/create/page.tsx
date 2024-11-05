import React from "react";
import { Metadata } from "next";
import CreateAnggota from "@/components/DataAnggota/CreateAnggota";

export const metadata: Metadata = {
  title: "Create Data Anggota",
  description: "Create Data Anggota Page",
};

const Page = () => {
  return (
    <>
      <div className="mt-0 px-2 md:px-10">
        <CreateAnggota />
      </div>
    </>
  );
};

export default Page;
