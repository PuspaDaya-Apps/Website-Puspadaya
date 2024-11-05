"use client";
import { RekapPengukuranBumil } from "@/types/rekapBumil";
import {
  IconEye,
  IconPencil,
  IconSearch,
  IconTrash,
} from "@tabler/icons-react";
import Link from "next/link";
import { Column, ColumnBodyOptions } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog"; // Import Dialog
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import React, { useEffect, useRef, useState } from "react";

const TableRekapBumil = () => {
  const [dataRekapBumil, setDataRekapBumil] = useState<RekapPengukuranBumil[]>(
    [],
  );
  const toast = useRef<Toast>(null);
  const [globalFilter, setGlobalFilter] = useState("");

  const [selectedDataRekap, setSelectedDataRekap] =
    useState<RekapPengukuranBumil | null>(null);
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);

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

  const confirmDeleteProduct = (rowData: RekapPengukuranBumil) => {
    setSelectedDataRekap(rowData);
    setDeleteProductDialog(true);
  };

  const deleteProduct = () => {
    if (selectedDataRekap) {
      setDataRekapBumil((prev) =>
        prev.filter((item) => item.id !== selectedDataRekap.id),
      );
      toast.current?.show({
        severity: "success",
        summary: "Deleted",
        detail: "Product deleted successfully",
        life: 3000,
      });
    }
    setDeleteProductDialog(false);
  };

  const actionBodyTemplate = (rowData: RekapPengukuranBumil) => {
    return (
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <Link href={`/rekap/pengukuran-ibu-hamil/perbarui`} passHref>
          <IconPencil style={{ color: "purple", cursor: "pointer" }} />
        </Link>

        <IconTrash
          onClick={() => confirmDeleteProduct(rowData)}
          style={{ color: "red", cursor: "pointer" }}
        />
      </div>
    );
  };

  const indexTemplate = (data: any, options: ColumnBodyOptions) => {
    return <span className="text-center">{options.rowIndex + 1}</span>;
  };

  const header = (
    <div className="mb-1 flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="pb-1 text-2xl font-bold text-black">
          Rekapitulasi Data Pengukuran Ibu Hamil
        </h2>
        <p className="text-normal font-normal text-gray-500">
          Digunakan untuk menampilkan data Rekapitulasi pengukuran Ibu Hamil
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

      <Dialog
        visible={deleteProductDialog}
        header="Konfirmasi Hapus"
        modal
        onHide={() => setDeleteProductDialog(false)}
        draggable={false}
        className="max-w-md rounded-lg bg-white shadow-lg "
      >
        <div className="p-6">
          <p className="text-lg font-medium">
            Apakah Anda yakin ingin menghapus{" "}
            <strong>{selectedDataRekap?.namaLengkap}</strong>?
          </p>
        </div>
        <div className="flex justify-end rounded-b-lg  p-4">
          <button
            className="rounded-md bg-gray-300 px-4 py-2 text-gray-700 transition duration-300 ease-in-out hover:bg-gray-400"
            onClick={() => setDeleteProductDialog(false)}
          >
            Batal
          </button>
          <button
            className="ml-2 rounded-md bg-red-500 px-4 py-2 text-white transition duration-300 ease-in-out hover:bg-red-600"
            onClick={deleteProduct}
          >
            Hapus
          </button>
        </div>
      </Dialog>
    </div>
  );
};

export default TableRekapBumil;
