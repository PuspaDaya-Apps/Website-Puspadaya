"use client";
import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { IconSearch } from "@tabler/icons-react";
import ButtonLink from "../ui/ButtonLink";
import AbsensiDropdown from "../Dropdowns/AbsensiDropdown";
import { Dropdown } from "primereact/dropdown";
import { DaftarTamuIbuHamil, Kehadiran } from "@/types/daftarTamuIbuHamil";
import { SvgAdd, SvgDelete } from "../ui/Svg";
import ModalDelete from "../modal/modalDelete";
import ModalSearch from "../modal/ModalSearch";
import { RadioButton } from "primereact/radiobutton";

interface Tahun {
  name: string;
  code: string;
}

const TableDaftarTamuIbuHamil: React.FC = () => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedTahun, setSelectedTahun] = useState<Tahun | null>(null);
  const [selectedIbuHamil, setSelectedIbuHamil] = useState<
    DaftarTamuIbuHamil[]
  >([]);
  const [selectedDeleteData, setSelectedDeleteData] =
    useState<DaftarTamuIbuHamil | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nik: "",
    namaIbu: "",
    namaSuami: "",
    namaPosyandu: "",
  });

  const [dataJadwalHadirTamuIbu, setDataJadwalHadirTamuIbu] = useState<
    DaftarTamuIbuHamil[]
  >([
    {
      id: 1,
      namaIbu: "Tiara Andini",
      posyandu: "Posyandu Mawar 2",
      nik: "98356738792",
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
      namaIbu: "Dewi Sartika",
      posyandu: "Posyandu Mawar 3",
      nik: "98356738793",
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

  const bulan = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Ags",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];

  const handleAbsensiSelect = (
    month: string,
    code: string | null,
    ibuId: number,
  ) => {
    setDataJadwalHadirTamuIbu((prevData) =>
      prevData.map((item) =>
        item.id === ibuId
          ? {
              ...item,
              absensi: { ...item.absensi, [month]: code as Kehadiran },
            }
          : item,
      ),
    );
    setOpenDropdown(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOnSearchData = () => {
    // Fungsi pencarian data
  };

  const resetForm = () => {
    setFormData({
      nik: "",
      namaIbu: "",
      namaSuami: "",
      namaPosyandu: "",
    });
  };

  const renderStatusBox = (
    month: string,
    status: Kehadiran | null,
    ibuId: number,
  ) => {
    const dropdownId = `${ibuId}-${month}`;
    return (
      <AbsensiDropdown
        onSelect={(code) => handleAbsensiSelect(month, code, ibuId)}
        currentCode={status}
        isOpen={openDropdown === dropdownId}
        onToggle={() =>
          setOpenDropdown(openDropdown === dropdownId ? null : dropdownId)
        }
      />
    );
  };

  const monthColumns = bulan.map((month) => (
    <Column
      key={month}
      field={`absensi.${month.toLowerCase()}`}
      header={month}
      body={({ absensi, id }) =>
        renderStatusBox(month.toLowerCase(), absensi[month.toLowerCase()], id)
      }
    />
  ));
  const RowItem = ({ label, data }: { label: string; data: string }) => {
    return (
      <tr>
        <td className="border border-gray-300 px-4 py-2">{label}</td>
        <td className="border border-gray-300 px-4 py-2">{data}</td>
      </tr>
    );
  };
  const HasilPencarian = () => {
    const dataBalita = {
      nik: "56478827363667377",
      namaIbuHamil: "Tiara Andini",
      namaSuami: "Budiono",
      anakKe: "1",
      usiaKandungan: "2 Bulan",
      alamat: "Dusun Srono RT/RW 001/001 Desa Kebaman, Kec Srono",
      posyandu: "Mawar 1",
    };

    return (
      <div className="align-items-center flex my-5 gap-2">
        <RadioButton
          inputId="ingredient1"
          name="pizza"
          value="Cheese"
        />
        <div className="w-full">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">Label</th>
                <th className="border border-gray-300 px-4 py-2">Data</th>
              </tr>
            </thead>
            <tbody>
              <RowItem label="NIK " data={dataBalita.nik} />
              <RowItem label="Nama Ibu Hamil" data={dataBalita.namaIbuHamil} />
              <RowItem label="Nama Suami" data={dataBalita.namaSuami} />
              <RowItem label="Anak-ke" data={dataBalita.anakKe} />
              <RowItem label="Usia Kandungan" data={dataBalita.usiaKandungan} />
              <RowItem label="Alamat" data={dataBalita.alamat} />
              <RowItem label="Posyandu" data={dataBalita.posyandu} />
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  const header = (
    <div className="mb-1 flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="pb-1 text-2xl font-bold text-black">
          Daftar Tamu Ibu Hamil
        </h2>
        <p className="text-normal font-normal text-gray-500">
          Untuk menampilkan daftar tamu ibu hamil
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

        <Dropdown
          value={selectedTahun}
          onChange={(e) => setSelectedTahun(e.value)}
          options={tahun}
          optionLabel="name"
          placeholder="Pilih Tahun"
          className="md:w-14rem h-11 w-full"
        />
        <div
          className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-md border p-[10px] duration-300 ease-in-out hover:bg-gray-100"
          onClick={() => setIsModalVisible(true)}
        >
          <SvgAdd />
        </div>
        <div
          className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-md border border-red-500 p-[10px] duration-300 ease-in-out hover:bg-red-200"
          onClick={() => setIsDeleteModalVisible(true)}
        >
          <SvgDelete />
        </div>
      </div>
    </div>
  );

  return (
    <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
      <div className="max-w-full overflow-x-auto">
        <DataTable
          selectionMode="multiple"
          selection={selectedIbuHamil}
          onSelectionChange={(e) => setSelectedIbuHamil(e.value)}
          value={dataJadwalHadirTamuIbu}
          dataKey="id"
          paginator
          rows={5}
          className="datatable-responsive"
          header={header}
          globalFilter={globalFilter}
          globalFilterFields={["nik", "namaIbu"]}
        >
          <Column selectionMode="multiple" />
          <Column field="nik" header="NIK" />
          <Column field="namaIbu" header="Nama Ibu" />
          <Column field="posyandu" header="Posyandu " />
          {monthColumns}
        </DataTable>
      </div>

      <ModalDelete
        visible={isDeleteModalVisible}
        onHide={() => setIsDeleteModalVisible(false)}
        onConfirm={() => {
          if (selectedDeleteData) {
            setDataJadwalHadirTamuIbu((prevData) =>
              prevData.filter((item) => item.id !== selectedDeleteData.id),
            );
            setSelectedDeleteData(null);
          }
        }}
        headerTitle="Hapus Data Daftar Tamu Ibu Hamil"
      >
        {selectedIbuHamil.length > 0 ? (
          selectedIbuHamil.map((ibu) => (
            <div key={ibu.id}>
              <p>NIK: {ibu.nik}</p>
              <p>Nama Ibu: {ibu.namaIbu}</p>
              <p>Posyandu: {ibu.posyandu}</p>
            </div>
          ))
        ) : (
          <p>Tidak ada ibu yang dipilih</p>
        )}
      </ModalDelete>

      <ModalSearch
        isOpen={isModalVisible}
        title={"Tambah Daftar Tamu Ibu Hamil"}
        onClose={() => {
          setIsModalVisible(false);
          resetForm();
        }}
        onSearch={handleOnSearchData}
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="nik">Cari Data Berdasarkan NIK</label>
            <InputText
              id="nik"
              name="nik"
              placeholder="Masukan NIK disini"
              value={formData.nik}
              onChange={handleInputChange}
              className="w-full"
            />
          </div>
            <HasilPencarian />
          <h1>
            Apabila <span className="text-red-400">NIK tidak ditemukan,</span>{" "}
            cari data berdasarkan data dibawah ini!
          </h1>

          <div className="flex flex-wrap gap-4">
            <div className="flex-1">
              <label htmlFor="namaIbu">Nama Ibu</label>
              <InputText
                id="namaIbu"
                name="namaIbu"
                placeholder="Masukan nama ibu"
                value={formData.namaIbu}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>

            <div className="flex-1">
              <label htmlFor="namaSuami">Nama Suami</label>
              <InputText
                id="namaSuami"
                name="namaSuami"
                placeholder="Masukan nama suami"
                value={formData.namaSuami}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
          </div>

          <div>
            <label htmlFor="namaPosyandu">Nama Posyandu</label>
            <InputText
              id="namaPosyandu"
              name="namaPosyandu"
              placeholder="Masukan nama posyandu"
              value={formData.namaPosyandu}
              onChange={handleInputChange}
              className="w-full"
            />
          </div>
          <HasilPencarian />
          <HasilPencarian />
          <HasilPencarian />
        </div>
      </ModalSearch>
    </div>
  );
};

export default TableDaftarTamuIbuHamil;
