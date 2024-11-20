"use client";
import { ApexOptions } from "apexcharts";
import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";
import DefaultSelectOption from "@/components/SelectOption/DefaultSelectOption";
import { Dropdown } from "primereact/dropdown";
import { SvgSearch } from "../ui/Svg";
const color = ["#3b82f6", "#ef4444"];
interface Wilayah {
  name: string;
  code: string;
}
interface Kecamatan {
  name: string;
  code: string;
}
interface Desa {
  name: string;
  code: string;
}
const GrafikPersebaranKaderDanTingkatAktivitas: React.FC = () => {
  const [selectedWilayah, setSelectedWilayah] = useState<Wilayah | null>(null);
  const [selectedKecamatan, setSelectedKecamatan] = useState<Kecamatan | null>(
    null,
  );
  const [selectedDesa, setSelectedDesa] = useState<Desa | null>(null);

  const series = [
    {
      name: "Kader Aktif",
      data: [44, 55, 41, 67, 22, 43, 65,35,25],
    },
    {
      name: "Kader Tidak Aktif",
      data: [50, 23, 20, 8, 13, 27, 15,10,7],
    },
  ];
  const wilayah: Wilayah[] = [
    { name: "Banyuwangi", code: "Bwi" },
    { name: "Maluku Tengah", code: "MT" },
  ];
  const kecamatan: Kecamatan[] = [
    { name: "Genteng", code: "GTG" },
    { name: "Srono", code: "SRN" },
    { name: "Rogojampi", code: "RGJ" },
    { name: "Banyuwangi", code: "BWI" },
    { name: "Sempu", code: "SMP" },
  ];
  const desa: Desa[] = [
    { name: "desa1", code: "desa1" },
    { name: "desa2", code: "desa1" },
    { name: "desa3", code: "desa1" },
    { name: "desa4", code: "desa1" },
    { name: "desa5", code: "desa1" },
  ];
  const options: ApexOptions = {
    series: series,
    chart: {
      type: "bar",
      height: 350,
    },
    colors: color,
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: [
        "Kebaman",
        "Bangorejo",
        "Purwoharjo",
        "Wonosobo",
        "Sukomajo",
        "Sumbersari",
        "Srono",
        "Krajan",
        "Kabat",
      ],
    },
    yaxis: {
      title: {
        text: "",
      },
    },
    fill: {
      opacity: 1,
    },
  };

  return (
    <div className="col-span-12 rounded-[10px] bg-white px-7.5 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card xl:col-span-5">
      <div className="mb-4 justify-between gap-4 sm:flex">
        <div>
          <h4 className="text-body-2xlg font-bold text-dark dark:text-white">
            Grafik Tren Stunting Balita di Banyuwangi
          </h4>
          <div className="mt-2 flex flex-col items-start justify-start gap-1">
            <div className="flex items-center justify-center gap-2 mt-1">
              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
              <p className="">Kader Aktif</p>
            </div>
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="h-2 w-2 rounded-full bg-red-500"></div>
              <p className="">Kader Tidak Aktif</p>
            </div>
            <div className="flex items-center justify-center gap-2">
              {/* wilayah */}
              <Dropdown
                value={selectedWilayah}
                onChange={(e) => setSelectedWilayah(e.value)}
                options={wilayah}
                optionLabel="name"
                placeholder="Pilih Wilayah"
                className="md:w-14rem h-11 w-full"
              />

              {/* kecamatan */}
              <Dropdown
                value={selectedKecamatan}
                onChange={(e) => setSelectedKecamatan(e.value)}
                options={kecamatan}
                optionLabel="name"
                placeholder="Pilih Kecamatan"
                className="md:w-14rem h-11 w-full"
              />
              {/* desa */}
              <Dropdown
                value={selectedDesa}
                onChange={(e) => setSelectedDesa(e.value)}
                options={desa}
                optionLabel="name"
                placeholder="Pilih Desa"
                className="md:w-14rem h-11 w-full"
              />
              {/* searching */}
              <div className=" flex h-11 w-35 items-center cursor-pointer justify-center rounded-md border border-gray-300 ">
                <SvgSearch />
              </div>
            </div>
          </div>
        </div>
        <div>
          <DefaultSelectOption
            options={[
              "Januari 2024",
              "Februari 2024",
              "Maret 2024",
              "April 2024",
              "Mei 2024",
              "Juni 2024",
              "Juli 2024",
              "Agustus 2024",
              "September 2024",
              "Oktober 2024",
              "November 2024",
              "Desember 2024",
            ]}
          />
        </div>
      </div>

      <div>
        <div id="chartTwo" className="-ml-3.5">
          <ReactApexChart
            options={options}
            series={series}
            type="bar"
            height={370}
          />
        </div>
      </div>
    </div>
  );
};

export default GrafikPersebaranKaderDanTingkatAktivitas;
