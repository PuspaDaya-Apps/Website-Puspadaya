import React from 'react';
import { DashboardSectionProps } from './types';
import CountingCard from "@/components/Card/CountingCard";
import ChartPerhitunganSkdn from "@/components/Charts/ChartPerhitunganSkdn";
import { svgIconTingkatpartisispasi, svgIxonJangankauan } from "@/components/ui/Svg";

const SKDNSection: React.FC<DashboardSectionProps> = ({ isLoading, datadash, monthYear }) => {
  return (
    <>
      <div className="col-span-8">
        {isLoading.grafikTrendStuntingBanyuwangi ? (
          <h4>Loading...</h4>
        ) : (
          <ChartPerhitunganSkdn />
        )}
      </div>

      <div className="col-span-4 flex flex-col justify-between gap-10">
        {isLoading.countingCard ? (
          <h4>Loading...</h4>
        ) : (
          <CountingCard
            icon={svgIconTingkatpartisispasi}
            isMeningkat={true}
            jumlah={datadash?.perhitungan_skdn.D_S.jumlah ?? "0"}
            peningkatan={
              datadash?.perhitungan_skdn.D_S.rate !== undefined
                ? `${datadash.perhitungan_skdn.D_S.rate}%`
                : "-"
            }
            subtitle={datadash?.perhitungan_skdn.D_S.status ?? ""}
            title="Tingkat Partisipasi Posyandu"
            title_secound={`Aktif ${monthYear}`}
            color={"#EBF3FE"}
          />
        )}

        {isLoading.countingCard ? (
          <h4>Loading...</h4>
        ) : (
          <CountingCard
            icon={svgIxonJangankauan}
            isMeningkat={true}
            jumlah={datadash?.perhitungan_skdn.K_S.jumlah ?? "0"}
            peningkatan={
              datadash?.perhitungan_skdn.K_S.rate !== undefined
                ? `${datadash.perhitungan_skdn.K_S.rate}%`
                : "-"
            }
            subtitle={datadash?.perhitungan_skdn.K_S.status ?? ""}
            title="Jangkauan Posyandu terhadap Balita KMS"
            title_secound={`Aktif ${monthYear}`}
            color={"#EBF3FE"}
          />
        )}
      </div>
    </>
  );
};

export default SKDNSection;