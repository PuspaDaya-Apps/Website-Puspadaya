import EditBalita from "@/components/DataKeluarga/EditBalita";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Edit Data Balita",
  description: "Edit Data Balita Page",
};

const Page = ({ params }: { params: { id: string } }) => {
  return (
    <>
      <div className="mt-0 px-2 md:px-10">
        <EditBalita id={params.id} />
      </div>
    </>
  );
};

export default Page;
