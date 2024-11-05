"use client";
import React from "react";
import { Card } from "primereact/card";
import CardDetail from "../ui/CardDetail";
import { RadioButton } from "primereact/radiobutton";
import Image from "next/image";

const DetailAnggota = ({ id }: { id: string }) => {
  return (
    <>
      <Card className="mt-8 px-2">
        <div className="mb-6 flex justify-center md:mb-12">
          <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-white shadow-lg">
            <Image
              src={"/images/team/team-03.png"}
              alt="Profile"
              width={160}
              height={160}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-6">
          <div>
            <div className="mb-4">
              <CardDetail label="Nama Lengkap">Elang Daisuke</CardDetail>
            </div>

            <div className="mb-4">
              <CardDetail label="Nomor Telepon (WA AKTIF)">
                081234567890
              </CardDetail>
            </div>

            <div className="mb-4">
              <CardDetail label="E-mail">elangdaisuke@example.com</CardDetail>
            </div>
          </div>

          <div>
            <div className="mb-4">
              <CardDetail label="Posisi/Peran">Ketua Kader</CardDetail>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
              <div className="mb-4">
                <CardDetail label="Kabupaten">Banyuwangi</CardDetail>
              </div>
              <div className="mb-4">
                <CardDetail label="Kecamatan">Banyuwangi</CardDetail>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
              <div className="mb-4">
                <CardDetail label="Desa">Glagah</CardDetail>
              </div>
              <div className="mb-4">
                <CardDetail label="Dusun">Licin</CardDetail>
              </div>
            </div>

            <div className="mb-4">
              <CardDetail label="Posyandu">Posyandu Mawar 10</CardDetail>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
};

export default DetailAnggota;
