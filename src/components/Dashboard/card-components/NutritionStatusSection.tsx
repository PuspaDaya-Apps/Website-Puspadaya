import React from 'react';
import { DashboardSectionProps } from './types';
import CountingCard from "@/components/Card/CountingCard";
import { svgUnderweight, svgWasting } from "@/components/ui/Svg";
import TingkatGiziAnakWilayahDesa from '@/components/Charts/TingkatGiziAnakWilayahDesa';

const NutritionStatusSection: React.FC<DashboardSectionProps> = ({ datadash, monthYear }) => {
  return (
    <>
      <div className="col-span-8">
        <TingkatGiziAnakWilayahDesa />
      </div>

      <div className="col-span-4 flex flex-col justify-between gap-10">
        <CountingCard
          icon={svgUnderweight}
          isMeningkat={false}
          jumlah={datadash?.jumlah_anak_underweight?.jumlah ?? "0"}
          peningkatan={
            datadash?.jumlah_anak_underweight?.rate == `null`
              ? `${datadash.jumlah_anak_underweight.rate}%`
              : "-"
          }
          subtitle={datadash?.jumlah_anak_underweight?.status ?? ""}
          title="Jumlah Anak Underweight"
          title_secound={`Aktif ${monthYear}`}
          color={"#EBF3FE"}
        />

        <CountingCard
          icon={svgWasting}
          isMeningkat={false}
          jumlah={datadash?.jumlah_anak_wasting?.jumlah ?? "0"}
          peningkatan={
            datadash?.jumlah_anak_wasting?.rate == `null`
              ? `${datadash.jumlah_anak_wasting.rate}%`
              : "-"
          }
          subtitle={datadash?.jumlah_anak_wasting?.status ?? ""}
          title="Jumlah Anak Wasting"
          title_secound={`Aktif ${monthYear}`}
          color={"#EBF3FE"}
        />
      </div>
    </>
  );
};

export default NutritionStatusSection;