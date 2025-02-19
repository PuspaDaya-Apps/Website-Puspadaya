"use client";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts"; 
import { statistikDashboard } from "@/app/api/statistik/statistik";

const ChartDonatBeratBadan: React.FC = () => {
  const [data, setData] = useState<{ 
    jumlah_anak_kenaikan_bb: number;
    jumlah_anak_bb_tetap: number;
    jumlah_anak_penurunan_bb: number;
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await statistikDashboard();

        if (result.successCode === 200 && result.data) {
          setData(result.data);
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
    ? [data.jumlah_anak_kenaikan_bb, data.jumlah_anak_bb_tetap, data.jumlah_anak_penurunan_bb]
    : [];

  return (
    <div className="p-7 bg-white shadow-lg rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Statistik Berat Badan Anak</h2>
      
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <ReactApexChart options={chartOptions} series={chartSeries} type="donut" height={380} />
      )}
    </div>
  );
};

export default ChartDonatBeratBadan;
