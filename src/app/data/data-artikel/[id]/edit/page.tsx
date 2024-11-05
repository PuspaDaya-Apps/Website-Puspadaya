
import EditArtikel from "@/components/Artikel/EditArtikel";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Artikel",
  description: "Edit Artikel",
};
// disini membawa id
const Page = () => {
  return (
    
    <>
      <div className="container mx-auto">
        <EditArtikel />
      </div>
    </>
  );
};

export default Page;
