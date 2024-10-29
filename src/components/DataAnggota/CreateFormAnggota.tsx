"use client";
import React, { useState } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { PosyanduType } from "@/types/posyandu";
import PasswordInput from "../ui/PasswordInput";
import ImageUploadSingle from "../FileUpload/Image/fileUploadSingle";

interface Kabupaten {
  name: string;
  code: string;
}

const CreateFormAnggota = () => {
  const [selectedKabupaten, setSelectedKabupaten] = useState<Kabupaten | null>(
    null,
  );
  const [selectedKecamatan, setSelectedKecamatan] = useState<Kabupaten | null>(
    null,
  );
  const [selectedDusun, setSelectedDusun] = useState<Kabupaten | null>(null);
  const [selectedDesa, setSelectedDesa] = useState<Kabupaten | null>(null);
  const [selectedPeran, setSelectedPeran] = useState<string | null>(null);
  const [selectedPosyandu, setSelectedPosyandu] = useState<PosyanduType | null>(
    null,
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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

  const kabupaten: Kabupaten[] = [
    { name: "New York", code: "NY" },
    { name: "Rome", code: "RM" },
    { name: "London", code: "LDN" },
    { name: "Istanbul", code: "IST" },
    { name: "Paris", code: "PRS" },
  ];

  const role: string[] = ["Ketua Kader", "Anggota Kader", "Bidan", "TPG"];

  const handleSubmit: React.FormEventHandler = (e) => {
    e.preventDefault();
    console.log("Form submitted", selectedFile);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Unggah Foto Pribadi
          </label>
          <ImageUploadSingle
            file={selectedFile}
            onFileSelect={setSelectedFile}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-6">
          <div>
            <div className="mb-4">
              <label
                htmlFor="namaLengkap"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Nama Lengkap
              </label>
              <InputText
                id="namaLengkap"
                name="nama_lengkap"
                className="w-full rounded-md border border-gray-300 p-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                placeholder="Masukkan Nama Posyandu"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="noTelp"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Nomor Telepon (WA AKTIF)
              </label>
              <InputText
                id="noTelp"
                name="no_telp"
                className="w-full rounded-md border border-gray-300 p-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                placeholder="Masukkan Nama Lengkap"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="email"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                E-mail
              </label>
              <InputText
                type="email"
                keyfilter={"email"}
                id="email"
                name="email"
                className="w-full rounded-md border border-gray-300 p-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                placeholder="Masukkan Nama Lengkap"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="kataSandi"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Kata Sandi
              </label>
              <PasswordInput placeholder="Masukan Kata Sandi" />
            </div>
          </div>

          <div>
            <div className="mb-4">
              <label
                htmlFor="peran"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Posisi/Peran
              </label>
              <Dropdown
                id="peran"
                value={selectedPeran}
                onChange={(e) => setSelectedPeran(e.value)}
                options={role}
                placeholder="Pilih Posisi/Peran"
                className="flex h-[2.6rem] w-full items-center"
              />
            </div>

            {selectedPeran == "Ketua Kader" ? (
              <div className="mb-4">
                <label
                  htmlFor="posyandu"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Posyandu
                </label>
                <Dropdown
                  id="posyandu"
                  filter
                  value={selectedPosyandu}
                  onChange={(e) => setSelectedPosyandu(e.value)}
                  options={posyanduData}
                  optionLabel="namaPosyandu"
                  placeholder="Pilih Posyandu"
                  className="flex h-[2.6rem] w-full items-center"
                />
              </div>
            ) : (
              <div>
                <div className="mb-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label
                        htmlFor="kabupaten"
                        className="mb-1 block text-sm font-medium text-gray-700"
                      >
                        Kabupaten
                      </label>
                      <Dropdown
                        filter
                        id="kabupaten"
                        value={selectedKabupaten}
                        onChange={(e) => setSelectedKabupaten(e.value)}
                        options={kabupaten}
                        optionLabel="name"
                        placeholder="Pilih Kabupaten"
                        className="flex h-[2.6rem] w-full items-center"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="Kecamatan"
                        className="mb-1 block text-sm font-medium text-gray-700"
                      >
                        Kecamatan
                      </label>
                      <Dropdown
                        filter
                        id="Kecamatan"
                        value={selectedKecamatan}
                        onChange={(e) => setSelectedKecamatan(e.value)}
                        options={kabupaten}
                        optionLabel="name"
                        placeholder="Pilih Kabupaten"
                        className="flex h-[2.6rem] w-full items-center"
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label
                        htmlFor="desa"
                        className="mb-1 block text-sm font-medium text-gray-700"
                      >
                        Desa
                      </label>
                      <Dropdown
                        filter
                        id="desa"
                        value={selectedDesa}
                        onChange={(e) => setSelectedDesa(e.value)}
                        options={kabupaten}
                        optionLabel="name"
                        placeholder="Pilih Kabupaten"
                        className="flex h-[2.6rem] w-full items-center"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="dusun"
                        className="mb-1 block text-sm font-medium text-gray-700"
                      >
                        Dusun
                      </label>
                      <Dropdown
                        filter
                        id="dusun"
                        value={selectedDusun}
                        onChange={(e) => setSelectedDusun(e.value)}
                        options={kabupaten}
                        optionLabel="name"
                        placeholder="Pilih Kabupaten"
                        className="flex h-[2.6rem] w-full items-center"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <Button
            type="submit"
            className="border-none bg-[#486284] px-25 py-2 hover:bg-[#3c526e]"
          >
            Simpan
          </Button>
        </div>
      </form>
    </>
  );
};

export default CreateFormAnggota;
