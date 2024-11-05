"use client";
import { Parameter } from "@/types/parameter";
import { IconDownload } from "@tabler/icons-react";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { useState } from "react";

interface City {
  name: string;
  code: string;
}

const ParameterStunting = () => {
  const [activeTab, setActiveTab] = useState("laki-laki");
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const cities: City[] = [
    { name: "Tinggi Badan (Cm)", code: "TB" },
    { name: "Berat Badan (Cm)", code: "BB" },
  ];

  const header = (
    <div className="relative mb-4 flex items-center justify-between">
      <div>
        <h2 className="pb-1 text-2xl font-bold text-black">Parameter Stunting</h2>
        <p className="text-sm font-light text-gray-500">
          Untuk menambahkan informasi detail data Faktor Stunting
        </p>
      </div>

      <div className="flex space-x-4">
        <Button
          label="Laki-Laki"
          onClick={() => setActiveTab("laki-laki")}
          className={`w-[186px] border-none py-2 focus:outline-none focus:ring-2 focus:ring-[#347dde] ${activeTab === "laki-laki" ? "bg-[#1854a2] text-white" : "bg-[#9bc0ef] text-black"}`}
        />
        <Button
          label="Perempuan"
          onClick={() => setActiveTab("perempuan")}
          className={`w-[186px] border-none py-2 focus:outline-none focus:ring-2 focus:ring-[#347dde] ${activeTab === "perempuan" ? "bg-[#1854a2] text-white" : "bg-[#9bc0ef] text-black"}`}
        />
      </div>
    </div>
  );

  const actionBar = (
    <div className="mt-10 flex flex-col items-end space-y-4">
      {/* Tombol Unduh PDF */}
      <Button
        label="Unduh PDF"
        onClick={() => console.log("Unduh PDF")}
        className="mt-2 mb-3 w-[186px] border-none bg-gray-400 py-2 text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
      >
        <IconDownload />
      </Button>

    </div>
  );

  const dummyDataParameter: Parameter[] = [
    { umur: 1, min3: 44.38, min2: 46.27, min1: 48.17, median: 50.06, plus1: 51.96, plus2: 53.85, plus3: 55.74 },
    { umur: 2, min3: 44.38, min2: 46.27, min1: 48.17, median: 50.06, plus1: 51.96, plus2: 53.85, plus3: 55.74 },
    { umur: 3, min3: 44.38, min2: 46.27, min1: 48.17, median: 50.06, plus1: 51.96, plus2: 53.85, plus3: 55.74 },
    { umur: 4, min3: 44.38, min2: 46.27, min1: 48.17, median: 50.06, plus1: 51.96, plus2: 53.85, plus3: 55.74 },
    { umur: 5, min3: 44.38, min2: 46.27, min1: 48.17, median: 50.06, plus1: 51.96, plus2: 53.85, plus3: 55.74 },
    { umur: 6, min3: 44.38, min2: 46.27, min1: 48.17, median: 50.06, plus1: 51.96, plus2: 53.85, plus3: 55.74 },
    { umur: 7, min3: 44.38, min2: 46.27, min1: 48.17, median: 50.06, plus1: 51.96, plus2: 53.85, plus3: 55.74 },
  ];

  const setBackgroundColor = (value: string) => {
    if (["min3", "min2", "plus2", "plus3"].includes(value)) {
      return "bg-red-500 text-white";
    } else if (["min1", "plus1"].includes(value)) {
      return "bg-yellow-500 text-white";
    } else if (value === "median") {
      return "bg-green-500 text-white";
    }
    return "";
  };

  return (
    <div className="mt-10 rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
      {header}
      {actionBar}
      <div className="max-w-full overflow-x-auto">
        <div className="rounded-lg">
          <Dropdown
            value={selectedCity}
            onChange={(e: DropdownChangeEvent) => setSelectedCity(e.value)}
            options={cities}
            optionLabel="name"
            placeholder="Tinggi Badan (Cm)"
            className="h-10 w-full border border-stroke bg-white text-black focus:outline-none focus:ring-2 focus:ring-gray-500 rounded-none flex items-center justify-center text-center" // Memastikan teks berada di tengah dan tidak ada rounded
            itemTemplate={(option) => (
              <div className="text-center">{option.name}</div>
            )}
            checkmark={true}
            highlightOnSelect={false}
          />
          <DataTable
            value={dummyDataParameter}
            showGridlines
            className="datatable-responsive"
            emptyMessage="No data available"
          >
            <Column
              field="umur"
              header="Umur (hari)"
              headerStyle={{ height: "54px", width: "10rem" }}
              style={{ minWidth: "8rem" }}
              headerClassName="border px-4 py-2 text-center align-middle"
              bodyClassName="text-center align-middle"
            />
            <Column
              field="min3"
              header="-3 SD"
              bodyClassName={`text-center align-middle ${setBackgroundColor("min3")}`}
              headerClassName="border px-4 py-2 text-center align-middle"
              style={{ minWidth: "7rem" }}
            />
            <Column
              field="min2"
              header="-2 SD"
              bodyClassName={`text-center align-middle ${setBackgroundColor("min2")}`}
              headerClassName="border px-4 py-2 text-center align-middle"
              style={{ minWidth: "7rem" }}
            />
            <Column
              field="min1"
              header="-1 SD"
              bodyClassName={`text-center align-middle ${setBackgroundColor("min1")}`}
              headerClassName="border px-4 py-2 text-center align-middle"
              style={{ minWidth: "7rem" }}
            />
            <Column
              field="median"
              header="Median"
              bodyClassName={`text-center align-middle ${setBackgroundColor("median")}`}
              headerClassName="border px-4 py-2 text-center align-middle"
              style={{ minWidth: "7rem" }}
            />
            <Column
              field="plus1"
              header="+1 SD"
              bodyClassName={`text-center align-middle ${setBackgroundColor("plus1")}`}
              headerClassName="border px-4 py-2 text-center align-middle"
              style={{ minWidth: "7rem" }}
            />
            <Column
              field="plus2"
              header="+2 SD"
              bodyClassName={`text-center align-middle ${setBackgroundColor("plus2")}`}
              headerClassName="border px-4 py-2 text-center align-middle"
              style={{ minWidth: "7rem" }}
            />
            <Column
              field="plus3"
              header="+3 SD"
              bodyClassName={`text-center align-middle ${setBackgroundColor("plus3")}`}
              headerClassName="border px-4 py-2 text-center align-middle"
              style={{ minWidth: "7rem" }}
            />
          </DataTable>


        </div>
      </div>
    </div>
  );
};

export default ParameterStunting;