"use client";
import { ApexOptions } from "apexcharts";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { Dropdown } from "primereact/dropdown";
import { trendPersebaranKader } from "@/app/api/statistik/trendpersebarankader";
import { DesakelurahanClass, KabupatenClass, KecamatanClass } from "@/types/dashborad";
import { Desakelurahanwilayahaktivitas } from "@/app/api/lokasi/desaaktivitas";
import { Kabupatenwilayahaktivitas } from "@/app/api/lokasi/kabupatenaktivitas";
import { Kecamatanwilayahaktivitas } from "@/app/api/lokasi/kecamatanaktivitas";
const color = ["#3b82f6", "#ef4444"];

interface Wilayah {
  id: string;
  name: string;
}

interface Kecamatan {
  id: string;
  name: string;
  kabupaten_kota: {
    id: string;
  };
}

interface Desa {
  id: string;
  name: string;
  kecamatan: {
    id: string;
  };
}

interface StatistikData {
  categories: string[];
  aktif: number[];
  tidakAktif: number[];
}

const GrafikPersebaranKaderDanTingkatAktivitas: React.FC = () => {
  const [selectedWilayah, setSelectedWilayah] = useState<Wilayah | null>(null);
  const [selectedKecamatan, setSelectedKecamatan] = useState<Kecamatan | null>(null);
  const [selectedDesa, setSelectedDesa] = useState<Desa | null>(null);

  const [datadash, setData] = useState<KabupatenClass[] | null>(null);
  const [datakec, setkecData] = useState<KecamatanClass[] | null>(null);
  const [datades, setdesData] = useState<DesakelurahanClass[] | null>(null);
  const [wilayah, setWilayah] = useState<Wilayah[]>([]);
  const [kecamatan, setKecamatan] = useState<Kecamatan[]>([]);
  const [desa, setDesa] = useState<Desa[]>([]);
  const [filteredDesa, setFilteredDesa] = useState<Desa[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [statistikData, setStatistikData] = useState<StatistikData>({
    categories: [],
    aktif: [],
    tidakAktif: [],
  });

  // Retrieve nama_provinsi and nama_role from sessionStorage
  const namaProvinsi = sessionStorage.getItem("nama_provinsi");
  const namaRole = sessionStorage.getItem("user_role");

  // Fetch data kabupaten
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await Kabupatenwilayahaktivitas();
        if (response.successCode === 200 && response.data) {
          setData(response.data);
          const wilayahData = response.data.map((kabupaten) => ({
            id: kabupaten.id,
            name: kabupaten.nama_kabupaten_kota,
          }));
          setWilayah(wilayahData);

          // Automatically set selectedWilayah based on nama_provinsi and role
          if (namaRole !== "Admin") {
            let defaultWilayah = null;
            if (namaProvinsi === "Jawa Timur") {
              defaultWilayah = wilayahData.find((w) => w.name === "Banyuwangi");
            } else {
              defaultWilayah = wilayahData.find((w) => w.name === "Maluku");
            }
            if (defaultWilayah) {
              setSelectedWilayah(defaultWilayah);
            }
          }
        } else {
          setError(`Error ${response.successCode}: Gagal mengambil data`);
        }
      } catch (err) {
        setError("Terjadi kesalahan saat mengambil data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [namaProvinsi, namaRole]);

  // Fetch data kecamatan
 useEffect(() => {
     const fetchKecamatanData = async () => {
       setLoading(true);
       try {
         const response = await Kecamatanwilayahaktivitas();
         if (response.successCode === 200 && response.data) {
           setkecData(response.data);
           const kecamatanData = response.data.map((kec) => ({
             id: kec.id,
             name: kec.nama_kecamatan,
             kabupaten_kota: {
               id: kec.kabupaten_kota.id,
             },
           }));
           setKecamatan(kecamatanData);
         } else {
           setError(`Error ${response.successCode}: Gagal mengambil data kecamatan`);
         }
       } catch (err) {
         setError("Terjadi kesalahan saat mengambil data kecamatan.");
       } finally {
         setLoading(false);
       }
     };
 
     fetchKecamatanData();
   }, []);

  // Fetch data desa
  useEffect(() => {
    const fetchDesakelurahanData = async () => {
      setLoading(true);
      try {
        const response = await Desakelurahanwilayahaktivitas();
        if (response.successCode === 200 && response.data) {
          setdesData(response.data);
          const desaData = response.data.map((desa) => ({
            id: desa.id,
            name: desa.nama_desa_kelurahan,
            kecamatan: {
              id: desa.kecamatan.id,
            },
          }));
          setDesa(desaData);
        } else {
          setError(`Error ${response.successCode}: Gagal mengambil data desa`);
        }
      } catch (err) {
        setError("Terjadi kesalahan saat mengambil data desa.");
      } finally {
        setLoading(false);
      }
    };

    fetchDesakelurahanData();
  }, []);

  // Filter kecamatan berdasarkan kabupaten yang dipilih
useEffect(() => {
  if (selectedWilayah && datakec) {
    // console.log("Filtering Kecamatan for Wilayah:", selectedWilayah);
    const filteredKecamatan = datakec
      .filter((kec) => kec.kabupaten_kota.id === selectedWilayah.id)
      .map((kec) => ({
        id: kec.id,
        name: kec.nama_kecamatan,
        kabupaten_kota: {
          id: kec.kabupaten_kota.id,
        },
      }));
    // console.log("Filtered Kecamatan:", filteredKecamatan);
    setKecamatan(filteredKecamatan);
  } else {
    // console.log("No Wilayah selected or no Kecamatan data.");
    setKecamatan([]);
  }
}, [selectedWilayah, datakec]);

  // Filter desa berdasarkan kecamatan yang dipilih
  useEffect(() => {
    if (selectedKecamatan && datades) {
      const filteredDesa = datades
        .filter((desa) => desa.kecamatan.id === selectedKecamatan.id)
        .map((desa) => ({
          id: desa.id,
          name: desa.nama_desa_kelurahan,
          kecamatan: {
            id: desa.kecamatan.id,
          },
        }));
      setFilteredDesa(filteredDesa);
    } else {
      setFilteredDesa([]);
    }
  }, [selectedKecamatan, datades]);

  // Fetch statistik data saat desa dipilih
  useEffect(() => {
    const fetchStatistikData = async () => {
      if (selectedDesa) {
        setLoading(true);
        try {
          const response = await trendPersebaranKader(selectedDesa.name);
          if (response.successCode === 200 && response.data) {
            const categories = response.data.data.map((item) => item.nama_dusun);
            const aktifData = response.data.data.map((item) => item.kader_aktif_count);
            const tidakAktifData = response.data.data.map((item) => item.kader_tidak_aktif_count);

            setStatistikData({
              categories: categories,
              aktif: aktifData,
              tidakAktif: tidakAktifData,
            });
          } else {
            setError(`Error ${response.successCode}: Gagal mengambil data statistik`);
          }
        } catch (err) {
          setError("Terjadi kesalahan saat mengambil data statistik.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchStatistikData();
  }, [selectedDesa]);

  // Reset pilihan kecamatan dan desa saat kabupaten berubah
  useEffect(() => {
    setSelectedKecamatan(null);
    setSelectedDesa(null);
  }, [selectedWilayah]);

  // Reset pilihan desa saat kecamatan berubah
  useEffect(() => {
    setSelectedDesa(null);
  }, [selectedKecamatan]);

  const options: ApexOptions = {
    series: [
      {
        name: "Kader Aktif",
        data: statistikData.aktif,
      },
      {
        name: "Kader Tidak Aktif",
        data: statistikData.tidakAktif,
      },
    ],
    chart: {
      type: "bar",
      height: 350,
    },
    colors: color,
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: statistikData.categories,
    },
    yaxis: {
      title: {
        text: "",
      },
    },
    fill: {
      opacity: 1,
    },
  };

  const handleWilayahChange = (e: { value: Wilayah | null }) => {
    setSelectedWilayah(e.value);
    sessionStorage.setItem("selected_wilayah", JSON.stringify(e.value));
  };

  const wilayahData = sessionStorage.getItem("selected_wilayah");
  if (wilayahData) {
    // Parse data JSON
    const parsedData = JSON.parse(wilayahData);

    // Ambil properti 'name'
    const name = parsedData.name;

    // Cetak properti 'name' ke console
    // console.log("Selected Wilayah Name:", name);
  } else {
    // console.log("No data found in sessionStorage for 'selected_wilayah'.");
  }

  return (
    <div className="col-span-12 rounded-[10px] bg-white px-7.5 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card xl:col-span-5">
      <div className="mb-14 justify-between gap-4 sm:flex">
        <div>
          <div className="">
            <h1 className="text-body-2xlg font-bold text-dark dark:text-white">
              Grafik Persebaran Kader dan Tingkat Aktivitas
            </h1>
            <p className="text-normal text-dark">Menampilkan sebaran kader dan tingkat aktivitas</p>
          </div>
          <div className="mt-2 flex flex-col items-start justify-start gap-1">
            <div className="flex items-center justify-center gap-2">
              <Dropdown
                value={selectedWilayah}
                onChange={(e) => setSelectedWilayah(e.value)}
                options={wilayah}
                optionLabel="name"
                placeholder="Pilih Wilayah"
                className="md:w-14rem h-11 w-full"
                disabled={namaRole !== "Admin"} 
              />
              <Dropdown
                value={selectedKecamatan}
                onChange={(e) => setSelectedKecamatan(e.value)}
                options={kecamatan}
                optionLabel="name"
                placeholder="Pilih Kecamatan"
                className="md:w-14rem h-11 w-full"
                disabled={!selectedWilayah}
              />
              <Dropdown
                value={selectedDesa}
                onChange={(e) => setSelectedDesa(e.value)}
                options={filteredDesa}
                optionLabel="name"
                placeholder="Pilih Desa"
                className="md:w-14rem h-11 w-full"
                disabled={!selectedKecamatan}
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <div id="chartTwo" className="-ml-3.5">
          <ReactApexChart
            options={options}
            series={options.series}
            type="bar"
            height={370}
          />
        </div>
      </div>
    </div>
  );
};

export default GrafikPersebaranKaderDanTingkatAktivitas;