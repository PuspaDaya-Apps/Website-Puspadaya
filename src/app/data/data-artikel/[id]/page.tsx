
import DetailArtikel from "@/components/Artikel/DetailArtikel";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Detail Artikel Artikel",
  description: "Detail Artikel",
};
// disini membawa id
const Page = () => {
  return (
    <>
      <div className="container mx-auto">
        <DetailArtikel />
      </div>
    </>
  );
};

export default Page;
