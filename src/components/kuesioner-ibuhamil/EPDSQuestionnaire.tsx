"use client";

import React, { useEffect, useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { RadioButton } from "primereact/radiobutton";
import { PregnantWoman } from "./types";
import { Ibuhamil } from "@/app/api/kuesioner/ibuhamil";
import { Listkuesioner } from "@/app/api/kuesioner/listkuesioner";
import { KuisionerList } from "@/types/data-25/KuisionerList";

const EPDSQuestionnaire: React.FC = () => {
  const [selectedPregnantWoman, setSelectedPregnantWoman] = useState<PregnantWoman | null>(null);
  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  const [dataIbu, setDataIbu] = useState<PregnantWoman[]>([]);
  const [loading, setLoading] = useState(true);
  const [kuisionerData, setKuisionerData] = useState<KuisionerList | null>(null);

  // Ambil data Ibu Hamil
  useEffect(() => {
    const fetchIbuHamil = async () => {
      const result = await Ibuhamil();

      if (result.successCode === 200 && result.data) {
        const formattedData = result.data.data.map((item: any) => ({
          id: item.id,
          name: item.nama_ibu,
          age: parseInt(item.usia_ibu),
          trimester: item.usia_kehamilan,
        }));

        setDataIbu(formattedData);
      }

      setLoading(false);
    };

    fetchIbuHamil();
  }, []);

  // Ambil daftar pertanyaan kuisioner
  useEffect(() => {
    const fetchKuisioner = async () => {
      const res = await Listkuesioner();
      if (res.successCode === 200 && res.data && res.data.length > 0) {
        setKuisionerData(res.data[0]);
      }
    };
    fetchKuisioner();
  }, []);

  const handleAnswerChange = (questionId: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = () => {
    // pastikan hasil reduce selalu number
    const totalScore = Object.values(answers).reduce<number>(
      (sum, value) => sum + (value ?? 0),
      0
    );

    // Ambil kader_id dari localStorage
    const currentUser = localStorage.getItem('current_user');
    const kaderData = currentUser ? JSON.parse(currentUser) : null;
    const kader_id = kaderData?.id || null;

    // Ambil ID Ibu Hamil yang dipilih
    const ibu_hamil_id = selectedPregnantWoman?.id || null;

    // Ambil ID Kuisioner aktif
    const kuisioner_id = kuisionerData?.id || null;

    // Buat array jawaban
    const jawaban = questions.map((q) => {
      const selectedOptionId = answers[q.id]; // ambil pilihan user, misalnya 1
      const selectedOption = q.pilihan_opsional.find(opt => opt.id === selectedOptionId);

      return {
        pertanyaan_id: q.id,
        jawaban_text: selectedOption ? selectedOption.text : "", // ambil teks, bukan skor
      };
    });


    // Susun payload untuk log
    const payload = {
      kader_id,
      ibu_hamil_id,
      kuisioner_id,
      jawaban,
    };

    // Tampilkan log data final (untuk debugging)
    console.log("📦 Data Log Siap Dikirim:", payload);

    alert(
      `EPDS Questionnaire submitted!\nTotal Score: ${totalScore}\n\n Data Berhasil Disimpan`
    );
  };


  // Simpan otomatis ke sessionStorage setiap kali data berubah
  useEffect(() => {
    if (!selectedPregnantWoman || !kuisionerData) return;

    const currentUser = localStorage.getItem("current_user");
    const kaderData = currentUser ? JSON.parse(currentUser) : null;
    const kader_id = kaderData?.id || null;
    const ibu_hamil_id = selectedPregnantWoman.id;
    const kuisioner_id = kuisionerData.id;

    const jawaban = kuisionerData.pertanyaan.map((q) => {
      const selectedOptionScore = answers[q.id]; // nilai dari radio
      const selectedOption = q.pilihan_opsional.find(
        (opt) => opt.score === selectedOptionScore
      );

      return {
        pertanyaan_id: q.id,
        jawaban_text: selectedOption ? selectedOption.text : "",
      };
    });

    const payload = {
      kader_id,
      ibu_hamil_id,
      kuisioner_id,
      jawaban,
    };

    // simpan di session storage
    sessionStorage.setItem("epds_progress", JSON.stringify(payload));

  }, [selectedPregnantWoman, answers, kuisionerData]);


  useEffect(() => {
    const saved = sessionStorage.getItem("epds_progress");
    if (saved) {
      const parsed = JSON.parse(saved);
      setSelectedPregnantWoman(
        dataIbu.find((ibu) => ibu.id === parsed.ibu_hamil_id) || null
      );
      setAnswers(() => {
        const restored: Record<string, number | null> = {};
        parsed.jawaban.forEach((j: any) => {
          const question = kuisionerData?.pertanyaan.find(
            (q) => q.id === j.pertanyaan_id
          );
          const selectedOption = question?.pilihan_opsional.find(
            (opt) => opt.text === j.jawaban_text
          );
          restored[j.pertanyaan_id] = selectedOption?.score ?? null;
        });
        return restored;
      });
    }
  }, [dataIbu, kuisionerData]);


  const questions = kuisionerData?.pertanyaan || [];
  const isFormComplete =
    selectedPregnantWoman !== null && questions.every((q) => answers[q.id] !== null && answers[q.id] !== undefined);

  if (loading) return <p>⏳ Sedang memuat data Ibu Hamil...</p>;
  if (!kuisionerData) return <p>📭 Tidak ada data kuisioner ditemukan.</p>;

  return (
    <div className="container mx-auto px-1 py-2">
      <Card title={kuisionerData.nama_kuisioner}>
        <div className="mb-6">
          <p className="text-gray-600">{kuisionerData.deskripsi}</p>
        </div>

        {/* Dropdown Ibu Hamil */}
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

        {/* Pertanyaan */}
        {selectedPregnantWoman && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Pertanyaan Kuisioner</h2>
              <span className="text-sm text-gray-500">{questions.length} pertanyaan</span>
            </div>

            <div className="space-y-6">
              {questions
                .sort((a, b) => a.urutan - b.urutan)
                .map((question, index) => (
                  <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="mb-3">
                      <span className="font-medium text-gray-700 bg-blue-100 rounded-full px-3 py-1 inline-block">
                        Pertanyaan {index + 1}
                      </span>
                      <p className="mt-2 text-gray-700">{question.pertanyaan_text}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      {question.pilihan_opsional.map((option) => (
                        <div key={option.id} className="flex align-items-center">
                          <RadioButton
                            inputId={`q${question.id}-option${option.id}`}
                            name={`question-${question.id}`}
                            value={option.score}
                            onChange={(e) => handleAnswerChange(question.id, e.value)}
                            checked={answers[question.id] === option.score}
                          />
                          <label htmlFor={`q${question.id}-option${option.id}`} className="ml-2 text-sm text-gray-700">
                            <div className="font-medium">{option.text}</div>
                            <div className="text-xs text-gray-500">Skor: {option.score}</div>
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
                  Jumlah jawaban terisi: {Object.values(answers).filter((v) => v !== null).length} dari{" "}
                  {questions.length} pertanyaan
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
