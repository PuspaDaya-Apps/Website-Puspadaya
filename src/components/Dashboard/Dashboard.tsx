import React from "react";
import CountingCard from "../Card/CountingCard";
import { SvgIconBayi } from "../ui/Svg";
import PercentageCard from "../Card/PercentageCard";

const Dashboard = () => {
  const colors = ["#34B53A", "#F39D00"];
  const label = ["Banyuwangi","Maluku Tengah"]
  const data = [
    { name: "Banyuwangi", value: 65 },
    { name: "Maluku Tengah", value: 35 },
  ];
  return (
    <div>
      <h1 className="text-3xl font-bold text-black">Dashboard</h1>
      <p className="mt-1">Pantau perkembangan keluarga dan kader disini!</p>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-4">
          <CountingCard icon={SvgIconBayi} isMeningkat={true} jumlah={140} title="Posyandu" color={"#EBF3FE"}  />
        </div>
        <div className="col-span-4">
          <PercentageCard color={colors} data={data} jumlah={100} label={label} title="Presentase Jumlah Posyandu"/>
        </div>
        <div className="col-span-8">
          {/* <CountingCard /> */}
        </div>
        
      </div>
    </div>
  );
};

export default Dashboard;
