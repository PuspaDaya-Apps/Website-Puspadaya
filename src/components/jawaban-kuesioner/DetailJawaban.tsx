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

// ✅ Aktifkan plugin timezone Day.js
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

  // 🔹 Ambil daftar ibu hamil
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

  // 🔹 Ambil jawaban kuisioner berdasarkan ibu yang dipilih
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
    return dayjs.utc(tanggal).tz("Asia/Jakarta").format("DD-MM-YYYY HH:mm") + " WIB";

  };


  return (
    <div className="p-4">
      <Card title="Detail Jawaban Kuisioner" className="shadow-md rounded-2xl p-4">
        <div className="flex gap-3 items-center mb-4">
          <span className="font-medium w-32">Pilih Ibu Hamil</span>
          <Dropdown
            value={selectedIbu}
            onChange={(e) => setSelectedIbu(e.value)}
            options={daftarIbu}
            optionLabel="nama_lengkap"
            placeholder="Pilih ibu hamil"
            className="w-full md:w-30rem"
          />
        </div>

        {loading && (
          <div className="flex justify-center py-4">
            <ProgressSpinner style={{ width: "40px", height: "40px" }} />
          </div>
        )}

        {!loading && riwayatJawaban.length > 0 && (
          <div className="space-y-4">
            {riwayatJawaban.map((riwayat, index) => (
              <Card key={riwayat.id} className="shadow-sm border border-gray-200 rounded-xl">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() =>
                    setExpandedIndex(expandedIndex === index ? null : index)
                  }
                >
                  <div>
                    <p className="font-semibold text-lg">
                      Kuesioner EPDS
                    </p>
                    <p className="text-gray-600 text-sm">
                      {formatTanggal(riwayat.tanggal_pengisian)}
                    </p>
                  </div>
                  <Button
                    icon={
                      expandedIndex === index
                        ? "pi pi-chevron-up"
                        : "pi pi-chevron-down"
                    }
                    className="p-button-text"
                  />
                </div>

                {expandedIndex === index && (
                  <div className="mt-3 border-t border-gray-200 pt-3 space-y-3">
                    {riwayat.jawaban.map((item, i) => (
                      <div
                        key={item.id}
                        className="p-3 bg-gray-50 rounded-md border border-gray-100"
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
