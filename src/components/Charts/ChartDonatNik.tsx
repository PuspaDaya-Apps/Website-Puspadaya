"use client";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts"; 
import { statistikDashboard } from "@/app/api/statistik/statistik";

const ChartDonatNik: React.FC = () => {
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
          setError("Error fetching data. Please try again.");
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
        (data.jumlah_ayah_tidak_punya_nik / total) * 100,
        (data.jumlah_ibu_tidak_punya_nik / total) * 100,
        (data.jumlah_anak_tidak_punya_nik / total) * 100
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
      formatter: (val: number) => `${Math.round(val)}%`, 
      style: {
        fontSize: "14px",
        colors: ["#fff"], 
      },
    },
    tooltip: {
      theme: "dark",
      y: {
        formatter: (val: number) => `${Math.round(val)}%`,
      },
    },
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg flex flex-col justify-center min-h-[400px]">
       <div>
          <h4 className="text-body-2xlg font-bold text-dark dark:text-white">
          Statistik NIK Orang Tua dan Anak
          </h4>
          <p className="text-black">
            Monitoring Status Pendaftaran NIK Orang Tua dan Anak
          </p>
       </div>

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
        <ReactApexChart options={chartOptions} series={chartSeries} type="donut" height={380} />
      )}
    </div>
  );
};

export default ChartDonatNik;