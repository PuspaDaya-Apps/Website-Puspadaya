"use client";
import { ApexOptions } from "apexcharts";
import React, { useState, useEffect, useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import { Dropdown } from "primereact/dropdown";
import { DesakelurahanClass, KabupatenClass, KecamatanClass } from "@/types/dashborad";
import {
  useCurrentUser,
  useDesaKelurahanWilayah,
  useKabupatenWilayah,
  useKecamatanWilayah,
  useTrendPersebaranPosyandu,
} from "@/hooks/dashboard";

const color = ["#F39D00", "#34B53A"];

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

const GrafikPersebaranPosyandu: React.FC = () => {
  const [selectedWilayah, setSelectedWilayah] = useState<Wilayah | null>(null);
  const [selectedKecamatan, setSelectedKecamatan] = useState<Kecamatan | null>(null);
  const [selectedDesa, setSelectedDesa] = useState<Desa | null>(null);

  // currentUser() mengisi nama_provinsi dkk di sessionStorage; lewat hook ini
  // panggilannya ikut masuk cache dan tidak terulang tiap komponen mount.
  useCurrentUser();

  // Daftar wilayah dibaca dari cache lalu diturunkan dengan useMemo. Ini
  // menggantikan rantai fetch + setState + debounce 1 detik yang sebelumnya
  // dijalankan ulang setiap pilihan berubah.
  const { data: kabupatenData } = useKabupatenWilayah();
  const { data: kecamatanData } = useKecamatanWilayah({ enabled: Boolean(selectedWilayah) });
  const { data: desaData } = useDesaKelurahanWilayah({ enabled: Boolean(selectedKecamatan) });
  const { data: trenPosyandu } = useTrendPersebaranPosyandu(selectedDesa?.name);

  const wilayah = useMemo<Wilayah[]>(
    () =>
      (kabupatenData ?? []).map((kabupaten) => ({
        id: kabupaten.id,
        name: kabupaten.nama_kabupaten_kota,
      })),
    [kabupatenData]
  );

  const kecamatan = useMemo<Kecamatan[]>(() => {
    if (!selectedWilayah || !kecamatanData) {
      return [];
    }

    return kecamatanData
      .filter((kec) => kec.kabupaten_kota.id === selectedWilayah.id)
      .map((kec) => ({
        id: kec.id,
        name: kec.nama_kecamatan,
        kabupaten_kota: {
          id: kec.kabupaten_kota.id,
        },
      }));
  }, [selectedWilayah, kecamatanData]);

  const filteredDesa = useMemo<Desa[]>(() => {
    if (!selectedKecamatan || !desaData) {
      return [];
    }

    return desaData
      .filter((item) => item.kecamatan.id === selectedKecamatan.id)
      .map((item) => ({
        id: item.id,
        name: item.nama_desa_kelurahan,
        kecamatan: {
          id: item.kecamatan.id,
        },
      }));
  }, [selectedKecamatan, desaData]);

  const statistikData = useMemo<StatistikData>(() => {
    const rows = trenPosyandu?.data ?? [];

    return {
      categories: rows.map((item) => item.nama_dusun),
      aktif: rows.map((item) => item.posyandu_aktif_count),
      tidakAktif: rows.map((item) => item.posyandu_tidak_aktif_count),
    };
  }, [trenPosyandu]);

  // Retrieve nama_provinsi and nama_role from sessionStorage
  const namaProvinsi = sessionStorage.getItem("nama_provinsi");
  const namaKecamatan = sessionStorage.getItem("nama_kecamatan");
  const namaDesa = sessionStorage.getItem("nama_desa_kelurahan");
  const namaRole = sessionStorage.getItem("user_role");

  // Pilihan default untuk role non-Admin: dipertahankan apa adanya, hanya
  // sumber datanya yang kini dari cache, bukan dari dalam fungsi fetch.
  useEffect(() => {
    if (namaRole === "Admin" || wilayah.length === 0) {
      return;
    }

    const defaultWilayah =
      namaProvinsi === "Jawa Timur"
        ? wilayah.find((w) => w.name === "Banyuwangi")
        : wilayah.find((w) => w.name === "Maluku");

    if (defaultWilayah) {
      setSelectedWilayah(defaultWilayah);
    }
  }, [wilayah, namaProvinsi, namaRole]);

  useEffect(() => {
    if (["Admin", "Dinas Kesehatan", "Dinas Sosial"].includes(namaRole || "") || !namaKecamatan) {
      return;
    }

    const defaultKecamatan = kecamatan.find((kec) => kec.name === namaKecamatan);

    if (defaultKecamatan) {
      setSelectedKecamatan(defaultKecamatan);
    }
  }, [kecamatan, namaKecamatan, namaRole]);

  useEffect(() => {
    if (
      ["Admin", "Dinas Kesehatan", "Dinas Sosial"].includes(namaRole || "") ||
      !namaDesa ||
      !desaData
    ) {
      return;
    }

    const defaultDesa = desaData
      .map((item) => ({
        id: item.id,
        name: item.nama_desa_kelurahan,
        kecamatan: {
          id: item.kecamatan.id,
        },
      }))
      .find((item) => item.name === namaDesa);

    if (defaultDesa) {
      setSelectedDesa(defaultDesa);
    }
  }, [desaData, namaDesa, namaRole]);

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
        name: "Aktif",
        data: statistikData.aktif,
      },
      {
        name: "Tidak Aktif",
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

  return (
    <div className="col-span-12 rounded-[10px] bg-white px-7.5 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card xl:col-span-5">
      <div className="mb-12 justify-between gap-4 sm:flex">
        <div>
          <div className="">
            <h1 className="text-body-2xlg font-bold text-dark dark:text-white">
              Grafik Persebaran Posyandu
            </h1>
            <p className="p text-black">Menampilkan grafik posyandu aktif dan tidak aktif</p>
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
                disabled={namaRole !== "Admin"} // Disable if role is not Admin
              />
              <Dropdown
                value={selectedKecamatan}
                onChange={(e) => setSelectedKecamatan(e.value)}
                options={kecamatan}
                optionLabel="name"
                placeholder="Pilih Kecamatan"
                className="md:w-14rem h-11 w-full"
                disabled={!(
                  ["Admin", "Dinas Kesehatan", "Dinas Sosial"].includes(namaRole || "")
                ) || !selectedWilayah}
              />
              <Dropdown
                value={selectedDesa}
                onChange={(e) => setSelectedDesa(e.value)}
                options={filteredDesa}
                optionLabel="name"
                placeholder="Pilih Desa"
                className="md:w-14rem h-11 w-full"
                disabled={!(
                  ["Admin", "Dinas Kesehatan", "Dinas Sosial"].includes(namaRole || "")
                ) || !selectedWilayah}
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

export default GrafikPersebaranPosyandu;