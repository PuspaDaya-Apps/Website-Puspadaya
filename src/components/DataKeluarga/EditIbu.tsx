import { InputText } from "primereact/inputtext";
import React, { useState } from "react";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Checkbox, CheckboxChangeEvent } from "primereact/checkbox";
import { RadioButton } from "primereact/radiobutton";
import { Fieldset } from "primereact/fieldset";

interface Kabupaten {
  name: string;
  code: string;
}

const EditIbu = () => {
  const [selectedKabupaten, setSelectedKabupaten] = useState<Kabupaten | null>(
    null,
  );
  const [otherDisability, setOtherDisability] = useState("");
  const [hasDisability, setHasDisability] = useState(null);
  const [selectedDisabilityTypes, setSelectedDisabilityTypes] = useState<
    string[]
  >([]);

  const kabupaten: Kabupaten[] = [
    { name: "New York", code: "NY" },
    { name: "Rome", code: "RM" },
    { name: "London", code: "LDN" },
    { name: "Istanbul", code: "IST" },
    { name: "Paris", code: "PRS" },
  ];

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
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label
                  htmlFor="jumlahAnak"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Jumlah Anak
                </label>
                <InputText
                  id="jumlahAnak"
                  name="jumlahAnak"
                  keyfilter={"int"}
                  className="w-full rounded-md border border-gray-300 p-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  placeholder="1"
                />
              </div>
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
            <h1 className="pb-2 text-xl font-semibold">
              Informasi Kelahiran Pertama
            </h1>
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
                            onChange={(e) => setOtherDisability(e.target.value)}
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
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label
                  htmlFor="kabupaten"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Kabupaten
                </label>
                <Dropdown
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
                  id="Kecamatan"
                  value={selectedKabupaten}
                  onChange={(e) => setSelectedKabupaten(e.value)}
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
                  id="desa"
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
                  htmlFor="dusun"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Dusun
                </label>
                <Dropdown
                  id="dusun"
                  value={selectedKabupaten}
                  onChange={(e) => setSelectedKabupaten(e.value)}
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

          <div className="mb-4">
            <label
              htmlFor="alamatLengkap"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Alamat Lengkap
            </label>
            <InputText
              id="alamatLengkap"
              name="alamatLengkap"
              className="w-full rounded-md border border-gray-300 p-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan Alamat Lengkap"
            />
          </div>

          <div className="mb-4">
            <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label
                  htmlFor="noTelepon"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Nomor Telepon
                </label>
                <InputText
                  id="noTelepon"
                  name="noTelepon"
                  className="w-full rounded-md border border-gray-300 p-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan Nomor Telepon"
                />
              </div>
              <div>
                <label
                  htmlFor="goldarah"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Golongan Darah
                </label>
                <Dropdown
                  id="goldarah"
                  value={selectedKabupaten}
                  onChange={(e) => setSelectedKabupaten(e.value)}
                  options={kabupaten}
                  optionLabel="name"
                  placeholder="Pilih Gol Darah"
                  className="flex h-[2.6rem] w-full items-center"
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
    </>
  );
};

export default EditIbu;
