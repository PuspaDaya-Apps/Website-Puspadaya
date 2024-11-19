"use client";
import { ApexOptions } from "apexcharts";
import React from "react";
import ReactApexChart from "react-apexcharts";
import DefaultSelectOption from "@/components/SelectOption/DefaultSelectOption";

const color = ["#3b82f6","#ef4444"]
const GrafikTrendStunting: React.FC = () => {
  const series = [
    {
      name: "Balita Gizi Baik",
      data: [0, 20, 35, 45, 35, 55, 65, 50, 65, 75, 60, 75],
    },
    {
      name: "Balita Gizi Buruk",
      data: [42, 32, 31, 30, 21, 31, 19, 20, 14, 12,8, 4],
    },
  ];

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
        enabled: !1,
      },
      x: {
        show: !1,
      },
      y: {
        title: {
          formatter: function (e) {
            return `${e}`;
          },
        },
      },
      marker: {
        show: !1,
      },
    },
    xaxis: {
      type: "category",
      categories: [
        "Sep",
        "Oct",
        "Nov",
        "Dec",
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
      ],
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
            Grafik Tren Stunting pada Balita
          </h4>
          <div className="flex flex-col items-start justify-start gap-1 mt-2">
            <div className="flex items-center justify-center gap-2">
              <div
                className="h-2 w-2 rounded-full bg-blue-500"
              ></div>
              <p className="">Balita Gizi Baik</p>
            </div>
            <div className="flex items-center justify-center gap-2">
              <div
                className="h-2 w-2 rounded-full bg-red-500"
              ></div>
              <p className="">Balita Gizi Buruk</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <p className="font-medium text-dark dark:text-dark-6">
            Pilih Wilayah
          </p>
          <DefaultSelectOption options={["Banyuwangi", "Maluku Tengah"]} />
        </div>
      </div>
      <div>
        <div className="-ml-4 -mr-5">
          <ReactApexChart
            options={options}
            series={series}
            type="area"
            height={310}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 text-center xsm:flex-row xsm:gap-0">
        <div className="border-stroke dark:border-dark-3 xsm:w-1/2 xsm:border-r">
          <p className="font-medium">Balita Gizi Baik</p>
          <h4 className="mt-1 text-xl font-bold text-blue-400 dark:text-white">
            182
          </h4>
        </div>
        <div className="xsm:w-1/2">
          <p className="font-medium">Balita Gizi Buruk</p>
          <h4 className="mt-1 text-xl font-bold text-red-400 dark:text-white">
            21
          </h4>
        </div>
      </div>
    </div>
  );
};

export default GrafikTrendStunting;
