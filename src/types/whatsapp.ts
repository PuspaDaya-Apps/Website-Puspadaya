// Type definitions for WhatsApp Integration

export interface WhatsAppConfig {
  api_key: string;
  api_url: string;
  sender_id: string;
  is_active: boolean;
}

export interface WhatsAppMessage {
  recipient: string; // phone number
  message: string;
  template_name?: string;
  template_data?: Record<string, string>;
  media_url?: string;
  scheduled_time?: string;
}

export interface WhatsAppTemplate {
  id: string;
  name: string;
  category: "appointment" | "alert" | "reminder" | "report" | "info";
  subject: string;
  body: string;
  variables: string[];
  example: string;
}

export interface WhatsAppLog {
  id: string;
  recipient: string;
  message: string;
  status: "sent" | "delivered" | "read" | "failed";
  sent_at: string;
  delivered_at?: string;
  read_at?: string;
  error_message?: string;
}

export interface WhatsAppStats {
  total_sent: number;
  total_delivered: number;
  total_read: number;
  total_failed: number;
  delivery_rate: number;
  read_rate: number;
  last_7_days: DailyStats[];
}

export interface DailyStats {
  date: string;
  sent: number;
  delivered: number;
  failed: number;
}

export interface SendMessageResult {
  success: boolean;
  message_id?: string;
  error?: string;
  recipient?: string;
}

// Message Templates for Posyandu
export const WHATSAPP_TEMPLATES: WhatsAppTemplate[] = [
  {
    id: "appointment_reminder",
    name: "Pengingat Posyandu",
    category: "reminder",
    subject: "🔔 Pengingat Posyandu",
    body: `Kepada Yth. Ibu {nama_ibu}
Posyandu {nama_posyandu}

🔔 PENGINGAT POSYANDU

Anak: {nama_anak}
Jadwal: {tanggal}
Pukul: {jam} WIB
Tempat: {tempat}

⚠️ PENTING:
{catatan_khusus}

Info: {nomor_kontak}`,
    variables: [
      "nama_ibu",
      "nama_posyandu",
      "nama_anak",
      "tanggal",
      "jam",
      "tempat",
      "catatan_khusus",
      "nomor_kontak",
    ],
    example:
      "Kepada Yth. Ibu Fatimah\nPosyandu Melati 1\n\n🔔 PENGINGAT POSYANDU\n\nAnak: Ahmad Rizki\nJadwal: Rabu, 15 Maret 2026\nPukul: 08.00 - 10.00 WIB\nTempat: Posyandu Melati 1\n\n⚠️ PENTING:\nAhmad Rizki termasuk prioritas monitoring gizi.\nMohon hadir tepat waktu.\n\nInfo: 0812-3456-7890",
  },
  {
    id: "critical_alert",
    name: "Alert Kasus Kritis",
    category: "alert",
    subject: "🚨 ALERT - Kasus Kritis",
    body: `🚨 ALERT - {jenis_alert}

Kepada: {nama_penerima}

Ditemukan {jenis_kasus} baru:
├─ Nama: {nama_anak}
├─ Usia: {usia} bulan
├─ Posyandu: {nama_posyandu}
├─ {detail_kasus}
└─ Prioritas: {prioritas}

TINDAKAN SEGERA:
{tindakan}

Silakan konfirmasi tindakan yang diambil.`,
    variables: [
      "jenis_alert",
      "nama_penerima",
      "jenis_kasus",
      "nama_anak",
      "usia",
      "nama_posyandu",
      "detail_kasus",
      "prioritas",
      "tindakan",
    ],
    example:
      "🚨 ALERT - Kasus Gizi Buruk\n\nKepada: Kepala Desa & Koordinator Kader\n\nDitemukan kasus gizi buruk baru:\n├─ Nama: Omar Abdullah\n├─ Usia: 17 bulan\n├─ Posyandu: Melati 1\n├─ BB: 7.2 kg (Sangat rendah)\n└─ Prioritas: SANGAT TINGGI\n\nTINDAKAN SEGERA:\n1. Kunjungan rumah hari ini\n2. Rujuk ke puskesmas\n3. Berikan makanan tambahan\n\nSilakan konfirmasi tindakan yang diambil.",
  },
  {
    id: "monthly_report",
    name: "Laporan Bulanan",
    category: "report",
    subject: "📊 Laporan Bulanan Posyandu",
    body: `📊 LAPORAN BULANAN POSYANDU
Periode: {periode}

📈 RINGKASAN:
├─ Total Posyandu: {total_posyandu}
├─ Kehadiran Balita: {kehadiran_balita} ({persentase_balita}%)
├─ Kehadiran Ibu Hamil: {kehadiran_ibu_hamil} ({persentase_ibu_hamil}%)
├─ Kasus Stunting: {kasus_stunting} {trend_stunting}
└─ Kasus Gizi Buruk: {kasus_gizi_buruk} {trend_gizi_buruk}

🏆 POSYANDU TERBAIK:
{ranking_posyandu}

⚠️ PERHATIAN:
{perhatian}

Laporan lengkap: {link_download}`,
    variables: [
      "periode",
      "total_posyandu",
      "kehadiran_balita",
      "persentase_balita",
      "kehadiran_ibu_hamil",
      "persentase_ibu_hamil",
      "kasus_stunting",
      "trend_stunting",
      "kasus_gizi_buruk",
      "trend_gizi_buruk",
      "ranking_posyandu",
      "perhatian",
      "link_download",
    ],
    example:
      "📊 LAPORAN BULANAN POSYANDU\nPeriode: Maret 2026\n\n📈 RINGKASAN:\n├─ Total Posyandu: 8\n├─ Kehadiran Balita: 375 (79%)\n├─ Kehadiran Ibu Hamil: 103 (82%)\n├─ Kasus Stunting: 32 ⬇️ (-3 dari bulan lalu)\n└─ Kasus Gizi Buruk: 11 ⬇️ (-2 dari bulan lalu)\n\n🏆 POSYANDU TERBAIK:\n1. Posyandu Kenanga 4 (92 poin)\n2. Posyandu Melati 1 (85 poin)\n3. Posyandu Kamboja 7 (82 poin)\n\n⚠️ PERHATIAN:\nPosyandu Matahari 8 perlu pembinaan\n(2 kasus gizi buruk baru)\n\nLaporan lengkap: [Link Download PDF]",
  },
  {
    id: "task_assignment",
    name: "Penugasan Kader",
    category: "info",
    subject: "✅ Tugas Baru",
    body: `✅ TUGAS BARU

Kepada: {nama_kader}
Posyandu: {nama_posyandu}

Anda mendapat tugas baru:
📋 {jenis_tugas}

📍 Lokasi: {lokasi}
⏰ Deadline: {deadline}
🔴 Prioritas: {prioritas}

📝 Detail:
{detail_tugas}

Silakan konfirmasi penerimaan tugas ini.`,
    variables: [
      "nama_kader",
      "nama_posyandu",
      "jenis_tugas",
      "lokasi",
      "deadline",
      "prioritas",
      "detail_tugas",
    ],
    example:
      "✅ TUGAS BARU\n\nKepada: Kader Siti Nurhaliza\nPosyandu: Melati 1\n\nAnda mendapat tugas baru:\n📋 Kunjungan Rumah\n\n📍 Lokasi: Rumah Ahmad Rizki, Dusun Krajan\n⏰ Deadline: Hari ini, 17:00 WIB\n🔴 Prioritas: URGENT\n\n📝 Detail:\n- Anak gizi buruk, perlu monitoring berat badan\n- Bawa makanan tambahan\n- Laporkan hasil kunjungan\n\nSilakan konfirmasi penerimaan tugas ini.",
  },
  {
    id: "burnout_alert",
    name: "Alert Kader Burnout",
    category: "alert",
    subject: "⚠️ Alert Beban Kerja Kader",
    body: `⚠️ ALERT BEBAN KERJA KADER

Kepada: {nama_penerima}

Kader berikut mengalami beban kerja TINGGI:

👤 {nama_kader}
📍 Posyandu: {nama_posyandu}

📊 Indikator:
├─ Skor Beban: {skor_beban}/100
├─ Jam Kerja: {jam_kerja} jam/minggu
├─ Balita Dibina: {total_balita} anak
└─ Trend: {trend_beban}

💡 REKOMENDASI:
{rekomendasi}

Mohon tindak lanjuti untuk mencegah burnout.`,
    variables: [
      "nama_penerima",
      "nama_kader",
      "nama_posyandu",
      "skor_beban",
      "jam_kerja",
      "total_balita",
      "trend_beban",
      "rekomendasi",
    ],
    example:
      "⚠️ ALERT BEBAN KERJA KADER\n\nKepada: Kepala Desa\n\nKader berikut mengalami beban kerja TINGGI:\n\n👤 Siti Nurhaliza\n📍 Posyandu: Kenanga 4\n\n📊 Indikator:\n├─ Skor Beban: 92/100\n├─ Jam Kerja: 65 jam/minggu\n├─ Balita Dibina: 60 anak\n└─ Trend: Meningkat 40%\n\n💡 REKOMENDASI:\n1. Redistribusi 15 balita ke kader lain\n2. Wajibkan cuti 1 minggu\n3. Rekrut 2 kader pendamping\n\nMohon tindak lanjuti untuk mencegah burnout.",
  },
  {
    id: "attendance_low",
    name: "Alert Kehadiran Rendah",
    category: "alert",
    subject: "📉 Alert Kehadiran Rendah",
    body: `📉 ALERT KEHADIRAN RENDAH

Posyandu: {nama_posyandu}
Periode: {periode}

📊 Data Kehadiran:
├─ Balita: {kehadiran_balita}/{total_balita} ({persentase_balita}%) ⬇️
└─ Ibu Hamil: {kehadiran_ibu_hamil}/{total_ibu_hamil} ({persentase_ibu_hamil}%) ⬇️

📉 Penurunan: {penurunan}% dari bulan lalu

🔍 Kemungkinan Penyebab:
{kemungkinan_penyebab}

💡 Saran Tindakan:
{saran_tindakan}

Mohon evaluasi dan tindak lanjuti.`,
    variables: [
      "nama_posyandu",
      "periode",
      "kehadiran_balita",
      "total_balita",
      "persentase_balita",
      "kehadiran_ibu_hamil",
      "total_ibu_hamil",
      "persentase_ibu_hamil",
      "penurunan",
      "kemungkinan_penyebab",
      "saran_tindakan",
    ],
    example:
      "📉 ALERT KEHADIRAN RENDAH\n\nPosyandu: Matahari 8\nPeriode: Maret 2026\n\n📊 Data Kehadiran:\n├─ Balita: 35/55 (64%) ⬇️\n└─ Ibu Hamil: 10/16 (63%) ⬇️\n\n📉 Penurunan: 17% dari bulan lalu\n\n🔍 Kemungkinan Penyebab:\n- Musim panen (orang tua sibuk di ladang)\n- Jadwal bentrok dengan acara desa\n\n💡 Saran Tindakan:\n1. Ubah jadwal ke minggu setelah panen\n2. Kirim reminder H-3 via WhatsApp\n3. Kunjungan rumah untuk yang tidak hadir\n\nMohon evaluasi dan tindak lanjuti.",
  },
];

// Helper function to format message from template
export const formatWhatsAppMessage = (
  template: WhatsAppTemplate,
  data: Record<string, string>
): string => {
  let message = template.body;

  Object.keys(data).forEach((key) => {
    const regex = new RegExp(`{${key}}`, "g");
    message = message.replace(regex, data[key] || "");
  });

  return message;
};

// Helper function to validate phone number
export const validatePhoneNumber = (phone: string): boolean => {
  // Remove spaces, dashes, and parentheses
  const cleaned = phone.replace(/[\s\-\(\)]/g, "");

  // Check if it's a valid Indonesian phone number
  // Should start with +62, 62, or 0
  // Followed by 9-12 digits
  const regex = /^(\+62|62|0)[0-9]{9,12}$/;
  return regex.test(cleaned);
};

// Helper function to format phone number to WhatsApp format
export const formatPhoneNumber = (phone: string): string => {
  // Remove spaces, dashes, and parentheses
  let cleaned = phone.replace(/[\s\-\(\)]/g, "");

  // Replace leading 0 with 62
  if (cleaned.startsWith("0")) {
    cleaned = "62" + cleaned.substring(1);
  }

  // Remove leading + if present
  if (cleaned.startsWith("+")) {
    cleaned = cleaned.substring(1);
  }

  return cleaned;
};
