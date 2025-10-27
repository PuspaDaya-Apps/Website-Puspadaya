
import Policy from "@/components/Policy";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kebijakan Aplikasi - Pengaturan",
  description: "Halaman pengaturan kebijakan aplikasi pada dashboard Puspadaya",
};

const Settings = () => {
  return (
    <div className="container mx-auto">
      <div className="mb-4 mt-10">
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
