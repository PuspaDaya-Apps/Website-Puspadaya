"use client";
import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

// Dummy Data for Stunting Parameters Table
const stuntingData = [
  {
    umur: 1,
    Neg3: 78.0,
    Neg2: 81.0,
    Neg1: 84.1,
    median: 87.1,
    Pos1: 90.2,
    Pos2: 93.2,
    Pos3: 96.3,
  },
  {
    umur: 2,
    Neg3: 78.6,
    Neg2: 81.7,
    Neg1: 84.9,
    median: 88.0,
    Pos1: 91.1,
    Pos2: 94.2,
    Pos3: 97.3,
  },
  {
    umur: 3,
    Neg3: 79.3,
    Neg2: 82.5,
    Neg1: 85.6,
    median: 88.8,
    Pos1: 92.0,
    Pos2: 95.2,
    Pos3: 98.3,
  },
  {
    umur: 4,
    Neg3: 79.9,
    Neg2: 83.1,
    Neg1: 86.4,
    median: 89.6,
    Pos1: 92.9,
    Pos2: 96.1,
    Pos3: 99.3,
  },
  {
    umur: 5,
    Neg3: 80.5,
    Neg2: 83.8,
    Neg1: 87.1,
    median: 90.4,
    Pos1: 93.7,
    Pos2: 97.0,
    Pos3: 100.3,
  },
  {
    umur: 7,
    Neg3: 81.1,
    Neg2: 84.5,
    Neg1: 87.8,
    median: 91.2,
    Pos1: 94.5,
    Pos2: 97.9,
    Pos3: 101.2,
  },
];

const ColorTemplate = (value: number, background: string) => {
  return (
    <div
      style={{
        backgroundColor: background,
        color: "black",
        textAlign: "center",
      }}
    >
      {value}
    </div>
  );
};

const TableParameterStunting = () => {
  const header = (
    <div className="mb-1 flex flex-col md:items-start">
      <h2 className="pb-1 text-2xl font-bold text-black">Parameter Stunting</h2>
      <p className="text-sm font-light text-gray-5">
        Standarisasi parameter stunting
      </p>
    </div>
  );

  return (
    <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
      <div className="max-w-full overflow-x-auto">
        <div className="rounded-lg">
          <DataTable
            value={stuntingData}
            className="datatable-responsive"
            header={header}
          >
            <Column
              field="umur"
              header="Umur (hari)"
              style={{ textAlign: "center" }}
            />
            <Column
              field="Neg3"
              header="-3 SD"
              body={(rowData) => ColorTemplate(rowData.Neg3, "red")}
            />
            <Column
              field="Neg2"
              header="-2 SD"
              body={(rowData) => ColorTemplate(rowData.Neg2, "#ff4500")} // Dark Red
            />
            <Column
              field="Neg1"
              header="-1 SD"
              body={(rowData) => ColorTemplate(rowData.Neg1, "yellow")}
            />
            <Column
              field="median"
              header="Median"
              body={(rowData) => ColorTemplate(rowData.median, "green")}
            />
            <Column
              field="Pos1"
              header="+1 SD"
              body={(rowData) => ColorTemplate(rowData.Pos1, "yellow")}
            />
            <Column
              field="Pos2"
              header="+2 SD"
              body={(rowData) => ColorTemplate(rowData.Pos2, "#ff4500")} // Dark Red
            />
            <Column
              field="Pos3"
              header="+3 SD"
              body={(rowData) => ColorTemplate(rowData.Pos3, "red")}
            />
          </DataTable>
        </div>
      </div>
    </div>
  );
};

export default TableParameterStunting;
