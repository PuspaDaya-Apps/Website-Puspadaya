"use client";
import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { IconSearch } from "@tabler/icons-react";
import { Kehadiran } from "@/types/daftarbalita";
import AbsensiDropdown from "../Dropdowns/AbsensiDropdown";
import { DaftarTamuBalita } from "@/types/daftarTamuBalita";
import { SvgAdd, SvgDelete } from "../ui/Svg";
import Modal from "../modal/modal";
import ModalSearch from "../modal/ModalSearch";
import ModalDelete from "../modal/modalDelete";
import { RadioButton } from "primereact/radiobutton";

const TableDaftarTamuBalita: React.FC = () => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [selectedBalita, setSelectedBalita] = useState<DaftarTamuBalita[]>([]); // Ubah menjadi array
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false); // Modal delete visibility
  const [selectedDeleteData, setSelectedDeleteData] =
    useState<DaftarTamuBalita | null>(null); // Data to be deleted
  const [formData, setFormData] = useState({
    nik: "",
    namaBalita: "",
    namaIbu: "",
    namaPosyandu: "",
  });
  const [dataJadwalTamuBalita, setDataJadwalTamuBalita] = useState<
    DaftarTamuBalita[]
  >([
    {
      id: 1,
      namaIbu: "Tiara Andini",
      namaBalita: "Soke Bahtera",
      posyandu: "Mawar 1",
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
      posyandu: "Mawar 1",
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
  const handleDeleteClick = () => {
    if (selectedBalita.length > 0) {
      const updatedData = dataJadwalTamuBalita.filter(
        (item) => !selectedBalita.some((selected) => selected.id === item.id),
      );
      setDataJadwalTamuBalita(updatedData);
      setSelectedBalita([]); // Reset selected data
      setIsDeleteModalVisible(false);
    }
  };
  const confirmDelete = () => {
    if (selectedDeleteData) {
      setDataJadwalTamuBalita((prevData) =>
        prevData.filter((item) => item.id !== selectedDeleteData.id),
      );
      setIsDeleteModalVisible(false);
      setSelectedDeleteData(null);
    }
  };
  const deleteModalContent =
    selectedBalita && selectedBalita.length > 0 ? (
      <div>
        {selectedBalita.map((balita) => (
          <div key={balita.id}>
            <p>Nama Balita: {balita.namaBalita}</p>
            <p>Nama Ibu: {balita.namaIbu}</p>
            <p>Posyandu: {balita.posyandu}</p>
          </div>
        ))}
      </div>
    ) : (
      <p>Tidak ada balita yang dipilih</p>
    );

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
    balitaId: number,
  ) => {
    setDataJadwalTamuBalita((prevData) =>
      prevData.map((item) =>
        item.id === balitaId
          ? {
              ...item,
              absensi: {
                ...item.absensi,
                [month]: code as Kehadiran,
              },
            }
          : item,
      ),
    );
    setOpenDropdown(null);
  };

  const renderStatusBox = (
    month: string,
    status: Kehadiran | null,
    balitaId: number,
  ) => {
    const dropdownId = `${balitaId}-${month}`;
    return (
      <AbsensiDropdown
        onSelect={(code) => handleAbsensiSelect(month, code, balitaId)}
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

  const resetForm = () => {
    setFormData({
      nik: "",
      namaBalita: "",
      namaIbu: "",
      namaPosyandu: "",
    });
  };

  const handleOnSearchData = () => {
    // Add or update data logic here
    // After success:
    // setIsModalVisible(false);
    // resetForm();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const header = (
    <div className="mb-1 flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="pb-1 text-2xl font-bold text-black">
          Daftar Tamu Balita
        </h2>
        <p className="text-normal font-normal text-gray-500">
          Digunakan untuk menampilkan daftar tamu balita
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
        {/* button add */}
        <div
          className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-md border p-[10px] duration-300 ease-in-out hover:bg-gray-100"
          onClick={() => setIsModalVisible(true)}
        >
          <SvgAdd />
        </div>
        {/* button delete */}
        <div
          className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-md border border-red-500 p-[10px] duration-300 ease-in-out hover:bg-red-200"
          onClick={() => setIsDeleteModalVisible(true)}
        >
          <SvgDelete />
        </div>
      </div>
    </div>
  );
  // Komponen RowItem
  const RowItem = ({ label, data }: { label: string; data: string }) => {
    return (
      <tr>
        <td className="border border-gray-300 px-4 py-2">{label}</td>
        <td className="border border-gray-300 px-4 py-2">{data}</td>
      </tr>
    );
  };

  // Komponen utama HasilPencarian
  const HasilPencarian = () => {
    const dataBalita = {
      nik: "56478827363667377",
      namaBalita: "Tiara Andini",
      namaAyah: "Budiono",
      namaIbu: "Susiani",
      usia: "2 Tahun",
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
              <RowItem label="NIK Balita" data={dataBalita.nik} />
              <RowItem label="Nama Balita" data={dataBalita.namaBalita} />
              <RowItem label="Nama Ayah" data={dataBalita.namaAyah} />
              <RowItem label="Nama Ibu" data={dataBalita.namaIbu} />
              <RowItem label="Usia Balita" data={dataBalita.usia} />
              <RowItem label="Alamat" data={dataBalita.alamat} />
              <RowItem label="Posyandu" data={dataBalita.posyandu} />
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
      <div className="max-w-full overflow-x-auto">
        <DataTable
          selectionMode="multiple" // Ubah menjadi multiple
          selection={selectedBalita}
          onSelectionChange={(e) => setSelectedBalita(e.value)} // Perbarui nilai
          value={dataJadwalTamuBalita}
          dataKey="id"
          paginator
          rows={5}
          className="datatable-responsive"
          header={header}
          globalFilter={globalFilter}
          globalFilterFields={["namaBalita", "namaIbu"]}
        >
          <Column selectionMode="multiple" />
          {/* Untuk multiple select */}
          <Column field="namaIbu" header="Nama Ibu" />
          <Column field="namaBalita" header="Nama Balita" />
          <Column field="posyandu" header="Posyandu " />
          {monthColumns}
        </DataTable>
      </div>
      {/* modal tambah daftar tamu balita */}
      <ModalSearch
        isOpen={isModalVisible}
        title={"Tambah Daftar Tamu Balita"}
        onClose={() => {
          setIsModalVisible(false);
          resetForm();
        }}
        onSearch={handleOnSearchData}
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="nik">Cari Data Berdasarkan NIK Balita</label>
            <InputText
              id="nik"
              name="nik"
              placeholder="Masukan NIK Balita disini"
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
              <label htmlFor="namaBalita">Nama Balita</label>
              <InputText
                id="namaBalita"
                name="namaBalita"
                placeholder="Masukan nama balita"
                value={formData.namaBalita}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>

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
        </div>
        <HasilPencarian/>
        <HasilPencarian/>
        <HasilPencarian/>

      </ModalSearch>
      <ModalDelete
        visible={isDeleteModalVisible}
        onHide={() => setIsDeleteModalVisible(false)}
        onConfirm={confirmDelete}
        headerTitle="Hapus Data Daftar Tamu Balita"
      >
        {deleteModalContent}
      </ModalDelete>
    </div>
  );
};

export default TableDaftarTamuBalita;
