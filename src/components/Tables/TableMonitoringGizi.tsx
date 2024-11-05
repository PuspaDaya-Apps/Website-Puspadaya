"use client";

import { IconEye, IconSearch } from "@tabler/icons-react";
import Link from "next/link";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { ProgressBar } from "primereact/progressbar";
import { Toast } from "primereact/toast";
import React, { useEffect, useRef, useState } from "react";

interface DataRow {
  id: number;
  contact_ref: string;
  nik: string; // NIK
  status: string; // Status
  pelaksana: string;
}

const statusColors: { [key: string]: string } = {
  "Gizi Buruk": "bg-red-200",
  "Gizi Kurang": "bg-yellow-200",
};

const TableMonitoringGizi: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dataWithDisplayId, setDataWithDisplayId] = useState<DataRow[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const toast = useRef<Toast>(null);
  const [globalFilter, setGlobalFilter] = useState("");

  useEffect(() => {
    setLoading(true);
    try {
      const dummyData: DataRow[] = Array.from({ length: 30 }, (_, index) => ({
        id: index + 1,
        contact_ref: `Nama Balita ${index + 1}`, // Nama Balita
        nik: generateNIK(), // NIK acak 16 angka
        status: getRandomStatus(), // Status acak
        pelaksana: `Tenaga Pelaksana ${index + 1}`,
      }));
      setDataWithDisplayId(dummyData);
    } catch (err) {
      setError("Error fetching data");
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to load data",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const generateNIK = (): string => {
    let nik = "";
    for (let i = 0; i < 16; i++) {
      nik += Math.floor(Math.random() * 10); // Menghasilkan angka 0-9
    }
    return nik;
  };

  const rowClassName = (data: DataRow) => {
    return data.id % 2 === 0
      ? "bg-gray-100 h-12 text-base text-black rounded-lg"
      : "bg-white h-12 text-base text-black rounded-lg";
  };

  const getRandomStatus = () => {
    const statuses = Object.keys(statusColors);
    return statuses[Math.floor(Math.random() * statuses.length)];
  };

  const actionBodyTemplate = (rowData: DataRow) => {
    return (
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <div className="flex space-x-2">
          <Link
            href={`/monitoring/monitoring-gizi/view`}
            passHref
            className="rounded-lg bg-gray-500 p-1"
          >
            <IconEye className="text-white" />
          </Link>
        </div>
      </div>
    );
  };

  const statusBodyTemplate = (rowData: DataRow) => {
    return (
      <span
        className={`${statusColors[rowData.status]} rounded-full px-3 py-1 text-sm font-medium`}
      >
        {rowData.status}
      </span>
    );
  };

  return (
    <div className="container mx-auto">
      <div className="card -mt-4 overflow-hidden rounded-lg bg-white p-4 shadow-md">
        <div className="mb-6 flex flex-col justify-between md:flex-row md:items-center">
          <div className="md:mb-0">
            <h2 className="pb-1 text-2xl font-bold text-black">
              Monitoring Gizi
            </h2>
            <p className="text-sm font-light text-gray-5">
              Digunakan untuk menampilkan monitoring gizi
            </p>
          </div>
          <div className="mt-2 flex items-center justify-end space-x-4 md:mt-0">
            <span className="relative flex items-center">
              <IconSearch className="absolute left-3 text-gray-500" />
              <InputText
                type="search"
                onInput={(e) =>
                  setGlobalFilter((e.target as HTMLInputElement).value)
                }
                placeholder="Search..."
                className="rounded-lg border border-gray-300 py-2 pl-10 pr-4"
              />
            </span>
          </div>
        </div>
        {loading && (
          <div className="mb-4">
            <span className="text-sm text-gray-600">Loading...</span>
            <ProgressBar mode="indeterminate" className="mt-2 h-2" />
          </div>
        )}
        {error && (
          <div className="mb-4 rounded-lg bg-red-100 p-4 text-red-700">
            {error}
          </div>
        )}

        <Toast ref={toast} />
        <div className="rounded-lg ">
          <DataTable
            value={dataWithDisplayId}
            dataKey="id"
            paginator
            rows={rowsPerPage}
            rowsPerPageOptions={[20, 40, 60, 80, 100]}
            className="datatable-responsive"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} records"
            emptyMessage="No data available"
            responsiveLayout="scroll"
            rowClassName={rowClassName}
            paginatorClassName="bg-gray-50 p-4 mt-4 rounded-lg"
          >
            <Column
              field="id"
              header="No"
              headerStyle={{ height: "54px" }}
              sortable
              headerClassName="bg-[#F7F9FC] text-black rounded-l-lg"
              className="text-center"
            />
            <Column
              field="nik"
              header="NIK"
              sortable
              headerClassName="bg-[#F7F9FC] text-black"
              style={{ minWidth: "5rem" }}
            />
            <Column
              field="contact_ref"
              header="Nama Balita"
              sortable
              headerClassName="bg-[#F7F9FC] text-black"
              style={{ minWidth: "5rem" }}
            />
            <Column
              field="status"
              header="Status"
              body={statusBodyTemplate}
              sortable
              headerClassName="bg-[#F7F9FC] text-black"
              style={{ minWidth: "5rem" }}
            />
            <Column
              field="contact_ref"
              header="Tenaga Pelaksana"
              sortable
              headerClassName="bg-[#F7F9FC] text-black"
              style={{ minWidth: "5rem" }}
            />
            <Column
              header="Action"
              body={actionBodyTemplate}
              headerClassName="bg-[#F7F9FC] text-black rounded-r-lg"
              style={{ minWidth: "5rem" }}
            />
          </DataTable>
        </div>
      </div>
    </div>
  );
};

export default TableMonitoringGizi;
