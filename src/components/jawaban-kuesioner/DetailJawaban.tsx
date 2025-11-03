"use client";

import React, { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { Ibuhamil } from "@/app/api/kuesioner/ibuhamil";
import { JawabanKuesionerBySession } from "@/app/api/kuesioner/detail-kuesioner";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";


dayjs.extend(utc);
dayjs.extend(timezone);

interface IbuHamil {
  id: string;
  nama_lengkap: string;
}

interface JawabanKuesioner {
  id: string;
  tanggal_pengisian: string;
  status: string;
  kuisioner: { nama_kuisioner: string; deskripsi: string };
  jawaban: {
    id: string;
    jawaban_value: string;
    pertanyaan: { pertanyaan_text: string };
  }[];
}

export default function DetailJawaban() {
  const [daftarIbu, setDaftarIbu] = useState<IbuHamil[]>([]);
  const [selectedIbu, setSelectedIbu] = useState<IbuHamil | null>(null);
  const [riwayatJawaban, setRiwayatJawaban] = useState<JawabanKuesioner[]>([]);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchIbuHamil = async () => {
      try {
        const result = await Ibuhamil();
        if (result.successCode === 200 && result.data) {
          const mapped = result.data.data.map((ibu: any) => ({
            id: ibu.id,
            nama_lengkap: ibu.nama_ibu,
          }));
          setDaftarIbu(mapped);
        }
      } catch (error) {
        console.error("Gagal memuat data ibu hamil:", error);
      }
    };
    fetchIbuHamil();
  }, []);

  useEffect(() => {
    const fetchJawaban = async () => {
      if (!selectedIbu) return;
      setLoading(true);
      try {
        const result = await JawabanKuesionerBySession(selectedIbu.id);
        if (result.successCode === 200 && result.data) {
          setRiwayatJawaban(result.data);
        } else {
          setRiwayatJawaban([]);
        }
      } catch (error) {
        console.error("Gagal memuat jawaban:", error);
        setRiwayatJawaban([]);
      } finally {
        setLoading(false);
      }
    };
    fetchJawaban();
  }, [selectedIbu]);

  const formatTanggal = (tanggal: string) => {
    const t = dayjs(tanggal);
    if (!t.isValid()) return "-";
    return dayjs.utc(tanggal).tz("Asia/Jakarta").format("DD-MM-YYYY");
  };



  return (
    <div className="p-4">
      <Card title="Detail Jawaban Kuisioner" className="shadow-md rounded-2xl p-4">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center mb-4">
          <span className="font-medium w-auto sm:w-32">Pilih Ibu Hamil</span>
          <div className="w-full sm:w-auto">
            <Dropdown
              value={selectedIbu}
              onChange={(e) => setSelectedIbu(e.value)}
              options={daftarIbu}
              optionLabel="nama_lengkap"
              placeholder="Pilih ibu hamil"
              className="w-full"
            />
          </div>
        </div>

        {loading && (
          <div className="flex justify-center py-4">
            <ProgressSpinner style={{ width: "40px", height: "40px" }} className="w-10 h-10" />
          </div>
        )}

        {!loading && riwayatJawaban.length > 0 && (
          <div className="space-y-4">
            {riwayatJawaban.map((riwayat, index) => (
              <Card key={riwayat.id} className="shadow-sm border border-gray-200 rounded-xl">
                <div
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center cursor-pointer gap-2"
                  onClick={() =>
                    setExpandedIndex(expandedIndex === index ? null : index)
                  }
                >
                  <div className="w-full sm:w-auto">
                    <p className="font-semibold text-lg">
                      Kuesioner EPDS
                    </p>
                    <p className="text-gray-800 text-sm">
                      Tanggal : {formatTanggal(riwayat.tanggal_pengisian)}
                    </p>
                  </div>
                  <Button
                    icon={
                      expandedIndex === index
                        ? "pi pi-chevron-up"
                        : "pi pi-chevron-down"
                    }
                    className="p-button-text w-full sm:w-auto"
                  />
                </div>

                {expandedIndex === index && (
                  <div className="mt-3 border-t border-gray-200 pt-3 space-y-3">
                    {riwayat.jawaban.map((item, i) => (
                      <div
                        key={item.id}
                        className="p-3 bg-gray-50 rounded-md border border-gray-100 break-words"
                      >
                        <p className="font-medium text-gray-800">
                          {i + 1}. {item.pertanyaan.pertanyaan_text}
                        </p>
                        <p className="text-sm text-blue-700 mt-1">
                          Jawaban:{" "}
                          <span className="font-semibold">
                            {item.jawaban_value}
                          </span>
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        {!loading && selectedIbu && riwayatJawaban.length === 0 && (
          <p className="text-center text-gray-500 py-4">
            Belum ada jawaban kuisioner untuk ibu ini.
          </p>
        )}
      </Card>
    </div>
  );
}
