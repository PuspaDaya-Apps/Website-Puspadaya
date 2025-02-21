"use client";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts"; 
import { statistikDashboard } from "@/app/api/statistik/statistik";

const ChartDonatBeratBadan: React.FC = () => {
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

  const chartOptions: ApexOptions = {
    chart: {
      type: "donut",
    },
    labels: ["Kenaikan BB", "BB Tetap", "Penurunan BB"],
    colors: ["#16A34A", "#EAB308", "#DC2626"], // Warna lebih soft: hijau, kuning, merah
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
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => Math.round(val), 
      style: {
        fontSize: "14px",
        colors: ["#fff"], 
      },
    },
    tooltip: {
      theme: "dark",
    },
  };

  const chartSeries = data
    ? [data.kenaikan_bb, data.bb_tetap, data.penurunan_bb]
    : [];

  return (
    <div className="p-7 bg-white shadow-lg rounded-lg">
      <div>
        <h4 className="text-body-2xlg font-bold text-dark dark:text-white">
          Statistik Berat Badan Anak
        </h4>
        <p className="text-black">
          Pemantauan Pertumbuhan Anak Berdasarkan Data Berat Badan
        </p>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : chartSeries.every(value => value === 0) ? (
        <p className="text-gray-500">Tidak ada data untuk ditampilkan.</p>
      ) : (
        <ReactApexChart options={chartOptions} series={chartSeries} type="donut" height={380} />
      )}
    </div>
  );
};

export default ChartDonatBeratBadan;
