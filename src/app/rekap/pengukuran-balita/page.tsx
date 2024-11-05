"use client";

import {
  IconEye,
  IconPencil,
  IconSearch,
  IconTrash,
} from "@tabler/icons-react";
import Link from "next/link";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog"; // Import Dialog
import { InputText } from "primereact/inputtext";
import { ProgressBar } from "primereact/progressbar";
import { Toast } from "primereact/toast";
import React, { useEffect, useRef, useState } from "react";

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
  const [formData, setFormData] = useState<{ nama: string }>({ nama: "" });
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const toast = useRef<Toast>(null);
  const [globalFilter, setGlobalFilter] = useState("");

  const [information, setInformation] = useState<DataRow | null>(null);
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);

  useEffect(() => {
    setLoading(true);
    try {
      const dummyData: DataRow[] = Array.from({ length: 30 }, (_, index) => ({
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
      nik += Math.floor(Math.random() * 10);
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

  const handleEdit = (rowData: DataRow) => {
    console.log("Edit", rowData);
    toast.current?.show({
      severity: "info",
      summary: "Edit",
      detail: `Editing ${rowData.contact_ref}`,
      life: 3000,
    });
  };

  const confirmDeleteProduct = (rowData: DataRow) => {
    setInformation(rowData);
    setDeleteProductDialog(true);
  };

  const deleteProduct = () => {
    if (information) {
      setDataWithDisplayId((prev) =>
        prev.filter((item) => item.id !== information.id),
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

  const actionBodyTemplate = (rowData: DataRow) => {
    return (
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <Link href={`/rekap/pengukuran-balita/view-detail`} passHref>
          <IconEye style={{ color: "green", cursor: "pointer" }} />
        </Link>

        <Link href={`/rekap/pengukuran-balita/perbarui`} passHref>
          <IconPencil style={{ color: "purple", cursor: "pointer" }} />
        </Link>

        <IconTrash
          onClick={() => confirmDeleteProduct(rowData)}
          style={{ color: "red", cursor: "pointer" }}
        />
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

  const header = (
    <div className="mb-1 flex flex-col md:flex-row md:items-center md:justify-between">
      <h2 className="pb-1 text-2xl font-bold text-black">
        Rekap Pengukuran Balita
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
    <div className="container mx-auto">
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
              style={{ minWidth: "10rem" }}
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
            <strong>{information?.contact_ref}</strong>?
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

export default TablesPage;
