import TableDaftarTamuBalita from "@/components/Tables/TableDaftaTamuBalita";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daftar Tamu Balita",
  description: "",
};

const Page = () => {
  return (
    <>
      <div className="container mx-auto">
        <TableDaftarTamuBalita />
      </div>
    </>
  );
};

export default Page;
