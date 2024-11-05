import EditAnggota from "@/components/DataAnggota/EditAnggota";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Edit Data Anggota",
  description: "Edit Data Anggota Page",
};

const Page = ({ params }: { params: { id: string } }) => {
  return (
    <>
      <div className="mt-0 px-2 md:px-10">
        <EditAnggota id={params.id} />
      </div>
    </>
  );
};

export default Page;
