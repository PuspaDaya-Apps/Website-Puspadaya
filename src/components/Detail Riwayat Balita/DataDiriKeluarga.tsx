"use client";
import React from "react";
import CardDetail from "../ui/CardDetail";

const DataDiriKeluarga = () => {
  return (
    <div>
      <h3 className="pb-4 text-xl font-bold text-black">Data Diri Keluarga</h3>
      <div className="grid grid-cols-2 gap-6">
        {/* Kiri */}
        <div>
          <div className="mb-4">
            <CardDetail label="Nomor Kartu Keluarga">
              3201326565656987
            </CardDetail>
          </div>
          <div className="mb-4">
            <CardDetail label="Nama Ayah">Muhammad Mawang</CardDetail>
          </div>
          <div className="mb-4">
            <CardDetail label="Nama Ibu">Tiara Andini</CardDetail>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="mb-2">
              <CardDetail label="Kabupaten">Banyuwangi</CardDetail>
            </div>
            <div className="mb-2">
              <CardDetail label="Kecamatan">Rogojampi</CardDetail>
            </div>
            <div className="mb-2">
              <CardDetail label="Desa">Laban Asem</CardDetail>
            </div>
            <div className="mb-2">
              <CardDetail label="Dusun / Dati">Krajan</CardDetail>
            </div>
            <div className="mb-2">
              <CardDetail label="RW">08</CardDetail>
            </div>
            <div className="mb-2">
              <CardDetail label="RT">09</CardDetail>
            </div>
          </div>
          <div className="mb-4">
            <CardDetail label="Alamat">
              JL Raya Jember - Banyuwangi KM 13
            </CardDetail>
          </div>
        </div>

        {/* Kanan */}
        <div>
          <div className="mb-4">
            <CardDetail label="NIK Balita">3201326565656987</CardDetail>
          </div>
          <div className="mb-4">
            <CardDetail label="Nama Lengkap Balita">Soke Bahtera</CardDetail>
          </div>
          <div className="mb-4">
            <CardDetail label="Usia">3 Tahun</CardDetail>
          </div>
          <div className="mb-4">
            <CardDetail label="Posyandu">Posyandu Rogojampi</CardDetail>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataDiriKeluarga;
