import React from "react";


import { data } from "../../../types/data-25/kaderData";
import PageHeader from "./child/PageHeader";
import KaderCard from "./child/KaderCard";
import KaderStats from "./child/KaderStats";
import KehadiranGrafik from "./child/KehadiranGrafik";
import DurasiJarak from "./child/DurasiJarak";

const DurationDistanceChart: React.FC = () => {
  const kader = data.kader[0];

  return (
    <div className="mt-2 sm:mt-10 space-y-6">
      {/* Header Card */}
      <PageHeader />

      {/* Profil Kader Card */}
      {data.kader.map((kaderItem, index) => (
        <KaderCard key={index} />
      ))}

      {/* Statistik Kehadiran */}
      {data.kader.map((kaderItem, index) => (
        <div key={index} className="mb-6">
          <KaderStats />
        </div>
      ))}

      {/* Grafik dan List Kegiatan */}
      {data.kader.map((kaderItem, index) => (
        <div key={index} className="mb-6">
          <KehadiranGrafik />
        </div>
      ))}

      {/* Visualisasi Durasi dan Jarak */}
      {data.kader.map((kaderItem, index) => (
        <div key={index} className="mb-6">
          <DurasiJarak />
        </div>
      ))}

    </div>
  );
};

export default DurationDistanceChart;
