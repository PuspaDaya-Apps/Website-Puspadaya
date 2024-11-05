import EditOrangTua from "@/components/DataKeluarga/EditOrangTua";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Edit Data Orang Tua",
  description: "Edit Data Orang Tua Page",
};

const Page = ({ params }: { params: { kk: string } }) => {
  return (
    <>
      <div className="mt-0 px-2 md:px-10">
        <EditOrangTua kk={params.kk} />
      </div>
    </>
  );
};

export default Page;
