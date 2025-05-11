import React from 'react';
import { DashboardSectionProps } from './types';
import CountingCard from "@/components/Card/CountingCard";
import StatistikKehadiranAnak from "@/components/Charts/StatistikKehadiranAnak";
import { svgIconAnakHadir, svgIconAnaklulus } from "@/components/ui/Svg";

const AttendanceSection: React.FC<DashboardSectionProps> = ({ isLoading, datadash, monthYear }) => {
  return (
    <>
      <div className="col-span-8">
        {isLoading.grafikTrendStuntingBanyuwangi ? (
          <h4>Loading...</h4>
        ) : (
          <StatistikKehadiranAnak />
        )}
      </div>

      <div className="col-span-4 flex flex-col justify-between gap-10">
        {isLoading.countingCard ? (
          <h4>Loading...</h4>
        ) : (
          <CountingCard
            icon={svgIconAnakHadir}
            isMeningkat={true}
            jumlah={datadash?.jumlah_anak_hadir.jumlah ?? "0"}
            peningkatan={
              datadash?.jumlah_anak_hadir.rate !== undefined
                ? `${datadash.jumlah_anak_hadir.rate}%`
                : "-"
            }
            subtitle={datadash?.jumlah_anak_hadir.status ?? ""}
            title="Jumlah Anak Hadir"
            title_secound={`Aktif ${monthYear}`}
            color={"#EBF3FE"}
          />
        )}

        {isLoading.countingCard ? (
          <h4>Loading...</h4>
        ) : (
          <CountingCard
            icon={svgIconAnaklulus}
            isMeningkat={true}
            jumlah={datadash?.jumlah_anak_lulus.jumlah ?? "0"}
            peningkatan={
              datadash?.jumlah_anak_lulus.rate !== undefined
                ? `${datadash.jumlah_anak_lulus.rate}%`
                : "-"
            }
            subtitle={datadash?.jumlah_anak_lulus.status ?? ""}
            title="Jumlah Anak Lulus"
            title_secound={`Aktif ${monthYear}`}
            color={"#EBF3FE"}
          />
        )}
      </div>
    </>
  );
};

export default AttendanceSection;