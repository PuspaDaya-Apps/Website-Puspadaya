"use client";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import PercentageCard from "@/components/Card/PercentageCard";
import CountingCard from "@/components/Card/CountingCard";
import { statistikDashboard } from "@/app/api/statistik/statistik";
import {
  svgIbuhamil,
  svgIconAnakHadir,
  SvgIconAnakHadir,
  svgIconAnaklulus,
  svgIconAsieklusif,
  SvgIconBayi,
  SvgIconLoveBlue,
  SvgIconLoveOrange,
  svgIconMpasi,
  SvgIconPregnantMother,
  svgIconTingkatpartisispasi,
  SvgIconVillage,
  svgIxonJangankauan,
  svgStunting,
  svgUnderweight,
  svgWasting,
} from "@/components/ui/Svg";
import ChartJumlahBalitaHadir from "@/components/Charts/StatistikKehadiranAnak"; //
import ChartDonatBeratBadan from "@/components/Charts/ChartDonatBeratBadan";
import ChartPerhitunganSkdn from "@/components/Charts/ChartPerhitunganSkdn";
import CountingCardDesa from "@/components/Card/CountingCardDesa";
import MapPersebaranBalitaStunting from "@/components/Charts/PetaPersebaranAnakStunting";
import GrafikPersebaranPosyandu from "@/components/Charts/GrafikPersebaranPosyandu";
import GrafikPersebaranKaderDanTingkatAktivitas from "@/components/Charts/GrafikPersebaranKaderDanTingkatAktivitas";
import MapPersebaranBalitaBerdasarkanWIlayah from "@/components/Charts/MapPersebaranBalitaBerdasarkanWIlayah";
import MapPersebaranKader from "@/components/Charts/MapPersebaranKader";
import MapPersebaranKeluargaTanpaMCK from "@/components/Charts/MapPersebaranKeluargaTanpaMCK";
import StatistikRisikoKehamilan from "@/components/Charts/StatistikRisikoKehamilan";
import StatistikNikOrangTua from "@/components/Charts/StatistikNikOrangTua;";
import TingkatGiziAnakWilayahDesa from "@/components/Charts/TingkatGiziAnakWilayahDesa TingkatGiziAnakWilayahDesa";
import GrafikTrendGiziBalita from "@/components/Charts/GrafikTrendGiziBalita GrafikTrendGiziBalita";
import TrendSection from "../card-components/TrendSection";
import NutritionStatusSection from "../card-components/NutritionStatusSection";
import AttendanceSection from "../card-components/AttendanceSection";
import NutritionProgramSection from "../card-components/NutritionProgramSection";
import SKDNSection from "../card-components/SKDNSection";
import NIKStatisticsSection from "../card-components/NIKStatisticsSection";
import PregnancyRiskSection from "../card-components/PregnancyRiskSection";

const DashboardAdmin = () => {
  const [datadash, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
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

  const currentDate = new Date();
  const monthYear = currentDate.toLocaleString("id-ID", {
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    const fetchData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const result = await statistikDashboard();

      // console.log("Fetched Data:", result);

      if (result.successCode === 200 && result.data) {
        setData(result.data);
        setError(null);
      } else {
        setData(null);
        setError("Error fetching data. Please try again.");
      }

      setLoading(false);
    };

    fetchData();
  }, []);

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
    }, 26000);

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
        <p className="mt-1 text-black">
          Pantau perkembangan keluarga dan kader disini!
        </p>
      </div>

      <InfiniteScroll
        dataLength={items.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<h4></h4>}
      >
        <div className="grid grid-cols-12 gap-10">

          
            <TrendSection
            isLoading={isLoading}
            datadash={datadash}
            monthYear={monthYear}
          />

          <NutritionStatusSection
          isLoading={isLoading}
          datadash={datadash}
          monthYear={monthYear}
        />
       
       
        <AttendanceSection 
          isLoading={isLoading}
          datadash={datadash}
          monthYear={monthYear}
        />
        
        <NutritionProgramSection 
          isLoading={isLoading}
          datadash={datadash}
          monthYear={monthYear}
        />

         <SKDNSection 
          isLoading={isLoading}
          datadash={datadash}
          monthYear={monthYear}
        />
        
        <NIKStatisticsSection 
          isLoading={isLoading}
          datadash={datadash}
          monthYear={monthYear}
        />

       <PregnancyRiskSection 
          isLoading={isLoading}
          datadash={datadash}
          monthYear={monthYear}
        />

          {/* ini mapya */}
          <div className="col-span-12 w-full rounded-lg bg-white p-10 shadow-lg">
            {isLoading.mapPersebaranBalitaStunting ? (
              <h4>Loading...</h4>
            ) : (
              <MapPersebaranBalitaStunting />
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
                jumlah={datadash?.jumlah_posyandu.jumlah ?? "0"}
                peningkatan={
                  datadash?.jumlah_posyandu.rate != null
                    ? `${datadash.jumlah_posyandu.rate}%`
                    : "-"
                }
                title="Jumlah Posyandu"
                title_secound=""
                subtitle={datadash?.jumlah_posyandu.status ?? ""}
                color={"#EBF3FE"}
              />
            )}

            {isLoading.countingCard ? (
              <h4>Loading...</h4>
            ) : (
              <PercentageCard
                title={"Persentase Jumlah Posyandu"}
                jumlah={100}
                color={["#34B53A", "#F39D00"]}
                data={[
                    {
                    name: "Banyuwangi",
                    value: datadash?.persentase_posyandu.banyuwangi_rate ?? 0,
                  },
                  {
                    name: "Maluku Tengah",
                    value: datadash?.persentase_posyandu.maluku_rate ?? 0,
                  },
                ]}
                label={["Banyuwangi", "Maluku Tengah"]}
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
                jumlah={datadash?.jumlah_kader.jumlah ?? "0"}
                peningkatan={
                  datadash?.jumlah_kader.rate != null
                    ? `${datadash.jumlah_kader.rate}%`
                    : "-"
                }
                title="Jumlah Kader"
                title_secound=""
                subtitle={datadash?.jumlah_kader.status ?? ""}
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
                  {
                    name: "Banyuwangi",
                    value: datadash?.persentase_kader.banyuwangi_rate ?? 0,
                  },
                  {
                    name: "Maluku Tengah",
                    value: datadash?.persentase_kader.maluku_rate ?? 0,
                  },
                ]}
                label={["Banyuwangi", "Maluku Tengah"]}
              />
            )}
          </div>

          <div className="col-span-12 w-full rounded-lg bg-white p-10 shadow-lg">
            {isLoading.mapPersebaranBalitaBerdasarkanWilayah ? (
              <h4>Loading...</h4>
            ) : (
              <MapPersebaranBalitaBerdasarkanWIlayah />
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

export default DashboardAdmin;
