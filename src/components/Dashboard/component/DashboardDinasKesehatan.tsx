"use client";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import PercentageCard from "@/components/Card/PercentageCard";
import GrafikTrendStuntingBanyuwangi from "@/components/Charts/TingkatGiziAnakWilayahDesa TingkatGiziAnakWilayahDesa";
import CountingCard from "@/components/Card/CountingCard";
import { statistikDashboard } from "@/app/api/statistik/statistik";
import { svgIbuhamil, svgIconAnakHadir, SvgIconAnakHadir, svgIconAnaklulus, svgIconAsieklusif, SvgIconBayi, SvgIconLoveBlue, SvgIconLoveOrange, svgIconMpasi, SvgIconPregnantMother, svgIconTingkatpartisispasi, SvgIconVillage, svgIxonJangankauan, svgStunting, svgUnderweight, svgWasting } from "@/components/ui/Svg";
import ChartJumlahBalitaHadir from "@/components/Charts/StatistikKehadiranAnak"; //
import ChartDonatBeratBadan from "@/components/Charts/ChartDonatBeratBadan";
import ChartPerhitunganSkdn from "@/components/Charts/ChartPerhitunganSkdn";
import CountingCardDesa from "@/components/Card/CountingCardDesa";
import MapPersebaranBalitaStunting from "@/components/Charts/PetaPersebaranAnakStunting";
import GrafikPersebaranPosyandu from "@/components/Charts/GrafikPersebaranPosyandu";
import GrafikPersebaranKaderDanTingkatAktivitas from "@/components/Charts/GrafikPersebaranKaderDanTingkatAktivitas";
import MapPersebaranBalitaBerdasarkanWIlayah from "@/components/Charts/MapPersebaranBalitaBerdasarkanWIlayah";
import MapPersebaranKader from "@/components/Charts/MapPersebaranKader";
import MapPersebaranKeluargaTanpaMCK from "@/components/Charts/MapPersebaranKeluargaTanpaMCK";
import GrafikTrendStuntingBalita from "@/components/Charts/GrafikTrendGiziBalita GrafikTrendGiziBalita";
import StatistikRisikoKehamilan from "@/components/Charts/StatistikRisikoKehamilan";
import StatistikNikOrangTua from "@/components/Charts/StatistikNikOrangTua;";

const DashboardDinasKesehatan = () => {
  const colors = ["#34B53A", "#F39D00"];
  const [datadash, setData] = useState<any | null>(null);
  const label = ["Banyuwangi", "Maluku Tengah"];
  const [loading, setLoading] = useState<boolean>(true);

  const data = [
    {
      name: "Banyuwangi",
      value: datadash?.persentase_posyandu.banyuwangi_rate ?? 0,
    },
    {
      name: "Maluku Tengah",
      value: datadash?.persentase_posyandu.maluku_rate ?? 0,
    },
  ];

  const [error, setError] = useState<string | null>(null);

  const [items, setItems] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const [isLoading, setIsLoading] = useState({
    grafikTrendStuntingBalita: true,
    grafikTrendStuntingBanyuwangi: true,
    mapPersebaranBalitaStunting: true,
    mapPersebaranBalitaBerdasarkanWilayah: true,
    grafikPersebaranPosyandu: true,
    grafikPersebaranKaderDanTingkatAktivitas: true,
    mapPersebaranKader: true,
    mapPersebaranKeluargaTanpaMCK: true,
    countingCard: true,
    countingCardRow: true,
  });

  const currentDate = new Date();
  const monthYear = currentDate.toLocaleString("id-ID", {
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    const fetchData = async () => {

      await new Promise((resolve) => setTimeout(resolve, 2000));
      const result = await statistikDashboard();

      // console.log("Fetched Data:", result);

      if (result.successCode === 200 && result.data) {
        setData(result.data);
        setError(null);
      } else {
        setData(null);
        setError("Error fetching data. Please try again.");
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  const fetchMoreData = () => {
    if (items.length >= 10000) {
      setHasMore(false);
      return;
    }

    // Simulasikan loading dengan delay
    setTimeout(() => {
      setItems(items.concat(Array.from({ length: 20 })));
    }, 2000); // Delay 2 detik untuk setiap batch data
  };

  useEffect(() => {
    setTimeout(() => {
      setIsLoading((prev) => ({ ...prev, countingCard: false }));
    }, 5000);

    setTimeout(() => {
      setIsLoading((prev) => ({ ...prev, countingCardRow: false }));
    }, 5000);

    // Simulasikan loading untuk setiap komponen dengan delay yang berbeda
    setTimeout(() => {
      setIsLoading((prev) => ({ ...prev, grafikTrendStuntingBalita: false }));
    }, 8000);

    setTimeout(() => {
      setIsLoading((prev) => ({
        ...prev,
        grafikTrendStuntingBanyuwangi: false,
      }));
    }, 17000);

    setTimeout(() => {
      setIsLoading((prev) => ({ ...prev, mapPersebaranBalitaStunting: false }));
    }, 19000);

    setTimeout(() => {
      setIsLoading((prev) => ({
        ...prev,
        mapPersebaranBalitaBerdasarkanWilayah: false,
      }));
    }, 23000);

    setTimeout(() => {
      setIsLoading((prev) => ({ ...prev, grafikPersebaranPosyandu: false }));
    }, 26000);

    setTimeout(() => {
      setIsLoading((prev) => ({
        ...prev,
        grafikPersebaranKaderDanTingkatAktivitas: false,
      }));
    }, 26000);

    setTimeout(() => {
      setIsLoading((prev) => ({ ...prev, mapPersebaranKader: false }));
    }, 35000);

    setTimeout(() => {
      setIsLoading((prev) => ({
        ...prev,
        mapPersebaranKeluargaTanpaMCK: false,
      }));
    }, 38000);
  }, []);

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-black">Dashboard</h1>
        <p className="mt-1 text-black">Pantau perkembangan keluarga dan kader disini!</p>
      </div>

      <InfiniteScroll
        dataLength={items.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<h4></h4>}
      >
        <div className="grid grid-cols-12 gap-10">
          <div className="col-span-8">
            {isLoading.grafikTrendStuntingBalita ? (
              <h4>Loading...</h4>
            ) : (
              <GrafikTrendStuntingBalita />
            )}
          </div>

          <div className="col-span-4 flex flex-col justify-between gap-10">
            {isLoading.countingCard ? (
              <h4>Loading...</h4>
            ) : (
              <CountingCard
                icon={SvgIconBayi}
                isMeningkat={true}
                jumlah={datadash?.jumlah_anak.jumlah ?? "-"}
                peningkatan={datadash?.jumlah_anak.rate ?? "-"}
                subtitle={datadash?.jumlah_anak.status ?? "-"}
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
                jumlah={datadash?.jumlah_anak_stunting.jumlah}
                peningkatan={datadash?.jumlah_anak_stunting.rate ?? "-"}
                subtitle={datadash?.jumlah_anak_stunting.status ?? "-"}
                title="Jumlah Anak Stunting"
                title_secound={`Aktif ${monthYear}`}
                color={"#EBF3FE"}
              />
            )}
          </div>

          <div className="col-span-8">
            {isLoading.grafikTrendStuntingBanyuwangi ? (
              <h4>Loading...</h4>
            ) : (
              <GrafikTrendStuntingBanyuwangi />
            )}
          </div>

          <div className="col-span-4 flex flex-col justify-between gap-10">
            {isLoading.countingCard ? (
              <h4>Loading...</h4>
            ) : (
              <CountingCard
                icon={svgUnderweight}
                isMeningkat={false}
                jumlah={datadash?.jumlah_anak_underweight.jumlah}
                peningkatan={datadash?.jumlah_anak_underweight.rate ?? "-"}
                subtitle={datadash?.jumlah_anak_underweight.status ?? "-"}
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
                jumlah={datadash?.jumlah_anak_wasting.jumlah}
                peningkatan={datadash?.jumlah_anak_wasting.rate ?? "-"}
                subtitle={datadash?.jumlah_anak_wasting.status ?? "-"}
                title="Jumlah Anak Wasting"
                title_secound={`Aktif ${monthYear}`}
                color={"#EBF3FE"}
              />
            )}
          </div>

          <div className="col-span-8">
            {isLoading.grafikTrendStuntingBanyuwangi ? (
              <h4>Loading...</h4>
            ) : (
              <ChartJumlahBalitaHadir />
            )}
          </div>

          <div className="col-span-4 flex flex-col justify-between gap-10">
            {isLoading.countingCard ? (
              <h4>Loading...</h4>
            ) : (
              <CountingCard
                icon={svgIconAnakHadir}
                isMeningkat={true}
                jumlah={datadash?.jumlah_anak_hadir.jumlah}
                peningkatan={datadash?.jumlah_anak_hadir.rate ?? "-"}
                subtitle={datadash?.jumlah_anak_hadir.status ?? "-"}
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
                jumlah={datadash?.jumlah_anak_lulus.jumlah}
                peningkatan={datadash?.jumlah_anak_lulus.rate ?? "-"}
                subtitle={datadash?.jumlah_anak_lulus.status ?? "-"}
                title="Jumlah Anak Lulus"
                title_secound={`Aktif ${monthYear}`}
                color={"#EBF3FE"}
              />


            )}
          </div>

          {/* testing 3*/}

          <div className="col-span-8">
            {isLoading.grafikTrendStuntingBanyuwangi ? (
              <h4>Loading...</h4>
            ) : (
              <ChartDonatBeratBadan />
            )}
          </div>

          <div className="col-span-4 flex flex-col justify-between gap-10">

          {isLoading.countingCard ? (
              <h4>Loading...</h4>
            ) : (
              <CountingCard
                icon={svgIconAsieklusif}
                isMeningkat={true}
                jumlah={datadash?.jumlah_anak_asi_ekslusif.jumlah}
                peningkatan={datadash?.jumlah_anak_asi_ekslusif.rate ?? "-"}
                subtitle={datadash?.jumlah_anak_asi_ekslusif.status ?? "-"}
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
                jumlah={datadash?.jumlah_anak_mpasi.jumlah}
                peningkatan={datadash?.jumlah_anak_mpasi.rate ?? "-"}
                subtitle={datadash?.jumlah_anak_mpasi.status ?? "-"}
                title="Jumlah Anak Mpasi"
                title_secound={`Aktif ${monthYear}`}
                color={"#EBF3FE"}
              />
            )}
           
            
          </div>


          {/* Perhitungan SKDN */}
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
                jumlah={datadash?.perhitungan_skdn.D_S.jumlah}
                peningkatan={datadash?.perhitungan_skdn.D_S.rate ?? "-"}
                subtitle={datadash?.perhitungan_skdn.D_S.status ?? "-"}
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
                jumlah={datadash?.perhitungan_skdn.K_S.jumlah}
                peningkatan={datadash?.perhitungan_skdn.K_S.rate ?? "-"}
                subtitle={datadash?.perhitungan_skdn.K_S.status ?? "-"}
                title="Jangkauan Posyandu terhadap Balita KMS"
                title_secound={`Aktif ${monthYear}`}
                color={"#EBF3FE"}
              />
            )}
          </div>

          {/* Statistik NIK */}

          <div className="col-span-8 gap ">
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
              <CountingCardDesa
                icon={SvgIconVillage}
                isMeningkat={true}
                jumlah={datadash?.jumlah_desa.jumlah}
                jumlah_keluarga={datadash?.keluarga_tanpa_mck.jumlah}
                peningkatan={datadash?.jumlah_desa.rate ?? "-"}
                subtitle={datadash?.jumlah_desa.status ?? "-"}
                title="Jumlah Desa"
                title_secound={`Aktif ${monthYear}`}
                color={"#EBF3FE"}
              />
            )}

            {isLoading.countingCard ? (
              <h4>Loading...</h4>
            ) : (
              <CountingCard
                icon={SvgIconAnakHadir}
                isMeningkat={true}
                jumlah={datadash?.jumlah_orang_tua_tidak_punya_kk?.jumlah}
                peningkatan={datadash?.jumlah_orang_tua_tidak_punya_kk.rate ?? "-"}
                subtitle={datadash?.jumlah_orang_tua_tidak_punya_kk.status ?? "-"}
                title="Jumlah Orang Tua Tidak Memiliki Kartu Keluarga"
                title_secound={`Aktif ${monthYear}`}
                color={"#EBF3FE"}
              />
            )}

          </div>

          {/* Perhitungan Ibu Hamil */}
          <div className="col-span-8">
            {isLoading.grafikTrendStuntingBanyuwangi ? (
              <h4>Loading...</h4>
            ) : (
              <StatistikRisikoKehamilan />
            )}
          </div>

          <div className="col-span-4 flex flex-col justify-between gap-10">

            {isLoading.countingCard ? (
              <h4>Loading...</h4>
            ) : (
              <CountingCard
                icon={svgIbuhamil}
                isMeningkat={true}
                jumlah={datadash?.jumlah_ibu_hamil.jumlah ?? "-"}
                peningkatan={datadash?.jumlah_ibu_hamil.rate ?? "-"}
                subtitle={datadash?.jumlah_ibu_hamil.status ?? "-"}
                title="Jumlah Ibu Hamil"
                title_secound={`Aktif ${monthYear}`}
                color={"#EBF3FE"}
              />
            )}
            {/* end point ini ndak ada */}
            {isLoading.countingCard ? (
              <h4>Loading...</h4>
            ) : (
              <CountingCard
                icon={SvgIconPregnantMother}
                isMeningkat={true}
                jumlah={datadash?.jumlah_ibu_hamil.jumlah ?? "-"}
                peningkatan={datadash?.jumlah_ibu_hamil.rate ?? "-"}
                subtitle={datadash?.jumlah_ibu_hamil.status ?? "-"}
                title="Jumlah Ibu Hamil Menjelang Persalinan"
                title_secound={`Aktif ${monthYear}`}
                color={"#EBF3FE"}
              />
            )}
          </div>

          {/* ini mapya */}
          <div className="col-span-12 w-full rounded-lg bg-white p-10 shadow-lg">
            {isLoading.mapPersebaranBalitaStunting ? (
              <h4>Loading...</h4>
            ) : (
              <MapPersebaranBalitaStunting />
            )}
          </div>

          <div className="col-span-8">
            {isLoading.grafikPersebaranPosyandu ? (
              <h4>Loading...</h4>
            ) : (
              <GrafikPersebaranPosyandu />
            )}
          </div>

          <div className="col-span-4 flex flex-col justify-between gap-10">
            {isLoading.countingCard ? (
              <h4>Loading...</h4>
            ) : (
              <CountingCard
                icon={SvgIconLoveOrange}
                isMeningkat={true}
                jumlah={datadash?.jumlah_posyandu.jumlah}
                peningkatan={datadash?.jumlah_posyandu.rate ?? "-"}
                title="Jumlah Posyandu"
                title_secound=""
                subtitle={datadash?.jumlah_posyandu.status ?? "-"}
                color={"#EBF3FE"}
              />
            )}

            {isLoading.countingCard ? (
              <h4>Loading...</h4>
            ) : (
              <PercentageCard
                title={"Persentase Jumlah Posyandu"}
                jumlah= {100}
                color= {colors}
                data= {data}
                label= {label}
              />
            )}

          </div>

          <div className="col-span-8">
            {isLoading.grafikPersebaranKaderDanTingkatAktivitas ? (
              <h4>Loading...</h4>
            ) : (
              <GrafikPersebaranKaderDanTingkatAktivitas />
            )}
          </div>

          <div className="col-span-4 flex flex-col justify-between gap-4">
            {isLoading.countingCard ? (
              <h4>Loading...</h4>
            ) : (
              <CountingCard
                icon={SvgIconLoveBlue}
                isMeningkat={true}
                jumlah={datadash?.jumlah_kader.jumlah}
                peningkatan={datadash?.jumlah_kader.rate ?? "-"}
                title="Jumlah Kader"
                title_secound=""
                subtitle={datadash?.jumlah_kader.status ?? ""}
                color={"#EBF3FE"}
              />
            )}

            {isLoading.countingCardRow ? (
              <h4>Loading...</h4>
            ) : (
              <PercentageCard
                title={"Persentase Jumlah Kader"}
                jumlah={100}
                color={["#ef4444", "#3b82f6"]}
                data={[
                  {
                    name: "Banyuwangi",
                    value:
                      datadash?.persentase_kader.banyuwangi_rate ?? 0,
                  },
                  {
                    name: "Maluku Tengah",
                    value: datadash?.persentase_kader.maluku_rate ?? 0,
                  },
                ]}
                label={["Banyuwangi", "Maluku Tengah"]}
              />
            )}
          </div>

          <div className="col-span-12 w-full rounded-lg bg-white p-10 shadow-lg">
            {isLoading.mapPersebaranBalitaBerdasarkanWilayah ? (
              <h4>Loading...</h4>
            ) : (
              <MapPersebaranBalitaBerdasarkanWIlayah />
            )}
          </div>

          <div className="col-span-12 w-full rounded-lg bg-white p-10 shadow-lg">
            {isLoading.mapPersebaranKader ? (
              <h4>Loading...</h4>
            ) : (
              <MapPersebaranKader />
            )}
          </div>
          <div className="col-span-12 w-full rounded-lg bg-white p-10 shadow-lg">
            {isLoading.mapPersebaranKeluargaTanpaMCK ? (
              <h4>Loading...</h4>
            ) : (
              <MapPersebaranKeluargaTanpaMCK />
            )}
          </div>
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default DashboardDinasKesehatan;