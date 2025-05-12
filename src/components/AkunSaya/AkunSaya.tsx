"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { SvgEditProfile } from "@/components/ui/Svg";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Role } from "@/types/role";
import { currentUser } from "@/app/api/user/currentUser";

type Kabupaten = { name: string; code: string };
type Kecamatan = { name: string; code: string };
type Desa = { name: string; code: string };
type Dusun = { name: string; code: string };

interface UserCurrent {
  id: string;
  nama_lengkap: string;
  nomor_telepon: string;
  tanggal_lahir: string;
  rt: string;
  rw: string;
  alamat_lengkap: string;
  provinsi: { nama_provinsi: string };
  kabupaten_kota: { nama_kabupaten_kota: string };
  kecamatan: { nama_kecamatan: string };
  desa_kelurahan: { nama_desa_kelurahan: string };
  dusun: { nama_dusun: string };
  role: { nama_role: string };
  posyandu: { nama_posyandu: string };
  foto_profil?: string;
}

interface Akun {
  namaLengkap: string;
  noTelepon: string;
  kata_sandi: string;
  tanggalLahir: string;
  konfirmasi_sandi: string;
  posisi: Role;
  alamat: {
    kabupaten: string;
    kecamatan: string;
    desa: string;
    dusun: string;
  };
}

const kabupatenOptions: Kabupaten[] = [
  { name: "Banyuwangi", code: "BWI" },
  { name: "Maluku Tengah", code: "MT" },
];

const kecamatanOptions: Record<string, Kecamatan[]> = {
  BWI: [
    { name: "Rogojampi", code: "K1" },
    { name: "Glagah", code: "K2" },
  ],
  MT: [
    { name: "Masohi", code: "K3" },
    { name: "Amahai", code: "K4" },
  ],
};

const desaOptions: Record<string, Desa[]> = {
  K1: [{ name: "Pangatigan", code: "D1" }],
  K2: [{ name: "Glagah Desa", code: "D2" }],
  K3: [{ name: "Masohi Desa", code: "D3" }],
  K4: [{ name: "Amahai Desa", code: "D4" }],
};

const dusunOptions: Record<string, Dusun[]> = {
  D1: [{ name: "Krajan", code: "DS1" }],
  D2: [{ name: "Dusun 2", code: "DS2" }],
  D3: [{ name: "Dusun 3", code: "DS3" }],
  D4: [{ name: "Dusun 4", code: "DS4" }],
};

const AkunSaya = () => {
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [user, setUser] = useState<UserCurrent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [akun, setAkun] = useState<Akun>({
    namaLengkap: "",
    noTelepon: "",
    tanggalLahir: "",
    kata_sandi: "",
    konfirmasi_sandi: "",
    posisi: Role.AnggotaKader,
    alamat: {
      kabupaten: "",
      kecamatan: "",
      desa: "",
      dusun: "",
    },
  });

  const [selectedKabupaten, setSelectedKabupaten] = useState<Kabupaten | null>(null);
  const [selectedKecamatan, setSelectedKecamatan] = useState<Kecamatan | null>(null);
  const [selectedDesa, setSelectedDesa] = useState<Desa | null>(null);
  const [selectedDusun, setSelectedDusun] = useState<Dusun | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const result = await currentUser();

        if (result.successCode === 200 && result.data) {
          const userData = Array.isArray(result.data) ? result.data[0] : result.data;
          setUser(userData);

          // Set form data
          setAkun({
            namaLengkap: userData.nama_lengkap || "",
            noTelepon: userData.nomor_telepon || "",
            tanggalLahir: userData.tanggal_lahir || "",
            kata_sandi: "",
            konfirmasi_sandi: "",
            posisi: (userData.role?.nama_role as Role) || Role.AnggotaKader,
            alamat: {
              kabupaten: userData.kabupaten_kota?.nama_kabupaten_kota || "",
              kecamatan: userData.kecamatan?.nama_kecamatan || "",
              desa: userData.desa_kelurahan?.nama_desa_kelurahan || "",
              dusun: userData.dusun?.nama_dusun || "",
            },
          });

          // Set dropdown values
          const kabupaten = kabupatenOptions.find(
            (k) => k.name === userData.kabupaten_kota?.nama_kabupaten_kota
          );
          setSelectedKabupaten(kabupaten || null);

          if (kabupaten) {
            const kecamatan = kecamatanOptions[kabupaten.code]?.find(
              (k) => k.name === userData.kecamatan?.nama_kecamatan
            );
            setSelectedKecamatan(kecamatan || null);

            if (kecamatan) {
              const desa = desaOptions[kecamatan.code]?.find(
                (d) => d.name === userData.desa_kelurahan?.nama_desa_kelurahan
              );
              setSelectedDesa(desa || null);

              if (desa) {
                const dusun = dusunOptions[desa.code]?.find(
                  (ds) => ds.name === userData.dusun?.nama_dusun
                );
                setSelectedDusun(dusun || null);
              }
            }
          }
        } else {
          setError('Gagal mengambil data user');
        }
      } catch (err) {
        setError('Terjadi kesalahan saat mengambil data user');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

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

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center text-gray-500">Memuat data pengguna...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  const roleName = user?.role?.nama_role || "Admin";
  const imageSrc = profilePhoto || roleImageMap[roleName] || "/images/user/user-03.png";

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

      <div className="overflow-hidden rounded-[10px] bg-white px-18 py-9 pt-6 shadow-1">
        <ProfilePicture
          profilePhoto={profilePhoto}
          onPhotoChange={handlePhotoChange}
          imageSrc={imageSrc}
        />

        {user && (
          <FormProfile
            akun={akun}
            handleInputChange={handleInputChange}
            selectedKabupaten={selectedKabupaten}
            setSelectedKabupaten={setSelectedKabupaten}
            selectedKecamatan={selectedKecamatan}
            setSelectedKecamatan={setSelectedKecamatan}
            selectedDesa={selectedDesa}
            setSelectedDesa={setSelectedDesa}
            selectedDusun={selectedDusun}
            setSelectedDusun={setSelectedDusun}
            roleName={roleName}
          />
        )}

        <div className="mt-14 flex items-center justify-center px-4">
          {roleName !== "Admin" && (
            <Button
              label="Simpan"
              className="w-full max-w-[370px] bg-[#486284]"
            />
          )}
        </div>
      </div>
    </div>
  );
};

const roleImageMap: { [key: string]: string } = {
  "Admin": "/images/user/admin.png",
  "Dinas Kesehatan": "/images/user/dinkes.png",
  "Dinas Sosial": "/images/user/dinsos.svg",
  "Kepala Camat": "/images/user/kepala_desa_kec.png",
  "Kepala Desa": "/images/user/kepala_desa_kec.png",
  "TPG": "/images/user/tpg.png",
  "Ketua Kader": "/images/user/ketua.png",
  "Kader": "/images/user/anggota.png",
};

const ProfilePicture = ({
  profilePhoto,
  onPhotoChange,
  imageSrc
}: {
  profilePhoto: string | null;
  onPhotoChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  imageSrc: string;
}) => {
  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        <div className="relative flex h-30 w-30 justify-items-center rounded-full drop-shadow-2">
          <Image
            src={imageSrc}
            width={160}
            height={160}
            className="h-30 w-30 rounded-full object-cover"
            alt="profile"
          />
        </div>
      </div>
    </div>
  );
};

const FormProfile = ({
  akun,
  handleInputChange,
  selectedKabupaten,
  setSelectedKabupaten,
  selectedKecamatan,
  setSelectedKecamatan,
  selectedDesa,
  setSelectedDesa,
  selectedDusun,
  setSelectedDusun,
  roleName,
}: {
  akun: Akun;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedKabupaten: Kabupaten | null;
  setSelectedKabupaten: (kab: Kabupaten | null) => void;
  selectedKecamatan: Kecamatan | null;
  setSelectedKecamatan: (kec: Kecamatan | null) => void;
  selectedDesa: Desa | null;
  setSelectedDesa: (desa: Desa | null) => void;
  selectedDusun: Dusun | null;
  setSelectedDusun: (dusun: Dusun | null) => void;
  roleName: string;
}) => {
  const getKecamatanOptions = () =>
    selectedKabupaten ? kecamatanOptions[selectedKabupaten.code] || [] : [];

  const getDesaOptions = () =>
    selectedKecamatan ? desaOptions[selectedKecamatan.code] || [] : [];

  const getDusunOptions = () =>
    selectedDesa ? dusunOptions[selectedDesa.code] || [] : [];

  return (
    <div className="mt-10 grid grid-cols-2 gap-10">
      <div className="left">
        <div className="mb-3 w-full">
          <label htmlFor="namaLengkap">Nama Lengkap</label>
          <InputText
            id="namaLengkap"
            name="namaLengkap"
            className="mt-2 w-full"
            value={akun.namaLengkap}
            onChange={handleInputChange}
          />
        </div>

        <div className="mb-3 w-full">
          <label htmlFor="telepon">Nomor Telepon (WA Aktif)</label>
          {roleName === "Admin" ? (
            <InputText
              id="telepon"
              name="noTelepon"
              value="*************"
              readOnly
              className="mt-2 w-full"
            />
          ) : (
            <InputText
              id="telepon"
              name="noTelepon"
              value={akun.noTelepon}
              onChange={handleInputChange}
              inputMode="tel"
              className="mt-2 w-full"
            />
          )}
        </div>

        <div className="mb-3 w-full">
          <label htmlFor="tanggalLahir">Tanggal Lahir</label>
          <input
            type="date"
            id="tanggalLahir"
            name="tanggalLahir"
            value={akun.tanggalLahir}
            onChange={handleInputChange}
            disabled={roleName === "Admin"}
            className="mt-2 w-full rounded border px-2 py-3"
          />
        </div>

        {roleName !== "Admin" && (
          <div className="grid grid-cols-2 gap-5">
            <div className="relative mb-3 w-full">
              <label htmlFor="password">Password</label>
              <InputText
                id="password"
                name="kata_sandi"
                value={akun.kata_sandi}
                onChange={handleInputChange}
                type="password"
                className="mt-2 w-full"
              />
            </div>
            <div className="relative mb-3 w-full">
              <label htmlFor="konfirmasiPassword">Konfirmasi Password</label>
              <InputText
                id="konfirmasiPassword"
                name="konfirmasi_sandi"
                value={akun.konfirmasi_sandi}
                onChange={handleInputChange}
                type="password"
                className="mt-2 w-full"
              />
            </div>
          </div>
        )}
      </div>

      <div className="right">
        <div className="mb-3 w-full">
          <label htmlFor="posisi">Posisi/Peran</label>
          <InputText
            id="posisi"
            name="posisi"
            value={akun.posisi}
            readOnly
            disabled
            className="mt-2 w-full"
          />
        </div>

        <label>Alamat</label>
        <div className="grid grid-cols-2 gap-5">
          <InputText
            id="kabupaten"
            name="alamat.kabupaten"
            value={akun.alamat.kabupaten}
            readOnly
            disabled
            className="mb-4 mt-2 w-full"
          />

          <InputText
            id="kecamatan"
            name="alamat.kecamatan"
            value={akun.alamat.kecamatan}
            readOnly
            disabled
            className="mb-4 mt-2 w-full"
          />

          <InputText
            id="desa"
            name="alamat.desa"
            value={akun.alamat.desa}
            readOnly
            disabled
            className="mb-4 mt-2 w-full"
          />

          <InputText
            id="dusun"
            name="alamat.dusun"
            value={akun.alamat.dusun}
            readOnly
            disabled
            className="mb-4 mt-2 w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default AkunSaya;