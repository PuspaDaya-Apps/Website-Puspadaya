import TableOrangTua from "@/components/Tables/TableOrangTua";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Orang Tua",
  description: "Data Orang Tua Page",
};

const Page = () => {
  return (
    <>
      <div className="container mx-auto">
        <TableOrangTua />
      </div>
    </>
  );
};

export default Page;
