import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TableOne from "@/components/Tables/TableOne";
import TableThree from "@/components/Tables/TableThree";
import TableTwo from "@/components/Tables/TableTwo";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import TableJadwalPosyandu from "@/components/Tables/TableJadwalPosyandu";

export const metadata: Metadata = {
  title: "Jadwal Posyandu",
  description: "Jadwal Posyandu Page",
};

const Page = () => {
  return (
    <>
      <div className="container mx-auto">
        <TableJadwalPosyandu />
      </div>
    </>
  );
};

export default Page;
