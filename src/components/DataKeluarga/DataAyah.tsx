import React from "react";
import CardDetail from "../ui/CardDetail";

const DataAyah = () => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-6">
        <div>
          <div className="mb-4">
            <CardDetail label="Nomor Kartu Keluarga">3522010503102</CardDetail>
          </div>

          <div className="mb-4">
            <CardDetail label="NIK">3522010503102</CardDetail>
          </div>

          <div className="mb-4">
            <CardDetail label="Nama Lengkap">Budi Hartono</CardDetail>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
            <div className="mb-4 md:mb-8">
              <CardDetail label="Tempat">Jakarta</CardDetail>
            </div>
            <div className="mb-4">
              <CardDetail label="Tanggal Lahir">28 Januari 1987</CardDetail>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <CardDetail label="Nomor Telepon">0123456789</CardDetail>
            </div>
            <div className="mb-4">
              <CardDetail label="Golongan Darah">A</CardDetail>
            </div>
          </div>
        </div>

        <div>
          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <CardDetail label="Kabupaten">Banyuwangi</CardDetail>
            </div>
            <div className="mb-4">
              <CardDetail label="Kecamatan">Banyuwangi</CardDetail>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <CardDetail label="Desa">Rogojampi</CardDetail>
            </div>
            <div className="mb-4">
              <CardDetail label="Dusun">Krajan</CardDetail>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <CardDetail label="RT">01</CardDetail>
            </div>
            <div className="mb-4">
              <CardDetail label="RW">03</CardDetail>
            </div>
          </div>

          <div className="mb-4">
            <CardDetail label="Alamat Lengkap">Jalan Kertanegara</CardDetail>
          </div>

          <div className="mb-4">
            <h2 className="mb-2 text-lg font-semibold">
              Informasi Disabilitas
            </h2>
            <ul className="list-disc pl-5">
              <li>
                Autis <span>Kesulitan Berbicara / Berkomunikasi</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default DataAyah;
