import TableDaftarHadirBalita from "@/components/Tables/TableDaftarHadirBalita";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daftar Hadir Balita",
  description: "",
};

const Page = () => {
  return (
    <>
      <div className="container mx-auto">
        <TableDaftarHadirBalita />
      </div>
    </>
  );
};

export default Page;
