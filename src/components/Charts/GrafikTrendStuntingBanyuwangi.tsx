"use client";
import { ApexOptions } from "apexcharts";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { Dropdown } from "primereact/dropdown";
import { SvgSearch } from "../ui/Svg";
import { Kabupatenwilayah } from "@/app/api/lokasi/kabupaten";
import { DesakelurahanClass, KabupatenClass, KecamatanClass } from "@/types/dashborad";
import { Kecamatanwilayah } from "@/app/api/lokasi/kecamatan";
import { Desakelurahanwilayah } from "@/app/api/lokasi/desa";
const color = ["#3b82f6", "#ef4444"];

interface Wilayah {
  name: string;
}

interface Kecamatan {
  id: string; // Sesuaikan dengan respons API
  name: string;
}

interface Desa {
  id: string; // Sesuaikan dengan respons API
  name: string;
  kecamatan: {
    id: string; // Sesuaikan dengan respons API
  };
}

const GrafikTrendStuntingBanyuwangi: React.FC = () => {
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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await Kabupatenwilayah();
        if (response.successCode === 200 && response.data) {
          setData(response.data);
          const wilayahData = response.data.map((kabupaten) => ({
            name: kabupaten.nama_kabupaten_kota,
          }));
          setWilayah(wilayahData);
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
  }, []);

  useEffect(() => {
    const fetchKecamatanData = async () => {
      setLoading(true);
      try {
        const response = await Kecamatanwilayah();
        if (response.successCode === 200 && response.data) {
          setkecData(response.data);
          const kecamatanData = response.data.map((kecamatan) => ({
            id: kecamatan.id,
            name: kecamatan.nama_kecamatan,
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

  useEffect(() => {
    const fetchDesakelurahanData = async () => {
      setLoading(true);
      try {
        const response = await Desakelurahanwilayah();
        if (response.successCode === 200 && response.data) {
          setdesData(response.data);
          const desaData = response.data.map((desa) => ({
            id: desa.id,
            name: desa.nama_desa_kelurahan,
            kecamatan: {
              id: desa.kecamatan.id, // Sesuaikan dengan respons API
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

  useEffect(() => {
    if (selectedKecamatan && desa.length > 0) {
      const filtered = desa.filter((d) => d.kecamatan.id === selectedKecamatan.id);
      setFilteredDesa(filtered);
    } else {
      setFilteredDesa([]);
    }
  }, [selectedKecamatan, desa]);

  const series = [
    {
      name: "Gizi Baik",
      data: [44, 55, 41, 67, 22, 43, 65, 35, 25],
    },
    {
      name: "Gizi Buruk",
      data: [50, 23, 20, 8, 13, 27, 15, 10, 7],
    },
  ];

  const options: ApexOptions = {
    series: series,
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
      categories: [
        "Kebaman",
        "Bangorejo",
        "Purwoharjo",
        "Wonosobo",
        "Sukomajo",
        "Sumbersari",
        "Srono",
        "Krajan",
        "Kabat",
      ],
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

  return (
    <div className="col-span-12 rounded-[10px] bg-white px-7.5 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card xl:col-span-5">
      <div className="mb-4 justify-between gap-4 sm:flex">
        <div>
          <div>
            <h4 className="text-body-2xlg font-bold text-dark dark:text-white">
              Tingkat Gizi Balita menurut Wilayah Desa
            </h4>

            <p className="">
              Menampilkan tren gizi balita berdasarkan pembagian wilayah desa
            </p>
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
              />
              <Dropdown
                value={selectedKecamatan}
                onChange={(e) => setSelectedKecamatan(e.value)}
                options={kecamatan}
                optionLabel="name"
                placeholder="Pilih Kecamatan"
                className="md:w-14rem h-11 w-full"
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
              <div className=" flex h-11 w-35 cursor-pointer items-center justify-center rounded-md border border-gray-300 ">
                <SvgSearch />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div id="chartTwo" className="-ml-3.5">
          <ReactApexChart
            options={options}
            series={series}
            type="bar"
            height={370}
          />
        </div>
      </div>
    </div>
  );
};

export default GrafikTrendStuntingBanyuwangi;