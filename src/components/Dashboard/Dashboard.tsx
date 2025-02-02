import React from "react";
import CountingCard from "../Card/CountingCard";
import {
  SvgIconBayi,
  SvgIconLoveBlue,
  SvgIconLoveOrange,
  SvgIconPregnantMother,
  SvgIconToilet,
  SvgIconVillage,
} from "../ui/Svg";
import PercentageCard from "../Card/PercentageCard";
import GrafikTrendStuntingBalita from "../Charts/GrafikTrendStuntingBalita";
import GrafikTrendStuntingBanyuwangi from "../Charts/GrafikTrendStuntingBanyuwangi";
import GrafikPersebaranPosyandu from "../Charts/GrafikPersebaranPosyandu";
import GrafikPersebaranKaderDanTingkatAktivitas from "../Charts/GrafikPersebaranKaderDanTingkatAktivitas";
import MapPersebaranBalitaStunting from "../Charts/MapPersebaranBalitaStunting";
import MapPersebaranBalitaBerdasarkanWIlayah from "../Charts/MapPersebaranBalitaBerdasarkanWIlayah";
import MapPersebaranKader from "../Charts/MapPersebaranKader";
import MapPersebaranKeluargaTanpaMCK from "../Charts/MapPersebaranKeluargaTanpaMCK";
import MapPersebaranDesa from "../Charts/MapPersebaranDesa";
import CountingCardRow from "../Card/CountingCardRow";

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
            subtitle="Jumlah Balita Meningkat"
            title="Jumlah Balita Keseluruhan"
            title_secound = ""
            color={"#EBF3FE"}
          />
          <CountingCard
            icon={SvgIconBayi}
            isMeningkat={false}
            jumlah={139}
            peningkatan="4%"
            subtitle="Jumlah Balita Stunting Meningkat"
            title="Jumlah Balita Stunting"
            title_secound = "Aktif Januari 2025"
            color={"#EBF3FE"}
          />
        </div>
        <div className="col-span-8">
          <GrafikTrendStuntingBanyuwangi />
        </div>

        <div className="col-span-4 flex flex-col justify-between gap-10">
          <CountingCard
            icon={SvgIconBayi}
            isMeningkat={true}
            jumlah={12}
            peningkatan="10%"
            subtitle="Jumlah Balita Underweigt Menurun"
            title="Jumlah Balita Underweigt"
            title_secound = "Aktif Januari 2025"
            color={"#EBF3FE"}
          />

          <CountingCard
            icon={SvgIconBayi}
            isMeningkat={true}
            jumlah={16}
            peningkatan="6%"
            subtitle="Jumlah Balita Underweigt Menurun"
            title="Jumlah Balita Underweigt"
            title_secound = "Aktif Januari 2025"
            color={"#EBF3FE"}
          />
        </div>


        <div className="col-span-4 flex flex-row gap-10">
          <CountingCardRow
            icon={SvgIconVillage}
            isMeningkat={true}
            jumlah={200}
            peningkatan="10%"
            subtitle="Jumlah Desa Meningkat"
            title="Jumlah Desa"
            title_secound = ""
            color={"#EBF3FE"}
          />

          <CountingCardRow
            icon={SvgIconToilet}
            isMeningkat={false}
            jumlah={30}
            peningkatan="9%"
            subtitle="Jumlah Keluarga Belum Memiliki Fasilitas MCK Meningkat"
            title="Keluarga tanpa MCK"
            title_secound = ""
            color={"#EBF3FE"}
          />

          <CountingCardRow
            icon={SvgIconPregnantMother}
            isMeningkat={false}
            jumlah={28}
            peningkatan="3%"
            subtitle="Jumlah Ibu Hamil Meningkat"
            title="Jumlah Ibu Hamil"
            title_secound = "Aktif Januari 2025"
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
             title_secound = ""
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

        <div className="col-span-4 flex flex-col justify-between gap-4">
          <CountingCard
            icon={SvgIconLoveBlue}
            isMeningkat={true}
            jumlah={300}
            peningkatan="43%"
            title="Jumlah Kader"
             title_secound = ""
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
        {/* <div className="col-span-12 w-full rounded-lg bg-white p-10 shadow-lg">
          <MapPersebaranDesa />
        </div> */}
      </div>
    </div>
  );
};

export default Dashboard;
