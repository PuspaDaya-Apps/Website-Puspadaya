// /data/kaderData.ts
export const data = {
    title: "Raport Kader Posyandu",
    periode: "September 2025",
    posyandu: { nama: "Posyandu Melati", alamat: "Dusun Krajan, Rogojampi, Banyuwangi" },
    kader: [
        {
            nama: "Siti Aminah",
            jabatan: "Kader Utama",
            jenis_pekerjaan: [
                "Pemantauan pertumbuhan balita",
                "Pemantauan kesehatan ibu hamil",
                "Kunjungan rumah",
                "Penyuluhan gizi",
                "Pemeriksaan kesehatan dasar",
            ],
            laporan: {
                jumlah_balita_hadir_per_kompetensi: {
                    total_hadir_balita: 42,
                    detail: [
                        { kompetensi: "Pertumbuhan Balita", jumlah: 15 },
                        { kompetensi: "Imunisasi", jumlah: 12 },
                        { kompetensi: "Gizi Balita", jumlah: 15 },
                    ],
                },
                jumlah_ibu_hamil_hadir_per_kompetensi: {
                    total_ibu_hamil: 18,
                    detail: [
                        {
                            kompetensi: "Pemeriksaan Kehamilan", aktivitas_kader: [
                                "Pemeriksaan tekanan darah",
                                "Penyuluhan gizi ibu hamil",
                                "Pemeriksaan berat badan",
                                "Konseling persalinan",
                            ]
                        },
                        {
                            kompetensi: "Suplemen Gizi", aktivitas_kader: [
                                "Pembagian tablet tambah darah",
                                "Edukasi pentingnya suplemen",
                            ]
                        },
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

// Data untuk grafik kehadiran
export const chartData = [
    { name: "Balita", value: 42, color: "#4f46e5" },
    { name: "Ibu Hamil", value: 18, color: "#10b981" },
];

// Data untuk visualisasi durasi & jarak
export const durationDistanceData = [
    { name: "Durasi Posyandu", value: 4, unit: "jam", color: "#6366f1" },
    { name: "Durasi Kunjungan", value: 1.5, unit: "jam", color: "#8b5cf6" },
    { name: "Jarak Kunjungan", value: 12, unit: "km", color: "#ec4899" },
];
