"use client";
import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ProgressBar } from "primereact/progressbar";
import { Toast } from "primereact/toast";

const dataPengukuran = [
  { no: 1, tanggal: "12/02/2024", bb: 12, tb: 20, lila: 3, tfu: 6, hb: 6, kar: "Iya", fe: 6, petugas: "Siti Ahyani" },
  { no: 2, tanggal: "13/03/2024", bb: 12, tb: 20, lila: 3, tfu: 6, hb: 6, kar: "Iya", fe: 6, petugas: "Siti Ahyani" },
  { no: 3, tanggal: "14/04/2024", bb: 12, tb: 20, lila: 3, tfu: 6, hb: 6, kar: "Iya", fe: 6, petugas: "Yovita Nanda" },
  { no: 4, tanggal: "15/05/2024", bb: 12, tb: 20, lila: 3, tfu: 6, hb: 6, kar: "Iya", fe: 6, petugas: "Yovita Nanda" },
  { no: 5, tanggal: "16/06/2024", bb: 12, tb: 20, lila: 3, tfu: 6, hb: 6, kar: "Iya", fe: 6, petugas: "Risma Tahmidi" },
  { no: 6, tanggal: "17/07/2024", bb: 12, tb: 20, lila: 3, tfu: 6, hb: 6, kar: "Iya", fe: 6, petugas: "Risma Tahmidi" },
  { no: 7, tanggal: "18/08/2024", bb: 12, tb: 20, lila: 3, tfu: 6, hb: 6, kar: "Iya", fe: 6, petugas: "Willa Wikarsi" },
  { no: 8, tanggal: "19/09/2024", bb: 12, tb: 20, lila: 3, tfu: 6, hb: 6, kar: "Iya", fe: 6, petugas: "Willa Wikarsi" }
];

const TableRiwayatBalita = () => {
  const [data, setData] = useState(dataPengukuran);
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);

  return (
    <div className="mt-5">
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
            <Column field="tfu" header="TFU (Cm)" sortable headerClassName="bg-[#F7F9FC] text-black" />
            <Column field="hb" header="HB (mg/dl)" sortable headerClassName="bg-[#F7F9FC] text-black" />
            <Column field="fe" header="Tablet FE" sortable headerClassName="bg-[#F7F9FC] text-black" />
            <Column field="kar" header="KAR" sortable headerClassName="bg-[#F7F9FC] text-black" />
            <Column field="petugas" header="Petugas" sortable headerClassName="bg-[#F7F9FC] text-black" style={{ minWidth: "10rem" }} />
          </DataTable>
        </div>
      </div>
    </div>
  );
};

export default TableRiwayatBalita;
