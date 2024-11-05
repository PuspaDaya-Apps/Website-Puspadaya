"use client";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import React, { useState } from "react";
import InputWithLabel from "../ui/InputWithLabel";
import { RadioButton } from "primereact/radiobutton";
import { Checkbox, CheckboxChangeEvent } from "primereact/checkbox";
import { Fieldset } from "primereact/fieldset";

const CreateBalita = () => {
  const [caraLahir, setCaraLahir] = useState<"normal" | "caesar">();
  const [jenisKelamin, setJenisKelamin] = useState<"l" | "p">();
  const [hasDisability, setHasDisability] = useState(null);
  const [selectedDisabilityTypes, setSelectedDisabilityTypes] = useState<
    string[]
  >([]);
  const [otherDisability, setOtherDisability] = useState("");

  const disabilityOptions = [
    { label: "Tunanetra", value: "tunanetra" },
    { label: "Tunarungu", value: "tunarungu" },
    { label: "Tunawicara", value: "tunawicara" },
    { label: "Tunadaksa", value: "tunadaksa" },
    { label: "Tunagrahita", value: "tunagrahita" },
    { label: "Autisme", value: "autisme" },
    { label: "Lainnya", value: "lainnya" },
  ];

  const onDisabilityChange = (e: CheckboxChangeEvent) => {
    setHasDisability(e.value);
    if (e.value === false) {
      setSelectedDisabilityTypes([]);
    }
  };

  const onTypeChange = (e: CheckboxChangeEvent) => {
    const selectedTypes = [...selectedDisabilityTypes];
    if (e.checked) {
      selectedTypes.push(e.value);
    } else {
      const index = selectedTypes.indexOf(e.value);
      selectedTypes.splice(index, 1);
    }
    setSelectedDisabilityTypes(selectedTypes);
  };

  return (
    <>
      <Card>
        <h1 className="mb-2 text-3xl font-bold text-gray-800">
          Tambah Data Balita
        </h1>
        <h5 className="text-lg text-gray-600">Menambahkan Data Balita</h5>
      </Card>
      <Card className="mt-8">
        <div className="px-2">
          <form>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <div className="mb-4">
                  <label
                    htmlFor="noKK"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Nomor Kartu Keluarga
                  </label>
                  <InputText
                    id="noKK"
                    name="noKK"
                    className="w-full rounded-md border border-gray-300 p-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan Nomor Kartu Keluarga"
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="nik"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    NIK
                  </label>
                  <InputText
                    id="nik"
                    name="nik"
                    className="w-full rounded-md border border-gray-300 p-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan NIK"
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
                    name="namaLengkap"
                    className="w-full rounded-md border border-gray-300 p-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan Nama Lengkap"
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="anakKe"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Anak Ke-
                  </label>
                  <InputText
                    keyfilter={"int"}
                    id="anakKe"
                    name="anakKe"
                    className="w-full rounded-md border border-gray-300 p-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    placeholder="1"
                  />
                </div>

                <div className="mb-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label
                        htmlFor="tempatLahir"
                        className="mb-1 block text-sm font-medium text-gray-700"
                      >
                        Tempat Lahir
                      </label>
                      <InputText
                        id="tempatLahir"
                        name="tempatLahir"
                        className="w-full rounded-md border border-gray-300 p-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                        placeholder="Banyuwangi"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="tanggalLahir"
                        className="mb-1 block text-sm font-medium text-gray-700"
                      >
                        Tanggal Lahir
                      </label>
                      <Calendar
                        id="tanggalLahir"
                        className="h-[2.6rem] w-full"
                        showIcon
                        placeholder="dd/mm/yyyy"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h1 className="py-2 text-xl font-bold">
                    Apakah Anda Mengalami Disabilitas?
                  </h1>
                  <div className="mb-3 flex items-center gap-2">
                    <div className="p-field-radiobutton flex items-center gap-2 text-base">
                      <RadioButton
                        inputId="disYes"
                        name="disability"
                        value={true}
                        onChange={onDisabilityChange}
                        checked={hasDisability === true}
                      />
                      <label htmlFor="disYes">Iya</label>
                    </div>
                    <div className="p-field-radiobutton flex items-center gap-2 text-base">
                      <RadioButton
                        inputId="disNo"
                        name="disability"
                        value={false}
                        onChange={onDisabilityChange}
                        checked={hasDisability === false}
                      />
                      <label htmlFor="disNo">Tidak</label>
                    </div>
                  </div>

                  {hasDisability && (
                    <Fieldset legend="Pilih Jenis Disabilitas">
                      <div className="flex flex-col gap-3">
                        {disabilityOptions.map((disability, index) => (
                          <div key={index} className="flex items-center">
                            <Checkbox
                              inputId={disability.value}
                              name="category"
                              onChange={onTypeChange}
                              value={disability.value}
                              checked={selectedDisabilityTypes.includes(
                                disability.value,
                              )}
                            />
                            <label htmlFor={disability.value} className="ml-2">
                              {disability.label}
                            </label>
                            {disability.value === "lainnya" &&
                              selectedDisabilityTypes.includes("lainnya") && (
                                <InputText
                                  name="disabiltasLainnya"
                                  value={otherDisability}
                                  onChange={(e) =>
                                    setOtherDisability(e.target.value)
                                  }
                                  placeholder="Sebutkan jenis disabilitas lainnya"
                                  className="ms-8 w-full rounded-md border border-gray-300 p-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 md:w-100"
                                />
                              )}
                          </div>
                        ))}
                      </div>
                    </Fieldset>
                  )}
                </div>
              </div>

              <div>
                <div className="mb-4">
                  <InputWithLabel
                    id="beratBadanLahir"
                    label="Berat Badan Lahir"
                    placeholder="2.5"
                    satuan="KG"
                    keyfilter={"num"}
                  />
                </div>

                <div className="mb-4">
                  <InputWithLabel
                    id="tinggiBadanLahir"
                    label="Tinggi Badan Lahir"
                    placeholder="20.5"
                    satuan="CM"
                    keyfilter={"num"}
                  />
                </div>

                <div className="mb-4">
                  <InputWithLabel
                    id="lingkarLenganAtas"
                    label="Lingkar Lengan Atas"
                    placeholder="20.2"
                    satuan="CM"
                    keyfilter={"num"}
                  />
                </div>

                <div className="mb-10">
                  <InputWithLabel
                    id="lingkarKepala"
                    label="Lingkar Kepala"
                    placeholder="20.4"
                    satuan="CM"
                    keyfilter={"num"}
                  />
                </div>

                <div className="mb-4">
                  <div className="rounded-md bg-white px-8 pt-4 shadow-lg ">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                      <div className="mb-4 md:mb-8">
                        <label className="mb-1 block text-base font-medium text-gray-700">
                          Cara Lahir
                        </label>
                        <div className="flex gap-3">
                          <div className="flex items-center">
                            <RadioButton
                              inputId="caraLahir1"
                              name="caraLahir"
                              value={"normal"}
                              onChange={(e) => setCaraLahir(e.value)}
                              checked={caraLahir == "normal"}
                            />
                            <label htmlFor="caraLahir1" className="ml-2">
                              Normal
                            </label>
                          </div>
                          <div className="flex items-center">
                            <RadioButton
                              inputId="caraLahir2"
                              name="caraLahir"
                              value={"caesar"}
                              onChange={(e) => setCaraLahir(e.value)}
                              checked={caraLahir == "caesar"}
                            />
                            <label htmlFor="caraLahir2" className="ml-2">
                              Caesar
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="mb-4 md:mb-8">
                        <label className="mb-1 block text-base font-medium text-gray-700">
                          Jenis Kelamin
                        </label>
                        <div className="flex gap-3">
                          <div className="flex items-center">
                            <RadioButton
                              inputId="lakiLaki"
                              name="jenisKelamin"
                              value={"l"}
                              onChange={(e) => setJenisKelamin(e.value)}
                              checked={jenisKelamin == "l"}
                            />
                            <label htmlFor="lakiLaki" className="ml-2">
                              Laki Laki
                            </label>
                          </div>
                          <div className="flex items-center">
                            <RadioButton
                              inputId="perempuan"
                              name="jenisKelamin"
                              value={"p"}
                              onChange={(e) => setJenisKelamin(e.value)}
                              checked={jenisKelamin == "p"}
                            />
                            <label htmlFor="perempuan" className="ml-2">
                              Perempuan
                            </label>
                          </div>
                        </div>
                      </div>
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

export default CreateBalita;
