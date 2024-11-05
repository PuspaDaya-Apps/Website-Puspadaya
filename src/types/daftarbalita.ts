// Definisi enum untuk kehadiran
export enum Kehadiran {
  Hadir = "H",
  KunjunganHadir = "KH",
  KunjunganTidakHadir = "KT",
  Izin = "I",
}

// Definisi type untuk daftarBalita
export type DaftarBalita = {
  id: number;
  namaIbu: string;
  namaBalita: string;
  absensi: {
    jan?: Kehadiran |null; // Absensi untuk bulan Januari
    feb?: Kehadiran |null; // Contoh untuk bulan Februari
    mar?: Kehadiran |null;
    apr?: Kehadiran |null;
    mei?: Kehadiran |null;
    jun?: Kehadiran |null;
    jul?: Kehadiran |null;
    ags?: Kehadiran |null;
    sep?: Kehadiran |null;
    okt?: Kehadiran |null;
    nov?: Kehadiran |null;
    des?: Kehadiran |null;
  };
};
