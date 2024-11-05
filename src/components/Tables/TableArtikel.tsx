"use client";
import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { IconSearch } from "@tabler/icons-react";
import { SvgAdd, SvgEdit, SvgDelete, SvgDetail } from "../ui/Svg";
import { Calendar } from "primereact/calendar";
import ModalDelete from "../modal/modalDelete";
import { Artikel } from "@/types/artikel";
import Link from "next/link";
import ImageUploadSingle from "../FileUpload/Image/fileUploadSingle";
import ImageUploadMultiple from "../FileUpload/Image/fileUploadMultiple";

const TableArtikel: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file); // Update state dengan file baru
  };
  const [globalFilter, setGlobalFilter] = useState("");
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedArtikel, setSelectedArtikel] = useState<Artikel | null>(null);

  // State for the table data
  const [dataArtikel, setDataArtikel] = useState<Artikel[]>([
    {
      id: 1,
      image: "",
      isPublish: false,
      judul: "Pentingnya Peran Posyandu",
      konten: "Pentingnya Peran Posyandu dalam pelayanan Kesehatan.....",
    },
    {
      id: 2,
      image: "",
      isPublish: true,
      judul: "Edukasi Gizi ",
      konten: "Upaya Peningkatan Pengetahuan Kader Puskesmas Medokan..",
    },
  ]);

  const handleDelete = (data: Artikel) => {
    setSelectedArtikel(data);
    setIsDeleteModalVisible(true);
  };

  const confirmDelete = () => {
    if (selectedArtikel) {
      setDataArtikel(
        dataArtikel.filter((item) => item.id !== selectedArtikel.id),
      );
      setSelectedArtikel(null);
    }
  };

  const header = (
    <div className="mb-1 flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="pb-1 text-2xl font-bold text-black">Data Artikel</h2>
        <p className="text-normal font-normal text-gray-500">
          Manajemen data artikel di bidang kesehatan
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
        <Link
          className="flex cursor-pointer items-center justify-center rounded-md border p-[10px]"
          href={"/data/data-artikel/create"}
        >
          <SvgAdd />
        </Link>
      </div>
    </div>
  );

  const actionTemplate = (data: Artikel) => (
    <div className="flex items-center gap-2">
      <Link href={`/data/data-artikel/${data.id}`} className="cursor-pointer">
        <SvgDetail />
      </Link>
      <Link
        href={`/data/data-artikel/${data.id}/edit`}
        className="cursor-pointer"
      >
        <SvgEdit />
      </Link>
      <div className="cursor-pointer" onClick={() => handleDelete(data)}>
        <SvgDelete />
      </div>
    </div>
  );
  const statusPublishTemplate = (data: Artikel) => {
    return data.isPublish ? "Ya" : "Tidak";
  };

  const deleteModalContent = selectedArtikel && (
    <>
      <p>Apakah Anda yakin ingin menghapus Artikel Mengenai</p>
      <h1 className="mt-2 font-medium">{selectedArtikel.judul}</h1>
      <p className="mt-2">Tindakan ini tidak dapat dibatalkan.</p>
    </>
  );

  return (
    <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
      <div className="max-w-full overflow-x-auto">
        <DataTable
          value={dataArtikel}
          dataKey="id"
          paginator
          rows={5}
          className="datatable-responsive"
          header={header}
          globalFilter={globalFilter}
          globalFilterFields={["judul", "konten"]}
        >
          <Column field="id" header="No" />
          <Column field="judul" header="Judul Artikel" />
          <Column field="konten" header="Konten Artikel" />
          <Column
            field="isPublish"
            header="Status Publikasi"
            body={statusPublishTemplate}
          />

          <Column header="Aksi" body={actionTemplate} />
        </DataTable>
      </div>

      <ModalDelete
        visible={isDeleteModalVisible}
        onHide={() => setIsDeleteModalVisible(false)}
        onConfirm={confirmDelete}
        headerTitle="Hapus Artikel"
      >
        {deleteModalContent}
      </ModalDelete>
      {/* <ImageUploadSingle file={selectedFile} onFileSelect={handleFileSelect} />
      <ImageUploadMultiple
        initialFiles={[]} // Pass any initial files if needed
        onFileSelect={(files) => console.log(files)} // Handle selected files
      /> */}
    </div>
  );
};

export default TableArtikel;
