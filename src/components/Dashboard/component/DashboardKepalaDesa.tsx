import React from "react";

import ChartRaporBaby from "../component-desa/ChartRaporBaby";
import DurationDistanceChart from "../component-desa/DurationDistanceChart";


const DashboardKepalaDesa: React.FC = () => {
  return (
    <div style={{ marginTop: "30px" }}>

      <div className="mb-6">
        <DurationDistanceChart />
      </div>
      <ChartRaporBaby />
    </div>


  );
};

export default DashboardKepalaDesa;