"use client";
import React, { useEffect, useState } from "react";
import CountingCard from "../Card/CountingCard";
import {
  SvgIconBayi,
  SvgIconLoveBlue,
  SvgIconLoveOrange,
  SvgIconPregnantMother,
  SvgIconToilet,
  SvgIconVillage,
} from "../ui/Svg";
import InfiniteScroll from "react-infinite-scroll-component";
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

  const [items, setItems] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState({
    grafikTrendStuntingBalita: true,
    grafikTrendStuntingBanyuwangi: true,
    mapPersebaranBalitaStunting: true,
    mapPersebaranBalitaBerdasarkanWilayah: true,
    grafikPersebaranPosyandu: true,
    grafikPersebaranKaderDanTingkatAktivitas: true,
    mapPersebaranKader: true,
    mapPersebaranKeluargaTanpaMCK: true,
    countingCard: true,
    countingCardRow: true,
  });

  const fetchMoreData = () => {
    if (items.length >= 10000) {
      setHasMore(false);
      return;
    }

    // Simulasikan loading dengan delay
    setTimeout(() => {
      setItems(items.concat(Array.from({ length: 20 })));
    }, 2000); // Delay 2 detik untuk setiap batch data
  };

  useEffect(() => {
    setTimeout(() => {
      setIsLoading((prev) => ({ ...prev, countingCard: false }));
    }, 5000); 

    setTimeout(() => {
      setIsLoading((prev) => ({ ...prev, countingCardRow: false }));
    }, 5000); 
    

    // Simulasikan loading untuk setiap komponen dengan delay yang berbeda
    setTimeout(() => {
      setIsLoading((prev) => ({ ...prev, grafikTrendStuntingBalita: false }));
    }, 8000); 

    setTimeout(() => {
      setIsLoading((prev) => ({
        ...prev,
        grafikTrendStuntingBanyuwangi: false,
      }));
    }, 17000);

    setTimeout(() => {
      setIsLoading((prev) => ({ ...prev, mapPersebaranBalitaStunting: false }));
    }, 19000);

    setTimeout(() => {
      setIsLoading((prev) => ({
        ...prev,
        mapPersebaranBalitaBerdasarkanWilayah: false,
      }));
    }, 23000);

    setTimeout(() => {
      setIsLoading((prev) => ({ ...prev, grafikPersebaranPosyandu: false }));
    }, 26000);

    setTimeout(() => {
      setIsLoading((prev) => ({
        ...prev,
        grafikPersebaranKaderDanTingkatAktivitas: false,
      }));
    }, 30000);

    setTimeout(() => {
      setIsLoading((prev) => ({ ...prev, mapPersebaranKader: false }));
    }, 35000);

    setTimeout(() => {
      setIsLoading((prev) => ({
        ...prev,
        mapPersebaranKeluargaTanpaMCK: false,
      }));
    }, 38000);

   
  }, []);

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-black">Dashboard</h1>
        <p className="mt-1">Pantau perkembangan keluarga dan kader disini!</p>
      </div>

      <InfiniteScroll
        dataLength={items.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<h4></h4>}
      >
        <div className="grid grid-cols-12 gap-10">
          <div className="col-span-8">
            {isLoading.grafikTrendStuntingBalita ? (
              <h4>Loading...</h4>
            ) : (
              <GrafikTrendStuntingBalita />
            )}
          </div>

          <div className="col-span-4 flex flex-col justify-between gap-10">
            {isLoading.countingCard ? (
              <h4>Loading...</h4>
            ) : (
              <CountingCard
                icon={SvgIconBayi}
                isMeningkat={true}
                jumlah={1200}
                peningkatan="20%"
                subtitle="Jumlah Balita Meningkat"
                title="Jumlah Balita Keseluruhan"
                title_secound=""
                color={"#EBF3FE"}
              />
            )}

            {isLoading.countingCard ? (
              <h4>Loading...</h4>
            ) : (
              <CountingCard
                icon={SvgIconBayi}
                isMeningkat={false}
                jumlah={139}
                peningkatan="4%"
                subtitle="Jumlah Balita Stunting Meningkat"
                title="Jumlah Balita Stunting"
                title_secound="Aktif Januari 2025"
                color={"#EBF3FE"}
              />
            )}
          </div>

          <div className="col-span-8">
            {isLoading.grafikTrendStuntingBanyuwangi ? (
              <h4>Loading...</h4>
            ) : (
              <GrafikTrendStuntingBanyuwangi />
            )}
          </div>

          <div className="col-span-4 flex flex-col justify-between gap-10">
            {isLoading.countingCard ? (
              <h4>Loading...</h4>
            ) : (
              <CountingCard
                icon={SvgIconBayi}
                isMeningkat={true}
                jumlah={16}
                peningkatan="6%"
                subtitle="Jumlah Balita Underweigt Menurun"
                title="Jumlah Balita Underweigt"
                title_secound="Aktif Januari 2025"
                color={"#EBF3FE"}
              />
            )}

            {isLoading.countingCard ? (
              <h4>Loading...</h4>
            ) : (
              <CountingCard
                icon={SvgIconBayi}
                isMeningkat={true}
                jumlah={12}
                peningkatan="10%"
                subtitle="Jumlah Balita Underweigt Menurun"
                title="Jumlah Balita Underweigt"
                title_secound="Aktif Januari 2025"
                color={"#EBF3FE"}
              />
            )}
          </div>

          <div className="col-span-4 flex flex-row gap-10">
            {isLoading.countingCardRow ? (
              <h4>Loading...</h4>
            ) : (
              <CountingCardRow
                icon={SvgIconVillage}
                isMeningkat={true}
                jumlah={200}
                peningkatan="10%"
                subtitle="Jumlah Desa Meningkat"
                title="Jumlah Desa"
                title_secound=""
                color={"#EBF3FE"}
              />
            )}

            {isLoading.countingCardRow ? (
              <h4>Loading...</h4>
            ) : (
              <CountingCardRow
                icon={SvgIconToilet}
                isMeningkat={false}
                jumlah={30}
                peningkatan="9%"
                subtitle="Jumlah Keluarga Belum Memiliki Fasilitas MCK Meningkat"
                title="Keluarga tanpa MCK"
                title_secound=""
                color={"#EBF3FE"}
              />
            )}

            {isLoading.countingCardRow ? (
              <h4>Loading...</h4>
            ) : (
              <CountingCardRow
                icon={SvgIconPregnantMother}
                isMeningkat={false}
                jumlah={28}
                peningkatan="3%"
                subtitle="Jumlah Ibu Hamil Meningkat"
                title="Jumlah Ibu Hamil"
                title_secound="Aktif Januari 2025"
                color={"#EBF3FE"}
              />
            )}
          </div>

          <div className="col-span-12 w-full rounded-lg bg-white p-10 shadow-lg">
            {isLoading.mapPersebaranBalitaStunting ? (
              <h4>Loading...</h4>
            ) : (
              <MapPersebaranBalitaStunting />
            )}
          </div>

          <div className="col-span-12 w-full rounded-lg bg-white p-10 shadow-lg">
            {isLoading.mapPersebaranBalitaBerdasarkanWilayah ? (
              <h4>Loading...</h4>
            ) : (
              <MapPersebaranBalitaBerdasarkanWIlayah />
            )}
          </div>

          <div className="col-span-8">
            {isLoading.grafikPersebaranPosyandu ? (
              <h4>Loading...</h4>
            ) : (
              <GrafikPersebaranPosyandu />
            )}
          </div>

          <div className="col-span-4 flex flex-col justify-between gap-10">
            {isLoading.countingCard ? (
              <h4>Loading...</h4>
            ) : (
              <CountingCard
                icon={SvgIconLoveOrange}
                isMeningkat={true}
                jumlah={140}
                peningkatan="18%"
                title="Jumlah Posyandu"
                title_secound=""
                subtitle="Jumlah Posyandu Meningkat"
                color={"#EBF3FE"}
              />
            )}

            {isLoading.countingCard ? (
              <h4>Loading...</h4>
            ) : (
              <PercentageCard
                title={"Persentase Jumlah Posyandu"}
                jumlah={100}
                color={colors}
                data={data}
                label={label}
              />
            )}
          </div>

          <div className="col-span-8">
            {isLoading.grafikPersebaranKaderDanTingkatAktivitas ? (
              <h4>Loading...</h4>
            ) : (
              <GrafikPersebaranKaderDanTingkatAktivitas />
            )}
          </div>

          <div className="col-span-4 flex flex-col justify-between gap-4">
            {isLoading.countingCard ? (
              <h4>Loading...</h4>
            ) : (
              <CountingCard
                icon={SvgIconLoveBlue}
                isMeningkat={true}
                jumlah={300}
                peningkatan="43%"
                title="Jumlah Kader"
                title_secound=""
                subtitle="Jumlah Kader Meningkat"
                color={"#EBF3FE"}
              />
            )}

            {isLoading.countingCardRow ? (
              <h4>Loading...</h4>
            ) : (
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
            )}
          </div>

          <div className="col-span-12 w-full rounded-lg bg-white p-10 shadow-lg">
            {isLoading.mapPersebaranKader ? (
              <h4>Loading...</h4>
            ) : (
              <MapPersebaranKader />
            )}
          </div>
          <div className="col-span-12 w-full rounded-lg bg-white p-10 shadow-lg">
            {isLoading.mapPersebaranKeluargaTanpaMCK ? (
              <h4>Loading...</h4>
            ) : (
              <MapPersebaranKeluargaTanpaMCK />
            )}
          </div>
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default Dashboard;
