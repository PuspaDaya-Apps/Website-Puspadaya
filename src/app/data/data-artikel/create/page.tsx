import CreateArtikel from "@/components/Artikel/CreateArtikel";
import TableArtikel from "@/components/Tables/TableArtikel";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Artikel",
  description: "Create Artikel",
};

const Page = () => {
  return (
    <>
      <div className="container mx-auto">
        <CreateArtikel />
      </div>
    </>
  );
};

export default Page;
