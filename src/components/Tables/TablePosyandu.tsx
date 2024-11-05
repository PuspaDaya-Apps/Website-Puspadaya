"use client";
import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column, ColumnBodyOptions } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { IconPencil, IconSearch, IconTrash } from "@tabler/icons-react";
import {
  CascadeSelect,
  CascadeSelectChangeEvent,
} from "primereact/cascadeselect";
import "./style.css";
import Link from "next/link";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import { PosyanduType } from "@/types/posyandu";
import { SvgAdd } from "../ui/Svg";

interface City {
  cname: string;
  code: string;
}

interface CountryState {
  name: string;
  cities: City[];
}

interface Country {
  name: string;
  code: string;
  states: CountryState[];
}

const TablePosyandu = () => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const countries: Country[] = [
    {
      name: "Banyuwangi",
      code: "BWI",
      states: [
        {
          name: "Kabat",
          cities: [
            { cname: "Kedayunan", code: "A-SY" },
            { cname: "Tambong", code: "A-NE" },
          ],
        },
        {
          name: "Rogojampi",
          cities: [
            { cname: "Brisbane", code: "A-BR" },
            { cname: "Townsville", code: "A-TO" },
          ],
        },
      ],
    },
    {
      name: "Maluku",
      code: "MLK",
      states: [
        {
          name: "A",
          cities: [
            { cname: "A1", code: "C-MO" },
            { cname: "B1", code: "C-QU" },
          ],
        },
      ],
    },
  ];

  const header = (
    <div className="mb-1 flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="pb-1 text-2xl font-bold text-black">Data Posyandu</h2>
        <p className="text-normal font-normal text-gray-500">
          Digunakan untuk menampilkan data posyandu
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
        <div>
          <CascadeSelect
            value={selectedCity}
            onChange={(e: CascadeSelectChangeEvent) => setSelectedCity(e.value)}
            options={countries}
            optionLabel="cname"
            optionGroupLabel="name"
            optionGroupChildren={["states", "cities"]}
            className="md:w-14rem flex h-11 w-full items-center"
            breakpoint="767px"
            placeholder="Select a City"
            style={{ minWidth: "14rem" }}
          />
        </div>
        <Link
          href={`/data/data-posyandu/create`}
          className="flex cursor-pointer items-center justify-center rounded-md border p-[10px]"
        >
          <SvgAdd />
        </Link>
      </div>
    </div>
  );

  const indexTemplate = (data: any, options: ColumnBodyOptions) => {
    return <span className="text-center">{options.rowIndex + 1}</span>;
  };

  const confirmDelete = () => {
    confirmDialog({
      message: "Do you want to delete this record?",
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
      accept,
    });
  };

  const accept = () => {
    alert("Sukses  Dihapus");
  };

  const actionBodyTemplate = (rowData: PosyanduType) => {
    return (
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <Link href={`/data/data-posyandu/${rowData.id}/edit`} passHref>
          <IconPencil style={{ color: "purple", cursor: "pointer" }} />
        </Link>
        <IconTrash
          onClick={() => confirmDelete()}
          style={{ color: "red", cursor: "pointer" }}
        />
      </div>
    );
  };

  const posyanduData: PosyanduType[] = [
    {
      id: 1,
      namaPosyandu: "Posyandu Melati Sehat",
      namaPuskesmas: "Puskesmas Suka Sehat",
      kecamatan: "Kecamatan Suka Maju",
    },
    {
      id: 2,
      namaPosyandu: "Posyandu Teratai Indah",
      namaPuskesmas: "Puskesmas Sentosa",
      kecamatan: "Kecamatan Aman Jaya",
    },
    {
      id: 3,
      namaPosyandu: "Posyandu Mawar Berseri",
      namaPuskesmas: "Puskesmas Mulia Bersama",
      kecamatan: "Kecamatan Sumber Makmur",
    },
    {
      id: 4,
      namaPosyandu: "Posyandu Kembang Sari",
      namaPuskesmas: "Puskesmas Harapan Kita",
      kecamatan: "Kecamatan Luhur Mulyo",
    },
    {
      id: 5,
      namaPosyandu: "Posyandu Sejahtera",
      namaPuskesmas: "Puskesmas Sehat Makmur",
      kecamatan: "Kecamatan Karya Bakti",
    },
  ];

  return (
    <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
      <div className="max-w-full overflow-x-auto">
        <div className="rounded-lg">
          <ConfirmDialog />
          <DataTable
            value={posyanduData}
            dataKey="id"
            paginator
            rows={5}
            rowsPerPageOptions={[20, 40, 60, 80, 100]}
            className="datatable-responsive"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} records"
            emptyMessage="No data available"
            stripedRows
            globalFilter={globalFilter}
            filters={{ global: { value: globalFilter, matchMode: "contains" } }}
            globalFilterFields={["namaPosyandu", "namaPuskesmas"]}
            header={header}
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
              field="namaPosyandu"
              header="Nama Posyandu"
              sortable
              headerClassName="bg-[#F7F9FC] text-black"
              style={{ minWidth: "10rem" }}
            />

            <Column
              field="namaPuskesmas"
              header="Nama Puskesmas"
              sortable
              headerClassName="bg-[#F7F9FC] text-black"
              style={{ minWidth: "10rem" }}
            />

            <Column
              field="kecamatan"
              header="Kecamatan"
              sortable
              headerClassName="bg-[#F7F9FC] text-black"
              style={{ minWidth: "10rem" }}
            />

            <Column
              header="Aksi"
              headerClassName="bg-[#F7F9FC] text-black rounded-r-lg text-center"
              body={actionBodyTemplate}
              style={{ minWidth: "5rem" }}
            />
          </DataTable>
        </div>
      </div>
    </div>
  );
};

export default TablePosyandu;
