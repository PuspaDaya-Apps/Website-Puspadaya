"use client";
import { Puskesmas } from "@/types/puskesmas";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import React, { useState } from "react";

interface Kabupaten {
  name: string;
  code: string;
}

const EditPosyandu = ({ id }: { id: string }) => {
  const [selectedKabupaten, setSelectedKabupaten] = useState<Kabupaten | null>(
    null,
  );
  const [selectedKecamatan, setSelectedKecamatan] = useState<Kabupaten | null>(
    null,
  );
  const [selectedDusun, setSelectedDusun] = useState<Kabupaten | null>(null);
  const [selectedDesa, setSelectedDesa] = useState<Kabupaten | null>(null);
  const [selectedPuskesmas, setSelectedPuskesmas] = useState<Puskesmas | null>(
    null,
  );

  const kabupaten: Kabupaten[] = [
    { name: "New York", code: "NY" },
    { name: "Rome", code: "RM" },
    { name: "London", code: "LDN" },
    { name: "Istanbul", code: "IST" },
    { name: "Paris", code: "PRS" },
  ];

  const puskesmasData: Puskesmas[] = [
    {
      id: 1,
      nama: "Puskesmas Suka Sehat",
      kecamatan: "Suka Maju",
      kabupaten: "Banyuwangi",
    },
    {
      id: 2,
      nama: "Puskesmas Sentosa",
      kecamatan: "Aman Jaya",
      kabupaten: "Banyuwangi",
    },
    {
      id: 3,
      nama: "Puskesmas Mulia Bersama",
      kecamatan: "Sumber Makmur",
      kabupaten: "Banyuwangi",
    },
    {
      id: 4,
      nama: "Puskesmas Harapan Kita",
      kecamatan: "Luhur Mulyo",
      kabupaten: "Banyuwangi",
    },
    {
      id: 5,
      nama: "Puskesmas Sehat Makmur",
      kecamatan: "Karya Bakti",
      kabupaten: "Banyuwangi",
    },
  ];

  return (
    <>
      <Card>
        <h1 className="mb-2 text-3xl font-bold text-gray-800">
          Perbarui Data Posyandu
        </h1>
        <h5 className="text-lg text-gray-600">Perbarui Data Posyandu</h5>
      </Card>
      <Card className="mb-4 mt-8">
        <div className="px-2">
          <form>
            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-6">
              <div>
                <div className="mb-4">
                  <label
                    htmlFor="namaPosyandu"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Nama Posyandu
                  </label>
                  <InputText
                    id="namaPosyandu"
                    name="nama_posyandu"
                    className="w-full rounded-md border border-gray-300 p-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan Nama Posyandu"
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="puskesmas"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Puskesmas
                  </label>
                  <Dropdown
                    filter
                    id="puskesmas"
                    value={selectedPuskesmas}
                    onChange={(e) => setSelectedPuskesmas(e.value)}
                    options={puskesmasData}
                    optionLabel="nama"
                    placeholder="Pilih Puskesmas"
                    className="flex h-[2.6rem] w-full items-center"
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="alamatLengkap"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Alamat Lengkap
                  </label>
                  <InputText
                    id="alamatLengkap"
                    name="alamat_lengkap"
                    className="w-full rounded-md border border-gray-300 p-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan Nama Lengkap"
                  />
                </div>
              </div>

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

                <div className="mb-4">
                  <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label
                        htmlFor="rt"
                        className="mb-1 block text-sm font-medium text-gray-700"
                      >
                        RT
                      </label>
                      <InputText
                        id="rt"
                        name="rt"
                        className="w-full rounded-md border border-gray-300 p-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                        placeholder="Masukkan RT"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="rw"
                        className="mb-1 block text-sm font-medium text-gray-700"
                      >
                        RW
                      </label>
                      <InputText
                        id="rw"
                        name="rw"
                        className="w-full rounded-md border border-gray-300 p-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                        placeholder="Masukkan RW"
                      />
                    </div>
                  </div>
                </div>
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

export default EditPosyandu;
