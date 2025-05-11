"use client";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { statistikDashboard } from "@/app/api/statistik/statistik";

const StatistikRisikoKehamilan: React.FC = () => {
  const [data, setData] = useState<{
    kurangDari20: number;
    lebihDari35: number;
    terlaluBanyakAnak: number;
    kehamilanTerlaluDekat: number;
  } | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const result = await statistikDashboard();

        if (result.successCode === 200 && result.data) {
          setData({
            kurangDari20:
              result.data.jumlah_ibu_hamil_kurang_dari_20.jumlah || 0,
            lebihDari35: result.data.jumlah_ibu_hamil_lebih_dari_35.jumlah || 0,
            terlaluBanyakAnak:
              result.data.jumlah_anak_terlalu_banyak.jumlah || 0,
            kehamilanTerlaluDekat:
              result.data.jumlah_kehamilan_terlalu_dekat.jumlah || 0,
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
    ? [
        data.kurangDari20,
        data.lebihDari35,
        data.terlaluBanyakAnak,
        data.kehamilanTerlaluDekat,
      ]
    : [];

const chartOptions: ApexOptions = {
  chart: { 
    type: "donut",
    height: 400 
  },
  labels: [
    "Ibu Hamil < 20 Tahun",
    "Ibu Hamil > 35 Tahun",
    "Ibu dengan Anak Terlalu Banyak",
    "Kehamilan Terlalu Dekat",
  ],
  colors: ["#16A34A", "#EAB308", "#DC2626", "#2563EB"],
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
   formatter: function(seriesName) {
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
        size: '65%',
        labels: {
          show: true,
          total: {
            show: true,
            showAlways: true,
            label: 'Total Kasus',
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#374151',
            formatter: () => chartSeries.reduce((a, b) => a + b, 0).toString()
          },
          value: {
            fontSize: '20px',
            color: '#374151',
            fontWeight: 'bold'
          }
        }
      }
    }
  },
  dataLabels: {
    enabled: true,
    formatter: (val, opts) => {
      const value = chartSeries[opts.seriesIndex];
      return value > 0 ? value.toString() : '';
    },
    style: {
      fontSize: "14px",
      fontWeight: "bold",
      colors: ["#fff"]
    },
    dropShadow: {
      enabled: true,
      top: 1,
      left: 1,
      blur: 1,
      opacity: 0.5
    }
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
        formatter: (seriesName) => seriesName
      }
    }
  },
  responsive: [{
    breakpoint: 480,
    options: {
      legend: {
        position: 'bottom',
        horizontalAlign: 'center',
        itemMargin: {
          horizontal: 5,
          vertical: 3
        }
      }
    }
  }]
};

  return (
 <div className="p-7 bg-white shadow-lg rounded-lg">
  <div className="flex items-center justify-between mb-2">
    <h4 className="text-lg font-bold text-dark dark:text-white">
      Statistik Risiko Kehamilan
    </h4>
  </div>

  <p className="text-black mb-4">
    Pemantauan Kesehatan Ibu Hamil untuk Mencegah Risiko
  </p>

  <div className="w-full">
    {loading ? (
      <div className="h-80 flex items-center justify-center">
        <p>Memuat data...</p>
      </div>
    ) : error ? (
      <p className="text-red-500 text-center py-10">{error}</p>
    ) : chartSeries.every(value => value === 0) ? (
      <div className="h-80 flex items-center justify-center">
        <p className="text-green-600 text-lg font-semibold">
          Tidak ada data untuk ditampilkan.
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

export default StatistikRisikoKehamilan;
