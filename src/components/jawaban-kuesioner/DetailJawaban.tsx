"use client";

import React, { useState, useEffect } from "react";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { PregnantWoman } from "./types";
import { Ibuhamil } from "@/app/api/kuesioner/ibuhamil";
import { JawabanKuesionerBySession, JawabanKuesionerResponse } from "@/app/api/kuesioner/detail-kuesioner";
import { KuisionerList } from "@/types/data-25/KuisionerList";

// Tipe data untuk jawaban kuesioner
interface Jawaban {
  pertanyaan_id: string;
  jawaban_value: string;
}

// Tipe data untuk riwayat kuesioner
interface RiwayatKuesioner {
  id: string;
  tanggal_pengisian: string;
  kuisioner_id: string;
  jawaban: Jawaban[];
}

// Tipe data untuk detail kuesioner
interface DetailKuisioner {
  id: string;
  pertanyaan_text: string;
}

// Data dummy untuk detail kuisioner
const dummyKuisioner: DetailKuisioner[] = [
  { id: "1", pertanyaan_text: "Saya merasa cemas atau gelisah" },
  { id: "2", pertanyaan_text: "Saya merasa sedih atau ingin menangis" },
  { id: "3", pertanyaan_text: "Saya merasa kesulitan tidur" },
  { id: "4", pertanyaan_text: "Saya merasa kehilangan minat pada hal-hal yang biasanya menyenangkan" },
  { id: "5", pertanyaan_text: "Saya merasa cemas tentang masa depan bayi saya" }
];

const DetailJawaban = () => {

  const [dataIbu, setDataIbu] = useState<PregnantWoman[]>([]);
  const [selectedIbu, setSelectedIbu] = useState<PregnantWoman | null>(null);
  const [jawabanData, setJawabanData] = useState<JawabanKuesionerResponse[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedPregnantWoman, setSelectedPregnantWoman] = useState<PregnantWoman | null>(null);
  // const [selectedIbu, setSelectedIbu] = useState<PregnantWoman | null>(null);
  const [riwayatKuesioner, setRiwayatKuesioner] = useState<RiwayatKuesioner[]>([]);
  const [expandedRiwayat, setExpandedRiwayat] = useState<{ [key: string]: boolean }>({});

  const [data, setData] = useState<KuisionerList | null>(null);

  useEffect(() => {
    const fetchIbuHamil = async () => {
      setLoading(true);
      try {
        console.log("📡 Memulai fetch data ibu hamil...");
        const result = await Ibuhamil();

        if (result.successCode === 200 && result.data?.data) {
          const formattedData = result.data.data.map((item: any) => ({
            id: item.id,
            name: item.nama_ibu ?? "Tanpa Nama",
            age: parseInt(item.usia_ibu) || 0,
            trimester: item.usia_kehamilan ?? "Tidak diketahui",
          }));

          console.log("✅ Data ibu hamil:", formattedData);
          setDataIbu(formattedData);
        } else {
          console.warn("⚠️ Gagal memuat data ibu hamil, menggunakan dummy.");
          setDataIbu([
            { id: "1", name: "Siti Aminah", age: 25, trimester: "Trimester 2" },
          ]);
        }
      } catch (error) {
        console.error("❌ Error fetching ibu hamil:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIbuHamil();
  }, []);

  // ✅ Simpan ID ibu hamil ke sessionStorage setiap kali dipilih
  const handleSelectIbu = (e: any) => {
    const selected = e.value;
    setSelectedIbu(selected);
    console.log("👩‍🍼 Ibu hamil dipilih:", selected);

    if (selected?.id) {
      sessionStorage.setItem("ibu_hamil_id_jawaban", selected.id);
      console.log("💾 ID ibu disimpan ke sessionStorage:", selected.id);
    }
  };

  // ✅ Setiap kali ibu berubah → panggil JawabanKuesionerBySession()
  useEffect(() => {
    const fetchJawabanKuesioner = async () => {
      if (!selectedIbu) return;

      console.log("🚀 Fetch Jawaban Kuesioner untuk ibu:", selectedIbu.name);

      setLoading(true);
      try {
        const result = await JawabanKuesionerBySession();

        if (result.successCode === 200 && result.data) {
          console.log("✅ Data Kuisioner by Session:", result.data);
          setJawabanData(result.data);
        } else {
          console.warn("⚠️ Data kuisioner kosong atau gagal diambil.");
          setJawabanData(null);
        }
      } catch (error) {
        console.error("❌ Error fetching kuisioner:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJawabanKuesioner();
  }, [selectedIbu]); // ← efek jalan setiap kali ibu berubah


  // Jika ibu dipilih, ambil data riwayat kuesionernya
  useEffect(() => {
    if (selectedIbu) {
      // Gunakan data dummy untuk riwayat kuesioner
      const dummyRiwayat: RiwayatKuesioner[] = [
        {
          id: "1",
          tanggal_pengisian: "2025-11-01",
          kuisioner_id: "1",
          jawaban: [
            { pertanyaan_id: "1", jawaban_value: "Sangat sering" },
            { pertanyaan_id: "2", jawaban_value: "Kadang-kadang" },
            { pertanyaan_id: "3", jawaban_value: "Hampir setiap hari" },
            { pertanyaan_id: "4", jawaban_value: "Jarang" },
            { pertanyaan_id: "5", jawaban_value: "Sering" }
          ]
        },
        {
          id: "2",
          tanggal_pengisian: "2025-10-15",
          kuisioner_id: "1",
          jawaban: [
            { pertanyaan_id: "1", jawaban_value: "Jarang" },
            { pertanyaan_id: "2", jawaban_value: "Sangat sering" },
            { pertanyaan_id: "3", jawaban_value: "Kadang-kadang" },
            { pertanyaan_id: "4", jawaban_value: "Sering" },
            { pertanyaan_id: "5", jawaban_value: "Hampir setiap hari" }
          ]
        },
        {
          id: "3",
          tanggal_pengisian: "2025-09-20",
          kuisioner_id: "1",
          jawaban: [
            { pertanyaan_id: "1", jawaban_value: "Hampir setiap hari" },
            { pertanyaan_id: "2", jawaban_value: "Hampir setiap hari" },
            { pertanyaan_id: "3", jawaban_value: "Sangat sering" },
            { pertanyaan_id: "4", jawaban_value: "Hampir setiap hari" },
            { pertanyaan_id: "5", jawaban_value: "Sering" }
          ]
        }
      ];

      setRiwayatKuesioner(dummyRiwayat);

      // Set semua riwayat awalnya tertutup
      const initialExpandedState: { [key: string]: boolean } = {};
      dummyRiwayat.forEach(riwayat => {
        initialExpandedState[riwayat.id] = false;
      });
      setExpandedRiwayat(initialExpandedState);
    } else {
      setRiwayatKuesioner([]);
      setExpandedRiwayat({});
    }
  }, [selectedIbu]);


  const toggleRiwayat = (id: string) => {
    setExpandedRiwayat(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <Card className="container mx-auto px-1 py-2">

      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Riwayat Jawaban Kuesioner</h2>
      </div>

      <div className="mb-6">
        <label htmlFor="pregnant-woman" className="block text-sm font-medium text-gray-700 mb-2">
          Pilih Ibu Hamil
        </label>
        <div className="max-w-md">
          <Dropdown
            value={selectedIbu}
            options={dataIbu}
            onChange={handleSelectIbu}
            optionLabel="name"
            placeholder="Pilih Ibu Hamil"
          />

        </div>
      </div>

      {selectedIbu && (
        <div className="space-y-4">
          {riwayatKuesioner.length > 0 ? (
            riwayatKuesioner.map((riwayat) => (
              <div
                key={riwayat.id}
                className={`cursor-pointer transition-all duration-300 rounded-xl border ${expandedRiwayat[riwayat.id] ? 'border-blue-300 bg-blue-50 shadow-md' : 'border-gray-200 bg-white shadow-sm'} hover:shadow-md`}
                onClick={() => toggleRiwayat(riwayat.id)}
              >
                <div className="p-5">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <i className={`pi ${expandedRiwayat[riwayat.id] ? 'pi-chevron-up' : 'pi-chevron-down'} mr-3 text-gray-500`}></i>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">Tanggal Pengisian: {riwayat.tanggal_pengisian}</h3>
                        <p className="text-sm text-gray-500 mt-1">Klik untuk {expandedRiwayat[riwayat.id] ? 'menutup' : 'melihat'} detail</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${expandedRiwayat[riwayat.id] ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                      {expandedRiwayat[riwayat.id] ? 'Terbuka' : 'Tertutup'}
                    </span>
                  </div>

                  {expandedRiwayat[riwayat.id] && (
                    <div className="mt-5 pt-5 border-t border-gray-200">
                      <h4 className="text-md font-semibold text-gray-700 mb-4">Detail Jawaban:</h4>
                      <div className="space-y-4">
                        {dummyKuisioner.map((pertanyaan) => {
                          const jawabanItem = riwayat.jawaban.find(j => j.pertanyaan_id === pertanyaan.id);
                          return (
                            <div key={`${riwayat.id}-${pertanyaan.id}`} className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
                              <div className="mb-2">
                                <p className="text-gray-700 font-medium">{pertanyaan.pertanyaan_text}</p>
                              </div>
                              <div className="bg-gray-50 p-3 rounded-md">
                                <p className="text-gray-800"><span className="font-medium">Jawaban:</span> {jawabanItem?.jawaban_value || "-"}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>Tidak ada riwayat kuesioner untuk ibu ini</p>
            </div>
          )}
        </div>
      )}

      {!selectedIbu && (
        <div className="text-center py-8 text-gray-500">
          <p>Silakan pilih ibu hamil terlebih dahulu</p>
        </div>
      )}
    </Card>
  );
};

export default DetailJawaban;