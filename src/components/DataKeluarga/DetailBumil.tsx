"use client";
import React, { useRef } from "react";
import { Card } from "primereact/card";
import CardDetail from "../ui/CardDetail";
import { RadioButton } from "primereact/radiobutton";
import KesimpulanBumil from "./KesimpulanBumil";
import { Image } from "primereact/image";
import { InputTextarea } from "primereact/inputtextarea";

const DetailBumil = ({ id }: { id: string }) => {
  const op = useRef(null);

  return (
    <>
      <Card className="mt-8 px-2">
        <div className="grid grid-cols-1 gap-6  md:grid-cols-2">
          <div>
            <div className="mb-4">
              <CardDetail label="NIK">3522010503102</CardDetail>
            </div>

            <div className="mb-4">
              <CardDetail label="Nama Lengkap">Siti Fatimah</CardDetail>
            </div>

            <div className="mb-4">
              <CardDetail label="Posyandu">Posyandu Mawar 10</CardDetail>
            </div>

            <div className="mb-4">
              <CardDetail label="Tanggal Pendampingan">10/10/2022</CardDetail>
            </div>

            <div className="mb-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <CardDetail label="Tinggi Badan" satuan="CM">
                    155
                  </CardDetail>
                </div>

                <div>
                  <CardDetail label="Tinggi Badan" satuan="CM">
                    155
                  </CardDetail>
                </div>
              </div>
            </div>
            <div className="mb-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <CardDetail label="Tinggi Badan" satuan="CM">
                    155
                  </CardDetail>
                </div>

                <div>
                  <CardDetail label="Tinggi Badan" satuan="CM">
                    155
                  </CardDetail>
                </div>
              </div>
            </div>
            <div className="mb-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <CardDetail label="Tinggi Badan" satuan="CM">
                    155
                  </CardDetail>
                </div>

                <div>
                  <CardDetail label="Tinggi Badan" satuan="CM">
                    155
                  </CardDetail>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="mb-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <CardDetail label="Tinggi Badan" satuan="CM">
                    155
                  </CardDetail>
                </div>

                <div>
                  <CardDetail label="Tinggi Badan" satuan="CM">
                    155
                  </CardDetail>
                </div>
              </div>
            </div>
            <div className="mb-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <CardDetail label="Tinggi Badan" satuan="CM">
                    155
                  </CardDetail>
                </div>

                <div>
                  <CardDetail label="Tinggi Badan" satuan="CM">
                    155
                  </CardDetail>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <div>
                <label
                  htmlFor="intervensi"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Intervensi Yang Diberikan
                </label>
                <InputTextarea
                  disabled
                  value="Obat"
                  className="w-full"
                  id="intervensi"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="mb-4 block text-sm text-gray-600">
                Keterpapasan Asap Rokok
              </label>
              <div className="flex gap-3">
                <div className="flex items-center">
                  <RadioButton inputId="asaprokok1" />
                  <label htmlFor="asaprokok1" className="ml-2">
                    Ya
                  </label>
                </div>
                <div className="flex items-center">
                  <RadioButton
                    inputId="asaprokok2"
                    checked={true}
                    disabled={false}
                  />
                  <label htmlFor="asaprokok2" className="ml-2">
                    Tidak
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
};

export default DetailBumil;
