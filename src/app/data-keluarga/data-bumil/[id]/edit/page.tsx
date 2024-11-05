import EditBumil from "@/components/DataKeluarga/EditBumil";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Edit Data Ibu Hamil",
  description: "Edit Data Ibu Hamil Page",
};

const Page = ({ params }: { params: { id: string } }) => {
  return (
    <>
      <div className="mt-0 px-2 md:px-10">
        <EditBumil id={params.id} />
      </div>
    </>
  );
};

export default Page;
