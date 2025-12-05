// // dummyDataBaby.ts

// export const balitaList = [
//     {
//         id: 1,
//         nama: "Aisyah Putri",
//         nik: "3512345678900001",
//         tanggal_lahir: "2021-04-12",
//         jenis_kelamin: "Perempuan",
//         alamat: "Jl. Melati No. 24, Banyuwangi",
//         ayah: {
//             nama: "Budi Santoso",
//             nik: "3512345678901001",
//             pekerjaan: "Karyawan Swasta",
//         },
//         ibu: {
//             nama: "Siti Aminah",
//             nik: "3512345678902001",
//             pekerjaan: "Ibu Rumah Tangga",
//         },
//         pengukuran: {
//             tinggi_badan: 80,
//             berat_badan: 10.5,
//             lingkar_kepala: 47,
//             tanggal: "2024-10-01",
//         },
//     },
//     {
//         id: 2,
//         nama: "Raka Wijaya",
//         nik: "3512345678900002",
//         tanggal_lahir: "2020-12-05",
//         jenis_kelamin: "Laki-laki",
//         alamat: "Jl. Cempaka No. 18, Banyuwangi",
//         ayah: {
//             nama: "Agus Wijaya",
//             nik: "3512345678901002",
//             pekerjaan: "Wiraswasta",
//         },
//         ibu: {
//             nama: "Rina Kusuma",
//             nik: "3512345678902002",
//             pekerjaan: "Guru",
//         },
//         pengukuran: {
//             tinggi_badan: 85,
//             berat_badan: 12.0,
//             lingkar_kepala: 48,
//             tanggal: "2024-10-01",
//         },
//     },
// ];

// export const dummyBalitaData: BalitaData[] = [
//     {
//         id: 1,
//         identitasBalita: {
//             noKK: "1234567890",
//             nik: "3512345678900001",
//             nama: "Aisyah Putri",
//             tanggalLahir: "2021-04-12",
//             tempatLahir: "Banyuwangi",
//             jenisKelamin: "Perempuan",
//             anakKe: 1,
//             caraLahir: "Normal"
//         },
//         dataAyah: {
//             nik: "3512345678901001",
//             nama: "Budi Santoso",
//             tanggalLahir: "1988-02-01",
//             tempatLahir: "Banyuwangi",
//             jenisKelamin: "Laki-laki",
//             alamat: "Jl. Melati No. 24"
//         },
//         dataIbu: {
//             nik: "3512345678902001",
//             nama: "Siti Aminah",
//             tanggalLahir: "1990-04-10",
//             tempatLahir: "Banyuwangi",
//             jenisKelamin: "Perempuan",
//             alamat: "Jl. Melati No. 24"
//         },
//         pengukuranBalita: [
//             {
//                 tanggal: "2024-10-01",
//                 tempat: "Posyandu Melati",
//                 posisi: "Berdiri",
//                 tinggi: 80,
//                 berat: 10.5,
//                 lila: 15,
//                 lingkarKepala: 47,
//                 asiEksklusif: "Ya",
//                 mpasi: "Ya",
//                 stunting: "Tidak",
//                 underweight: "Tidak",
//                 wasting: "Tidak"
//             }
//         ],
//         pengukuranIbuHamil: []
//     },
// ];


// // Interfaces
// export interface IdentitasBalita {
//     noKK: string;
//     nik: string;
//     nama: string;
//     tanggalLahir: string;
//     tempatLahir: string;
//     jenisKelamin: string;
//     anakKe: number;
//     caraLahir: string;
// }

// export interface DataOrangTua {
//     nik: string;
//     nama: string;
//     tanggalLahir: string;
//     tempatLahir: string;
//     jenisKelamin: string;
//     alamat: string;
// }

// export interface PengukuranBalita {
//     tanggal: string;
//     tempat: string;
//     posisi: string;
//     tinggi: number;
//     berat: number;
//     lila: number;
//     lingkarKepala: number;
//     asiEksklusif: string;
//     mpasi: string;
//     stunting: string;
//     underweight: string;
//     wasting: string;
// }

// export interface PengukuranIbuHamil {
//     tanggal: string;
//     tempat: string;
//     usiaKehamilan: number;
//     tinggi: number;
//     berat: number;
//     lila: number;
//     tinggiFundus: number;
//     hemoglobin: number;
//     tglHaid: string;
//     asapRokok: string;
//     tabletFe: string;
// }

// export interface BalitaData {
//     id: number;
//     identitasBalita: IdentitasBalita;
//     dataAyah: DataOrangTua;
//     dataIbu: DataOrangTua;
//     pengukuranBalita: PengukuranBalita[];
//     pengukuranIbuHamil: PengukuranIbuHamil[];
// }
