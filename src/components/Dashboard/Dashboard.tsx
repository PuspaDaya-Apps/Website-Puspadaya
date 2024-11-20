import React from "react";
import CountingCard from "../Card/CountingCard";
import {
  SvgIconArtikel,
  SvgIconBayi,
  SvgIconFamily,
  SvgIconLoveBlue,
  SvgIconLoveOrange,
} from "../ui/Svg";
import PercentageCard from "../Card/PercentageCard";
import GrafikTrendStuntingBalita from "../Charts/GrafikTrendStuntingBalita";
import GrafikTrendStuntingBanyuwangi from "../Charts/GrafikTrendStuntingBanyuwangi";
import GrafikPersebaranPosyandu from "../Charts/GrafikPersebaranPosyandu";
import GrafikPersebaranKaderDanTingkatAktivitas from "../Charts/GrafikPersebaranKaderDanTingkatAktivitas";
import BanyuwangiMap from "../Charts/BanyuwangiMap";
import MalukuTengahMap from "../Charts/MalukuTengahMap";
import MapPersebaranBalitaStunting from "../Charts/MapPersebaranBalitaStunting";
import MapPersebaranBalitaBerdasarkanWIlayah from "../Charts/MapPersebaranBalitaBerdasarkanWIlayah";
import MapPersebaranKader from "../Charts/MapPersebaranKader";
import MapPersebaranKeluargaTanpaMCK from "../Charts/MapPersebaranKeluargaTanpaMCK";
import MapPersebaranDesa from "../Charts/MapPersebaranDesa";

const Dashboard = () => {
  const colors = ["#34B53A", "#F39D00"];
  const label = ["Banyuwangi", "Maluku Tengah"];
  const data = [
    { name: "Banyuwangi", value: 65 },
    { name: "Maluku Tengah", value: 35 },
  ];
  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-black">Dashboard</h1>
        <p className="mt-1">Pantau perkembangan keluarga dan kader disini!</p>
      </div>
      <div className="grid grid-cols-12 gap-10">
        <div className="col-span-8">
          <GrafikTrendStuntingBalita />
        </div>
        <div className="col-span-4 flex flex-col justify-between gap-10">
          <CountingCard
            icon={SvgIconBayi}
            isMeningkat={true}
            jumlah={1200}
            peningkatan="20%"
            subtitle="Jumlah Balita meningkat"
            title="Jumlah Balita Keseluruhan"
            color={"#EBF3FE"}
          />
          <CountingCard
            icon={SvgIconBayi}
            isMeningkat={false}
            jumlah={20}
            peningkatan="4%"
            subtitle="Jumlah Balita Stunting meningkat"
            title="Jumlah Balita Stunting"
            color={"#EBF3FE"}
          />
        </div>
        <div className="col-span-8">
          <GrafikTrendStuntingBanyuwangi />
        </div>

        <div className="col-span-4 flex flex-col justify-between gap-10">
          <CountingCard
            icon={SvgIconArtikel}
            isMeningkat={true}
            jumlah={78}
            peningkatan="90%"
            subtitle="Artikel Yang di Publikasi Meningkat"
            title="Jumlah Artikel"
            color={"#EBF3FE"}
          />
          <CountingCard
            icon={SvgIconFamily}
            isMeningkat={false}
            jumlah={30}
            peningkatan="2%"
            title={
              <>
                Jumlah Keluarga Belum <br /> Memiliki Fasilitas MCK
              </>
            }
            subtitle="Jumlah Keluarga Belum Memiliki Fasilitas MCK Meningkat"
            color={"#EBF3FE"}
          />
        </div>
          
        <div className="col-span-12 w-full rounded-lg bg-white p-10 shadow-lg">
          <MapPersebaranBalitaStunting />
        </div>
        
        <div className="col-span-12 w-full rounded-lg bg-white p-10 shadow-lg">
          <MapPersebaranBalitaBerdasarkanWIlayah />
        </div>

        <div className="col-span-8">
          <GrafikPersebaranPosyandu />
        </div>

        <div className="col-span-4 flex flex-col justify-between gap-10">
          <CountingCard
            icon={SvgIconLoveOrange}
            isMeningkat={true}
            jumlah={140}
            peningkatan="18%"
            title="Jumlah Posyandu"
            subtitle="Jumlah Posyandu Meningkat"
            color={"#EBF3FE"}
          />
          <PercentageCard
            title={"Persentase Jumlah Posyandu"}
            jumlah={100}
            color={colors}
            data={data}
            label={label}
          />
        </div>

        <div className="col-span-8">
          <GrafikPersebaranKaderDanTingkatAktivitas />
        </div>

        <div className="col-span-4 flex flex-col justify-between gap-10">
          <CountingCard
            icon={SvgIconLoveBlue}
            isMeningkat={true}
            jumlah={200}
            peningkatan="43%"
            title="Jumlah Kader"
            subtitle="Jumlah Kader Meningkat"
            color={"#EBF3FE"}
          />
          <PercentageCard
            title={"Persentase Jumlah Kader"}
            jumlah={100}
            color={["#ef4444", "#3b82f6"]}
            data={[
              { name: "Banyuwangi", value: 60 },
              { name: "Maluku Tengah", value: 40 },
            ]}
            label={["Banyuwangi", "Maluku Tengah"]}
          />
        </div>
        <div className="col-span-12 w-full rounded-lg bg-white p-10 shadow-lg">
          <MapPersebaranKader />
        </div>
        <div className="col-span-12 w-full rounded-lg bg-white p-10 shadow-lg">
          <MapPersebaranKeluargaTanpaMCK />
        </div>
        <div className="col-span-12 w-full rounded-lg bg-white p-10 shadow-lg">
          <MapPersebaranDesa />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
