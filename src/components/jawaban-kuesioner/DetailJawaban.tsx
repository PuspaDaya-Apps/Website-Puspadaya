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
        // Silently handle error to prevent UI disruption
      }
    };
    fetchIbuHamil();
  }, []);

  async function fetchScore(ibuId: string) {
    const result = await Skorkuesioner(ibuId);

    if (result.successCode === 200 && result.data) {
      setTotalScore(result.data.total_score);
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
      // Silently handle error to prevent UI disruption
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
        // Silently handle error to prevent UI disruption
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
          <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg text-blue-800 flex items-center gap-2">
                  <i className="pi pi-chart-line mr-2"></i>Total Skor Kuesioner
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  untuk <span className="font-medium">{selectedIbu?.nama_lengkap}</span>
                </p>
              </div>
              <div className="mt-3 sm:mt-0 flex items-center">
                <div className="bg-white rounded-full shadow-sm p-3 border border-blue-200">
                  <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    {totalScore}
                  </span>
                  <span className="text-xs text-gray-500 ml-1">poin</span>
                </div>
              </div>
            </div>
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
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center cursor-pointer gap-3 p-3"
                  onClick={() =>
                    setExpandedIndex(expandedIndex === index ? null : index)
                  }
                >
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-lg text-gray-800">
                          {riwayat.kuisioner?.nama_kuisioner || 'Kuesioner EPDS'}
                        </p>
                        <p className="text-gray-600 text-sm mt-1 flex items-center gap-2">
                          <i className="pi pi-calendar text-gray-400"></i>
                          {formatTanggal(riwayat.tanggal_pengisian)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {individualScores[riwayat.id] !== undefined && (
                          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-lg shadow-sm flex items-center">
                            <i className="pi pi-star mr-2 text-xs"></i>
                            <span className="font-bold">{individualScores[riwayat.id]}</span>
                            <span className="text-xs ml-1">poin</span>
                          </div>
                        )}

                        {/* {riwayat.status && (
                          <span className={`px-3 py-1 rounded-full text-xs font-medium 
                            ${riwayat.status.toLowerCase() === 'selesai' || riwayat.status.toLowerCase() === 'completed' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'}`}>
                            {riwayat.status}
                          </span>
                        )} */}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <Button
                      icon={
                        expandedIndex === index
                          ? "pi pi-chevron-up"
                          : "pi pi-chevron-down"
                      }
                      className="p-button-text w-full sm:w-auto text-gray-500 hover:text-blue-600"
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
