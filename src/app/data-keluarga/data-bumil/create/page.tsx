import CreateBumil from "@/components/DataKeluarga/CreateBumil";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Create Data Ibu Hamil",
  description: "Create Data Ibu Hamil Page",
};

const Page = () => {
  return (
    <>
      <div className="mt-0 px-2 md:px-10">
        <CreateBumil />
      </div>
    </>
  );
};

export default Page;
