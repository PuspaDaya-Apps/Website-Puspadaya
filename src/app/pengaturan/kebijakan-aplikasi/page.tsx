
import Policy from "@/components/Policy";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next.js Settings Page | NextAdmin - Next.js Dashboard c",
  description: "This is Next.js Settings page for NextAdmin Dashboard Kit",
};

const Settings = () => {
  return (
      <div className="container mx-auto">
        <div className="mb-4">
          <div className="rounded-lg bg-white p-6 shadow-lg">
            <h2 className="pb-1 text-2xl font-bold text-black">
            Kebijakan Aplikasi
            </h2>
            <p className="text-sm font-medium text-gray-500">
            Melindungi data anda, meningkatkan pengalaman anda
            </p>
          </div>
        </div>
        <Policy />
      </div>
  
  );
};

export default Settings;
