import React from "react";
import { Metadata } from "next";
import DetailBalita from "@/components/DataKeluarga/DetailBalita";
import { Card } from "primereact/card";

export const metadata: Metadata = {
  title: "Detail Balita",
  description: "Detail Balita Page",
};

const Page = ({ params }: { params: { id: string } }) => {
  return (
    <>
      <div className="mt-0 px-2 md:px-10">
        <Card>
          <h1 className="mb-2 text-3xl font-bold text-gray-800">
            Detail Data Balita
          </h1>
          <h5 className="text-lg text-gray-600">
            Informasi Detail Data Balita
          </h5>
        </Card>
        <DetailBalita id={params.id} />
      </div>
    </>
  );
};

export default Page;
