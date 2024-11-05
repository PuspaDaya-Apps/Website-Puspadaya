import TableDaftarIbuHamil from "@/components/Tables/TableDaftarIbuHamil";
import TableDaftarTamuIbuHamil from "@/components/Tables/TableDaftarTamuIbuHamil";
import TableDaftarTamuBalita from "@/components/Tables/TableDaftaTamuBalita";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daftar Hadir Ibu Hamil",
  description: "",
};

const TablesPage = () => {
  return (
    <div className="container mx-auto">
      <TableDaftarIbuHamil />
    </div>
  );
};

export default TablesPage;
