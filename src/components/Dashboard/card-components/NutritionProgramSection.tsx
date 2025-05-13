import React from 'react';
import { DashboardSectionProps } from './types';
import CountingCard from "@/components/Card/CountingCard";
import StatistikBeratBadanAnak from "@/components/Charts/StatistikBeratBadanAnak";
import { svgIconAsieklusif, svgIconMpasi } from "@/components/ui/Svg";

const NutritionProgramSection: React.FC<DashboardSectionProps> = ({ isLoading, datadash, monthYear }) => {
  return (
    <>
      <div className="col-span-8">
        {isLoading.grafikTrendStuntingBanyuwangi ? (
          <h4>Loading...</h4>
        ) : (
          <StatistikBeratBadanAnak />
        )}
      </div>

      <div className="col-span-4 flex flex-col justify-between gap-10">
        {isLoading.countingCard ? (
          <h4>Loading...</h4>
        ) : (
          <CountingCard
            icon={svgIconAsieklusif}
            isMeningkat={true}
            jumlah={datadash?.jumlah_anak_asi_ekslusif.jumlah ?? "0"}
            peningkatan={
              datadash?.jumlah_anak_asi_ekslusif.rate == `null`
                ? `${datadash.jumlah_anak_asi_ekslusif.rate}%`
                : "-"
            }
            subtitle={datadash?.jumlah_anak_asi_ekslusif.status ?? ""}
            title="Jumlah Anak Asi Eklusif"
            title_secound={`Aktif ${monthYear}`}
            color={"#EBF3FE"}
          />
        )}

        {isLoading.countingCard ? (
          <h4>Loading...</h4>
        ) : (
          <CountingCard
            icon={svgIconMpasi}
            isMeningkat={true}
            jumlah={datadash?.jumlah_anak_mpasi.jumlah ?? "0"}
            peningkatan={
              datadash?.jumlah_anak_mpasi.rate == `null`
                ? `${datadash.jumlah_anak_mpasi.rate}%`
                : "-"
            }
            subtitle={datadash?.jumlah_anak_mpasi.status ?? ""}
            title="Jumlah Anak Mpasi"
            title_secound={`Aktif ${monthYear}`}
            color={"#EBF3FE"}
          />
        )}
      </div>
    </>
  );
};

export default NutritionProgramSection;