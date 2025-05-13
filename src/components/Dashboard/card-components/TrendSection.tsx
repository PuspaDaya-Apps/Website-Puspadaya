import React from 'react';
import { DashboardSectionProps } from './types';
import CountingCard from "@/components/Card/CountingCard";
import { SvgIconBayi, svgStunting } from "@/components/ui/Svg";
import GrafikTrendGiziBalita from '@/components/Charts/GrafikTrendGiziBalita GrafikTrendGiziBalita';

const TrendSection: React.FC<DashboardSectionProps> = ({ isLoading, datadash, monthYear }) => {
  return (
    <>
      <div className="col-span-8">
        {isLoading.grafikTrendStuntingBalita ? (
          <h4>Loading...</h4>
        ) : (
          <GrafikTrendGiziBalita />
        )}
      </div>

      <div className="col-span-4 flex flex-col justify-between gap-10">
        {isLoading.countingCard ? (
          <h4>Loading...</h4>
        ) : (
          <CountingCard
            icon={SvgIconBayi}
            isMeningkat={true}
            jumlah= {datadash?.jumlah_anak.jumlah ?? "0"}
            peningkatan={
              datadash?.jumlah_anak.rate == `null`
                ? `${datadash.jumlah_anak.rate}%`
                : "-"
            }
            subtitle={datadash?.jumlah_anak.status ?? ""}
            title="Jumlah Anak Keseluruhan"
            title_secound={`Aktif ${monthYear}`}
            color={"#EBF3FE"}
          />
        )}

        {isLoading.countingCard ? (
          <h4>Loading...</h4>
        ) : (
          <CountingCard
            icon={svgStunting}
            isMeningkat={false}
            jumlah={datadash?.jumlah_anak_stunting.jumlah ?? "0"}
            peningkatan={
              datadash?.jumlah_anak_stunting.rate == `null`
                ? `${datadash.jumlah_anak_stunting.rate}%`
                : "-"
            }
            subtitle={datadash?.jumlah_anak_stunting.status ?? ""}
            title="Jumlah Anak Stunting"
            title_secound={`Aktif ${monthYear}`}
            color={"#EBF3FE"}
          />
        )}
      </div>
    </>
  );
};

export default TrendSection;