import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

// Data dummy yang diperkaya
const data = {
  title: "Raport Kader Posyandu",
  periode: "September 2025",
  posyandu: {
    nama: "Posyandu Melati",
    alamat: "Dusun Krajan, Rogojampi, Banyuwangi",
  },
  kader: [
    {
      nama: "Siti Aminah",
      jabatan: "Kader Utama",
      jenis_pekerjaan: [
        "Pemantauan pertumbuhan balita",
        "Pemantauan kesehatan ibu hamil",
        "Kunjungan rumah",
        "Penyuluhan gizi",
        "Pemeriksaan kesehatan dasar"
      ],
      laporan: {
        jumlah_balita_hadir_per_kompetensi: {
          total_hadir_balita: 42,
          detail: [
            {
              kompetensi: "Pertumbuhan Balita",
              jumlah: 15
            },
            {
              kompetensi: "Imunisasi",
              jumlah: 12
            },
            {
              kompetensi: "Gizi Balita",
              jumlah: 15
            }
          ],
        },
        jumlah_ibu_hamil_hadir_per_kompetensi: {
          total_ibu_hamil: 18,
          detail: [
            {
              kompetensi: "Pemeriksaan Kehamilan",
              aktivitas_kader: [
                "Pemeriksaan tekanan darah",
                "Penyuluhan gizi ibu hamil",
                "Pemeriksaan berat badan",
                "Konseling persalinan"
              ],
            },
            {
              kompetensi: "Suplemen Gizi",
              aktivitas_kader: [
                "Pembagian tablet tambah darah",
                "Edukasi pentingnya suplemen"
              ]
            }
          ],
        },
        durasi_kerja_posyandu: "4 jam",
        durasi_kerja_kunjungan_rumah: "1 jam 30 menit",
        jarak_ke_posyandu: "0",
        jarak_total_kunjungan_rumah: "12 km",
        skor_beban_kerja: 85,
      },
    },
  ],
};

// Data untuk grafik
const chartData = [
  { name: "Balita", value: 42, color: "#4f46e5" },
  { name: "Ibu Hamil", value: 18, color: "#10b981" },
];

// Data aktivitas mingguan
const weeklyActivityData = [
  { hari: "Senin", balita: 8, ibuHamil: 3 },
  { hari: "Selasa", balita: 7, ibuHamil: 4 },
  { hari: "Rabu", balita: 9, ibuHamil: 2 },
  { hari: "Kamis", balita: 6, ibuHamil: 5 },
  { hari: "Jumat", balita: 12, ibuHamil: 4 },
];

const DashboardAnggotaKader: React.FC = () => {
  const kader = data.kader[0];

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header Card */}
      <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-dark">
        <h1 className="text-xl font-bold text-dark dark:text-white md:text-2xl">
          {data.title}
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          Periode: {data.periode} | {data.posyandu.nama} - {data.posyandu.alamat}
        </p>
      </div>

      {/* Profil Kader Card */}
      <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-dark">
        <h2 className="mb-4 text-lg font-semibold text-dark dark:text-white">
          Profil Kader
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="mb-2">
              <span className="font-medium text-dark dark:text-white">Nama:</span>{" "}
              <span className="text-gray-700 dark:text-gray-300">{kader.nama}</span>
            </p>
            <p>
              <span className="font-medium text-dark dark:text-white">Jabatan:</span>{" "}
              <span className="text-gray-700 dark:text-gray-300">{kader.jabatan}</span>
            </p>
          </div>
          <div>
            <p className="mb-2 font-medium text-dark dark:text-white">Jenis Pekerjaan:</p>
            <ul className="space-y-1">
              {kader.jenis_pekerjaan.map((pekerjaan, i) => (
                <li key={i} className="flex items-start">
                  <span className="mr-2 text-primary">•</span>
                  <span className="text-gray-700 dark:text-gray-300">{pekerjaan}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Statistik Kehadiran */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Kartu Statistik Utama */}
        <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-dark">
          <h2 className="mb-4 text-lg font-semibold text-dark dark:text-white">
            Statistik Kehadiran
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-indigo-50 p-4 text-center dark:bg-indigo-900/20">
              <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-300">
                {kader.laporan.jumlah_balita_hadir_per_kompetensi.total_hadir_balita}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Balita</p>
            </div>
            <div className="rounded-lg bg-emerald-50 p-4 text-center dark:bg-emerald-900/20">
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-300">
                {kader.laporan.jumlah_ibu_hamil_hadir_per_kompetensi.total_ibu_hamil}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Ibu Hamil</p>
            </div>
          </div>
        </div>

        {/* Skor Beban Kerja */}
        <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-dark">
          <h2 className="mb-4 text-lg font-semibold text-dark dark:text-white">
            Skor Beban Kerja
          </h2>
          <div className="flex items-center justify-between">
            <span className="text-3xl font-bold text-dark dark:text-white">
              {kader.laporan.skor_beban_kerja}
            </span>
            <span className="text-gray-500 dark:text-gray-400">/ 100</span>
          </div>
          <div className="mt-4 h-3 w-full rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600"
              style={{ width: `${kader.laporan.skor_beban_kerja}%` }}
            ></div>
          </div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {kader.laporan.skor_beban_kerja >= 80
              ? "Beban kerja tinggi"
              : kader.laporan.skor_beban_kerja >= 60
              ? "Beban kerja sedang"
              : "Beban kerja rendah"}
          </p>
        </div>
      </div>

      {/* Grafik dan List Kegiatan */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Grafik Kehadiran */}
        <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-dark">
          <h2 className="mb-4 text-lg font-semibold text-dark dark:text-white">
            Grafik Kehadiran Bulanan
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="name" 
                  stroke="#6b7280" 
                  tick={{ fill: '#6b7280' }}
                />
                <YAxis 
                  stroke="#6b7280" 
                  tick={{ fill: '#6b7280' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff',
                    borderRadius: '0.5rem',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar dataKey="value" name="Jumlah">
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* List Kegiatan Mingguan */}
        <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-dark">
          <h2 className="mb-4 text-lg font-semibold text-dark dark:text-white">
            Aktivitas Minggu Ini
          </h2>
          <div className="h-72 overflow-y-auto pr-2">
            <div className="space-y-4">
              <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                <h3 className="font-medium text-dark dark:text-white">Balita</h3>
                <ul className="mt-2 space-y-2">
                  {kader.laporan.jumlah_balita_hadir_per_kompetensi.detail.map((item, index) => (
                    <li key={index} className="flex justify-between">
                      <span className="text-gray-700 dark:text-gray-300">{item.kompetensi}</span>
                      <span className="font-medium text-dark dark:text-white">{item.jumlah}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                <h3 className="font-medium text-dark dark:text-white">Ibu Hamil</h3>
                <ul className="mt-2 space-y-3">
                  {kader.laporan.jumlah_ibu_hamil_hadir_per_kompetensi.detail.map((item, index) => (
                    <li key={index}>
                      <p className="font-medium text-gray-700 dark:text-gray-300">{item.kompetensi}</p>
                      <ul className="mt-1 space-y-1 pl-4">
                        {item.aktivitas_kader.map((aktivitas, i) => (
                          <li key={i} className="flex items-start">
                            <span className="mr-2 text-primary">•</span>
                            <span className="text-gray-600 dark:text-gray-400">{aktivitas}</span>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grafik Aktivitas Mingguan */}
      <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-dark">
        <h2 className="mb-4 text-lg font-semibold text-dark dark:text-white">
          Aktivitas Mingguan
        </h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={weeklyActivityData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="hari" 
                stroke="#6b7280" 
                tick={{ fill: '#6b7280' }}
              />
              <YAxis 
                stroke="#6b7280" 
                tick={{ fill: '#6b7280' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff',
                  borderRadius: '0.5rem',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar dataKey="balita" name="Balita" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              <Bar dataKey="ibuHamil" name="Ibu Hamil" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardAnggotaKader;
