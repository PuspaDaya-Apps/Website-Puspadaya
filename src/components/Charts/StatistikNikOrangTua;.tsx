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
          const jumlahAyah = result.data.jumlah_ayah_tidak_punya_nik?.jumlah ?? 0;
          const jumlahIbu = result.data.jumlah_ibu_tidak_punya_nik?.jumlah ?? 0;
          const jumlahAnak = result.data.jumlah_anak_tidak_punya_nik?.jumlah ?? 0;

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
    total = data.jumlah_ayah_tidak_punya_nik + data.jumlah_ibu_tidak_punya_nik + data.jumlah_anak_tidak_punya_nik;
    if (total > 0) {
      chartSeries = [
        data.jumlah_ayah_tidak_punya_nik,
        data.jumlah_ibu_tidak_punya_nik,
        data.jumlah_anak_tidak_punya_nik
      ];
    }
  }

  const chartOptions: ApexOptions = {
    chart: {
      type: "donut",
    },
    labels: ["Ayah Tidak Punya NIK", "Ibu Tidak Punya NIK", "Anak Tidak Punya NIK"],
    colors: ["#F97316", "#10B981", "#3B82F6"], // Orange, Hijau, Biru untuk kontras
    legend: {
      position: "bottom",
      labels: {
        colors: "#374151",
        useSeriesColors: false,
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
              formatter: () => total.toString(),
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number, opts) => {
        const seriesIndex = opts.seriesIndex;
        return chartSeries[seriesIndex].toString(); // Menampilkan nilai absolut
      },
      style: {
        fontSize: "14px",
        colors: ["#ffffff"], 
      },
    },
    tooltip: {
      theme: "dark",
      y: {
        formatter: (val: number, opts) => {
          const seriesIndex = opts.seriesIndex;
          return chartSeries[seriesIndex].toString(); 
        },
      },
    },
  };

  return (
    <div className="p-7 bg-white shadow-lg rounded-lg">
       <div>
          <h4 className="text-body-2xlg font-bold text-dark dark:text-white">
          Statistik NIK Orang Tua dan Anak
          </h4>
          <p className="text-black">
          Monitoring NIK Orang Tua dan Anak yang Tidak Terdaftar
          </p>
       </div>

       <div className="flex items-center justify-center min-h-[380px] w-full">
       {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : total === 0 ? (
        <div className="flex items-center justify-center min-h-[350px] w-full">
          <p className="text-green-600 text-lg font-semibold">
            Tidak ada data terkait status NIK
          </p>
        </div>
      ) : (
        <ReactApexChart options={chartOptions} series={chartSeries} type="donut" height={600} />
      )}
       </div>
    </div>
  );
};

export default StatistikNikOrangTua;