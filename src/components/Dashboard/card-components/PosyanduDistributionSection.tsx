import React from 'react';
import CountingCard from "@/components/Card/CountingCard";
import PercentageCard from "@/components/Card/PercentageCard";
import GrafikPersebaranPosyandu from "@/components/Charts/GrafikPersebaranPosyandu";
import { SvgIconLoveOrange } from "@/components/ui/Svg";
import { DashboardSectionProps } from './types';

const PosyanduDistributionSection: React.FC<DashboardSectionProps> = ({ 
  isLoading, 
  datadash, 
  monthYear 
}) => {

  return (
    <>
      <div className="col-span-8">
        {isLoading.grafikPersebaranPosyandu ? (
          <div className="h-[400px] bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
            Memuat grafik posyandu...
          </div>
        ) : (
          <GrafikPersebaranPosyandu />
        )}
      </div>

      <div className="col-span-4 flex flex-col justify-between gap-4">
        {isLoading.countingCard ? (
          <div className="h-48 bg-gray-100 rounded-lg animate-pulse"></div>
        ) : (
          <CountingCard
            icon={SvgIconLoveOrange}
            isMeningkat={true}
            jumlah={datadash?.jumlah_posyandu?.jumlah || "0"}
            peningkatan={
              datadash?.jumlah_posyandu?.rate != null
                ? `${datadash.jumlah_posyandu.rate}%`
                : "-"
            }
            title="Jumlah Posyandu"
            title_secound=""
            subtitle={datadash?.jumlah_posyandu?.status || ""}
            color="#EBF3FE"
          />
        )}

        {isLoading.countingCard ? (
          <div className="h-48 bg-gray-100 rounded-lg animate-pulse"></div>
        ) : (
            <PercentageCard
                title={"Persentase Jumlah Posyandu"}
                jumlah={100}
                  color={["#34B53A", "#F39D00"]}
                data={[
                    {
                    name: "Banyuwangi",
                    value: datadash?.persentase_posyandu.banyuwangi_rate ?? 0,
                  },
                  {
                    name: "Maluku Tengah",
                    value: datadash?.persentase_posyandu.maluku_rate ?? 0,
                  },
                ]}
                label={["Banyuwangi", "Maluku Tengah"]}
              />
        )}
      </div>
    </>
  );
};

export default PosyanduDistributionSection;