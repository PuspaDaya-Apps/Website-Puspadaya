"use client";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { statistikTrenKehadiran } from "@/app/api/statistik/statistikkehadiran";

// Mapping angka bulan ke nama bulan
const bulanMap: { [key: number]: string } = {
  1: "Januari",
  2: "Februari",
  3: "Maret",
  4: "April",
  5: "Mei",
  6: "Juni",
  7: "Juli",
  8: "Agustus",
  9: "September",
  10: "Oktober",
  11: "November",
  12: "Desember",
};

const ChartJumlahBalitaHadir: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [chartSeries, setChartSeries] = useState<{ name: string; data: number[] }[]>([
    { name: "Jumlah Anak Hadir", data: [] },
  ]);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        
        await new Promise((resolve) => setTimeout(resolve, 2000)); 

        const result = await statistikTrenKehadiran(); 

        if (result.data && result.data.data.length > 0) {
          // Periksa result.data.data
          const sortedData = result.data.data.sort((a, b) => a.bulan - b.bulan);

          setChartSeries([
            {
              name: "Jumlah Anak Hadir",
              data: sortedData.map((item) => item.jumlah_hadir),
            },
          ]);
          setCategories(sortedData.map((item) => bulanMap[item.bulan]));
          setError(null);
        } else {
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
      type: "line",
      toolbar: { show: false },
    },
    xaxis: {
      categories,
    },
    yaxis: {
      labels: {
        formatter: (value) => `${value}`,
      },
      min: 0,
      max: 240,
      tickAmount: 6,
    },
    stroke: {
      curve: "smooth",
    },
    markers: {
      size: 5,
    },
    colors: ["#2563EB"],
    tooltip: {
      theme: "dark",
    },
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <div>
        <h4 className="text-body-2xlg font-bold text-dark dark:text-white">
          Statistik Kehadiran Anak
        </h4>
        <p className="text-black">
          Analisis Kehadiran Anak untuk Pemantauan Perkembangan dan Gizi
        </p>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <ReactApexChart options={chartOptions} series={chartSeries} type="line" height={380} />
      )}
    </div>
  );
};

export default ChartJumlahBalitaHadir;