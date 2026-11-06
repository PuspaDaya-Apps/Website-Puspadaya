// src/components/DashboardSections/PregnancyRiskSection.tsx
import React from 'react';
import CountingCard from "@/components/Card/CountingCard";
import StatistikRisikoKehamilan from "@/components/Charts/StatistikRisikoKehamilan";
import { svgIbuhamil, SvgIconPregnantMother } from "@/components/ui/Svg";
import { DashboardSectionProps } from './types';

const PregnancyRiskSection: React.FC<DashboardSectionProps> = ({ 
  datadash, 
  monthYear 
}) => {
  return (
    <>
      {/* Chart Section */}
      <div className="col-span-8">
        <StatistikRisikoKehamilan />
      </div>

      {/* Cards Section */}
      <div className="col-span-4 flex flex-col justify-between gap-4">
        {/* Pregnant Women Card */}
        <CountingCard
          icon={svgIbuhamil}
          isMeningkat={true}
          jumlah={datadash?.jumlah_ibu_hamil?.jumlah || "0"}
          peningkatan={
            datadash?.jumlah_ibu_hamil?.rate == `null`
              ? `${datadash.jumlah_ibu_hamil.rate}%`
              : "-"
          }
          subtitle={datadash?.jumlah_ibu_hamil?.status || ""}
          title="Jumlah Ibu Hamil"
          title_secound={`Aktif ${monthYear}`}
          color="#EBF3FE"
        />

        {/* Near Delivery Card */}
        <CountingCard
          icon={SvgIconPregnantMother}
          isMeningkat={true}
          jumlah={datadash?.jumlah_ibu_hamil_hpl?.jumlah || "0"}
          peningkatan={
            datadash?.jumlah_ibu_hamil_hpl?.rate == `null`
              ? `${datadash.jumlah_ibu_hamil_hpl.rate}%`
              : "-"
          }
          subtitle={datadash?.jumlah_ibu_hamil_hpl?.status || ""}
          title="Ibu Hamil Menjelang Persalinan"
          title_secound={`Aktif ${monthYear}`}
          color="#EBF3FE"
        />
      </div>
    </>
  );
};

export default PregnancyRiskSection;