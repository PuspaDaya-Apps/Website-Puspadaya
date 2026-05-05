# Dokumentasi API Response Kepala Dashboard

Dokumen ini berisi contoh response API untuk modul **Kepala Dashboard** beserta catatan perhitungan yang digunakan pada beberapa endpoint.

## Daftar Endpoint

| No | Endpoint | Deskripsi Singkat |
|---:|---|---|
| 1 | `/api/v1/kepala-dashboard/informasi-data-desa` | Ringkasan data desa, kasus gizi, dan ibu hamil |
| 2 | `/api/v1/kepala-dashboard/tren-data` | Data posyandu dan persentase kehadiran |
| 3 | `/api/v1/kepala-dashboard/statistik-data-desa` | Tren kehadiran, status gizi balita, dan ibu hamil KEK |
| 4 | `/api/v1/kepala-dashboard/anak-cakupan-dilayani` | Data cakupan anak, kesehatan ibu bayi, KB, dan imunisasi |
| 5 | `/api/v1/kepala-dashboard/statistik-skdn` | Statistik SKDN dan cakupan berat badan balita |
| 6 | `/api/v1/kepala-dashboard/durasi-kerja-posyandu` | Durasi kerja posyandu, kunjungan rumah, dan jarak tempuh |
| 7 | `/api/v1/kepala-dashboard/skor-beban-kerja-tim` | Ringkasan dan distribusi skor beban kerja kader |
| 8 | `/api/v1/kepala-dashboard/imunisasi-kependudukan` | Imunisasi dan kependudukan |
| 9 | `/api/v1/kepala-dashboard/log-aktivitas-kader` | Log aktivitas kader posyandu |

## Format Response Umum

Sebagian besar endpoint menggunakan format response berikut:

```json
{
  "status": "success",
  "message": "Data dashboard berhasil diambil",
  "data": {}
}
```

Catatan: contoh response pada dokumen ini menggunakan periode **April 2026**, kecuali data aktivitas yang menggunakan tanggal aktivitas masing-masing.

## 1. Name API: `/api/v1/kepala-dashboard/informasi-data-desa`

### Contoh Response

```json
{
  "status": "success",
  "message": "Data dashboard berhasil diambil",
  "data": {
    "periode": {
      "bulan": "April",
      "tahun": 2026
    },
    "ringkasan": {
      "total_posyandu": 8,
      "total_kader": 68,
      "bayi_baru_lahir": 42,
      "total_balita": 375
    },
    "kasus_gizi": {
      "stunting_pendek": 20,
      "stunting_sangat_pendek": 12,
      "wasting": 28,
      "underweight": 35
    },
    "ibu_hamil": {
      "total": 103,
      "anemia": 15
    }
  }
}
```

## 2. Name API: `/api/v1/kepala-dashboard/tren-data`

### Contoh Response

```json
{
  "status": "success",
  "message": "Data dashboard berhasil diambil",
  "data": {
    "periode": {
      "bulan": "April",
      "tahun": 2026
    },
    "posyandu": [
      {
        "nama": "Posyandu Melati 1",
        "dusun": "Dusun Krajan",
        "balita": 45,
        "ibu_hamil": 12,
        "kader": 8,
        "kehadiran": 84
      },
      {
        "nama": "Posyandu Mawar 2",
        "dusun": "Dusun Sindangsari",
        "balita": 52,
        "ibu_hamil": 15,
        "kader": 10,
        "kehadiran": 81
      },
      {
        "nama": "Posyandu Anggrek 3",
        "dusun": "Dusun Sukamaju",
        "balita": 38,
        "ibu_hamil": 9,
        "kader": 6,
        "kehadiran": 74
      },
      {
        "nama": "Posyandu Kenanga 4",
        "dusun": "Dusun Cimahi",
        "balita": 60,
        "ibu_hamil": 18,
        "kader": 12,
        "kehadiran": 92
      }
    ]
  }
}
```

### Catatan Perhitungan Kehadiran

`kehadiran` dalam persen **bukan** dihitung dari jumlah `balita + ibu_hamil` saja. Nilainya dihitung dari jumlah peserta yang hadir dibanding total sasaran.

Rumus:

```text
Kehadiran (%) = (Jumlah Hadir / Total Sasaran) x 100%
Total Sasaran = Balita + Ibu Hamil
```

Contoh:

```text
Balita = 52
Ibu hamil = 15
Total sasaran = 67
Balita hadir = 40
Ibu hamil hadir = 12
Total hadir = 52
Kehadiran = 52 / 67 x 100% = 77.6%
```

## 3. Name API: `/api/v1/kepala-dashboard/statistik-data-desa`

### Contoh Response

```json
{
  "status": "success",
  "message": "Data dashboard berhasil diambil",
  "data": {
    "periode": {
      "bulan": "April",
      "tahun": 2026
    },
    "tren": {
      "kehadiran_balita": {
        "hari_ini": 382,
        "data": [
          {
            "bulan": "Januari",
            "jumlah": 320
          },
          {
            "bulan": "Februari",
            "jumlah": 335
          },
          {
            "bulan": "Maret",
            "jumlah": 345
          },
          {
            "bulan": "April",
            "jumlah": 350
          },
          {
            "bulan": "Mei",
            "jumlah": 360
          },
          {
            "bulan": "Juni",
            "jumlah": 365
          },
          {
            "bulan": "Juli",
            "jumlah": 370
          },
          {
            "bulan": "Agustus",
            "jumlah": 372
          },
          {
            "bulan": "September",
            "jumlah": 375
          },
          {
            "bulan": "Oktober",
            "jumlah": 378
          },
          {
            "bulan": "November",
            "jumlah": 380
          },
          {
            "bulan": "Desember",
            "jumlah": 382
          }
        ]
      },
      "kehadiran_ibu_hamil": {
        "hari_ini": 103,
        "data": [
          {
            "bulan": "Januari",
            "jumlah": 92
          },
          {
            "bulan": "Februari",
            "jumlah": 95
          },
          {
            "bulan": "Maret",
            "jumlah": 98
          },
          {
            "bulan": "April",
            "jumlah": 100
          },
          {
            "bulan": "Mei",
            "jumlah": 104
          },
          {
            "bulan": "Juni",
            "jumlah": 106
          },
          {
            "bulan": "Juli",
            "jumlah": 107
          },
          {
            "bulan": "Agustus",
            "jumlah": 109
          },
          {
            "bulan": "September",
            "jumlah": 107
          },
          {
            "bulan": "Oktober",
            "jumlah": 105
          },
          {
            "bulan": "November",
            "jumlah": 103
          },
          {
            "bulan": "Desember",
            "jumlah": 103
          }
        ]
      },
      "status_gizi_balita": {
        "hari_ini": 30,
        "data": [
          {
            "bulan": "Januari",
            "sangat_pendek": 8,
            "stunting_pendek": 12,
            "underweight": 18,
            "wasting": 15
          },
          {
            "bulan": "Februari",
            "sangat_pendek": 8,
            "stunting_pendek": 11,
            "underweight": 17,
            "wasting": 14
          },
          {
            "bulan": "Maret",
            "sangat_pendek": 7,
            "stunting_pendek": 11,
            "underweight": 16,
            "wasting": 14
          },
          {
            "bulan": "April",
            "sangat_pendek": 7,
            "stunting_pendek": 10,
            "underweight": 16,
            "wasting": 13
          },
          {
            "bulan": "Mei",
            "sangat_pendek": 6,
            "stunting_pendek": 10,
            "underweight": 15,
            "wasting": 13
          },
          {
            "bulan": "Juni",
            "sangat_pendek": 6,
            "stunting_pendek": 9,
            "underweight": 15,
            "wasting": 12
          },
          {
            "bulan": "Juli",
            "sangat_pendek": 5,
            "stunting_pendek": 9,
            "underweight": 14,
            "wasting": 12
          },
          {
            "bulan": "Agustus",
            "sangat_pendek": 5,
            "stunting_pendek": 8,
            "underweight": 14,
            "wasting": 11
          },
          {
            "bulan": "September",
            "sangat_pendek": 4,
            "stunting_pendek": 8,
            "underweight": 13,
            "wasting": 11
          },
          {
            "bulan": "Oktober",
            "sangat_pendek": 4,
            "stunting_pendek": 7,
            "underweight": 13,
            "wasting": 10
          },
          {
            "bulan": "November",
            "sangat_pendek": 3,
            "stunting_pendek": 7,
            "underweight": 12,
            "wasting": 10
          },
          {
            "bulan": "Desember",
            "sangat_pendek": 3,
            "stunting_pendek": 6,
            "underweight": 12,
            "wasting": 9
          }
        ]
      },
      "ibu_hamil_kek": {
        "hari_ini": 12,
        "data": [
          {
            "bulan": "Januari",
            "jumlah": 18
          },
          {
            "bulan": "Februari",
            "jumlah": 17
          },
          {
            "bulan": "Maret",
            "jumlah": 16
          },
          {
            "bulan": "April",
            "jumlah": 16
          },
          {
            "bulan": "Mei",
            "jumlah": 15
          },
          {
            "bulan": "Juni",
            "jumlah": 15
          },
          {
            "bulan": "Juli",
            "jumlah": 14
          },
          {
            "bulan": "Agustus",
            "jumlah": 14
          },
          {
            "bulan": "September",
            "jumlah": 13
          },
          {
            "bulan": "Oktober",
            "jumlah": 13
          },
          {
            "bulan": "November",
            "jumlah": 12
          },
          {
            "bulan": "Desember",
            "jumlah": 12
          }
        ]
      }
    }
  }
}
```

## 4. Name API: `/api/v1/kepala-dashboard/anak-cakupan-dilayani`

### Contoh Response

```json
{
  "status": "success",
  "message": "Data dashboard berhasil diambil",
  "data": {
    "periode": {
      "bulan": "April",
      "tahun": 2026
    },
    "anak_berdasarkan_usia": {
      "baduta": 198,
      "balita": 285,
      "pra_sekolah": 142
    },
    "kesehatan_ibu_bayi": {
      "ibu_hamil_kek": 15,
      "ibu_hamil_risiko_tinggi": 8,
      "ibu_menyusui": 8,
      "bayi_baru_lahir": 42
    },
    "keluarga_berencana": {
      "wanita_pasca_subur": 245,
      "akseptor_kb": 156,
      "ibu_hamil_asuransi": 89
    },
    "imunisasi": {
      "total": 352,
      "cakupan_persen": 87.5,
      "detail": {
        "bcg": 38,
        "dpt_1": 36,
        "dpt_2": 35,
        "dpt_3": 34,
        "polio_1": 37,
        "polio_2": 36,
        "polio_3": 35,
        "polio_4": 33,
        "hepatitis": 36,
        "campak": 32
      }
    }
  }
}
```

## 5. Name API: `/api/v1/kepala-dashboard/statistik-skdn`

### Contoh Response

```json
{
  "status": "success",
  "message": "Data dashboard berhasil diambil",
  "data": {
    "periode": {
      "bulan": "April",
      "tahun": 2026
    },
    "skdn": {
      "indikator": {
        "kenaikan_bb_persen": 70.7,
        "kenaikan_bb_sesuai_kbm_persen": 70.7
      },
      "jumlah": {
        "sasaran_balita": 45,
        "kunjungan": 330,
        "ditimbang": 290,
        "naik_bb": 265
      },
      "cakupan": {
        "d_per_s_persen": 644.4,
        "k_per_s_persen": 733.3
      }
    }
  }
}
```

### Catatan Rumus SKDN

Keterangan variabel:

- `S` = jumlah sasaran balita
- `K` = jumlah kunjungan
- `D` = jumlah ditimbang
- `N` = jumlah naik berat badan
- `NKBM` = jumlah anak dengan kenaikan berat badan sesuai Ketentuan Berat Minimal/Kenaikan Berat Minimal

Rumus cakupan:

```text
K/S (%) = (K / S) x 100%
D/S (%) = (D / S) x 100%
N/D (%) = (N / D) x 100%
Kenaikan BB (%) = (N / D) x 100%
Kenaikan BB sesuai KBM (%) = (NKBM / D) x 100%
```

Rumus kenaikan berat badan anak:

```text
Kenaikan BB = BB sekarang - BB bulan lalu
```

Nilai acuan NKBM utama:

| Jenis Kelamin | Usia | NKBM |
|---|---:|---:|
| Laki-laki | 0-3 bulan | 1.5 kg |
| Laki-laki | 3-6 bulan | 1.2 kg |
| Laki-laki | 6-9 bulan | 0.9 kg |
| Laki-laki | 9-12 bulan | 0.8 kg |
| Perempuan | 0-3 bulan | 1.4 kg |
| Perempuan | 3-6 bulan | 1.0 kg |
| Perempuan | 6-9 bulan | 0.8 kg |

Cara menggunakan:

1. Tentukan usia dan jenis kelamin anak.
2. Lihat nilai NKBM dari tabel.
3. Bandingkan kenaikan berat badan aktual dengan nilai NKBM.
4. Hitung persentase menggunakan rumus yang sesuai.

## 6. Name API: `/api/v1/kepala-dashboard/durasi-kerja-posyandu`

### Contoh Response

```json
{
  "status": "success",
  "message": "Data dashboard berhasil diambil",
  "data": {
    "periode": {
      "bulan": "April",
      "tahun": 2026
    },
    "ringkasan": {
      "kerja_posyandu_jam": 176,
      "kunjungan_rumah_jam": 107,
      "jarak_tempuh_km": 322
    },
    "tren": {
      "durasi_kerja": [
        {
          "bulan": "Januari",
          "kerja_posyandu": 15,
          "kunjungan_rumah": 10
        },
        {
          "bulan": "Februari",
          "kerja_posyandu": 18,
          "kunjungan_rumah": 12
        },
        {
          "bulan": "Maret",
          "kerja_posyandu": 20,
          "kunjungan_rumah": 14
        },
        {
          "bulan": "April",
          "kerja_posyandu": 19,
          "kunjungan_rumah": 13
        },
        {
          "bulan": "Mei",
          "kerja_posyandu": 22,
          "kunjungan_rumah": 15
        },
        {
          "bulan": "Juni",
          "kerja_posyandu": 21,
          "kunjungan_rumah": 14
        },
        {
          "bulan": "Juli",
          "kerja_posyandu": 23,
          "kunjungan_rumah": 16
        },
        {
          "bulan": "Agustus",
          "kerja_posyandu": 24,
          "kunjungan_rumah": 17
        },
        {
          "bulan": "September",
          "kerja_posyandu": 22,
          "kunjungan_rumah": 15
        },
        {
          "bulan": "Oktober",
          "kerja_posyandu": 25,
          "kunjungan_rumah": 18
        },
        {
          "bulan": "November",
          "kerja_posyandu": 26,
          "kunjungan_rumah": 20
        },
        {
          "bulan": "Desember",
          "kerja_posyandu": 176,
          "kunjungan_rumah": 107
        }
      ],
      "jarak_tempuh": [
        {
          "bulan": "Januari",
          "km": 150
        },
        {
          "bulan": "Februari",
          "km": 160
        },
        {
          "bulan": "Maret",
          "km": 165
        },
        {
          "bulan": "April",
          "km": 170
        },
        {
          "bulan": "Mei",
          "km": 175
        },
        {
          "bulan": "Juni",
          "km": 168
        },
        {
          "bulan": "Juli",
          "km": 180
        },
        {
          "bulan": "Agustus",
          "km": 185
        },
        {
          "bulan": "September",
          "km": 178
        },
        {
          "bulan": "Oktober",
          "km": 190
        },
        {
          "bulan": "November",
          "km": 195
        },
        {
          "bulan": "Desember",
          "km": 322
        }
      ]
    }
  }
}
```

### Catatan Perhitungan

Semua value pada endpoint ini menggunakan metode pengambilan **median** sebagai nilai yang ditampilkan.

## 7. Name API: `/api/v1/kepala-dashboard/skor-beban-kerja-tim`

### Contoh Response

```json
{
  "status": "success",
  "message": "Data dashboard berhasil diambil",
  "data": {
    "periode": {
      "bulan": "April",
      "tahun": 2026
    },
    "kader": {
      "ringkasan": {
        "total_kader": 68,
        "skor_tertinggi": 92,
        "skor_terendah": 45,
        "rata_rata_skor": 68.0
      },
      "distribusi_beban_kerja": {
        "total_kader": 68,
        "detail": [
          {
            "kategori": "tinggi",
            "jumlah": 18,
            "persen": 26.5
          },
          {
            "kategori": "sedang",
            "jumlah": 32,
            "persen": 47.1
          },
          {
            "kategori": "rendah",
            "jumlah": 18,
            "persen": 26.5
          }
        ]
      }
    }
  }
}
```

### Catatan Perhitungan Distribusi Beban Kerja

Persentase tiap kategori dihitung dari jumlah kader pada kategori tersebut dibanding total kader.

Rumus:

```text
Persen kategori = (Jumlah kategori / Total kader) x 100%
```

Contoh:

```js
const total = 68;

const tinggi = (18 / total) * 100;
const sedang = (32 / total) * 100;
const rendah = (18 / total) * 100;

console.log(round(tinggi)); // 26.5
```

## 8. Name API: `/api/v1/kepala-dashboard/imunisasi-kependudukan`

### Contoh Response

```json
{
  "status": "success",
  "message": "Data dashboard berhasil diambil",
  "data": {
    "periode": {
      "bulan": "April",
      "tahun": 2026
    },
    "imunisasi": {
      "cakupan_persen": 87.5,
      "total_imunisasi": 352,
      "detail": {
        "bcg": 38,
        "dpt_1": 36,
        "dpt_2": 35,
        "dpt_3": 34,
        "polio_1": 37,
        "polio_2": 36,
        "polio_3": 35,
        "polio_4": 33,
        "hepatitis": 36,
        "campak": 32
      }
    },
    "kependudukan": {
      "anak": {
        "baduta_0_23_bulan": 198,
        "balita_24_59_bulan": 285,
        "pra_sekolah_60_72_bulan": 142
      },
      "bayi": {
        "bayi_baru_lahir": 42,
        "bayi_0_12_bulan_asuransi": 118
      },
      "ibu": {
        "wanita_pasca_subur": 245,
        "ibu_hamil_kek": 15,
        "ibu_hamil_risiko_tinggi": 8,
        "ibu_menyusui": 8,
        "ibu_hamil_asuransi": 89
      },
      "kesehatan_reproduksi": {
        "akseptor_kb": 156
      },
      "balita_asuransi": {
        "balita_0_59_bulan_asuransi": 340
      }
    }
  }
}
```

## 9. Name API: `/api/v1/kepala-dashboard/log-aktivitas-kader`

### Contoh Response

```json
{
  "status": "success",
  "message": "Data aktivitas posyandu berhasil diambil",
  "data": {
    "aktivitas": [
      {
        "tanggal": "2026-03-01",
        "posyandu": "Posyandu Kenanga 4",
        "aktivitas": "pengukuran balita",
        "deskripsi": "Pengukuran rutin 45 balita",
        "kader": "Siti Nurhaliza"
      },
      {
        "tanggal": "2026-03-01",
        "posyandu": "Posyandu Melati 1",
        "aktivitas": "pengukuran ibu hamil",
        "deskripsi": "Pemeriksaan 12 ibu hamil",
        "kader": "Aisyah Rahma"
      }
    ]
  }
}


 Pemetaan endpoint

  - INFORMASI_DATA_DESA -> /D:/Website-Puspadaya/src/app/api/dashboard-kepala-desa/informasi-data-desa.ts -> /D:/Website-Puspadaya/src/components/
    Dashboard/component-desa/KeyMetrics.tsx
  - TREND_DATA_POSYANDU -> /D:/Website-Puspadaya/src/app/api/dashboard-kepala-desa/tren-data.ts -> /D:/Website-Puspadaya/src/components/Dashboard/
    component-desa/PosyanduOverview.tsx
  - STATISTIK_DATA_DESA -> /D:/Website-Puspadaya/src/app/api/dashboard-kepala-desa/statistik-data-desa.ts -> /D:/Website-Puspadaya/src/components/
    Dashboard/component-desa/PerformanceSection.tsx
  - ANAK_CAKUPAN_DILAYANI -> /D:/Website-Puspadaya/src/app/api/dashboard-kepala-desa/anak-cakupan-dilayani.ts -> /D:/Website-Puspadaya/src/
    components/Dashboard/component-desa/AdditionalMetrics.tsx
  - STATISTIK_SKDN -> /D:/Website-Puspadaya/src/app/api/dashboard-kepala-desa/statistik-skdn.ts -> /D:/Website-Puspadaya/src/components/Dashboard/
    component-desa/SKDNBarChart.tsx
  - DURASI_KERJA_POSYANDU -> /D:/Website-Puspadaya/src/app/api/dashboard-kepala-desa/durasi-kerja-posyandu.ts -> /D:/Website-Puspadaya/src/
    components/Dashboard/component-desa/DurasiJarakAgregat.tsx
  - SKOR_BEBAN_KERJA_TIM -> /D:/Website-Puspadaya/src/app/api/dashboard-kepala-desa/skor-beban-kerja-tim.ts -> /D:/Website-Puspadaya/src/components/
    Dashboard/component-desa/BebanKerjaTimSummary.tsx
  - IMUNISASI_KEPENDUDUKAN -> /D:/Website-Puspadaya/src/app/api/dashboard-kepala-desa/imunisasi-kependudukan.ts -> /D:/Website-Puspadaya/src/
    components/Dashboard/component-desa/ExpandableDataSection.tsx
  - LOG_AKTIVITAS_KADER -> /D:/Website-Puspadaya/src/app/api/dashboard-kepala-desa/log-aktivitas-kader.ts -> /D:/Website-Puspadaya/src/components/
    Dashboard/component-desa/RecentActivityTable.tsx
```