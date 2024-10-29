"use client"; // This directive allows the use of client-side features
// import DefaultLayout from "@/components/Layouts/DefaultLayout"; // Make sure the layout import is correct
import { Metadata } from "next";
import React, { useState } from "react";
import Image from "next/image";
import { SvgEditProfile, SvgEyeHide, SvgEyeShow } from "@/components/ui/Svg";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Akun } from "@/types/akun";
import { Role } from "@/types/role";
import ProfileBox from "../ProfileBox";
import SettingBoxes from "../SettingBoxes";

type Kabupaten = {
  name: string;
  code: string;
};

type Kecamatan = {
  name: string;
  code: string;
};

type Desa = {
  name: string;
  code: string;
};

type Dusun = {
  name: string;
  code: string;
};

const AkunSaya = () => {
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null); // State for profile photo
  const [Akun, setAkun] = useState<Akun>({
    namaLengkap: "Soke Bahtera",
    noTelepon: "08976543215",
    email: "sokebah@gmail.com",
    kata_sandi: "sokebah12345",
    konfirmasi_sandi: "sokebah12345",
    posisi: Role.AnggotaKader, // Anda bisa mengisi ini sesuai kebutuhan
    alamat: {
      kabupaten: "Banyuwangi",
      kecamatan: "Rogojampi",
      desa: "Pangatigan",
      dusun: "Krajan",
    },
  });
  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAkun((prevAkun) => ({ ...prevAkun, [name]: value }));
  };
  return (
    <div className="container mx-auto">
      <div className="mb-4">
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <h2 className="pb-1 text-2xl font-bold text-black">Profile</h2>
          <p className="text-sm font-medium text-gray-500">
            Untuk melihat informasi detail profile
          </p>
        </div>
      </div>
      {/* Card Wrapper */}
      <div className="overflow-hidden rounded-[10px] bg-white px-18 py-9 pt-6 shadow-1">
        <ProfilePicture
          profilePhoto={profilePhoto}
          onPhotoChange={handlePhotoChange}
        />
        <FormProfile Akun={Akun} handleInputChange={handleInputChange} />
        <div className="mt-14 flex items-center justify-center px-4">
          <Button
            label="Simpan"
            className="w-full max-w-[370px] bg-[#486284]"
          />
        </div>
      </div>
    </div>
  );
};

export default AkunSaya;

function ProfilePicture({
  profilePhoto,
  onPhotoChange,
}: {
  profilePhoto: string | null;
  onPhotoChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        <div className="relative flex h-30 w-30 justify-items-center rounded-full drop-shadow-2">
          <Image
            src={profilePhoto || "/images/user/user-03.png"} // Default image if no photo is selected
            width={160}
            height={160}
            className="h-30 w-30 rounded-full object-cover"
            alt="profile"
          />
        </div>
        <label
          htmlFor="profilePhoto"
          className="absolute bottom-[-.25rem] right-[.25rem] flex h-8.5 w-8.5 cursor-pointer items-center justify-center rounded-full bg-[#486284] text-white hover:bg-opacity-90"
        >
          <SvgEditProfile />
          <input
            type="file"
            name="profilePhoto"
            id="profilePhoto"
            className="sr-only"
            accept="image/png, image/jpg, image/jpeg"
            onChange={onPhotoChange} // Call the handler when the photo changes
          />
        </label>
      </div>
    </div>
  );
}

function FormProfile({
  Akun,
  handleInputChange,
}: {
  Akun: Akun;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const [selectedKabupaten, setSelectedKabupaten] = useState<Kabupaten | null>(
    null,
  );
  const [selectedKecamatan, setSelectedKecamatan] = useState<Kecamatan | null>(
    null,
  );
  const [selectedDesa, setSelectedDesa] = useState<Desa | null>(null);
  const [selectedDusun, setSelectedDusun] = useState<Dusun | null>(null);
  // Data Kabupaten
  const kabupatenOptions: Kabupaten[] = [
    { name: "Banyuwangi", code: "BWI" },
    { name: "Maluku Tengah", code: "MT" },
  ];

  // Data Kecamatan sesuai dengan Kabupaten yang dipilih
  const kecamatanOptions: Record<string, Kecamatan[]> = {
    BWI: [
      { name: "Kecamatan 1 Banyuwangi", code: "K1" },
      { name: "Kecamatan 2 Banyuwangi", code: "K2" },
    ],
    MT: [
      { name: "Kecamatan 1 Maluku Tengah", code: "K1" },
      { name: "Kecamatan 2 Maluku Tengah", code: "K2" },
    ],
  };

  // Data Desa sesuai dengan Kecamatan yang dipilih
  const desaOptions: Record<string, Desa[]> = {
    K1: [
      { name: "Desa 1 Kecamatan 1", code: "D1K1" },
      { name: "Desa 2 Kecamatan 1", code: "D2K1" },
    ],
    K2: [
      { name: "Desa 1 Kecamatan 2", code: "D1K2" },
      { name: "Desa 2 Kecamatan 2", code: "D2K2" },
    ],
  };

  // Data Dusun sesuai dengan Desa yang dipilih
  const dusunOptions: Record<string, Dusun[]> = {
    D1K1: [
      { name: "Dusun 1 Desa 1 Kecamatan 1", code: "Dusun1D1K1" },
      { name: "Dusun 2 Desa 1 Kecamatan 1", code: "Dusun2D1K1" },
    ],
    D2K1: [
      { name: "Dusun 1 Desa 2 Kecamatan 1", code: "Dusun1D2K1" },
      { name: "Dusun 2 Desa 2 Kecamatan 1", code: "Dusun2D2K1" },
    ],
    D1K2: [
      { name: "Dusun 1 Desa 1 Kecamatan 2", code: "Dusun1D1K2" },
      { name: "Dusun 2 Desa 1 Kecamatan 2", code: "Dusun2D1K2" },
    ],
    D2K2: [
      { name: "Dusun 1 Desa 2 Kecamatan 2", code: "Dusun1D2K2" },
      { name: "Dusun 2 Desa 2 Kecamatan 2", code: "Dusun2D2K2" },
    ],
  };

  // Ambil kecamatan berdasarkan kabupaten yang dipilih
  const getKecamatanOptions = () => {
    return selectedKabupaten ? kecamatanOptions[selectedKabupaten.code] : [];
  };

  // Ambil desa berdasarkan kecamatan yang dipilih
  const getDesaOptions = () => {
    return selectedKecamatan ? desaOptions[selectedKecamatan.code] : [];
  };

  // Ambil dusun berdasarkan desa yang dipilih
  const getDusunOptions = () => {
    return selectedDesa ? dusunOptions[selectedDesa.code] : [];
  };

  return (
    <div className="mt-10 grid grid-cols-2 gap-10">
      <div className="left">
        {/* Nama Lengkap */}
        <div className="mb-3 w-full">
          <label htmlFor="namaLengkap">Nama Lengkap</label>
          <InputText
            id="namaLengkap"
            name="namaLengkap"
            className="mt-2 w-full"
            value={Akun.namaLengkap}
            onChange={handleInputChange}
          />
        </div>
        {/* Telepon */}
        <div className="mb-3 w-full">
          <label htmlFor="telepon">Nomor Telepon (WA Aktif)</label>
          <InputText
            id="telepon"
            name="telepon"
            value={Akun.noTelepon}
            onChange={handleInputChange}
            inputMode="tel"
            className="mt-2 w-full"
          />
        </div>
        {/* Email */}
        <div className="mb-3 w-full">
          <label htmlFor="email">Email</label>
          <InputText
            id="email"
            name="email"
            value={Akun.email}
            onChange={handleInputChange}
            inputMode="email"
            className="mt-2 w-full"
          />
        </div>
        {/* Kata Sandi */}
        <div className="grid grid-cols-2 gap-5">
          {/* Password Field */}
          <div className="relative mb-3 w-full">
            <label htmlFor="password">Password</label>
            <InputText
              id="password"
              name="password"
              value={Akun.kata_sandi}
              onChange={handleInputChange}
              type={"password"}
              inputMode="text"
              className="mt-2 w-full"
            />
          </div>

          {/* Confirm Password Field */}
          <div className="relative mb-3 w-full">
            <label htmlFor="konfirmasiPassword">Konfirmasi Password</label>
            <InputText
              id="konfirmasiPassword"
              name="konfirmasiPassword"
              value={Akun.konfirmasi_sandi}
              onChange={handleInputChange}
              type={"password"}
              inputMode="text"
              className="mt-2 w-full"
            />
          </div>
        </div>
      </div>
      <div className="right">
        {/* posisi/peran */}
        <div className="mb-3 w-full">
          <label htmlFor="posisi">Posisi/Peran</label>
          <InputText
            id="posisi"
            name="posisi"
            inputMode="text"
            value={Akun.posisi}
            readOnly={true}
            disabled={true}
            className="mt-2 w-full"
          />
        </div>
        {/* alamat */}
        <label htmlFor="alamat">Alamat</label>
        <div className="grid grid-cols-2 gap-5">
          {/* Dropdown Kabupaten */}
          <Dropdown
            value={selectedKabupaten}
            onChange={(e) => {
              setSelectedKabupaten(e.value);
              setSelectedKecamatan(null); // Reset kecamatan saat kabupaten berubah
              setSelectedDesa(null); // Reset desa saat kabupaten berubah
              setSelectedDusun(null); // Reset dusun saat kabupaten berubah
            }}
            options={kabupatenOptions}
            optionLabel="name"
            placeholder="Kabupaten"
            className="mb-4 mt-2 w-full"
          />

          {/* Dropdown Kecamatan */}
          <Dropdown
            value={selectedKecamatan}
            onChange={(e) => {
              setSelectedKecamatan(e.value);
              setSelectedDesa(null); // Reset desa saat kecamatan berubah
              setSelectedDusun(null); // Reset dusun saat kecamatan berubah
            }}
            options={getKecamatanOptions()}
            optionLabel="name"
            placeholder="Kecamatan"
            className="mb-4 mt-2 w-full"
            disabled={!selectedKabupaten} // Nonaktifkan jika tidak ada kabupaten yang dipilih
          />

          {/* Dropdown Desa */}
          <Dropdown
            value={selectedDesa}
            onChange={(e) => {
              setSelectedDesa(e.value);
              setSelectedDusun(null); // Reset dusun saat desa berubah
            }}
            options={getDesaOptions()}
            optionLabel="name"
            placeholder="Desa"
            className="mb-4 mt-2 w-full"
            disabled={!selectedKecamatan} // Nonaktifkan jika tidak ada kecamatan yang dipilih
          />

          {/* Dropdown Dusun */}
          <Dropdown
            value={selectedDusun}
            onChange={(e) => setSelectedDusun(e.value)}
            options={getDusunOptions()}
            optionLabel="name"
            placeholder="Dusun"
            className="mb-4 mt-2 w-full"
            disabled={!selectedDesa} // Nonaktifkan jika tidak ada desa yang dipilih
          />
        </div>
      </div>
    </div>
  );
}
