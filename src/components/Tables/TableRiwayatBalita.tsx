"use client";
import React, { useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ProgressBar } from "primereact/progressbar";
import { Toast } from "primereact/toast";

// Dummy data
const dataPengukuran = [
  { no: 1, tanggal: "12/02/2024", bb: 12, tb: 20, lila: 3, lp: 6, petugas: "Siti Ahyani", status: "Normal", faktor: "Tidak Ada" },
  { no: 2, tanggal: "13/02/2024", bb: 13, tb: 21, lila: 3.5, lp: 6.2, petugas: "Yovita Nanda", status: "Beresiko", faktor: "Air bersih, Asupan Gizi" },
  { no: 3, tanggal: "14/02/2024", bb: 10, tb: 18, lila: 2.8, lp: 5.8, petugas: "Risma Tahmidi", status: "Stunting", faktor: "Asupan Gizi" },
  { no: 4, tanggal: "15/02/2024", bb: 11, tb: 19, lila: 3, lp: 6, petugas: "Willa Wikarsi", status: "Normal", faktor: "Tidak Ada" },
  { no: 5, tanggal: "16/02/2024", bb: 16, tb: 20, lila: 2, lp: 5, petugas: "Willa Wikarsi", status: "Stunting", faktor: "Tidak Ada" },
];

const TableRiwayatBalita = () => {
  const [data, setData] = useState(dataPengukuran);
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);

  const statusBodyTemplate = (rowData: any) => {
    return (
      <span
        className={`p-2 rounded-lg text-white ${
          rowData.status === "Normal" ? "bg-green-500" : rowData.status === "Beresiko" ? "bg-yellow-500" : "bg-red-500"
        }`}
      >
        {rowData.status}
      </span>
    );
  };

  return (
    <div className="mt-8">
      <div className="overflow-x-auto">
        {loading && (
          <div className="mb-4">
            <span className="text-sm text-gray-600">Loading...</span>
            <ProgressBar mode="indeterminate" className="mt-2 h-2" />
          </div>
        )}
        <Toast ref={toast} />
        <div className="rounded-lg">
          <DataTable
            value={data}
            className="datatable-responsive"
            emptyMessage="No data available"
            responsiveLayout="scroll"
          >
            <Column field="no" header="No" sortable headerClassName="bg-[#F7F9FC] text-black" bodyClassName="text-center" />
            <Column field="tanggal" header="Tanggal Pengukuran" sortable headerClassName="bg-[#F7F9FC] text-black" style={{ minWidth: "10rem" }} />
            <Column field="bb" header="BB (Kg)" sortable headerClassName="bg-[#F7F9FC] text-black" />
            <Column field="tb" header="TB (Cm)" sortable headerClassName="bg-[#F7F9FC] text-black" />
            <Column field="lila" header="Lila (Cm)" sortable headerClassName="bg-[#F7F9FC] text-black" />
            <Column field="lp" header="LP (Cm)" sortable headerClassName="bg-[#F7F9FC] text-black" />
            <Column field="petugas" header="Petugas" sortable headerClassName="bg-[#F7F9FC] text-black" style={{ minWidth: "10rem" }} />
            <Column field="status" header="Status" sortable body={statusBodyTemplate} headerClassName="bg-[#F7F9FC] text-black" />
            <Column field="faktor" header="Faktor Resiko" sortable headerClassName="bg-[#F7F9FC] text-black" style={{ minWidth: "15rem" }} />
          </DataTable>
        </div>
      </div>
    </div>
  );
};

export default TableRiwayatBalita;
