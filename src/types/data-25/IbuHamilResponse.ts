// types/IbuHamilResponse.ts

export interface IbuHamilItem {
  id: string;
  nik: string;
  nama_ibu: string;
  usia_ibu: string;
  nama_suami: string;
  usia_kehamilan: string;
  updated_at: string;
}

export interface MetaData {
  itemsPerPage: number;
  totalItems: number;
  currentPage: number;
  totalPages: number;
}

export interface Links {
  first: string;
  last: string;
  current: string;
  next: string;
  previous: string;
}

export interface IbuHamilResponse {
  data: IbuHamilItem[];
  meta: MetaData;
  links: Links;
  message: string;
}
