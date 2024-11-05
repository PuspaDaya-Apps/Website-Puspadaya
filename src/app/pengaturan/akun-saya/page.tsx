import AkunSaya from "@/components/AkunSaya/AkunSaya";
import { Metadata } from "next";

// Define metadata for the page
export const metadata: Metadata = {
  title: "Akun Saya",
  description: "Profile Akun Saya",
};

const Page = () => {
  return (
    <div className="container mx-auto">
      <AkunSaya />
    </div>
  );
};

export default Page;
