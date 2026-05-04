export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

export interface Periode {
  bulan: string;
  tahun: number;
}
