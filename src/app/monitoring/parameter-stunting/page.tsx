import ParameterStunting from "@/components/ParameterStunting/ParameterStunting";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Ibu Hamil",
  description: "Data Ibu Hamil Page",
};

const Page = () => {
  return (
    <>
      <div className="container mx-auto">
        <div className="mb-4 flex items-center justify-center p-2">
          <div>
            <ParameterStunting />
        </div>
      </div>
    </>
  );
};

export default Page;
