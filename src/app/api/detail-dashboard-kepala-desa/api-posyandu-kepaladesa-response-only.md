# API Response Posyandu Kepala Desa

## `/api/posyandu/kepaladesa/{id_posyandu}/ringkasan`

```json
{
  "success": true,
  "message": "Berhasil mengambil ringkasan posyandu",
  "data": {
    "periode": {
      "bulan": "April",
      "tahun": 2026
    },
    "posyandu": {
      "id": 2,
      "nama": "Posyandu Mawar 2",
      "alamat": {
        "dusun": "Sindangsari",
        "kecamatan": "Puspadiaya"
      }
    },
    "ringkasan": {
      "total_balita": 52,
      "total_ibu_hamil": 15,
      "total_kader": 10,
      "hadir_balita": 42,
      "hadir_ibu_hamil": 12,
      "stunting": 5,
      "gizi_buruk": 2,
      "normal": 45
    }
  }
}
```

## `/api/posyandu/kepaladesa/{id_posyandu}/overview`

```json
{
  "success": true,
  "message": "Berhasil mengambil overview posyandu",
  "data": {
    "periode": {
      "bulan": "April",
      "tahun": 2026
    },
    "tingkat_kehadiran": {
      "persentase": 81,
      "hadir": 42,
      "total": 52
    },
    "status_gizi_balita": [
      {
        "status": "Stunting",
        "jumlah": 5,
        "persentase": 9.6
      },
      {
        "status": "Gizi Buruk",
        "jumlah": 2,
        "persentase": 3.8
      },
      {
        "status": "Normal",
        "jumlah": 45,
        "persentase": 86.5
      }
    ],
    "kasus_kritis": [
      {
        "id_balita": 101,
        "nama": "Nurul Hidayah",
        "usia": "21 bulan",
        "status": "Gizi Buruk"
      },
      {
        "id_balita": 102,
        "nama": "Yusuf Ibrahim",
        "usia": "18 bulan",
        "status": "Gizi Kurang"
      }
    ]
  }
}
```

## `/api/posyandu/kepaladesa/{id_posyandu}/balita-khusus`

```json
{
  "success": true,
  "message": "Berhasil mengambil data balita dengan kondisi khusus",
  "data": {
    "periode": {
      "bulan": "April",
      "tahun": 2026
    },
    "balita": [
      {
        "id_balita": 101,
        "nama": "Nurul Hidayah",
        "usia": "21 bulan",
        "ibu": "Maryam",
        "berat_badan": 8.2,
        "tinggi_badan": 80,
        "status": "Gizi Buruk"
      },
      {
        "id_balita": 102,
        "nama": "Yusuf Ibrahim",
        "usia": "18 bulan",
        "ibu": "Nurul Hidayah",
        "berat_badan": 8.3,
        "tinggi_badan": 75,
        "status": "Gizi Kurang"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total_data": 2,
      "total_page": 1
    }
  }
}
```

## `/api/posyandu/kepaladesa/{id_posyandu}/kader`

```json
{
  "success": true,
  "message": "Berhasil mengambil data kader posyandu",
  "data": {
    "periode": {
      "bulan": "April",
      "tahun": 2026
    },
"total_sasaran": {
"total_balita_sasaran": 45,
"total_ibu_hamil_sasaran": 12
},
"kategori_kinerja": {
"rendah": {
"min": 0,
"max": 59
},
"sedang": {
"min": 60,
"max": 79
},
"tinggi": {
"min": 80,
"max": 100
}
}, 
    "kategori_kinerja": {
      "rendah": {
        "min": 0,
        "max": 59
      },
      "sedang": {
        "min": 60,
        "max": 79
      },
      "tinggi": {
        "min": 80,
        "max": 100
      }
    },
    "kader": [
      {
        "id_kader": 1,
        "nama": "Fatimah Zahra",
        "jabatan": "Bendahara",
        "jumlah_balita_didampingi": 52,
        "jumlah_ibu_hamil_didampingi": 15,
        "indikator_kinerja": {
          "kehadiran_kader": {
            "jumlah_hadir": 3,
            "total_kegiatan": 4,
            "persentase": 75
          },
          "cakupan_pendampingan": {
            "jumlah_didampingi": 67,
            "total_sasaran": 67,
            "persentase": 100
          },
          "ketepatan_laporan": {
            "jumlah_laporan_tepat_waktu": 2,
            "total_laporan": 4,
            "persentase": 50
          }
        },
        "skor_kinerja": 78,
        "status_kinerja": "Sedang"
      },
      {
        "id_kader": 2,
        "nama": "Aminah Santoso",
        "jabatan": "Kader",
        "jumlah_balita_didampingi": 35,
        "jumlah_ibu_hamil_didampingi": 10,
        "indikator_kinerja": {
          "kehadiran_kader": {
            "jumlah_hadir": 3,
            "total_kegiatan": 4,
            "persentase": 75
          },
          "cakupan_pendampingan": {
            "jumlah_didampingi": 45,
            "total_sasaran": 67,
            "persentase": 67
          },
          "ketepatan_laporan": {
            "jumlah_laporan_tepat_waktu": 2,
            "total_laporan": 4,
            "persentase": 50
          }
        },
        "skor_kinerja": 62,
        "status_kinerja": "Sedang"
      }
    ]
  }
}
```

## `/api/posyandu/kepaladesa/{id_posyandu}/kinerja`

```json
{
  "success": true,
  "message": "Berhasil mengambil data kinerja posyandu",
  "data": {
    "periode": {
      "bulan": "April",
      "tahun": 2026
    },
    "kinerja": {
      "skor": 78,
      "kategori": "Baik",
      "indikator": {
        "kehadiran": {
          "jumlah_hadir": 54,
          "total_sasaran": 67,
          "persentase": 81
        },
        "pengukuran_balita": {
          "jumlah_diukur": 42,
          "total_sasaran": 52,
          "persentase": 80
        },
        "pengukuran_ibu_hamil": {
          "jumlah_diukur": 12,
          "total_sasaran": 16,
          "persentase": 75
        }
      },
      "tren_kehadiran_6_bulan": [
        {
          "bulan": "Jan",
          "jumlah_hadir": 320
        },
        {
          "bulan": "Feb",
          "jumlah_hadir": 335
        },
        {
          "bulan": "Mar",
          "jumlah_hadir": 345
        },
        {
          "bulan": "Apr",
          "jumlah_hadir": 350
        },
        {
          "bulan": "Mei",
          "jumlah_hadir": 358
        },
        {
          "bulan": "Jun",
          "jumlah_hadir": 362
        }
      ]
    }
  }
}
```

## `/api/posyandu/kepaladesa/{id_posyandu}/kinerja-per-posyandu`

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
        { "bulan": "Januari", "kerja_posyandu": 15, "kunjungan_rumah": 10 },
        { "bulan": "Februari", "kerja_posyandu": 18, "kunjungan_rumah": 12 },
        { "bulan": "Maret", "kerja_posyandu": 20, "kunjungan_rumah": 14 },
        { "bulan": "April", "kerja_posyandu": 19, "kunjungan_rumah": 13 },
        { "bulan": "Mei", "kerja_posyandu": 22, "kunjungan_rumah": 15 },
        { "bulan": "Juni", "kerja_posyandu": 21, "kunjungan_rumah": 14 },
        { "bulan": "Juli", "kerja_posyandu": 23, "kunjungan_rumah": 16 },
        { "bulan": "Agustus", "kerja_posyandu": 24, "kunjungan_rumah": 17 },
        { "bulan": "September", "kerja_posyandu": 22, "kunjungan_rumah": 15 },
        { "bulan": "Oktober", "kerja_posyandu": 25, "kunjungan_rumah": 18 },
        { "bulan": "November", "kerja_posyandu": 26, "kunjungan_rumah": 20 },
        { "bulan": "Desember", "kerja_posyandu": 176, "kunjungan_rumah": 107 }
      ],
      "jarak_tempuh": [
        { "bulan": "Januari", "km": 150 },
        { "bulan": "Februari", "km": 160 },
        { "bulan": "Maret", "km": 165 },
        { "bulan": "April", "km": 170 },
        { "bulan": "Mei", "km": 175 },
        { "bulan": "Juni", "km": 168 },
        { "bulan": "Juli", "km": 180 },
        { "bulan": "Agustus", "km": 185 },
        { "bulan": "September", "km": 178 },
        { "bulan": "Oktober", "km": 190 },
        { "bulan": "November", "km": 195 },
        { "bulan": "Desember", "km": 322 }
      ]
    }
  }
}
```

## `/api/posyandu/kepaladesa/{id_posyandu}/balita-all`

```json
{
  "success": true,
  "message": "Berhasil mengambil data balita dengan kondisi khusus",
  "data": {
    "periode": {
      "bulan": "April",
      "tahun": 2026
    },
    "balita": [
      {
        "id_balita": 101,
        "nama": "Nurul Hidayah",
        "usia": "21 bulan",
        "ibu": "Maryam",
        "berat_badan": 8.2,
        "tinggi_badan": 80,
        "status": "Gizi Buruk"
      },
      {
        "id_balita": 102,
        "nama": "Yusuf Ibrahim",
        "usia": "18 bulan",
        "ibu": "Nurul Hidayah",
        "berat_badan": 8.3,
        "tinggi_badan": 75,
        "status": "Gizi Kurang"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total_data": 2,
      "total_page": 1
    }
  }
}
```
