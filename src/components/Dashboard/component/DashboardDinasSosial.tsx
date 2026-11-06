"use client";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useStatistikDashboard } from "@/hooks/dashboard";
import DashboardLoader from "../DashboardLoader";
import dynamic from "next/dynamic";
import TrendSection from "../card-components/TrendSection";
import NutritionStatusSection from "../card-components/NutritionStatusSection";
import AttendanceSection from "../card-components/AttendanceSection";
import NutritionProgramSection from "../card-components/NutritionProgramSection";
import SKDNSection from "../card-components/SKDNSection";
import NIKStatisticsSection from "../card-components/NIKStatisticsSection";
import PregnancyRiskSection from "../card-components/PregnancyRiskSection";
import PosyanduDistributionSection from "../card-components/PosyanduDistributionSection";
import KaderDistributionSection from "../card-components/KaderDistributionSection";

// Dynamically import map components with SSR disabled (Leaflet requires window)
const MapPersebaranBalitaStunting = dynamic(() => import("@/components/Charts/PetaPersebaranAnakStunting"), { ssr: false });
const MapPersebaranBalitaBerdasarkanWIlayah = dynamic(() => import("@/components/Charts/MapPersebaranBalitaBerdasarkanWIlayah"), { ssr: false });
const MapPersebaranKader = dynamic(() => import("@/components/Charts/MapPersebaranKader"), { ssr: false });
const MapPersebaranKeluargaTanpaMCK = dynamic(() => import("@/components/Charts/MapPersebaranKeluargaTanpaMCK"), { ssr: false });

const DashboardDinasSosial = () => {
  // Data dashboard dibaca dari cache React Query: cukup satu kali fetch, lalu
  // dipakai ulang saat komponen mount lagi atau user pindah halaman.
  const { data: datadash = null, isPending } = useStatistikDashboard();
  const [items, setItems] = useState([]);
  const [hasMore, setHasMore] = useState(true);


  const currentDate = new Date();
  const monthYear = currentDate.toLocaleString("id-ID", {
    month: "long",
    year: "numeric",
  });


const fetchMoreData = () => {
  if (items.length >= 1000) { 
    setHasMore(false);
    return;
  }

  setTimeout(() => {
    setItems(items.concat(Array.from({ length: 20 })));
  }, 500);
};


  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-black">Dashboard</h1>
        <p className="mt-1 text-black">
          Pantau perkembangan keluarga dan kader disini!
        </p>
      </div>

      {/* Satu loading untuk seluruh isi dashboard. */}
      {isPending ? (
        <DashboardLoader />
      ) : (
      <InfiniteScroll
        dataLength={items.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<h4></h4>}
      >
        <div className="grid grid-cols-12 gap-10">
          <TrendSection
            datadash={datadash}
            monthYear={monthYear}
          />

          <NutritionStatusSection
            datadash={datadash}
            monthYear={monthYear}
          />

          <AttendanceSection
            datadash={datadash}
            monthYear={monthYear}
          />

          <NutritionProgramSection
            datadash={datadash}
            monthYear={monthYear}
          />

          <SKDNSection
            datadash={datadash}
            monthYear={monthYear}
          />

           <NIKStatisticsSection
            datadash={datadash}
            monthYear={monthYear}
          />

          <PregnancyRiskSection
            datadash={datadash}
            monthYear={monthYear}
          />

          <div className="col-span-12 w-full rounded-lg bg-white p-10 shadow-lg">
            <MapPersebaranBalitaStunting />
          </div>

          <KaderDistributionSection
            datadash={datadash}
            monthYear={monthYear}
          />

            <div className="col-span-12 w-full rounded-lg bg-white p-10 shadow-lg">
            <MapPersebaranKeluargaTanpaMCK />
          </div>

        
        </div>
      </InfiniteScroll>
      )}
    </div>
  );
};

export default DashboardDinasSosial;
