"use client";
import { PosyanduType } from "@/types/posyandu";
import { IconPencil } from "@tabler/icons-react";
import Image from "next/image";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import React, { useState } from "react";

interface Kabupaten {
  name: string;
  code: string;
}

const EditAnggota = ({ id }: { id: string }) => {
  const [selectedKabupaten, setSelectedKabupaten] = useState<Kabupaten | null>(
    null,
  );
  const [selectedKecamatan, setSelectedKecamatan] = useState<Kabupaten | null>(
    null,
  );
  const [selectedDusun, setSelectedDusun] = useState<Kabupaten | null>(null);
  const [selectedDesa, setSelectedDesa] = useState<Kabupaten | null>(null);
  const [selectedPeran, setSelectedPeran] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState("/images/team/team-01.png");
  const [file, setFile] = useState<File | null>(null);

  const [selectedPosyandu, setSelectedPosyandu] = useState<PosyanduType | null>(
    null,
  );

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

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);
      setFile(file);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Form submitted", file);
  };

  return (
    <>
      <Card>
        <h1 className="mb-2 text-3xl font-bold text-gray-800">
          Perbarui Data Anggota
        </h1>
        <h5 className="text-lg text-gray-600">
          Menampilkan formulir pembaruan data anggota
        </h5>
      </Card>
      <Card className="mt-8">
        <div className="px-2">
          <form onSubmit={handleSubmit}>
            <div className="mb-6 flex justify-center md:mb-12">
              <div className="relative inline-block">
                {/* Profile Image Container */}
                <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-white shadow-lg">
                  <Image
                    src={previewImage}
                    alt="Profile"
                    width={160}
                    height={160}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* File Input with Edit Button Overlay */}
                <label
                  className="absolute bottom-0 right-0 cursor-pointer"
                  htmlFor="profile-upload"
                >
                  <div className="rounded-full bg-blue-600 p-2 text-white shadow-lg transition-colors hover:bg-blue-700">
                    <IconPencil size={16} />
                  </div>

                  <input
                    type="file"
                    id="profile-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
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
        </div>
      </Card>
    </>
  );
};

export default EditAnggota;
