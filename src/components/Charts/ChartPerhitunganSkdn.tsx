"use client";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { statistikDashboard } from "@/app/api/statistik/statistik";

const ChartPerhitunganSkdn: React.FC = () => {
  const [data, setData] = useState<{
    D_: number;
    O: number;
    B: number;
    T: number;
    KenaikanBBKbm: string;
  } | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Tambahkan delay 2 detik sebelum memanggil API
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Delay 2 detik

        const result = await statistikDashboard();

        if (result.successCode === 200 && result.data) {
          setData({
            D_: result.data.jumlah_anak_kenaikan_kbm.D_,
            O: result.data.jumlah_anak_kenaikan_kbm.O,
            B: result.data.jumlah_anak_kenaikan_kbm.B,
            T: result.data.jumlah_anak_kenaikan_kbm.T,
            KenaikanBBKbm: result.data.jumlah_anak_kenaikan_kbm.persentaseKenaikanBBKbm,
          });
          setError(null);
        } else {
          setData(null);
          setError("Data tidak ditemukan!");
        }
      } catch (err) {
        setError("Terjadi kesalahan saat mengambil data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  const chartSeries = data ? [data.D_, data.O, data.B, data.T] : [];

  const chartOptions: ApexOptions = {
    chart: { type: "donut" },
    labels: ["Balita Naik BB D'", "Balita Tidak Datang", "Balita Baru", "Balita Tidak Naik BB"],
    colors: ["#16A34A", "#EAB308", "#DC2626", "#2563EB"],
    legend: { position: "bottom", labels: { colors: "#374151" } },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total",
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
        <h4 className="text-body-2xlg font-bold text-dark dark:text-white">
          Statistik SKDN: Kenaikan Berat Badan Balita
        </h4>
        {data && (
          <div className="bg-green-100 px-3 py-1 rounded-lg ">
            <p className="text-sm font-medium text-green-700">
              Kenaikan BB Balita Sesuai KBM
            </p>
            <span className="text-lg font-semibold text-green-600">
              {data.KenaikanBBKbm}
            </span>
          </div>
        )}
      </div>

      <p className="text-black">
        Pemantauan pertumbuhan balita berdasarkan data SKDN
      </p>

      <div className="flex items-center justify-center min-h-[380px] w-full">
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


    </div>
  );
};

export default ChartPerhitunganSkdn;
