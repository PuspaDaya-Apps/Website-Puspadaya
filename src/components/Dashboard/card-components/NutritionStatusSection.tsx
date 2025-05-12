import React from 'react';
import { DashboardSectionProps } from './types';
import CountingCard from "@/components/Card/CountingCard";
import { svgUnderweight, svgWasting } from "@/components/ui/Svg";
import TingkatGiziAnakWilayahDesa from '@/components/Charts/TingkatGiziAnakWilayahDesa';

const NutritionStatusSection: React.FC<DashboardSectionProps> = ({ isLoading, datadash, monthYear }) => {
  return (
    <>
      <div className="col-span-8">
        {isLoading.grafikTrendStuntingBanyuwangi ? (
          <h4>Loading...</h4>
        ) : (
          <TingkatGiziAnakWilayahDesa />
        )}
      </div>

      <div className="col-span-4 flex flex-col justify-between gap-10">
        {isLoading.countingCard ? (
          <h4>Loading...</h4>
        ) : (
          <CountingCard
            icon={svgUnderweight}
            isMeningkat={false}
            jumlah={datadash?.jumlah_anak_underweight.jumlah ?? "0"}
            peningkatan={
              datadash?.jumlah_anak_underweight.rate !== undefined
                ? `${datadash.jumlah_anak_underweight.rate}%`
                : "-"
            }
            subtitle={datadash?.jumlah_anak_underweight.status ?? ""}
            title="Jumlah Anak Underweight"
            title_secound={`Aktif ${monthYear}`}
            color={"#EBF3FE"}
          />
        )}

        {isLoading.countingCard ? (
          <h4>Loading...</h4>
        ) : (
          <CountingCard
            icon={svgWasting}
            isMeningkat={false}
            jumlah={datadash?.jumlah_anak_wasting.jumlah ?? "0"}
            peningkatan={
              datadash?.jumlah_anak_wasting.rate !== undefined
                ? `${datadash.jumlah_anak_wasting.rate}%`
                : "-"
            }
            subtitle={datadash?.jumlah_anak_wasting.status ?? ""}
            title="Jumlah Anak Wasting"
            title_secound={`Aktif ${monthYear}`}
            color={"#EBF3FE"}
          />
        )}
      </div>
    </>
  );
};

export default NutritionStatusSection;