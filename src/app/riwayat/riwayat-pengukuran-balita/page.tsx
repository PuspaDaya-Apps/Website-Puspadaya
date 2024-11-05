import TableRiwayatPengukuranBalita from "@/components/Tables/TableRiwayatPengukuranBalita";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Riwayat Pengukuran Balita",
  description: "Riwayat Pengukuran Balita",
};

const Page = () => {
  return (
    <>
      <div className="container mx-auto">
        <TableRiwayatPengukuranBalita />
      </div>
    </>
  );
};

export default Page;
