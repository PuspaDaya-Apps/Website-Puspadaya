"use client";
import { RekapPengukuranBalita } from "@/types/rekapBalita";
import { IconSearch } from "@tabler/icons-react";
import { Column, ColumnBodyOptions } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import React, { useEffect, useRef, useState } from "react";
import { SvgDetailOrangTua } from "../ui/Svg";
import ButtonLink from "../ui/ButtonLink";

const statusColors: { [key: string]: string } = {
  Stunting: "bg-red-200",
  Beresiko: "bg-yellow-200",
  Normal: "bg-green-200",
};

const TableRiwayatPengukuranBalita = () => {
  const [dataRekapBalita, setDataRekapBalita] = useState<
    RekapPengukuranBalita[]
  >([]);
  const toast = useRef<Toast>(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const dummyData: RekapPengukuranBalita[] = [
    {
      id: 1,
      nik: "3201234567890001",
      namaLengkap: "Ahmad Putra",
      statusStunting: "Normal",
    },
    {
      id: 2,
      nik: "3201234567890002",
      namaLengkap: "Siti Aminah",
      statusStunting: "Stunting",
    },
    {
      id: 3,
      nik: "3201234567890003",
      namaLengkap: "Budi Santoso",
      statusStunting: "Beresiko",
    },
    {
      id: 4,
      nik: "3201234567890004",
      namaLengkap: "Rina Wijaya",
      statusStunting: "Normal",
    },
    {
      id: 5,
      nik: "3201234567890005",
      namaLengkap: "Eko Prasetyo",
      statusStunting: "Stunting",
    },
    {
      id: 6,
      nik: "3201234567890006",
      namaLengkap: "Nurul Aisyah",
      statusStunting: "Beresiko",
    },
    {
      id: 7,
      nik: "3201234567890007",
      namaLengkap: "Agus Firmansyah",
      statusStunting: "Normal",
    },
    {
      id: 8,
      nik: "3201234567890008",
      namaLengkap: "Sari Lestari",
      statusStunting: "Stunting",
    },
    {
      id: 9,
      nik: "3201234567890009",
      namaLengkap: "Doni Saputra",
      statusStunting: "Beresiko",
    },
    {
      id: 10,
      nik: "3201234567890010",
      namaLengkap: "Lia Rahma",
      statusStunting: "Normal",
    },
  ];

  useEffect(() => {
    try {
      setDataRekapBalita(dummyData);
    } catch (err) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to load data",
        life: 3000,
      });
    }
  }, []);

  const rowClassName = (data: RekapPengukuranBalita) => {
    return data.id % 2 === 0
      ? "bg-gray-100 h-12 text-base text-black rounded-lg"
      : "bg-white h-12 text-base text-black rounded-lg";
  };

  const actionBodyTemplate = (rowData: RekapPengukuranBalita) => {
    return (
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <ButtonLink
          href={`/monitoring/monitoring-stunting/${rowData.id}`}
          className="bg-[#486284] hover:bg-[#405672] focus-visible:ring-[#405672]"
        >
          <div className="flex items-center gap-1">
            <SvgDetailOrangTua />
            <span>Lihat Detail</span>
          </div>
        </ButtonLink>
      </div>
    );
  };

  const statusBodyTemplate = (rowData: RekapPengukuranBalita) => {
    return (
      <span
        className={`${statusColors[rowData.statusStunting]} rounded-full px-3 py-1 text-sm font-medium`}
      >
        {rowData.statusStunting}
      </span>
    );
  };

  const indexTemplate = (data: any, options: ColumnBodyOptions) => {
    return <span className="text-center">{options.rowIndex + 1}</span>;
  };

  const header = (
    <div className="mb-1 flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="pb-1 text-2xl font-bold text-black">
          Riwayat Pengukuran Balita
        </h2>
        <p className="text-normal font-normal text-gray-500">
          Digunakan untuk menampilkan riwayat pengukuran balita
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
  );

  return (
    <div className="container mx-auto">
      <div className="card overflow-hidden rounded-lg bg-white p-4 shadow-md">
        <Toast ref={toast} />
        <div className="rounded-lg ">
          <DataTable
            value={dataRekapBalita}
            dataKey="id"
            paginator
            rows={10}
            rowsPerPageOptions={[20, 40, 60, 80, 100]}
            className="datatable-responsive"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} records"
            emptyMessage="No data available"
            rowClassName={rowClassName}
            header={header}
            globalFilter={globalFilter}
            globalFilterFields={["nik", "namaLengkap"]}
            paginatorClassName="bg-gray-50 p-4 mt-4 rounded-lg"
          >
            <Column
              header="No"
              headerStyle={{ height: "54px", width: "4rem" }}
              body={indexTemplate}
              headerClassName="bg-[#F7F9FC] text-black rounded-l-lg"
              className="text-center"
            />

            <Column
              field="nik"
              header="NIK"
              sortable
              headerClassName="bg-[#F7F9FC] text-black"
              style={{ minWidth: "10rem" }}
            />
            <Column
              field="namaLengkap"
              header="Nama Lengkap"
              sortable
              headerClassName="bg-[#F7F9FC] text-black"
              style={{ minWidth: "10rem" }}
            />
            <Column
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

export default TableRiwayatPengukuranBalita;
