"use client";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { statistikDashboard } from "@/app/api/statistik/statistik";

const ChartPerhitunganIbuHamil: React.FC = () => {
  const [data, setData] = useState<{
    kurangDari20: number;
    lebihDari35: number;
    terlaluBanyakAnak: number;
    kehamilanTerlaluDekat: number;
  } | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await statistikDashboard();

        if (result.successCode === 200 && result.data) {
          setData({
            kurangDari20: result.data.jumlah_ibu_hamil_kurang_dari_20.jumlah || 0,
            lebihDari35: result.data.jumlah_ibu_hamil_lebih_dari_35.jumlah || 0,
            terlaluBanyakAnak: result.data.jumlah_anak_terlalu_banyak.jumlah || 0,
            kehamilanTerlaluDekat: result.data.jumlah_kehamilan_terlalu_dekat.jumlah || 0,
          });
          setError(null);
        } else {
          setData(null);
          setError("Data tidak ditemukan atau format tidak sesuai.");
        }
      } catch (err) {
        setError("Terjadi kesalahan saat mengambil data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartSeries = data
    ? [data.kurangDari20, data.lebihDari35, data.terlaluBanyakAnak, data.kehamilanTerlaluDekat]
    : [];

  const chartOptions: ApexOptions = {
    chart: { type: "donut" },
    labels: [
      "Ibu Hamil < 20 Tahun",
      "Ibu Hamil > 35 Tahun",
      "Ibu dengan Anak Terlalu Banyak",
      "Kehamilan Terlalu Dekat",
    ],
    colors: ["#16A34A", "#EAB308", "#DC2626", "#2563EB"], // Warna: Hijau, Kuning, Merah, Biru
    legend: { position: "bottom", labels: { colors: "#374151" } },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total Kasus",
              fontSize: "16px",
              color: "#374151",
              formatter: () => chartSeries.reduce((acc, val) => acc + val, 0).toString(),
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (_, opts) => chartSeries[opts.seriesIndex].toString(),
      style: { fontSize: "14px", colors: ["#fff"] },
    },
    tooltip: {
      theme: "dark",
      y: { formatter: (_, opts) => chartSeries[opts.seriesIndex].toString() },
    },
  };

  return (
    <div className="p-7 bg-white shadow-lg rounded-lg">
      {/* HEADER dengan Flexbox */}
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-lg font-bold text-dark dark:text-white">
          Statistik Risiko Kehamilan
        </h4>
      </div>

      <p className="text-black">
      Pemantauan Kesehatan Ibu Hamil untuk Mencegah Risiko
      </p>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : chartSeries.every(value => value === 0) ? (
        <div className="flex items-center justify-center min-h-[350px] w-full">
          <p className="text-green-600 text-lg font-semibold">Tidak ada data untuk ditampilkan.</p>
        </div>
      ) : (
        <ReactApexChart options={chartOptions} series={chartSeries} type="donut" height={380} />
      )}
    </div>
  );
};

export default ChartPerhitunganIbuHamil;
