import React from "react";
import DurationDistanceChart from "../dashboard/DurationDistanceChart";
import RaportBalita from "../dashboard/ChartRaporBaby";

const DashboardAnggotaKader: React.FC = () => {
  return (
    <div style={{ marginTop: "30px" }}>

      <div className="mb-6">
        <DurationDistanceChart />
      </div>
      <RaportBalita />
    </div>


  );
};

export default DashboardAnggotaKader;