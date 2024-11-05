"use client";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import React, { useState } from "react";
import InputWithLabel from "../ui/InputWithLabel";
import { RadioButton } from "primereact/radiobutton";
import { InputTextarea } from "primereact/inputtextarea";

const EditBumil = ({ id }: { id: string }) => {
  const [keterpaparanAsap, setKeterpaparanAsap] = useState<"ya" | "tidak">();

  return (
    <>
      <Card>
        <h1 className="mb-2 text-3xl font-bold text-gray-800">
          Perbarui Data Ibu Hamil
        </h1>
        <h5 className="text-lg text-gray-600">Memperbarui Data Ibu Hamil</h5>
      </Card>
      <Card className="mt-8">
        <div className="px-2">
          <form>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <div className="mb-4">
                  <label
                    htmlFor="nik_ibu"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    NIK Ibu
                  </label>
                  <InputText
                    id="nik_ibu"
                    name="nik_ibu"
                    value={id}
                    className="w-full rounded-md border border-gray-300 p-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan NIK Ibu"
                  />
                </div>

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
                    placeholder="Masukkan Nama Lengkap"
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="posyandu"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Posyandu
                  </label>
                  <InputText
                    id="posyandu"
                    name="posyandu"
                    className="w-full rounded-md border border-gray-300 p-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan Posyandu"
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="tanggal_pendampingan"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Tanggal Pendampingan
                  </label>
                  <Calendar
                    id="tanggal_pendampingan"
                    name="tanggal_pendampingan"
                    className="h-[2.6rem] w-full"
                    showIcon
                    placeholder="dd/mm/yyyy"
                  />
                </div>

                <div className="mb-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <InputWithLabel
                        id="UsiaKehamilan"
                        label="Usia Kehamilan"
                        placeholder="12"
                        satuan="Mg"
                        keyfilter={"num"}
                      />
                    </div>
                    <div>
                      <InputWithLabel
                        id="usiaIbuHamil"
                        label="Usia Ibu Hamil"
                        placeholder="24"
                        satuan="Tahun"
                        keyfilter={"num"}
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <InputWithLabel
                        id="jumlahtablet"
                        label="Jumlah Tablet Fe Yang Diminum"
                        placeholder="1"
                        satuan="Btr"
                        keyfilter={"num"}
                      />
                    </div>
                    <div>
                      <InputWithLabel
                        id="hemoGlobin"
                        label="Hemoglobin"
                        placeholder="1"
                        satuan="g/dl"
                        keyfilter={"num"}
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label
                        htmlFor="tanggal_pertama_haid"
                        className="mb-1 block text-sm font-medium text-gray-700"
                      >
                        Tanggal Pertama Haid
                      </label>
                      <Calendar
                        id="tanggal_pertama_haid"
                        name="tanggal_pertama_haid"
                        className="h-[2.6rem] w-full"
                        showIcon
                        placeholder="dd/mm/yyyy"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="tanggal_terakhir_haid"
                        className="mb-1 block text-sm font-medium text-gray-700"
                      >
                        Tanggal Terakhir Haid
                      </label>
                      <Calendar
                        id="tanggal_terakhir_haid"
                        name="tanggal_terakhir_haid"
                        className="h-[2.6rem] w-full"
                        showIcon
                        placeholder="dd/mm/yyyy"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <InputWithLabel
                        id="tinggiBadan"
                        label="Tinggi Badan"
                        placeholder="155"
                        satuan="Cm"
                        keyfilter={"num"}
                      />
                    </div>
                    <div>
                      <InputWithLabel
                        id="beratBadan"
                        label="Berat Badan"
                        placeholder="45"
                        satuan="Kg"
                        keyfilter={"num"}
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <InputWithLabel
                        id="lingkarLenganAtas"
                        label="Lingkar Lengan Atas"
                        placeholder="20"
                        satuan="Cm"
                        keyfilter={"num"}
                      />
                    </div>
                    <div>
                      <InputWithLabel
                        id="tinggiFundusUteri"
                        label="Tinggi Fundus Uteri"
                        placeholder="12"
                        satuan="Cm"
                        keyfilter={"num"}
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div>
                    <label
                      htmlFor="intervensi"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Intervensi Yang Diberikan
                    </label>
                    <InputTextarea
                      className="w-full"
                      placeholder="Masukkan intervensi yang akan diberikan kepada ibu hamil disini"
                      id="intervensi"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="mb-1 block text-base font-medium text-gray-700">
                    Keterpaparan Asap Rokok
                  </label>
                  <div className="flex gap-3">
                    <div className="flex items-center">
                      <RadioButton
                        inputId="keterpaparan1"
                        name="keterpaparanAsap"
                        value={"ya"}
                        onChange={(e) => setKeterpaparanAsap(e.value)}
                        checked={keterpaparanAsap == "ya"}
                      />
                      <label htmlFor="keterpaparan1" className="ml-2">
                        Ya
                      </label>
                    </div>
                    <div className="flex items-center">
                      <RadioButton
                        inputId="keterpaparan2"
                        name="keterpaparanAsap"
                        value={"tidak"}
                        onChange={(e) => setKeterpaparanAsap(e.value)}
                        checked={keterpaparanAsap == "tidak"}
                      />
                      <label htmlFor="keterpaparan2" className="ml-2">
                        Tidak
                      </label>
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

export default EditBumil;
