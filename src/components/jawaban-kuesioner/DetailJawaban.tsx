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
import { Skorkuesioner } from "@/app/api/kuesioner/skorkuesioner";
import { data } from "@/types/data-25/kaderData";


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
  kuisioner: {
    id: string;
    nama_kuisioner: string;
    deskripsi: string
  };
  jawaban: {
    id: string;
    jawaban_value: string;
    pertanyaan: {
      id: string;
      pertanyaan_text: string
    };
  }[];
}

export default function DetailJawaban() {
  const [daftarIbu, setDaftarIbu] = useState<IbuHamil[]>([]);
  const [selectedIbu, setSelectedIbu] = useState<IbuHamil | null>(null);
  const [riwayatJawaban, setRiwayatJawaban] = useState<JawabanKuesioner[]>([]);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [totalScore, setTotalScore] = useState<number | null>(null);
  const [individualScores, setIndividualScores] = useState<Record<string, number>>({});




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

  async function fetchScore(ibuId: string) {
    const result = await Skorkuesioner(ibuId);

    if (result.successCode === 200 && result.data) {
      setTotalScore(result.data.total_score);
    } else {
      console.log('Failed to fetch score');
    }
  }

  // Function to fetch individual score for a specific questionnaire session
  async function fetchIndividualScore(sessionId: string) {
    try {
      // The skorkuesioner API likely uses the session ID to get the score for that specific session
      const result = await Skorkuesioner(sessionId);

      if (result.successCode === 200 && result.data) {
        setIndividualScores(prev => ({
          ...prev,
          [sessionId]: result.data?.total_score ?? 0
        }));
      }
    } catch (error) {
      console.error(`Failed to fetch score for session ${sessionId}:`, error);
    }
  }

  useEffect(() => {
    const fetchJawaban = async () => {
      if (!selectedIbu) return; // Skip if no ibu is selected
      setLoading(true);
      try {
        const result = await JawabanKuesionerBySession(selectedIbu.id);
        if (result.successCode === 200 && result.data) {
          setRiwayatJawaban(result.data);
          console.log("Riwayat Jawaban:", result.data);

          // Fetch the total score for the selected user
          await fetchScore(selectedIbu.id);

          // Fetch individual scores for each questionnaire session
          setIndividualScores({}); // Reset previous scores
          for (const jawaban of result.data) {
            await fetchIndividualScore(jawaban.id);
          }
        } else {
          setRiwayatJawaban([]);
          setTotalScore(null);
          setIndividualScores({});
        }
      } catch (error) {
        console.error("Gagal memuat jawaban:", error);
        setRiwayatJawaban([]);
        setTotalScore(null);
        setIndividualScores({});
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

        {/* Total Score Display */}
        {totalScore !== null && selectedIbu && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <h3 className="font-semibold text-lg text-blue-800">Total Skor Kuesioner</h3>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-blue-700">{totalScore}</span>
                <span className="text-sm text-gray-600">poin</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Skor total untuk {selectedIbu?.nama_lengkap}
            </p>
          </div>
        )}

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
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="font-semibold text-lg">
                        {riwayat.kuisioner?.nama_kuisioner || 'Kuesioner EPDS'}
                      </p>
                      {/* Display score for this specific questionnaire if available */}
                      {individualScores[riwayat.id] !== undefined && (
                        <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                          Skor: {individualScores[riwayat.id]}
                        </div>
                      )}
                    </div>
                    <p className="text-gray-800 text-sm">
                      Tanggal : {formatTanggal(riwayat.tanggal_pengisian)}
                    </p>
                    {riwayat.status && (
                      <p className="text-sm font-medium mt-1">
                        Status: <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">{riwayat.status}</span>
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Button
                      icon={
                        expandedIndex === index
                          ? "pi pi-chevron-up"
                          : "pi pi-chevron-down"
                      }
                      className="p-button-text w-full sm:w-auto"
                    />
                  </div>
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
