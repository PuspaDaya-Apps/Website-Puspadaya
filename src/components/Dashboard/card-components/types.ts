export interface CountingCardData {
  jumlah: string;
  rate?: number;
  status?: string;
}

export interface DesaCardData extends CountingCardData {
  jumlah_keluarga?: string;
}

export interface PercentageData {
  banyuwangi_rate: number;
  maluku_rate: number;
}

export interface SKDNData {
  D_S?: CountingCardData;
  K_S?: CountingCardData;
}

export interface DashboardData {
  jumlah_anak?: CountingCardData;
  jumlah_anak_stunting?: CountingCardData;
  jumlah_anak_underweight?: CountingCardData;
  jumlah_anak_wasting?: CountingCardData;
  jumlah_anak_hadir?: CountingCardData;
  jumlah_anak_lulus?: CountingCardData;
  jumlah_anak_asi_ekslusif?: CountingCardData;
  jumlah_anak_mpasi?: CountingCardData;
  jumlah_ibu_hamil?: CountingCardData;
  jumlah_ibu_hamil_hpl?: CountingCardData;
  jumlah_posyandu?: CountingCardData;
  jumlah_kader?: CountingCardData;
  jumlah_orang_tua_tidak_punya_kk?: CountingCardData;
  perhitungan_skdn?: SKDNData;
  jumlah_desa?: DesaCardData;
  keluarga_tanpa_mck?: {
    jumlah: string;
  };
  persentase_posyandu?: PercentageData;
  persentase_kader?: {
    banyuwangi_rate: number;
    maluku_rate: number;
  };
}

export interface DashboardLoadingStates {
  grafikTrendStuntingBalita?: boolean;
  grafikTrendStuntingBanyuwangi?: boolean;
  
  countingCard?: boolean;
  

  mapPersebaranBalitaStunting?: boolean;
  mapPersebaranBalitaBerdasarkanWilayah?: boolean;
}


export interface DashboardSectionProps {
  isLoading: {
    grafikTrendStuntingBalita?: boolean;
    grafikTrendStuntingBanyuwangi?: boolean;
    countingCard?: boolean;
    grafikPersebaranPosyandu?: boolean;
    grafikPersebaranKaderDanTingkatAktivitas?: boolean;
    countingCardRow?: boolean;
  };
  datadash: any;
  monthYear: string;
}

