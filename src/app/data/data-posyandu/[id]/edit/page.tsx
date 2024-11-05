import EditPosyandu from "@/components/DataPosyandu/EditPosyandu";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Edit Data Posyandu",
  description: "Edit Data Posyandu Page",
};

const Page = ({ params }: { params: { id: string } }) => {
  return (
    <>
      <div className="mt-0 px-2 md:px-10">
        <EditPosyandu id={params.id} />
      </div>
    </>
  );
};

export default Page;
