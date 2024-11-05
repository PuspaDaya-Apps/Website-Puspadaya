import React from "react";
import CardDetail from "../ui/CardDetail";

const DataIbu = () => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-6">
        <div>
          <div className="mb-4">
            <CardDetail label="Nomor Kartu Keluarga">3522010503102</CardDetail>
          </div>

          <div className="mb-4">
            <CardDetail label="NIK">352201050223102</CardDetail>
          </div>

          <div className="mb-4">
            <CardDetail label="Nama Lengkap">Siti Nurhalimah</CardDetail>
          </div>

          <div className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-4">
            <div className="mb-4">
              <CardDetail label="Jumlah Anak">2</CardDetail>
            </div>
            <div className="mb-4">
              <CardDetail label="Tempat">Bandung</CardDetail>
            </div>
            <div className="col-span-2 mb-4 md:col-span-1">
              <CardDetail label="Tanggal Lahir">30 Agustus 1990</CardDetail>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <CardDetail label="Nomor Telepon">00382382</CardDetail>
            </div>
            <div className="mb-4">
              <CardDetail label="Golongan Darah">O</CardDetail>
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
            <CardDetail label="Tanggal Kelahiran Pertama">
              20 Februari 2010
            </CardDetail>
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

export default DataIbu;
