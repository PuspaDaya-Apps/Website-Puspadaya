import React from "react";

// Dummy data
const raportBalita = {
  identitasBalita: {
    noKK: "3510123456789001",
    nik: "3510123456789002",
    nama: "Aisyah Putri",
    tanggalLahir: "2021-06-15",
    tempatLahir: "Banyuwangi",
    jenisKelamin: "Perempuan",
    anakKe: 2,
    caraLahir: "Normal",
  },
  dataAyah: {
    nik: "3510123456789003",
    nama: "Budi Santoso",
    tanggalLahir: "1990-04-12",
    tempatLahir: "Banyuwangi",
    jenisKelamin: "Laki-laki",
    alamat: "Dusun Krajan, Rogojampi, Banyuwangi",
  },
  dataIbu: {
    nik: "3510123456789004",
    nama: "Siti Aminah",
    tanggalLahir: "1993-08-22",
    tempatLahir: "Banyuwangi",
    jenisKelamin: "Perempuan",
    alamat: "Dusun Krajan, Rogojampi, Banyuwangi",
  },
  pengukuranBalita: [
    {
      tanggal: "2025-08-10",
      tempat: "Posyandu Melati",
      posisi: "Berdiri",
      tinggi: 95,
      berat: 14,
      lila: 15,
      lingkarKepala: 47,
      asiEksklusif: "Ya",
      mpasi: "Ya",
      stunting: "Tidak",
      underweight: "Tidak",
      wasting: "Tidak",
    },
  ],
  pengukuranIbuHamil: [
    {
      tanggal: "2025-08-10",
      tempat: "Posyandu Melati",
      usiaKehamilan: 32,
      tinggi: 155,
      berat: 55,
      lila: 23,
      tinggiFundus: 28,
      hemoglobin: 12.5,
      tglHaid: "2025-01-05",
      asapRokok: "Tidak",
      tabletFe: "Ya",
    },
  ],
};

interface Props {
  data: typeof raportBalita;
}

const RaportBalita: React.FC<Props> = ({ data }) => {
  const { identitasBalita, dataAyah, dataIbu, pengukuranBalita, pengukuranIbuHamil } = data;

  return (
    <div className="space-y-6 p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold text-gray-800">Raport Balita</h1>

      {/* A. Identitas Balita */}
      <section>
        <h2 className="font-semibold text-lg mb-2">A. Identitas Balita</h2>
        <ul className="space-y-1 text-sm text-gray-700">
          <li>No KK: {identitasBalita.noKK}</li>
          <li>NIK Balita: {identitasBalita.nik}</li>
          <li>Nama Balita: {identitasBalita.nama}</li>
          <li>Tanggal Lahir: {identitasBalita.tanggalLahir}</li>
          <li>Tempat Lahir: {identitasBalita.tempatLahir}</li>
          <li>Jenis Kelamin: {identitasBalita.jenisKelamin}</li>
          <li>Anak Ke: {identitasBalita.anakKe}</li>
          <li>Cara Lahir: {identitasBalita.caraLahir}</li>
        </ul>
      </section>

      {/* B. Data Ayah */}
      <section>
        <h2 className="font-semibold text-lg mb-2">B. Data Ayah</h2>
        <ul className="space-y-1 text-sm text-gray-700">
          <li>NIK Ayah: {dataAyah.nik}</li>
          <li>Nama Ayah: {dataAyah.nama}</li>
          <li>Tanggal Lahir: {dataAyah.tanggalLahir}</li>
          <li>Tempat Lahir: {dataAyah.tempatLahir}</li>
          <li>Jenis Kelamin: {dataAyah.jenisKelamin}</li>
          <li>Alamat: {dataAyah.alamat}</li>
        </ul>
      </section>

      {/* C. Data Ibu */}
      <section>
        <h2 className="font-semibold text-lg mb-2">C. Data Ibu</h2>
        <ul className="space-y-1 text-sm text-gray-700">
          <li>NIK Ibu: {dataIbu.nik}</li>
          <li>Nama Ibu: {dataIbu.nama}</li>
          <li>Tanggal Lahir: {dataIbu.tanggalLahir}</li>
          <li>Tempat Lahir: {dataIbu.tempatLahir}</li>
          <li>Jenis Kelamin: {dataIbu.jenisKelamin}</li>
          <li>Alamat: {dataIbu.alamat}</li>
        </ul>
      </section>

      {/* D. Pengukuran Balita */}
      <section>
        <h2 className="font-semibold text-lg mb-2">D. Pengukuran Balita</h2>
        {pengukuranBalita.map((p, i) => (
          <div key={i} className="border rounded-lg p-3 mb-3 text-sm text-gray-700">
            <p>Tanggal: {p.tanggal}</p>
            <p>Tempat: {p.tempat}</p>
            <p>Posisi: {p.posisi}</p>
            <p>Tinggi Badan: {p.tinggi} cm</p>
            <p>Berat Badan: {p.berat} kg</p>
            <p>LILA: {p.lila} cm</p>
            <p>Lingkar Kepala: {p.lingkarKepala} cm</p>
            <p>ASI Eksklusif: {p.asiEksklusif}</p>
            <p>MPASI: {p.mpasi}</p>
            <p>Status Stunting: {p.stunting}</p>
            <p>Status Underweight: {p.underweight}</p>
            <p>Status Wasting: {p.wasting}</p>
          </div>
        ))}
      </section>

      {/* E. Pengukuran Ibu Hamil */}
      <section>
        <h2 className="font-semibold text-lg mb-2">E. Pengukuran Ibu Hamil</h2>
        {pengukuranIbuHamil.map((p, i) => (
          <div key={i} className="border rounded-lg p-3 mb-3 text-sm text-gray-700">
            <p>Tanggal: {p.tanggal}</p>
            <p>Tempat: {p.tempat}</p>
            <p>Usia Kehamilan: {p.usiaKehamilan} minggu</p>
            <p>Tinggi Badan Ibu: {p.tinggi} cm</p>
            <p>Berat Badan Ibu: {p.berat} kg</p>
            <p>LILA Ibu: {p.lila} cm</p>
            <p>Tinggi Fundus: {p.tinggiFundus} cm</p>
            <p>Hemoglobin: {p.hemoglobin} g/dl</p>
            <p>Tanggal Pertama Haid: {p.tglHaid}</p>
            <p>Terpapar Asap Rokok: {p.asapRokok}</p>
            <p>Tablet Fe: {p.tabletFe}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

// Example usage
export default function App() {
  return <RaportBalita data={raportBalita} />;
}
