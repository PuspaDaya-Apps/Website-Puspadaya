"use client";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { statistikDashboard } from "@/app/api/statistik/statistik";
import MapPersebaranBalitaStunting from "@/components/Charts/PetaPersebaranAnakStunting";
import MapPersebaranBalitaBerdasarkanWIlayah from "@/components/Charts/MapPersebaranBalitaBerdasarkanWIlayah";
import MapPersebaranKader from "@/components/Charts/MapPersebaranKader";
import TrendSection from "../card-components/TrendSection";
import NutritionStatusSection from "../card-components/NutritionStatusSection";
import AttendanceSection from "../card-components/AttendanceSection";
import NutritionProgramSection from "../card-components/NutritionProgramSection";
import SKDNSection from "../card-components/SKDNSection";
import NIKStatisticsSection from "../card-components/NIKStatisticsSection";
import PregnancyRiskSection from "../card-components/PregnancyRiskSection";
import PosyanduDistributionSection from "../card-components/PosyanduDistributionSection";
import KaderDistributionSection from "../card-components/KaderDistributionSection";

const DashboardAnggotaKader = () => {
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
  if (items.length >= 1000) { 
    setHasMore(false);
    return;
  }

  setTimeout(() => {
    setItems(items.concat(Array.from({ length: 20 })));
  }, 500);
};

useEffect(() => {
  // Mengatur waktu loading yang lebih singkat dan bervariasi
  const loadingTimeouts = [
    { key: 'countingCard', delay: 800 },
    { key: 'countingCardRow', delay: 1000 },
    { key: 'grafikTrendStuntingBalita', delay: 1200 },
    { key: 'grafikTrendStuntingBanyuwangi', delay: 1500 },
    { key: 'mapPersebaranBalitaStunting', delay: 1800 },
    { key: 'mapPersebaranBalitaBerdasarkanWilayah', delay: 2000 },
    { key: 'grafikPersebaranPosyandu', delay: 2200 },
    { key: 'grafikPersebaranKaderDanTingkatAktivitas', delay: 2500 },
    { key: 'mapPersebaranKader', delay: 2800 },
    { key: 'mapPersebaranKeluargaTanpaMCK', delay: 3000 }
  ];

  loadingTimeouts.forEach(({ key, delay }) => {
    setTimeout(() => {
      setIsLoading(prev => ({ ...prev, [key]: false }));
    }, delay);
  });

  // Membersihkan timeout saat komponen unmount
  return () => {
    loadingTimeouts.forEach(({ key, delay }) => {
      clearTimeout(setTimeout(() => {}, delay));
    });
  };
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

          <div className="col-span-12 w-full rounded-lg bg-white p-10 shadow-lg">
            {isLoading.mapPersebaranBalitaStunting ? (
              <h4>Loading...</h4>
            ) : (
              <MapPersebaranBalitaStunting />
            )}
          </div>

          <PosyanduDistributionSection
            isLoading={isLoading}
            datadash={datadash}
            monthYear={monthYear}
          />

          <KaderDistributionSection
            isLoading={isLoading}
            datadash={datadash}
            monthYear={monthYear}
          />

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

        </div>
      </InfiniteScroll>
    </div>
  );
};

export default DashboardAnggotaKader;
