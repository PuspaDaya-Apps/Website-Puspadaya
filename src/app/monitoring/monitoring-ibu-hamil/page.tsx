import TableMonitoringIbuHamil from "@/components/Tables/TableMonitoringIbuHamil";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Monitoring | Parameter Stunting",
  description: "This is Next.js Tables page for NextAdmin Dashboard Kit",
};

const TablesMonitoringGizi = () => {
  return (
    <>
      <div className="container mx-auto">
        <TableMonitoringIbuHamil />
      </div>
    </>
  );
};

export default TablesMonitoringGizi;
