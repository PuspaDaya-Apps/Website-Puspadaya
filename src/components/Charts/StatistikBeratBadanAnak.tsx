"use client";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { statistikDashboard } from "@/app/api/statistik/statistik";

const StatistikBeratBadanAnak: React.FC = () => {
  const [data, setData] = useState<{
    kenaikan_bb: number;
    bb_tetap: number;
    penurunan_bb: number;
  } | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Tambahkan delay 2 detik sebelum memanggil API
        await new Promise((resolve) => setTimeout(resolve, 3000));

        const result = await statistikDashboard();

        if (result.successCode === 200 && result.data) {
          setData({
            kenaikan_bb: result.data.jumlah_anak_kenaikan_bb?.jumlah || 0,
            bb_tetap: result.data.jumlah_anak_bb_tetap?.jumlah || 0,
            penurunan_bb: result.data.jumlah_anak_penurunan_bb?.jumlah || 0,
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

  const chartSeries = data
    ? [data.kenaikan_bb, data.bb_tetap, data.penurunan_bb]
    : [];

  const chartOptions: ApexOptions = {
    chart: {
      type: "donut",
    },
    labels: ["Kenaikan BB", "BB Tetap", "Penurunan BB"],
    colors: ["#16A34A", "#EAB308", "#DC2626"],
    legend: {
      position: "bottom",
      horizontalAlign: "center",
      floating: false,
      fontSize: "12px",
      fontWeight: 500,
      labels: {
        colors: "#374151",
        useSeriesColors: false,
      },
      markers: {
        width: 12,
        height: 12,
        radius: 6,
        offsetX: -5,
        offsetY: 0,
      },
      itemMargin: {
        horizontal: 15,
        vertical: 5,
      },
      formatter: function (seriesName) {
        return seriesName;
      },
      onItemClick: {
        toggleDataSeries: true,
      },
      onItemHover: {
        highlightDataSeries: true,
      },
    },
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
              formatter: () => {
                const total = chartSeries.reduce((acc, val) => acc + val, 0);
                return total.toString();
              },
            },
          },
        },
      },
    },

    dataLabels: {
      enabled: true,
      formatter: (val: number, opts) => {
        const value = chartSeries[opts.seriesIndex];
        return value > 0 ? value.toString() : "";
      },
      style: {
        fontSize: "14px",
        fontWeight: "bold",
        colors: ["#000000"], // Teks hitam untuk nilai di slice
      },
      dropShadow: {
        enabled: false, // Disable shadow agar teks lebih jelas
      },
    },
    tooltip: {
      enabled: true,
      theme: "dark",
      y: {
        formatter: (val, opts) => {
          const value = chartSeries[opts.seriesIndex];
          return `${value} kasus (${val.toFixed(1)}%)`;
        },
        title: {
          formatter: (seriesName) => seriesName,
        },
      },
    },

    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            position: "bottom",
            horizontalAlign: "center",
          },
        },
      },
    ],
  };

  return (
    <div className="rounded-lg bg-white p-7 shadow-lg">
      <div>
        <h4 className="text-body-2xlg font-bold text-dark dark:text-white">
          Statistik Berat Badan Anak
        </h4>
        <p className="text-black">
          Pemantauan Pertumbuhan Anak Berdasarkan Data Berat Badan
        </p>
      </div>

      <div className="flex min-h-[380px] w-full items-center justify-center">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : chartSeries.every((value) => value === 0) ? (
          <p className="text-lg font-semibold text-green-600">
            Tidak ada data untuk ditampilkan.
          </p>
        ) : (
          <div className="w-full">
            <ReactApexChart
              options={chartOptions}
              series={chartSeries}
              type="donut"
              height={400}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatistikBeratBadanAnak;
