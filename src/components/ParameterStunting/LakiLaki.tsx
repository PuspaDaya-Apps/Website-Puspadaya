"use client";
import React from "react";
import { Parameter } from "@/types/parameter";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const LakiLaki = () => {
  const dummyDataParameter: Parameter[] = [
    {
      umur: 1,
      min3: 44.38,
      min2: 46.27,
      min1: 48.17,
      median: 50.06,
      plus1: 51.96,
      plus2: 53.85,
      plus3: 55.74,
    },
    {
      umur: 2,
      min3: 44.38,
      min2: 46.27,
      min1: 48.17,
      median: 50.06,
      plus1: 51.96,
      plus2: 53.85,
      plus3: 55.74,
    },
    {
      umur: 3,
      min3: 44.38,
      min2: 46.27,
      min1: 48.17,
      median: 50.06,
      plus1: 51.96,
      plus2: 53.85,
      plus3: 55.74,
    },
    {
      umur: 4,
      min3: 44.38,
      min2: 46.27,
      min1: 48.17,
      median: 50.06,
      plus1: 51.96,
      plus2: 53.85,
      plus3: 55.74,
    },
    {
      umur: 5,
      min3: 44.38,
      min2: 46.27,
      min1: 48.17,
      median: 50.06,
      plus1: 51.96,
      plus2: 53.85,
      plus3: 55.74,
    },
    {
      umur: 6,
      min3: 44.38,
      min2: 46.27,
      min1: 48.17,
      median: 50.06,
      plus1: 51.96,
      plus2: 53.85,
      plus3: 55.74,
    },
    {
      umur: 7,
      min3: 44.38,
      min2: 46.27,
      min1: 48.17,
      median: 50.06,
      plus1: 51.96,
      plus2: 53.85,
      plus3: 55.74,
    },
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
    <div className="mt-8 rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
      <div className="max-w-full overflow-x-auto">
        <div className="rounded-lg ">
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
              headerClassName="border px-4 py-2 text-center"
              className="text-center"
            />

            <Column
              field="min3"
              header="-3 SD"
              bodyClassName={setBackgroundColor("min3")}
              headerClassName="border px-4 py-2 text-center"
              style={{ minWidth: "7rem" }}
            />

            <Column
              field="min2"
              header="-2 SD"
              bodyClassName={setBackgroundColor("min2")}
              headerClassName="border px-4 py-2 text-center"
              style={{ minWidth: "7rem" }}
            />

            <Column
              field="min1"
              header="-1 SD"
              bodyClassName={setBackgroundColor("min1")}
              headerClassName="border px-4 py-2 text-center"
              style={{ minWidth: "7rem" }}
            />

            <Column
              field="median"
              header="Median"
              bodyClassName={setBackgroundColor("median")}
              headerClassName="border px-4 py-2 text-center"
              style={{ minWidth: "7rem" }}
            />

            <Column
              field="plus1"
              header="+1 SD"
              bodyClassName={setBackgroundColor("plus1")}
              headerClassName="border px-4 py-2 text-center"
              style={{ minWidth: "7rem" }}
            />

            <Column
              field="plus2"
              header="+2 SD"
              bodyClassName={setBackgroundColor("plus2")}
              headerClassName="border px-4 py-2 text-center"
              style={{ minWidth: "7rem" }}
            />

            <Column
              field="plus3"
              header="+3 SD"
              bodyClassName={setBackgroundColor("plus3")}
              headerClassName="border px-4 py-2 text-center"
              style={{ minWidth: "7rem" }}
            />
          </DataTable>
        </div>
      </div>
    </div>
  );
};

export default LakiLaki;
