"use client"
import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { IconSearch } from "@tabler/icons-react";
import { DaftarBalita } from "@/types/daftarbalita";
import { Kehadiran } from "@/types/daftarbalita";
import ButtonLink from "../ui/ButtonLink";
import AbsensiDropdown from "../Dropdowns/AbsensiDropdown";
import { Dropdown } from "primereact/dropdown";

interface Tahun {
  name: string;
  code: string;
}

const TableDaftarHadirBalita: React.FC = () => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedTahun, setSelectedTahun] = useState<Tahun | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [dataJadwalHadirBalita, setDataJadwalHadirBalita] = useState<DaftarBalita[]>([
    {
      id: 1,
      namaIbu: "Tiara Andini",
      namaBalita: "Soke Bahtera",
      absensi: {
        jan: Kehadiran.Hadir,
        feb: Kehadiran.Izin,
        mar: Kehadiran.KunjunganHadir,
        apr: Kehadiran.Hadir,
        mei: Kehadiran.KunjunganTidakHadir,
        jun: Kehadiran.Hadir,
        jul: Kehadiran.Hadir,
        ags: Kehadiran.Izin,
        sep: Kehadiran.Hadir,
        okt: Kehadiran.Hadir,
        nov: Kehadiran.KunjunganHadir,
        des: Kehadiran.Hadir,
      },
    },
    {
      id: 2,
      namaIbu: "Tiara Andini",
      namaBalita: "Soke Bahtera",
      absensi: {
        jan: Kehadiran.Hadir,
        feb: Kehadiran.Izin,
        mar: Kehadiran.KunjunganHadir,
        apr: Kehadiran.Hadir,
        mei: Kehadiran.KunjunganTidakHadir,
        jun: Kehadiran.Hadir,
        jul: Kehadiran.Hadir,
        ags: null,
        sep: null,
        okt: null,
        nov: null,
        des: null,
      },
    },
  ]);
  const tahun: Tahun[] = [
    { name: "2021", code: "21" },
    { name: "2022", code: "22" },
    { name: "2023", code: "23" },
    { name: "2024", code: "24" },
    { name: "2025", code: "25" },
  ];
  const bulan = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];

  const handleAbsensiSelect = (month: string, code: string|null, balitaId: number) => {
    setDataJadwalHadirBalita((prevData) => 
      prevData.map((item) =>
        item.id === balitaId ? {
          ...item,
          absensi: {
            ...item.absensi,
            [month]: code as Kehadiran,
          },
        } : item
      )
    );
    setOpenDropdown(null);
  };

  const renderStatusBox = (month: string, status: Kehadiran | null, balitaId: number) => {
    const dropdownId = `${balitaId}-${month}`;
    return (
      <AbsensiDropdown 
        onSelect={(code) => handleAbsensiSelect(month, code, balitaId)} 
        currentCode={status} 
        isOpen={openDropdown === dropdownId}
        onToggle={() => setOpenDropdown(openDropdown === dropdownId ? null : dropdownId)}
      />
    );
  };

  const monthColumns = bulan.map((month) => (
    <Column
      key={month}
      field={`absensi.${month.toLowerCase()}`}
      header={month}
      body={({ absensi, id }) => renderStatusBox(month.toLowerCase(), absensi[month.toLowerCase()], id)} 
    />
  ));
  const header = (
    <div className="mb-1 flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="pb-1 text-2xl font-bold text-black">Daftar Hadir Balita</h2>
        <p className="text-normal font-normal text-gray-500">
          Digunakan untuk merekap daftar hadir balita
        </p>
      </div>
      <div className="mt-2 flex items-center justify-end space-x-4 md:mt-0">
        <span className="relative flex items-center">
          <IconSearch className="absolute left-3 text-gray-500" />
          <InputText
            type="search"
            onInput={(e) => setGlobalFilter((e.target as HTMLInputElement).value)}
            placeholder="Search..."
            className="rounded-lg border border-gray-300 py-2 pl-10 pr-4"
          />
        </span>

        <Dropdown
          value={selectedTahun}
          onChange={(e) => setSelectedTahun(e.value)}
          options={tahun}
          optionLabel="name"
          placeholder="Pilih Tahun"
          className="md:w-14rem h-11 w-full"
        />
        <ButtonLink
          href="/posyandu/daftar-hadir-balita/daftar-tamu-balita"
          className="h-11 w-full bg-primary"
        >
          Daftar Tamu
        </ButtonLink>
      </div>
    </div>
  );
  const Keterangan = () => {
    return (
      <>
        <h1 className="text-xl font-bold text-black">Keterangan</h1>
        <div className="mt-2 flex items-start justify-start">
          <div className="flex items-center justify-center gap-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border bg-green-500 p-5">
              <p className="text-white">H</p>
            </div>
            <p className="text-black">Hadir</p>
          </div>
        </div>
        <div className="mt-2 flex items-start justify-start">
          <div className="flex items-center justify-center gap-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border bg-blue-500 p-5">
              <p className="text-white">KH</p>
            </div>
            <p className="text-black">Kunjungan Hadir</p>
          </div>
        </div>
        <div className="mt-2 flex items-start justify-start">
          <div className="flex items-center justify-center gap-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border bg-red-500 p-5">
              <p className="text-white">KTH</p>
            </div>
            <p className="text-black">Kunjungan Tidak Hadir</p>
          </div>
        </div>
        <div className="mt-2 flex items-start justify-start">
          <div className="flex items-center justify-center gap-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border bg-yellow-500 p-5">
              <p className="text-white">I</p>
            </div>
            <p className="text-black">Izin</p>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
      <div className="max-w-full overflow-x-auto">
      <DataTable
          value={dataJadwalHadirBalita}
          dataKey="id"
          paginator
          rows={5}
          className="datatable-responsive"
          header={header}
          globalFilter={globalFilter}
          globalFilterFields={["namaBalita", "namaIbu"]}
        >
          <Column field="id" header="No" />
          <Column field="namaIbu" header="Nama Ibu" />
          <Column field="namaBalita" header="Nama Balita" />
          {monthColumns}
        </DataTable>
      </div>
      <Keterangan />
    </div>
  );
};

export default TableDaftarHadirBalita;