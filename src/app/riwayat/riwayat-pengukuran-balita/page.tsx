"use client";

import { SvgDetailOrangTua } from "@/components/ui/Svg";
import { IconSearch } from "@tabler/icons-react";
import { Column, ColumnBodyOptions } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { ProgressBar } from "primereact/progressbar";
import { Toast } from "primereact/toast";
import React, { useEffect, useRef, useState } from "react";
import ButtonLinks from "../../../components/ui/ButtonLink";

interface DataRow {
  id: number;
  contact_ref: string;
  nik: string; // NIK
  status: string; // Status
}

const statusColors: { [key: string]: string } = {
  Stunting: "bg-red-200",
  Risiko: "bg-yellow-200",
  Normal: "bg-green-200",
  "Gizi Buruk": "bg-red-300",
  "Gizi Kurang": "bg-orange-200",
  "Gizi Baik": "bg-green-300",
  "Berisiko Gizi Lebih": "bg-yellow-300",
  "Gizi Lebih": "bg-orange-300",
  Obesitas: "bg-red-500",
};

const TablesPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dataWithDisplayId, setDataWithDisplayId] = useState<DataRow[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const toast = useRef<Toast>(null);
  const [globalFilter, setGlobalFilter] = useState("");

  useEffect(() => {
    setLoading(true);
    try {
      const dummyData: DataRow[] = Array.from({ length: 680 }, (_, index) => ({
        id: index + 1,
        contact_ref: `Nama Lengkap ${index + 1}`, // Nama Lengkap
        nik: generateNIK(), // NIK acak 16 angka
        status: getRandomStatus(), // Status acak
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
      ? "bg-gray-100 h-12 text-base text-black rounded-lg" // Added text-black
      : "bg-white h-12 text-base text-black rounded-lg"; // Added text-black
  };

  const getRandomStatus = () => {
    const statuses = Object.keys(statusColors);
    return statuses[Math.floor(Math.random() * statuses.length)];
  };

  const handleEdit = (rowData: DataRow) => {
    console.log("Edit", rowData);
    toast.current?.show({
      severity: "info",
      summary: "Edit",
      detail: `Editing ${rowData.contact_ref}`,
      life: 3000,
    });
  };

  const actionBodyTemplate = (data: DataRow, options: ColumnBodyOptions) => {
    return (
      <ButtonLinks
        href={`/riwayat/riwayat-pengukuran-balita/view`}
        className="bg-[#486284] hover:bg-[#405672] focus-visible:ring-[#405672]"
      >
        <div className="flex items-center gap-1">
          <SvgDetailOrangTua />
          <span>Lihat Detail</span>
        </div>
      </ButtonLinks>
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

  const header = (
    <div className="mb-1 flex flex-col md:flex-row md:items-center md:justify-between">
      <h2 className="pb-1 text-2xl font-bold text-black">
        Riwayat Pengukuran Balita
      </h2>
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
  );

  return (
    <div className=" container mx-auto">
      <div className="card overflow-hidden rounded-lg bg-white p-4 shadow-md">
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
            header={header}
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
              style={{ minWidth: "8rem" }}
            />
            <Column
              field="contact_ref"
              header="Nama Lengkap"
              sortable
              headerClassName="bg-[#F7F9FC] text-black"
              style={{ minWidth: "10rem" }}
            />
            <Column
              field="status"
              header="Status"
              body={statusBodyTemplate}
              sortable
              headerClassName="bg-[#F7F9FC] text-black"
              style={{ minWidth: "10rem" }}
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

export default TablesPage;
