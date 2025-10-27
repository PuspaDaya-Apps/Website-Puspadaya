import React from "react";
import KaderCard from "../components-kader-25/KaderCard";
import KaderStats from "../components-kader-25/KaderStats";
import KehadiranGrafik from "../components-kader-25/KehadiranGrafik";
import DurasiJarak from "../components-kader-25/DurasiJarak";

import { data, durationDistanceData, chartData } from "../../../types/data-25/kaderData";

const DurationDistanceChart: React.FC = () => {
  const kader = data.kader[0];

  return (
    <div className="mt-2 sm:mt-10 space-y-6">
      {/* Header Card */}
      <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-dark">
        <h1 className="text-xl font-bold text-dark dark:text-white md:text-2xl">
          {data.title}
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          Periode: {data.periode} | {data.posyandu.nama} -{" "}
          {data.posyandu.alamat}
        </p>
      </div>

      {/* Profil Kader Card */}
      {data.kader.map((kaderItem, index) => (
        <KaderCard key={index} kader={kaderItem} />
      ))}

      {/* Statistik Kehadiran */}
      {data.kader.map((kaderItem, index) => (
        <div key={index} className="mb-6">
          <KaderStats kader={kaderItem} />
        </div>
      ))}

      {/* Grafik dan List Kegiatan */}
      {data.kader.map((kaderItem, index) => (
        <div key={index} className="mb-6">
          <KehadiranGrafik kader={kaderItem} chartData={chartData} />
        </div>
      ))}

      {/* Visualisasi Durasi dan Jarak */}
      {data.kader.map((kaderItem, index) => (
        <div key={index} className="mb-6">
          <DurasiJarak kader={kaderItem} durationDistanceData={durationDistanceData} />
        </div>
      ))}

    </div>
  );
};

export default DurationDistanceChart;
