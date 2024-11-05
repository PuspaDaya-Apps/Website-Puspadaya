import ImageUploadMultiple from "@/components/FileUpload/Image/fileUploadMultiple";
import ImageUploadSingle from "@/components/FileUpload/Image/fileUploadSingle";
import TableArtikel from "@/components/Tables/TableArtikel";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Artikel",
  description: "Data Artikel",
};

const Page = () => {
  return (
    <>
      <div className="container mx-auto">
        <TableArtikel />
      </div>
    </>
  );
};

export default Page;
