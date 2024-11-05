import CreatePosyandu from "@/components/DataPosyandu/CreatePosyandu";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Create Data Posyandu",
  description: "Create Data Posyandu Page",
};

const Page = () => {
  return (
    <>
      <div className="mt-0 px-2 md:px-10">
        <CreatePosyandu />
      </div>
    </>
  );
};

export default Page;
