import React, { useEffect, useState } from 'react';
import CountingCard from "@/components/Card/CountingCard";
import PercentageCard from "@/components/Card/PercentageCard";
import GrafikPersebaranPosyandu from "@/components/Charts/GrafikPersebaranPosyandu";
import { SvgIconLoveOrange } from "@/components/ui/Svg";
import { DashboardSectionProps } from './types';

const PosyanduDistributionSection: React.FC<DashboardSectionProps> = ({ 
  datadash, 
  monthYear 
}) => {
    const [userRole, setUserRole] = useState<string | null>(null);
  
    useEffect(() => {
      const role = sessionStorage.getItem("user_role");
      setUserRole(role);
    }, []);

  return (
    <>
      <div className="col-span-8">
        { ![ "Ketua Kader"].includes(userRole||"") &&(
        <GrafikPersebaranPosyandu />
         )}
      </div>

      <div className="col-span-4 flex flex-col justify-between gap-4">
        {![ "Ketua Kader"].includes(userRole||"") &&(
        <CountingCard
          icon={SvgIconLoveOrange}
          isMeningkat={true}
          jumlah={datadash?.jumlah_posyandu?.jumlah || "0"}
          peningkatan={
            datadash?.jumlah_posyandu?.rate == `null`
              ? `${datadash.jumlah_posyandu.rate}%`
              : "-"
          }
          title="Jumlah Posyandu"
          title_secound=""
          subtitle={datadash?.jumlah_posyandu?.status || ""}
          color="#EBF3FE"
        />
        )}

        {![ "Ketua Kader"].includes(userRole||"") &&(
          <PercentageCard
              title={"Persentase Jumlah Posyandu"}
              jumlah={100}
                color={["#34B53A", "#F39D00"]}
              data={[
                  {
                  name: "Banyuwangi",
                  value: datadash?.persentase_posyandu?.banyuwangi_rate ?? 0,
                },
                {
                  name: "Maluku Tengah",
                  value: datadash?.persentase_posyandu?.maluku_rate ?? 0,
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