import React from "react";
import DurationDistanceChart from "../component-new/DurationDistanceChart";
import RaportBalita from "../component-new/ChartRaporBaby";

const DashboardAnggotaKader: React.FC = () => {
  return (
    <div style={{ marginTop: "30px" }}>
      <DurationDistanceChart/>
        <RaportBalita/>
    </div>

  
  );
};

export default DashboardAnggotaKader;