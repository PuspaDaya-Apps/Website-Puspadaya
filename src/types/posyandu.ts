export type Posyandu = {
  id: number;
  namaPosyandu: string;
  lokasi: string;
  tanggalPelaksanaan: Date | null; // format: 17/10/2024
  waktuMulai: Date | null; // format: 09:00
  waktuSelesai: Date | null; // format: 12:00
};

export type PosyanduType = {
  id: number;
  namaPosyandu: string;
  namaPuskesmas: string;
  kecamatan: string;
};
