"use client";
import React from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

const ChartJumlahBalitaHadir: React.FC = () => {
  const chartOptions: ApexOptions = {
    chart: {
      type: "line",
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      categories: [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember",
      ],
    },
    yaxis: {
      labels: {
        formatter: (value) => `${value}`,
      },
      min: 0,
      max: 240,
      tickAmount: 6, // Agar sumbu Y rapi
    },
    stroke: {
      curve: "smooth", // Garis lebih halus
    },
    markers: {
      size: 5,
    },
    colors: ["#2563EB"], // Biru untuk tampilan profesional
    tooltip: {
      theme: "dark",
    },
  };

  const chartSeries = [
    {
      name: "Jumlah Balita Hadir",
      data: [100, 80, 120, 60, 140, 90, 180, 160, 120, 200, 140, 220], // Data bervariasi
    },
  ];

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
       <div>
          <h4 className="text-body-2xlg font-bold text-dark dark:text-white">
          Statistik Kehadiran Balita
          </h4>
            <p className="text-black">
            Analisis Kehadiran Balita untuk Pemantauan Perkembangan dan Gizi
            </p>
          </div>
      
      <ReactApexChart options={chartOptions} series={chartSeries} type="line" height={380} />
    </div>
  );
};

export default ChartJumlahBalitaHadir;
