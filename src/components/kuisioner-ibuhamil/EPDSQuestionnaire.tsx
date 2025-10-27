"use client";

import React, { useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { RadioButton } from "primereact/radiobutton";
import { PregnantWoman, Question, ResponseOption } from "./types";

const EPDSQuestionnaire: React.FC = () => {
  // Options for pregnant women dropdown
  const pregnantWomenOptions: PregnantWoman[] = [
    { id: "1", name: "Ibu Siti", age: 28, trimester: "Trimester 2" },
    { id: "2", name: "Ibu Ani", age: 32, trimester: "Trimester 3" },
    { id: "3", name: "Ibu Rina", age: 25, trimester: "Trimester 1" },
    { id: "4", name: "Ibu Maya", age: 30, trimester: "Trimester 2" },
    { id: "5", name: "Ibu Dina", age: 27, trimester: "Trimester 3" },
  ];

  // Questions for the EPDS questionnaire
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

  // Options for responses
  const responseOptions: ResponseOption[] = [
    { value: 0, label: "0 - Tidak pernah sama sekali", description: "Tidak pernah" },
    { value: 1, label: "1 - Jarang", description: "Kadang-kadang" },
    { value: 2, label: "2 - Kadang-kadang", description: "Sering" },
    { value: 3, label: "3 - Cukup sering", description: "Sangat sering" },
  ];

  const [selectedPregnantWoman, setSelectedPregnantWoman] = useState<PregnantWoman | null>(null);
  const [answers, setAnswers] = useState<Record<number, number | null>>({});

  const handleAnswerChange = (questionId: number, value: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = () => {
    // Hitung total skor
    const totalScore = Object.values(answers).reduce((sum: number, value) => {
      return sum + (value ?? 0); // Gunakan nullish coalescing agar aman
    }, 0);

    console.log("Selected pregnant woman:", selectedPregnantWoman);
    console.log("Answers:", answers);
    console.log("Total EPDS Score:", totalScore);

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

  const isFormComplete = selectedPregnantWoman !== null &&
    questions.every(q => answers[q.id] !== null);

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
              options={pregnantWomenOptions}
              onChange={(e) => setSelectedPregnantWoman(e.value)}
              optionLabel="name"
              placeholder="Pilih ibu hamil"
              className="w-full"
            />
          </div>

          {selectedPregnantWoman && (
            <div className="mt-3 p-3 bg-blue-50 rounded-md border border-blue-100">
              <p className="text-sm text-gray-700">
                <span className="font-medium">Nama:</span> {selectedPregnantWoman.name} |
                <span className="font-medium"> Umur:</span> {selectedPregnantWoman.age} tahun |
                <span className="font-medium"> Trimester:</span> {selectedPregnantWoman.trimester}
              </p>
            </div>
          )}
        </div>

        {selectedPregnantWoman && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Pertanyaan EPDS</h2>
              <span className="text-sm text-gray-500">
                {questions.length} pertanyaan
              </span>
            </div>

            <div className="space-y-6">
              {questions.map((question) => (
                <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="mb-3">
                    <span className="font-medium text-gray-700 bg-blue-100 text rounded-full px-3 py-1 inline-block">
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
                        <label
                          htmlFor={`q${question.id}-option${option.value}`}
                          className="ml-2 text-sm text-gray-700"
                        >
                          <div className="font-medium">{option.label.split(" - ")[0]}</div>
                          <div className="text-xs text-gray-500">{option.description}</div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedPregnantWoman && (
          <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              <p>Jumlah jawaban terisi: {Object.values(answers).filter(value => value !== null).length} dari {questions.length} pertanyaan</p>
            </div>
            <Button
              label="Simpan Jawaban"
              icon="pi pi-check"
              disabled={!isFormComplete}
              onClick={handleSubmit}
              className={`${isFormComplete
                ? "p-button-success"
                : "p-button-secondary p-button-outlined"
                }`}
            />
          </div>
        )}

        {!selectedPregnantWoman && (
          <div className="text-center py-12 text-gray-500">
            <div className="mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <p className="text-lg">Silakan pilih ibu hamil terlebih dahulu</p>
            <p className="text-sm mt-2">untuk melanjutkan pengisian kuisioner</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default EPDSQuestionnaire;