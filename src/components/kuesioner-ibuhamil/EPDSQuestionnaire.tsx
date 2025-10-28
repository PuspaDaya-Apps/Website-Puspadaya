"use client";

import React, { useEffect, useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { RadioButton } from "primereact/radiobutton";
import { PregnantWoman, Question, ResponseOption } from "./types";
import { IbuHamilResponse } from "@/types/data-25/IbuHamilResponse";
import { Ibuhamil } from "@/app/api/kuesioner/ibuhamil";

const EPDSQuestionnaire: React.FC = () => {
  const [selectedPregnantWoman, setSelectedPregnantWoman] = useState<PregnantWoman | null>(null);
  const [answers, setAnswers] = useState<Record<number, number | null>>({});
  const [dataIbu, setDataIbu] = useState<PregnantWoman[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data dari API
  useEffect(() => {
    const fetchData = async () => {
      const result = await Ibuhamil();

      if (result.successCode === 200 && result.data) {
        // Konversi format API ke format PregnantWoman
        const formattedData = result.data.data.map((item) => ({
          id: item.id,
          name: item.nama_ibu,
          age: parseInt(item.usia_ibu), // misalnya "31 tahun 5 bulan" → 31
          trimester: item.usia_kehamilan, // gunakan usia_kehamilan untuk tampilkan info
        }));

        setDataIbu(formattedData);
        console.log("✅ Data Ibu Hamil dari API:", formattedData);
      } else {
        console.error("❌ Gagal memuat data Ibu Hamil");
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  // Pertanyaan EPDS
  const questions: Question[] = [
    { id: 1, text: "Saya telah merasa cemas, gelisah, atau kesulitan untuk rileks" },
    { id: 2, text: "Saya telah merasa depresi atau murung" },
    { id: 3, text: "Saya telah merasa takut atau panik tanpa alasan yang jelas" },
    { id: 4, text: "Saya telah merasa tidak mampu menikmati apapun, bahkan hal-hal yang biasanya menyenangkan" },
    { id: 5, text: "Saya telah merasa tidak mampu menjalani hubungan dengan suami/pasangan, anak-anak, orang tua, atau keluarga" },
    { id: 6, text: "Saya telah merasa gelisah atau tidak mampu tetap tenang" },
    { id: 7, text: "Saya telah merasa sangat marah atau jengkel" },
    { id: 8, text: "Saya telah merasa tidak berguna sebagai ibu" },
    { id: 9, text: "Saya telah merasa takut bahwa sesuatu yang buruk akan terjadi pada bayi saya" },
    { id: 10, text: "Saya telah merasa sangat sedih atau ingin menangis" },
  ];

  // Opsi jawaban
  const responseOptions: ResponseOption[] = [
    { value: 0, label: "0 - Tidak pernah sama sekali", description: "Tidak pernah" },
    { value: 1, label: "1 - Jarang", description: "Kadang-kadang" },
    { value: 2, label: "2 - Kadang-kadang", description: "Sering" },
    { value: 3, label: "3 - Cukup sering", description: "Sangat sering" },
  ];

  const handleAnswerChange = (questionId: number, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = () => {
    const totalScore = Object.values(answers).reduce((sum: number, value) => sum + (value ?? 0), 0);
    console.log("🧍‍♀️ Selected Ibu Hamil:", selectedPregnantWoman);
    console.log("📋 Answers:", answers);
    console.log("🧮 Total EPDS Score:", totalScore);
    alert(
      `EPDS Questionnaire submitted!\nTotal Score: ${totalScore}\n\nInterpretation: ${getScoreInterpretation(
        totalScore
      )}`
    );
  };

  const getScoreInterpretation = (score: number): string => {
    if (score >= 13) return "Skor tinggi - Risiko depresi postnatal tinggi, disarankan konsultasi dokter";
    if (score >= 10) return "Skor sedang - Ada kemungkinan depresi, disarankan konsultasi";
    return "Skor rendah - Tidak ada indikasi depresi";
  };

  const isFormComplete = selectedPregnantWoman !== null && questions.every((q) => answers[q.id] !== null);

  if (loading) return <p>⏳ Sedang memuat data Ibu Hamil...</p>;

  return (
    <div className="container mx-auto px-1 py-2">
      <Card title="Kuisioner EPDS (Edinburgh Postnatal Depression Scale)">
        <div className="mb-6">
          <p className="text-gray-600">Silakan pilih ibu hamil dan jawab pertanyaan-pertanyaan berikut</p>
        </div>

        <div className="mb-6">
          <label htmlFor="pregnant-woman" className="block text-sm font-medium text-gray-700 mb-2">
            Pilih Ibu Hamil
          </label>
          <div className="max-w-md">
            <Dropdown
              id="pregnant-woman"
              value={selectedPregnantWoman}
              options={dataIbu}
              onChange={(e) => setSelectedPregnantWoman(e.value)}
              optionLabel="name"
              placeholder="Pilih ibu hamil"
              className="w-full"
              filter
            />
          </div>

          {selectedPregnantWoman && (
            <div className="mt-3 p-3 bg-blue-50 rounded-md border border-blue-100">
              <p className="text-sm text-gray-700">
                <span className="font-medium">Nama:</span> {selectedPregnantWoman.name} |
                <span className="font-medium"> Usia:</span> {selectedPregnantWoman.age ?? "-"} tahun |
                <span className="font-medium"> Kehamilan:</span> {selectedPregnantWoman.trimester}
              </p>
            </div>
          )}
        </div>

        {/* Pertanyaan muncul setelah ibu dipilih */}
        {selectedPregnantWoman && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Pertanyaan EPDS</h2>
              <span className="text-sm text-gray-500">{questions.length} pertanyaan</span>
            </div>

            <div className="space-y-6">
              {questions.map((question) => (
                <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="mb-3">
                    <span className="font-medium text-gray-700 bg-blue-100 rounded-full px-3 py-1 inline-block">
                      Pertanyaan {question.id}
                    </span>
                    <p className="mt-2 text-gray-700">{question.text}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {responseOptions.map((option) => (
                      <div key={option.value} className="flex align-items-center">
                        <RadioButton
                          inputId={`q${question.id}-option${option.value}`}
                          name={`question-${question.id}`}
                          value={option.value}
                          onChange={(e) => handleAnswerChange(question.id, e.value)}
                          checked={answers[question.id] === option.value}
                        />
                        <label htmlFor={`q${question.id}-option${option.value}`} className="ml-2 text-sm text-gray-700">
                          <div className="font-medium">{option.label.split(" - ")[0]}</div>
                          <div className="text-xs text-gray-500">{option.description}</div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                <p>
                  Jumlah jawaban terisi: {Object.values(answers).filter((v) => v !== null).length} dari {questions.length} pertanyaan
                </p>
              </div>
              <Button
                label="Simpan Jawaban"
                icon="pi pi-check"
                disabled={!isFormComplete}
                onClick={handleSubmit}
                className={isFormComplete ? "p-button-success" : "p-button-secondary p-button-outlined"}
              />
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default EPDSQuestionnaire;
