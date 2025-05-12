import React, { useEffect, useState } from 'react';
import { DashboardSectionProps } from './types';
import CountingCard from "@/components/Card/CountingCard";
import CountingCardDesa from "@/components/Card/CountingCardDesa";
import { SvgIconVillage, SvgIconAnakHadir } from "@/components/ui/Svg";
import StatistikNikOrangTua from '@/components/Charts/StatistikNikOrangTua;';

const NIKStatisticsSection: React.FC<DashboardSectionProps> = ({ isLoading, datadash, monthYear }) => {

  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const role = sessionStorage.getItem("user_role");
    setUserRole(role);
  }, []);

  return (
    <>
      <div className="col-span-8">
        {isLoading.grafikTrendStuntingBanyuwangi ? (
          <h4>Loading...</h4>
        ) : (
          <StatistikNikOrangTua />
        )}
      </div>

      <div className="col-span-4 flex flex-col justify-between gap-10">
        {isLoading.countingCard ? (
          <h4>Loading...</h4>
        ) : (
          !["Kepala Desa", "TPG", "Ketua Kader", "Kader"].includes(userRole || "") && (
            <CountingCardDesa
              icon={SvgIconVillage}
              isMeningkat={true}
              jumlah={datadash?.jumlah_desa.jumlah ?? "0"}
              jumlah_keluarga={datadash?.keluarga_tanpa_mck.jumlah ?? "0"}
              peningkatan={
                datadash?.jumlah_desa.rate !== undefined
                  ? `${datadash.jumlah_desa.rate}%`
                  : "-"
              }
              subtitle={datadash?.jumlah_desa.status ?? ""}
              title="Jumlah Desa"
              title_secound={`Aktif ${monthYear}`}
              color={"#EBF3FE"}
            />
          )
        )}

        {isLoading.countingCard ? (
          <h4>Loading...</h4>
        ) : (
          ["Ketua Kader", "Kader"].includes(userRole || "") && (
            <CountingCard
              icon={SvgIconAnakHadir}
              isMeningkat={true}
              jumlah={datadash?.keluarga_tanpa_mck?.jumlah ?? "0"}
              peningkatan={
                datadash?.keluarga_tanpa_mck.rate !== undefined
                  ? `${datadash.keluarga_tanpa_mck.rate}%`
                  : "-"
              }
              subtitle={datadash?.keluarga_tanpa_mck.status ?? ""}
              title="Jumlah Keluarga Tanpa MCK"
              title_secound={`Aktif ${monthYear}`}
              color={"#EBF3FE"}
            />
          )
        )}

        {isLoading.countingCard ? (
          <h4>Loading...</h4>
        ) : (

          <CountingCard
            icon={SvgIconAnakHadir}
            isMeningkat={true}
            jumlah={datadash?.jumlah_orang_tua_tidak_punya_kk?.jumlah ?? "0"}
            peningkatan={
              datadash?.jumlah_orang_tua_tidak_punya_kk.rate !== undefined
                ? `${datadash.jumlah_orang_tua_tidak_punya_kk.rate}%`
                : "-"
            }
            subtitle={datadash?.jumlah_orang_tua_tidak_punya_kk.status ?? ""}
            title="Jumlah Orang Tua Tidak Memiliki Kartu Keluarga"
            title_secound={`Aktif ${monthYear}`}
            color={"#EBF3FE"}
          />
        )}
      </div>
    </>
  );
};

export default NIKStatisticsSection;