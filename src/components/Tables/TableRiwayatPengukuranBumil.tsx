"use client";
import { RekapPengukuranBumil } from "@/types/rekapBumil";
import { Column, ColumnBodyOptions } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import React, { useEffect, useRef, useState } from "react";
import ButtonLink from "../ui/ButtonLink";
import { SvgDetailOrangTua } from "../ui/Svg";
import { IconSearch } from "@tabler/icons-react";

const TableRiwayatPengukuranBumil = () => {
  const [dataRekapBumil, setDataRekapBumil] = useState<RekapPengukuranBumil[]>(
    [],
  );
  const toast = useRef<Toast>(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const dummyDataBumil: RekapPengukuranBumil[] = [
    {
      id: 1,
      nik: "3201234567891001",
      namaLengkap: "Ratna Sari",
      tanggalPengukuran: "2024-10-01",
    },
    {
      id: 2,
      nik: "3201234567891002",
      namaLengkap: "Siti Rohmah",
      tanggalPengukuran: "2024-10-05",
    },
    {
      id: 3,
      nik: "3201234567891003",
      namaLengkap: "Dewi Lestari",
      tanggalPengukuran: "2024-10-08",
    },
    {
      id: 4,
      nik: "3201234567891004",
      namaLengkap: "Intan Permata",
      tanggalPengukuran: "2024-10-10",
    },
    {
      id: 5,
      nik: "3201234567891005",
      namaLengkap: "Yuli Rahmawati",
      tanggalPengukuran: "2024-10-12",
    },
    {
      id: 6,
      nik: "3201234567891006",
      namaLengkap: "Fitri Andini",
      tanggalPengukuran: "2024-10-15",
    },
    {
      id: 7,
      nik: "3201234567891007",
      namaLengkap: "Mega Purnama",
      tanggalPengukuran: "2024-10-18",
    },
    {
      id: 8,
      nik: "3201234567891008",
      namaLengkap: "Rina Kurnia",
      tanggalPengukuran: "2024-10-20",
    },
    {
      id: 9,
      nik: "3201234567891009",
      namaLengkap: "Sri Wahyuni",
      tanggalPengukuran: "2024-10-22",
    },
    {
      id: 10,
      nik: "3201234567891010",
      namaLengkap: "Diana Susanti",
      tanggalPengukuran: "2024-10-25",
    },
  ];

  useEffect(() => {
    try {
      setDataRekapBumil(dummyDataBumil);
    } catch (err) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to load data",
        life: 3000,
      });
    }
  }, []);

  const rowClassName = (data: RekapPengukuranBumil) => {
    return data.id % 2 === 0
      ? "bg-gray-100 h-12 text-base text-black rounded-lg"
      : "bg-white h-12 text-base text-black rounded-lg";
  };

  const actionBodyTemplate = (rowData: RekapPengukuranBumil) => {
    return (
      <ButtonLink
        href={`/pemeriksaan/detail-pemeriksaan/`}
        className="bg-[#486284] hover:bg-[#405672] focus-visible:ring-[#405672]"
      >
        <div className="flex items-center gap-1">
          <SvgDetailOrangTua />
          <span>Lihat Detail</span>
        </div>
      </ButtonLink>
    );
  };

  const indexTemplate = (data: any, options: ColumnBodyOptions) => {
    return <span className="text-center">{options.rowIndex + 1}</span>;
  };

  const header = (
    <div className="mb-1 flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="pb-1 text-2xl font-bold text-black">
          Riwayat Pengukuran Ibu Hamil
        </h2>
        <p className="text-normal font-normal text-gray-500">
          Digunakan untuk menampilkan data pengukuran Ibu Hamil
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
            value={dataRekapBumil}
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
              field="tanggalPengukuran"
              header="Tanggal Pengukuran"
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

export default TableRiwayatPengukuranBumil;
