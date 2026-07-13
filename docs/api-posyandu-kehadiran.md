# API Endpoint: Kehadiran per Status Kemiskinan

**Endpoint:** `GET /api/posyandu/kepaladesa/{id_posyandu}/kehadiran`

**Query Parameters:**

| Parameter | Tipe | Wajib | Deskripsi |
|-----------|------|-------|-----------|
| `bulan` | number | Ya | Bulan periode aktif (1-12) |
| `tahun` | number | Ya | Tahun periode |

**Response (Success - 200):**

```json
{
  "status": "success",
  "message": "Data kehadiran berhasil dimuat",
  "data": {
    "periode": {
      "tahun": 2024
    },
    "ringkasan_kehadiran": [
      {
        "kategori": "Miskin A",
        "total": 20,
        "hadir": 15,
        "persentase": 75
      },
      {
        "kategori": "Miskin B",
        "total": 30,
        "hadir": 20,
        "persentase": 66.67
      },
      {
        "kategori": "Miskin C",
        "total": 25,
        "hadir": 22,
        "persentase": 88
      }
    ],
    "daftar_anak": [
      {
        "id": 1,
        "nama": "Andika Pratama",
        "nik": "1234567890123456",
        "ibu": "Siti Nurhaliza",
        "kategori_kemiskinan": "A",
        "absensi": {
          "jan": true,
          "feb": true,
          "mar": false,
          "apr": true,
          "mei": true,
          "jun": false,
          "jul": true,
          "agt": true,
          "sep": true,
          "okt": false,
          "nov": true,
          "des": true
        }
      }
    ]
  }
}
```

---

## TypeScript Interface

```typescript
// ========================================
// Ringkasan per kategori kemiskinan
// ========================================
interface DetailPosyanduKehadiranKemiskinanItem {
  kategori: string;    // "Miskin A" | "Miskin B" | "Miskin C"
  total: number;       // total anak dalam kategori ini
  hadir: number;       // jumlah anak yang hadir
  persentase: number;  // persentase kehadiran (0-100)
}

// ========================================
// Absensi anak per bulan
// ========================================
type BulanKehadiran = 'jan' | 'feb' | 'mar' | 'apr' | 'mei' | 'jun'
                    | 'jul' | 'agt' | 'sep' | 'okt' | 'nov' | 'des';

interface DetailPosyanduAnakKehadiranItem {
  id: number;                  // ID unik anak
  nama: string;                // Nama lengkap anak
  nik: string;                 // NIK anak
  ibu: string;                 // Nama ibu
  kategori_kemiskinan: string; // "A" | "B" | "C"
  absensi: Record<BulanKehadiran, boolean>;
  // true  = hadir
  // false = tidak hadir
}

// ========================================
// Main response data wrapper
// ========================================
interface DetailPosyanduKehadiranData {
  periode: {
    tahun: number;
  };
  ringkasan_kehadiran: DetailPosyanduKehadiranKemiskinanItem[];
  daftar_anak: DetailPosyanduAnakKehadiranItem[];
}
```

---

## Spesifikasi Detail

### 1. `ringkasan_kehadiran[]`

Array statistik kehadiran per kategori kemiskinan.

| Field | Tipe | Contoh | Keterangan |
|-------|------|--------|------------|
| `kategori` | string | `"Miskin A"` | Label kategori (A/B/C). Ditampilkan di card UI. |
| `total` | number | `20` | Total anak dalam kategori ini |
| `hadir` | number | `15` | Jumlah anak yang hadir pada bulan aktif |
| `persentase` | number | `75` | Persentase kehadiran. Ditampilkan di progress bar. Boleh desimal. |

### 2. `daftar_anak[]`

Array daftar anak dengan absensi bulanan.

| Field | Tipe | Contoh | Keterangan |
|-------|------|--------|------------|
| `id` | number | `1` | ID unik anak |
| `nama` | string | `"Andika Pratama"` | Nama lengkap anak |
| `nik` | string | `"1234567890123456"` | NIK (opsional, bisa string kosong) |
| `ibu` | string | `"Siti Nurhaliza"` | Nama ibu |
| `kategori_kemiskinan` | string | `"A"` | Kode kategori: `"A"`, `"B"`, atau `"C"` |
| `absensi` | object | `{ "jan": true, ... }` | Objek absensi 12 bulan. Key = kode bulan (3 huruf), Value = `true` (hadir) / `false` (tidak hadir). **Semua 12 field wajib ada.** |

### Kode Bulan (`BulanKehadiran`)

| Key | Bulan |
|-----|-------|
| `jan` | Januari |
| `feb` | Februari |
| `mar` | Maret |
| `apr` | April |
| `mei` | Mei |
| `jun` | Juni |
| `jul` | Juli |
| `agt` | Agustus |
| `sep` | September |
| `okt` | Oktober |
| `nov` | November |
| `des` | Desember |

### Ketentuan

1.  **Kategori kemiskinan** — Frontend mendukung 3 kategori: `"Miskin A"`, `"Miskin B"`, `"Miskin C"`. Jika ada kategori lain, akan tampil dengan warna default (abu-abu).
2.  **`persentase`** — Nilai 0-100. Ditampilkan langsung tanpa transformasi. Boleh desimal.
3.  **`absensi`** — Semua 12 bulan wajib diisi. Jika anak belum terdaftar di bulan tertentu, kirimkan `false`.
4.  **Method** — `GET`
5.  **Auth** — Membutuhkan Bearer token (sama seperti endpoint posyandu lainnya).

---

## Error Response

```json
{
  "status": "error",
  "message": "Gagal memuat data kehadiran",
  "data": null
}
```

Kode status HTTP yang mungkin:
- `401` — Token tidak valid / expired
- `404` — Posyandu tidak ditemukan
- `500` — Internal server error
