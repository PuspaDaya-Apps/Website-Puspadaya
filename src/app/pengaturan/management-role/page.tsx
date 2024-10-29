import AkunSaya from "@/components/AkunSaya/AkunSaya";
import TableManagementRole from "@/components/Tables/TableManagementRole";
import { Metadata } from "next";

// Define metadata for the page
export const metadata: Metadata = {
  title: "Management Role",
  description: "Management Role dan Permission",
};

const Page = () => {
  return (
    <div className="container mx-auto">
      <TableManagementRole />
    </div>
  );
};

export default Page;
