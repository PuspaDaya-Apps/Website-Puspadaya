# Dokumentasi Endpoint

## /api/posyandu/kepaladesa/kinerja/ringkasan

```json
{
  "success": true,
  "message": "Berhasil mengambil ringkasan kinerja seluruh posyandu",
  "data": {
    "periode": {
      "bulan": "April",
      "tahun": 2026
    },
    "total_posyandu": 8,
    "rata_rata_skor": 75,
    "maksimal_skor": 100,
    "kategori_posyandu": {
      "sangat_baik": 2,
      "baik": 3,
      "cukup": 2,
      "kurang": 1
    }
  }
}
```

## /api/posyandu/kepaladesa/kinerja/perhatian-khusus

```json
{
  "success": true,
  "message": "Berhasil mengambil posyandu yang perlu perhatian khusus",
  "data": {
    "periode": {
      "bulan": "April",
      "tahun": 2026
    },
    "posyandu": [
      {
        "rank": 8,
        "id_posyandu": 8,
        "nama_posyandu": "Posyandu Matahari 8",
        "lokasi": "Dusun Cikeris",
        "skor": 58,
        "kategori": "Kurang"
      },
      {
        "rank": 7,
        "id_posyandu": 5,
        "nama_posyandu": "Posyandu Dahlia 5",
        "lokasi": "Dusun Neglasari",
        "skor": 65,
        "kategori": "Cukup"
      },
      {
        "rank": 6,
        "id_posyandu": 3,
        "nama_posyandu": "Posyandu Anggrek 3",
        "lokasi": "Dusun Sukamaju",
        "skor": 68,
        "kategori": "Cukup"
      }
    ]
  }
}
```

## /api/posyandu/kepaladesa/data-kasus-kritis-balita

```json
{
  "data": {
    "periode": {
      "bulan": "April",
      "tahun": 2026
    },
    "ringkasan": {
      "total_kasus": 12,
      "wasting": 8,
      "underweight": 7,
      "stunting": 9,
      "prioritas": {
        "sangat_tinggi": 4,
        "tinggi": 4,
        "sedang": 4
      }
    },
    "kasus_kritis": [
      {
        "id": 1,
        "nama_posyandu": "Posyandu Melati 1",
        "total_anak": 45,
        "stunting": 3,
        "wasting": 1,
        "underweight": 0,
        "normal": 41
      },
      {
        "id": 2,
        "nama_posyandu": "Posyandu Mawar 2",
        "total_anak": 52,
        "stunting": 5,
        "wasting": 2,
        "underweight": 0,
        "normal": 45
      },
      {
        "id": 3,
        "nama_posyandu": "Posyandu Anggrek 3",
        "total_anak": 38,
        "stunting": 4,
        "wasting": 1,
        "underweight": 0,
        "normal": 33
      },
      {
        "id": 4,
        "nama_posyandu": "Posyandu Kenanga 4",
        "total_anak": 60,
        "stunting": 2,
        "wasting": 0,
        "underweight": 0,
        "normal": 58
      },
      {
        "id": 5,
        "nama_posyandu": "Posyandu Dahlia 5",
        "total_anak": 42,
        "stunting": 6,
        "wasting": 2,
        "underweight": 0,
        "normal": 34
      },
      {
        "id": 6,
        "nama_posyandu": "Posyandu Teratai 6",
        "total_anak": 35,
        "stunting": 2,
        "wasting": 1,
        "underweight": 0,
        "normal": 32
      },
      {
        "id": 7,
        "nama_posyandu": "Posyandu Kamboja 7",
        "total_anak": 48,
        "stunting": 3,
        "wasting": 1,
        "underweight": 0,
        "normal": 44
      },
      {
        "id": 8,
        "nama_posyandu": "Posyandu Matahari 8",
        "total_anak": 55,
        "stunting": 7,
        "wasting": 3,
        "underweight": 0,
        "normal": 45
      }
    ]
  }
}
```

## /api/posyandu/kepaladesa/data-kasus-kritis

```json
{
  "data": {
    "periode": {
      "bulan": "April",
      "tahun": 2026
    },
    "daftar_prioritas": [
      {
        "id": 1,
        "prioritas": "Sangat Tinggi",
        "anak": {
          "id_anak": "ANK-001",
          "nama": "Ahmad Rizki",
          "ibu": "Fatimah",
          "usia_bulan": 23
        },
        "lokasi": {
          "posyandu": "Posyandu Matahari 8",
          "dusun": "Cikeris"
        },
        "pengukuran": {
          "berat_badan_kg": 7.5,
          "tinggi_badan_cm": 75
        },
        "status": [
          "Wasting",
          "Stunting",
          "Wasting"
        ]
      },
      {
        "id": 2,
        "prioritas": "Sangat Tinggi",
        "anak": {
          "id_anak": "ANK-002",
          "nama": "Siti Aisyah",
          "ibu": "Aminah",
          "usia_bulan": 26
        },
        "lokasi": {
          "posyandu": "Posyandu Dahlia 5",
          "dusun": "Neglasari"
        },
        "pengukuran": {
          "berat_badan_kg": 8,
          "tinggi_badan_cm": 78
        },
        "status": [
          "Wasting",
          "Stunting",
          "Wasting"
        ]
      },
      {
        "id": 3,
        "prioritas": "Sangat Tinggi",
        "anak": {
          "id_anak": "ANK-003",
          "nama": "Muhammad Fikri",
          "ibu": "Khadijah",
          "usia_bulan": 21
        },
        "lokasi": {
          "posyandu": "Posyandu Anggrek 3",
          "dusun": "Sukamaju"
        },
        "pengukuran": {
          "berat_badan_kg": 7.8,
          "tinggi_badan_cm": 72
        },
        "status": [
          "Wasting",
          "Stunting"
        ]
      },
      {
        "id": 4,
        "prioritas": "Tinggi",
        "anak": {
          "id_anak": "ANK-004",
          "nama": "Nurul Hidayah",
          "ibu": "Maryam",
          "usia_bulan": 24
        },
        "lokasi": {
          "posyandu": "Posyandu Mawar 2",
          "dusun": "Sindangsari"
        },
        "pengukuran": {
          "berat_badan_kg": 8.2,
          "tinggi_badan_cm": 80
        },
        "status": [
          "Wasting",
          "Wasting"
        ]
      },
      {
        "id": 5,
        "prioritas": "Tinggi",
        "anak": {
          "id_anak": "ANK-005",
          "nama": "Budi Santoso",
          "ibu": "Siti Nurhaliza",
          "usia_bulan": 22
        },
        "lokasi": {
          "posyandu": "Posyandu Matahari 8",
          "dusun": "Cikeris"
        },
        "pengukuran": {
          "berat_badan_kg": 8.5,
          "tinggi_badan_cm": 76
        },
        "status": [
          "Underweight",
          "Stunting"
        ]
      }
    ]
  }
}
```

## /api/posyandu/kepaladesa/detail/data-kasus-kritis

```json
{
  "data": {
    "anak": {
      "id_anak": "ANK-001",
      "nama": "Ahmad Rizki",
      "nik": "3205012345670001",
      "tanggal_lahir": "2024-06-15",
      "usia_bulan": 23,
      "jenis_kelamin": "Laki-laki",
      "nama_ibu": "Fatimah"
    },
    "lokasi": {
      "posyandu": "Posyandu Matahari 8",
      "dusun": "Cikeris"
    },
    "pengukuran_terakhir": {
      "berat_badan_kg": 7.5,
      "tinggi_badan_cm": 75,
      "tanggal": "2026-02-25"
    },
    "status_kesehatan": [
      "Wasting",
      "Stunting",
      "Wasting"
    ],
    "prioritas": "Sangat Tinggi"
  }
}
```