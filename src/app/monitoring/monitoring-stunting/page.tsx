import TableMonitoringStunting from "@/components/Tables/TableMonitoringStunting";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Monitoring | Parameter Stunting",
  description: "This is Next.js Tables page for NextAdmin Dashboard Kit",
};

const TablesMonitoringStunting = () => {
  return (
    <>
      <div className="container mx-auto">
        <TableMonitoringStunting />
      </div>
    </>
  );
};

export default TablesMonitoringStunting;
