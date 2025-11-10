import React from "react";
import KaderCard from "../components-kader-25/KaderCard";
import KaderStats from "../components-kader-25/KaderStats";
import KehadiranGrafik from "../components-kader-25/KehadiranGrafik";
import DurasiJarak from "../components-kader-25/DurasiJarak";

import { data } from "../../../types/data-25/kaderData";
import PageHeader from "../components-kader-25/PageHeader";

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
