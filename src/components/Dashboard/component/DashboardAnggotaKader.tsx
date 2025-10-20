import React from "react";
import DurationDistanceChart from "../component-raport-25/DurationDistanceChart";
import RaportBalita from "../component-raport-25/ChartRaporBaby";

const DashboardAnggotaKader: React.FC = () => {
  return (
    <div style={{ marginTop: "30px" }}>
      <DurationDistanceChart />
      <RaportBalita />
    </div>


  );
};

export default DashboardAnggotaKader;