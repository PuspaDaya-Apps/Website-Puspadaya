"use client";
import React from "react";
import { Card } from "primereact/card";
import CardDetail from "../ui/CardDetail";
import { RadioButton } from "primereact/radiobutton";

const DetailBalita = ({ id }: { id: string }) => {
  return (
    <>
      <Card className="mt-8 px-2">
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-6">
          <div>
            <div className="mb-4">
              <CardDetail label="Nomor Kartu Keluarga">
                3522010503102
              </CardDetail>
            </div>

            <div className="mb-4">
              <CardDetail label="Nama Lengkap">Elang Daisuke</CardDetail>
            </div>

            <div className="mb-4">
              <CardDetail label="Anak Ke">1</CardDetail>
            </div>

            <div className="mb-4">
              <CardDetail label="NIK">352201050223102</CardDetail>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
              <div className="mb-4 md:mb-8">
                <CardDetail label="Tempat">Bandung</CardDetail>
              </div>
              <div className="mb-4">
                <CardDetail label="Tanggal Lahir">30 Agustus 1990</CardDetail>
              </div>
            </div>
          </div>

          <div>
            <div className="mb-4">
              <CardDetail label="Berat Badan Lahir" satuan="KG">
                9
              </CardDetail>
            </div>

            <div className="mb-4">
              <CardDetail label="Tinggi Badaan Lahir" satuan="CM">
                20
              </CardDetail>
            </div>

            <div className="mb-4">
              <CardDetail label="Lingkar Lengan Atas" satuan="CM">
                15
              </CardDetail>
            </div>

            <div className="mb-4">
              <CardDetail label="Lingkar Kepala" satuan="CM">
                5
              </CardDetail>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="mb-4 md:mb-8">
                <label className="mb-4 block text-sm text-gray-600">
                  Cara Lahir
                </label>
                <div className="flex gap-3">
                  <div className="flex items-center">
                    <RadioButton
                      inputId="caraLahir1"
                      checked={true}
                      disabled={false}
                    />
                    <label htmlFor="caraLahir1" className="ml-2">
                      Normal
                    </label>
                  </div>
                  <div className="flex items-center">
                    <RadioButton inputId="caraLahir2" disabled />
                    <label htmlFor="caraLahir2" className="ml-2">
                      Caesar
                    </label>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="mb-4 block text-sm text-gray-600">
                  Jenis Kelamin
                </label>
                <div className="flex gap-3">
                  <div className="flex items-center">
                    <RadioButton inputId="jeniskelaminlaki" checked />
                    <label htmlFor="jeniskelaminlaki" className="ml-2">
                      Laki - Laki
                    </label>
                  </div>
                  <div className="flex items-center">
                    <RadioButton inputId="jeniskelaminperempuan" disabled />
                    <label htmlFor="jeniskelaminperempuan" className="ml-2">
                      Perempuan
                    </label>
                  </div>
                </div>
              </div>
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
      </Card>
    </>
  );
};

export default DetailBalita;
