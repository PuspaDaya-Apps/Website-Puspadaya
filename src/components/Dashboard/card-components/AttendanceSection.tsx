import React from 'react';
import { DashboardSectionProps } from './types';
import CountingCard from "@/components/Card/CountingCard";
import StatistikKehadiranAnak from "@/components/Charts/StatistikKehadiranAnak";
import { svgIconAnakHadir, svgIconAnaklulus } from "@/components/ui/Svg";

const AttendanceSection: React.FC<DashboardSectionProps> = ({ datadash, monthYear }) => {
  return (
    <>
      <div className="col-span-8">
        <StatistikKehadiranAnak />
      </div>

      <div className="col-span-4 flex flex-col justify-between gap-10">
        <CountingCard
          icon={svgIconAnakHadir}
          isMeningkat={true}
          jumlah={datadash?.jumlah_anak_hadir?.jumlah ?? "0"}
          peningkatan={
            datadash?.jumlah_anak_hadir?.rate == `null`
              ? `${datadash.jumlah_anak_hadir.rate}%`
              : "-"
          }
          subtitle={datadash?.jumlah_anak_hadir?.status ?? ""}
          title="Jumlah Anak Hadir"
          title_secound={`Aktif ${monthYear}`}
          color={"#EBF3FE"}
        />

        <CountingCard
          icon={svgIconAnaklulus}
          isMeningkat={true}
          jumlah={datadash?.jumlah_anak_lulus?.jumlah ?? "0"}
          peningkatan={
            datadash?.jumlah_anak_lulus?.rate == `null`
              ? `${datadash.jumlah_anak_lulus.rate}%`
              : "-"
          }
          subtitle={datadash?.jumlah_anak_lulus?.status ?? ""}
          title="Jumlah Anak Lulus"
          title_secound={`Aktif ${monthYear}`}
          color={"#EBF3FE"}
        />
      </div>
    </>
  );
};

export default AttendanceSection;