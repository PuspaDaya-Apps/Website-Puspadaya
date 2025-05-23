"use client";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { statistikDashboard } from "@/app/api/statistik/statistik";

const StatistikNikOrangTua: React.FC = () => {
  const [data, setData] = useState<{
    jumlah_ayah_tidak_punya_nik: number;
    jumlah_ibu_tidak_punya_nik: number;
    jumlah_anak_tidak_punya_nik: number;
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Delay 2 detik

        const result = await statistikDashboard();

        if (result.successCode === 200 && result.data) {
          const jumlahAyah =
            result.data.jumlah_ayah_tidak_punya_nik?.jumlah ?? 0;
          const jumlahIbu = result.data.jumlah_ibu_tidak_punya_nik?.jumlah ?? 0;
          const jumlahAnak =
            result.data.jumlah_anak_tidak_punya_nik?.jumlah ?? 0;

          setData({
            jumlah_ayah_tidak_punya_nik: jumlahAyah,
            jumlah_ibu_tidak_punya_nik: jumlahIbu,
            jumlah_anak_tidak_punya_nik: jumlahAnak,
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

  let chartSeries: number[] = [];
  let total = 0;

  if (data) {
    total =
      data.jumlah_ayah_tidak_punya_nik +
      data.jumlah_ibu_tidak_punya_nik +
      data.jumlah_anak_tidak_punya_nik;
    if (total > 0) {
      chartSeries = [
        data.jumlah_ayah_tidak_punya_nik,
        data.jumlah_ibu_tidak_punya_nik,
        data.jumlah_anak_tidak_punya_nik,
      ];
    }
  }

  const chartOptions: ApexOptions = {
    chart: {
      type: "donut",
      height: 400,
    },
    labels: [
      "Ayah Tidak Punya NIK",
      "Ibu Tidak Punya NIK",
      "Anak Tidak Punya NIK",
    ],
    colors: ["#F97316", "#10B981", "#3B82F6"],
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
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total Kasus",
              fontSize: "16px",
              fontWeight: "bold",
              color: "#000000",
              formatter: () => total.toString(),
            },
            value: {
              fontSize: "20px",
              color: "#000000",
              fontWeight: "bold",
            },
          },
        },
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
          Statistik NIK Orang Tua dan Anak
        </h4>
        <p className="text-black">
          Monitoring NIK Orang Tua dan Anak yang Tidak Terdaftar
        </p>
      </div>

      <div className="flex min-h-[380px] w-full items-center justify-center">
        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : total === 0 ? (
          <div className="flex min-h-[350px] w-full items-center justify-center">
            <p className="text-lg font-semibold text-green-600">
              Tidak ada data terkait status NIK
            </p>
          </div>
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

export default StatistikNikOrangTua;
