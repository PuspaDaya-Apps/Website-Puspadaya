import React, { useState, useEffect } from "react";

// Dummy data untuk beberapa balita
const dummyBalitaData = [
  {
    id: 1,
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
  },
  {
    id: 2,
    identitasBalita: {
      noKK: "3510123456789011",
      nik: "3510123456789012",
      nama: "Muhammad Rizky",
      tanggalLahir: "2020-03-22",
      tempatLahir: "Banyuwangi",
      jenisKelamin: "Laki-laki",
      anakKe: 1,
      caraLahir: "Normal",
    },
    dataAyah: {
      nik: "3510123456789013",
      nama: "Ahmad Fauzi",
      tanggalLahir: "1988-07-15",
      tempatLahir: "Banyuwangi",
      jenisKelamin: "Laki-laki",
      alamat: "Dusun Krajan, Rogojampi, Banyuwangi",
    },
    dataIbu: {
      nik: "3510123456789014",
      nama: "Dewi Lestari",
      tanggalLahir: "1991-11-30",
      tempatLahir: "Banyuwangi",
      jenisKelamin: "Perempuan",
      alamat: "Dusun Krajan, Rogojampi, Banyuwangi",
    },
    pengukuranBalita: [
      {
        tanggal: "2025-08-15",
        tempat: "Posyandu Mawar",
        posisi: "Berbaring",
        tinggi: 92,
        berat: 13.5,
        lila: 14.5,
        lingkarKepala: 46,
        asiEksklusif: "Ya",
        mpasi: "Ya",
        stunting: "Tidak",
        underweight: "Tidak",
        wasting: "Tidak",
      },
    ],
    pengukuranIbuHamil: [],
  },
  {
    id: 3,
    identitasBalita: {
      noKK: "3510123456789021",
      nik: "3510123456789022",
      nama: "Salsabila Nur",
      tanggalLahir: "2022-01-10",
      tempatLahir: "Banyuwangi",
      jenisKelamin: "Perempuan",
      anakKe: 3,
      caraLahir: "Caesar",
    },
    dataAyah: {
      nik: "3510123456789023",
      nama: "Joko Susilo",
      tanggalLahir: "1985-02-18",
      tempatLahir: "Banyuwangi",
      jenisKelamin: "Laki-laki",
      alamat: "Dusun Krajan, Rogojampi, Banyuwangi",
    },
    dataIbu: {
      nik: "3510123456789024",
      nama: "Rina Wati",
      tanggalLahir: "1989-05-25",
      tempatLahir: "Banyuwangi",
      jenisKelamin: "Perempuan",
      alamat: "Dusun Krajan, Rogojampi, Banyuwangi",
    },
    pengukuranBalita: [
      {
        tanggal: "2025-08-20",
        tempat: "Posyandu Kenanga",
        posisi: "Berdiri",
        tinggi: 85,
        berat: 11.5,
        lila: 13.5,
        lingkarKepala: 44,
        asiEksklusif: "Ya",
        mpasi: "Ya",
        stunting: "Tidak",
        underweight: "Tidak",
        wasting: "Tidak",
      },
    ],
    pengukuranIbuHamil: [],
  },
];

interface IdentitasBalita {
  noKK: string;
  nik: string;
  nama: string;
  tanggalLahir: string;
  tempatLahir: string;
  jenisKelamin: string;
  anakKe: number;
  caraLahir: string;
}

interface DataOrangTua {
  nik: string;
  nama: string;
  tanggalLahir: string;
  tempatLahir: string;
  jenisKelamin: string;
  alamat: string;
}

interface PengukuranBalita {
  tanggal: string;
  tempat: string;
  posisi: string;
  tinggi: number;
  berat: number;
  lila: number;
  lingkarKepala: number;
  asiEksklusif: string;
  mpasi: string;
  stunting: string;
  underweight: string;
  wasting: string;
}

interface PengukuranIbuHamil {
  tanggal: string;
  tempat: string;
  usiaKehamilan: number;
  tinggi: number;
  berat: number;
  lila: number;
  tinggiFundus: number;
  hemoglobin: number;
  tglHaid: string;
  asapRokok: string;
  tabletFe: string;
}

interface BalitaData {
  id: number;
  identitasBalita: IdentitasBalita;
  dataAyah: DataOrangTua;
  dataIbu: DataOrangTua;
  pengukuranBalita: PengukuranBalita[];
  pengukuranIbuHamil: PengukuranIbuHamil[];
}

const ChartRaporBaby: React.FC = () => {
  const [selectedBalita, setSelectedBalita] = useState<BalitaData>(dummyBalitaData[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [filteredBalita, setFilteredBalita] = useState<BalitaData[]>(dummyBalitaData);

  // Filter data balita berdasarkan pencarian
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredBalita(dummyBalitaData);
    } else {
      const filtered = dummyBalitaData.filter(balita => 
        balita.identitasBalita.nama.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBalita(filtered);
    }
  }, [searchTerm]);

  const handleSelectBalita = (balita: BalitaData) => {
    setSelectedBalita(balita);
    setIsOpen(false);
    setSearchTerm("");
  };

  const { identitasBalita, dataAyah, dataIbu, pengukuranBalita, pengukuranIbuHamil } = selectedBalita;

  return (
    <div className="space-y-6 p-6 bg-white rounded-xl shadow-md">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Raport Balita</h1>
        
        {/* Dropdown dengan Pencarian */}
        <div className="relative w-full md:w-64">
          <div 
            className="flex items-center justify-between p-2 border border-gray-300 rounded-lg cursor-pointer bg-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="truncate">{selectedBalita.identitasBalita.nama}</span>
            <svg 
              className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          
          {isOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
              {/* Input Pencarian */}
              <div className="p-2 border-b border-gray-200">
                <input
                  type="text"
                  placeholder="Cari nama balita..."
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              
              {/* Daftar Balita */}
              <div className="max-h-60 overflow-y-auto">
                {filteredBalita.length > 0 ? (
                  filteredBalita.map((balita) => (
                    <div
                      key={balita.id}
                      className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                      onClick={() => handleSelectBalita(balita)}
                    >
                      <div className="font-medium">{balita.identitasBalita.nama}</div>
                      <div className="text-sm text-gray-500">
                        {balita.identitasBalita.tanggalLahir} • {balita.identitasBalita.jenisKelamin}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-center text-gray-500">
                    Tidak ada data balita yang ditemukan
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* A. Identitas Balita */}
      <section>
        <h2 className="font-semibold text-lg mb-3 text-gray-800 border-b pb-2">A. Identitas Balita</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-2 font-medium text-gray-700 bg-gray-50 w-1/3">No KK</td>
                <td className="px-4 py-2 text-gray-900">{identitasBalita.noKK}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-medium text-gray-700 bg-gray-50">NIK Balita</td>
                <td className="px-4 py-2 text-gray-900">{identitasBalita.nik}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-medium text-gray-700 bg-gray-50">Nama Balita</td>
                <td className="px-4 py-2 text-gray-900">{identitasBalita.nama}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-medium text-gray-700 bg-gray-50">Tanggal Lahir</td>
                <td className="px-4 py-2 text-gray-900">{identitasBalita.tanggalLahir}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-medium text-gray-700 bg-gray-50">Tempat Lahir</td>
                <td className="px-4 py-2 text-gray-900">{identitasBalita.tempatLahir}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-medium text-gray-700 bg-gray-50">Jenis Kelamin</td>
                <td className="px-4 py-2 text-gray-900">{identitasBalita.jenisKelamin}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-medium text-gray-700 bg-gray-50">Anak Ke</td>
                <td className="px-4 py-2 text-gray-900">{identitasBalita.anakKe}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-medium text-gray-700 bg-gray-50">Cara Lahir</td>
                <td className="px-4 py-2 text-gray-900">{identitasBalita.caraLahir}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* B. Data Ayah */}
      <section>
        <h2 className="font-semibold text-lg mb-3 text-gray-800 border-b pb-2">B. Data Ayah</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-2 font-medium text-gray-700 bg-gray-50 w-1/3">NIK Ayah</td>
                <td className="px-4 py-2 text-gray-900">{dataAyah.nik}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-medium text-gray-700 bg-gray-50">Nama Ayah</td>
                <td className="px-4 py-2 text-gray-900">{dataAyah.nama}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-medium text-gray-700 bg-gray-50">Tanggal Lahir</td>
                <td className="px-4 py-2 text-gray-900">{dataAyah.tanggalLahir}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-medium text-gray-700 bg-gray-50">Tempat Lahir</td>
                <td className="px-4 py-2 text-gray-900">{dataAyah.tempatLahir}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-medium text-gray-700 bg-gray-50">Jenis Kelamin</td>
                <td className="px-4 py-2 text-gray-900">{dataAyah.jenisKelamin}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-medium text-gray-700 bg-gray-50">Alamat</td>
                <td className="px-4 py-2 text-gray-900">{dataAyah.alamat}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* C. Data Ibu */}
      <section>
        <h2 className="font-semibold text-lg mb-3 text-gray-800 border-b pb-2">C. Data Ibu</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-2 font-medium text-gray-700 bg-gray-50 w-1/3">NIK Ibu</td>
                <td className="px-4 py-2 text-gray-900">{dataIbu.nik}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-medium text-gray-700 bg-gray-50">Nama Ibu</td>
                <td className="px-4 py-2 text-gray-900">{dataIbu.nama}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-medium text-gray-700 bg-gray-50">Tanggal Lahir</td>
                <td className="px-4 py-2 text-gray-900">{dataIbu.tanggalLahir}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-medium text-gray-700 bg-gray-50">Tempat Lahir</td>
                <td className="px-4 py-2 text-gray-900">{dataIbu.tempatLahir}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-medium text-gray-700 bg-gray-50">Jenis Kelamin</td>
                <td className="px-4 py-2 text-gray-900">{dataIbu.jenisKelamin}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-medium text-gray-700 bg-gray-50">Alamat</td>
                <td className="px-4 py-2 text-gray-900">{dataIbu.alamat}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* D. Pengukuran Balita */}
      <section>
        <h2 className="font-semibold text-lg mb-3 text-gray-800 border-b pb-2">D. Pengukuran Balita</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left text-gray-700 font-medium">Tanggal</th>
                <th className="px-4 py-2 text-left text-gray-700 font-medium">Tempat</th>
                <th className="px-4 py-2 text-left text-gray-700 font-medium">Posisi</th>
                <th className="px-4 py-2 text-left text-gray-700 font-medium">Tinggi (cm)</th>
                <th className="px-4 py-2 text-left text-gray-700 font-medium">Berat (kg)</th>
                <th className="px-4 py-2 text-left text-gray-700 font-medium">LILA (cm)</th>
                <th className="px-4 py-2 text-left text-gray-700 font-medium">Lingkar Kepala (cm)</th>
                <th className="px-4 py-2 text-left text-gray-700 font-medium">ASI Eksklusif</th>
                <th className="px-4 py-2 text-left text-gray-700 font-medium">MPASI</th>
                <th className="px-4 py-2 text-left text-gray-700 font-medium">Stunting</th>
                <th className="px-4 py-2 text-left text-gray-700 font-medium">Underweight</th>
                <th className="px-4 py-2 text-left text-gray-700 font-medium">Wasting</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pengukuranBalita.map((p, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-gray-900">{p.tanggal}</td>
                  <td className="px-4 py-2 text-gray-900">{p.tempat}</td>
                  <td className="px-4 py-2 text-gray-900">{p.posisi}</td>
                  <td className="px-4 py-2 text-gray-900">{p.tinggi}</td>
                  <td className="px-4 py-2 text-gray-900">{p.berat}</td>
                  <td className="px-4 py-2 text-gray-900">{p.lila}</td>
                  <td className="px-4 py-2 text-gray-900">{p.lingkarKepala}</td>
                  <td className="px-4 py-2 text-gray-900">{p.asiEksklusif}</td>
                  <td className="px-4 py-2 text-gray-900">{p.mpasi}</td>
                  <td className="px-4 py-2 text-gray-900">{p.stunting}</td>
                  <td className="px-4 py-2 text-gray-900">{p.underweight}</td>
                  <td className="px-4 py-2 text-gray-900">{p.wasting}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* E. Pengukuran Ibu Hamil */}
      {pengukuranIbuHamil.length > 0 && (
        <section>
          <h2 className="font-semibold text-lg mb-3 text-gray-800 border-b pb-2">E. Pengukuran Ibu Hamil</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left text-gray-700 font-medium">Tanggal</th>
                  <th className="px-4 py-2 text-left text-gray-700 font-medium">Tempat</th>
                  <th className="px-4 py-2 text-left text-gray-700 font-medium">Usia Kehamilan (minggu)</th>
                  <th className="px-4 py-2 text-left text-gray-700 font-medium">Tinggi (cm)</th>
                  <th className="px-4 py-2 text-left text-gray-700 font-medium">Berat (kg)</th>
                  <th className="px-4 py-2 text-left text-gray-700 font-medium">LILA (cm)</th>
                  <th className="px-4 py-2 text-left text-gray-700 font-medium">Tinggi Fundus (cm)</th>
                  <th className="px-4 py-2 text-left text-gray-700 font-medium">Hemoglobin (g/dl)</th>
                  <th className="px-4 py-2 text-left text-gray-700 font-medium">Tgl Pertama Haid</th>
                  <th className="px-4 py-2 text-left text-gray-700 font-medium">Asap Rokok</th>
                  <th className="px-4 py-2 text-left text-gray-700 font-medium">Tablet Fe</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {pengukuranIbuHamil.map((p, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-gray-900">{p.tanggal}</td>
                    <td className="px-4 py-2 text-gray-900">{p.tempat}</td>
                    <td className="px-4 py-2 text-gray-900">{p.usiaKehamilan}</td>
                    <td className="px-4 py-2 text-gray-900">{p.tinggi}</td>
                    <td className="px-4 py-2 text-gray-900">{p.berat}</td>
                    <td className="px-4 py-2 text-gray-900">{p.lila}</td>
                    <td className="px-4 py-2 text-gray-900">{p.tinggiFundus}</td>
                    <td className="px-4 py-2 text-gray-900">{p.hemoglobin}</td>
                    <td className="px-4 py-2 text-gray-900">{p.tglHaid}</td>
                    <td className="px-4 py-2 text-gray-900">{p.asapRokok}</td>
                    <td className="px-4 py-2 text-gray-900">{p.tabletFe}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
};

export default ChartRaporBaby;
