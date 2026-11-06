import React, { useEffect, useState } from "react";
import CountingCard from "@/components/Card/CountingCard";
import PercentageCard from "@/components/Card/PercentageCard";
import GrafikPersebaranKaderDanTingkatAktivitas from "@/components/Charts/GrafikPersebaranKaderDanTingkatAktivitas";
import { SvgIconLoveBlue } from "@/components/ui/Svg";
import { DashboardSectionProps } from "./types";

const KaderDistributionSection: React.FC<DashboardSectionProps> = ({
  datadash,
  monthYear,
}) => {
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const role = sessionStorage.getItem("user_role");
    setUserRole(role);
  }, []);

  return (
    <>
      <div className="col-span-8">
        <GrafikPersebaranKaderDanTingkatAktivitas />
      </div>

      <div className="col-span-4 flex flex-col justify-between gap-4">
        {userRole !== "Dinas Sosial" && (
          <CountingCard
            icon={SvgIconLoveBlue}
            isMeningkat={true}
            jumlah={datadash?.jumlah_kader?.jumlah || "0"}
            peningkatan={
              datadash?.jumlah_kader?.rate == `null`
                ? `${datadash.jumlah_kader.rate}%`
                : "-"
            }
            title="Jumlah Kader"
            title_secound=""
            subtitle={datadash?.jumlah_kader?.status || ""}
            color="#EBF3FE"
          />
        )}

        { !["Ketua Kader", "Kader"].includes(userRole || "") && (
        <PercentageCard
          title="Persentase Jumlah Kader"
          jumlah={100}
          color={["#ef4444", "#3b82f6"]}
          data={[
            {
              name: "Banyuwangi",
              value: datadash?.persentase_kader?.banyuwangi_rate ?? 0,
            },
            {
              name: "Maluku Tengah",
              value: datadash?.persentase_kader?.maluku_rate ?? 0,
            },
          ]}
          label={["Banyuwangi", "Maluku Tengah"]}
          isDinsos={userRole === "Dinas Sosial"}
        />
        )}
      </div>
    </>
  );
};

export default KaderDistributionSection;
