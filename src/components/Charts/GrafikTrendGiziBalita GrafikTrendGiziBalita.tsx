"use client";
import { ApexOptions } from "apexcharts";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import DefaultSelectOption from "@/components/SelectOption/DefaultSelectOption";
import { statistikTrenGizi } from "@/app/api/statistik/trengizi";
import { TrenGizi, TrenGiziResponse } from "@/types/dashborad";

const color = ["#3b82f6", "#ef4444"];

const GrafikTrendGiziBalita: React.FC = () => {
  const [data, setData] = useState<TrenGizi[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const result = await statistikTrenGizi(); // Tipe kembalian adalah FetchResult

        if (result.data && result.data.length > 0) {
          // Periksa result.data (array)
          setData(result.data); // Set data dengan result.data
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

  // Memetakan data dari API ke dalam format grafik
  const series = [
    {
      name: "Anak Gizi Baik",
      data: data ? data.map((item) => item.jumlah_gizi_baik) : [],
    },
    {
      name: "Anak Gizi Buruk",
      data: data ? data.map((item) => item.jumlah_gizi_buruk) : [],
    },
  ];

  const categories = data ? data.map((item) => item.tahun.toString()) : [];

  const options: ApexOptions = {
    legend: {
      show: false,
      position: "top",
      horizontalAlign: "left",
    },
    colors: color,
    chart: {
      fontFamily: "Satoshi, sans-serif",
      height: 310,
      type: "area",
      toolbar: {
        show: false,
      },
    },
    fill: {
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
    responsive: [
      {
        breakpoint: 1024,
        options: {
          chart: {
            height: 300,
          },
        },
      },
      {
        breakpoint: 1366,
        options: {
          chart: {
            height: 320,
          },
        },
      },
    ],
    stroke: {
      curve: "smooth",
    },
    markers: {
      size: 0,
    },
    grid: {
      strokeDashArray: 5,
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      fixed: {
        enabled: false,
      },
      x: {
        show: false,
      },
      y: {
        title: {
          formatter: function (e) {
            return `${e}`;
          },
        },
      },
      marker: {
        show: false,
      },
    },
    xaxis: {
      type: "category",
      categories: categories,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      title: {
        style: {
          fontSize: "0px",
        },
      },
    },
  };

  return (
    <div className="col-span-12 rounded-[10px] bg-white px-7.5 pb-6 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card xl:col-span-7">
      <div className="mb-3.5 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h4 className="text-body-2xlg font-bold text-dark dark:text-white">
            Grafik Tren Gizi pada Anak
          </h4>
          <p className="text-black">
            Menampilkan tren gizi pada Anak berdasarkan wilayah
          </p>
        </div>
      </div>

      <div>
        {loading ? (
          <p className="text-center text-gray-600">Memuat data...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="-ml-4 -mr-5 text-black">
            <ReactApexChart
              options={options}
              series={series}
              type="area"
              height={310}
            />
          </div>
        )}

        <div className="flex items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
            <p className="text-black">Anak Gizi Baik</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-red-500"></div>
            <p className="text-black">Anak Gizi Buruk</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrafikTrendGiziBalita;
