"use client";
import React from "react";
import CardDetail from "../ui/CardDetail"; // Jika ini custom component, pastikan pathnya benar
import { InputText } from "primereact/inputtext"; // Pastikan primereact sudah terinstall

const DataDiriKeluarga = () => {
  return (
    <div>
      <h2 className="pb-5 text-2xl font-bold text-black">Data Diri Keluarga</h2>
      <div className="grid grid-cols-2 gap-6">
        {/* Bagian Kiri */}
        <div>
          <div className="mb-4">
            <CardDetail label="Nomor Kartu Keluarga">
              3201326565656987
            </CardDetail>
          </div>
          <div className="mb-4">
            <CardDetail label="Nama Ayah">Muhammad Mawang</CardDetail>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="mb-2">
              <CardDetail label="Tempat Lahir">Banyuwangi</CardDetail>
            </div>
            <div className="mb-2">
              <CardDetail label="Tempat Lahir">Banyuwangi</CardDetail>
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

        {/* Bagian Kanan */}
        <div>
          <div className="mb-4">
            <CardDetail label="NIK Ibu">3201326565656987</CardDetail>
          </div>
          <div className="mb-4">
            <CardDetail label="Nama Lengkap Ibu">Soke Bahtera</CardDetail>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="relative">
              <div className="mb-2">
                <CardDetail label="Usia Kehamilan">4</CardDetail>
              </div>
              <span className="absolute right-0 top-6 bottom-2 flex items-center text-gray-500 bg-gray-200 px-2 rounded-r-md border-l border-gray-300">
                Mg
              </span>
            </div>
            <div className="mb-2">
              <CardDetail label="Posyandu">Mawar 5</CardDetail>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataDiriKeluarga;
