import { QueryClient } from '@tanstack/react-query';
import { currentUser } from '@/app/api/user/currentUser';
import {
  fetchAnakCakupanDilayani,
  fetchDurasiKerjaPosyandu,
  fetchImunisasiKependudukan,
  fetchInformasiDataDesa,
  fetchLogAktivitasKader,
  fetchSkorBebanKerjaTim,
  fetchStatistikDataDesa,
  fetchStatistikSkdn,
  fetchTrenDataPosyandu,
} from '@/app/api/dashboard-kepala-desa';
import { Databalita } from '@/app/api/dashboatrd-new/databalita';
import { Statistikbebankerja } from '@/app/api/dashboatrd-new/statistikbebankerja';
import { StatistikBulanan } from '@/app/api/dashboatrd-new/statistikbulanan';
import { StatistikJarakTempuh } from '@/app/api/dashboatrd-new/statistikjaraktempuh';
import { StatistikJenisPekerjaan } from '@/app/api/dashboatrd-new/statistikjenispekerjaan';
import { statistikDashboard } from '@/app/api/statistik/statistik';
import { unwrapFetchResult } from './fetchResult';
import { flushQueryCache } from './persist';
import { getQueryClient } from './queryClient';
import { DashboardPeriod, queryKeys } from './queryKeys';

type PrefetchTask = () => Promise<unknown>;

const buildTasks = (client: QueryClient, normalizedRole: string): PrefetchTask[] => {
  const now = new Date();
  const period: DashboardPeriod = {
    bulan: now.getMonth() + 1,
    tahun: now.getFullYear(),
  };

  const tasks: PrefetchTask[] = [
    () =>
      client.prefetchQuery({
        queryKey: queryKeys.currentUser(),
        queryFn: () => unwrapFetchResult(currentUser()),
      }),
  ];

  const isStatistikRole = [
    'admin',
    'super admin',
    'dinas kesehatan',
    'dinas sosial',
    'tpg',
    'tenaga pelaksana gizi',
  ].includes(normalizedRole);

  if (isStatistikRole) {
    tasks.push(() =>
      client.prefetchQuery({
        queryKey: queryKeys.statistikDashboard(sessionStorage.getItem('user_role') ?? ''),
        queryFn: () => unwrapFetchResult(statistikDashboard()),
      })
    );
  }

  if (normalizedRole === 'kepala desa') {
    tasks.push(
      () =>
        client.prefetchQuery({
          queryKey: queryKeys.kepalaDesa.informasiDataDesa(period),
          queryFn: () => unwrapFetchResult(fetchInformasiDataDesa(period)),
        }),
      () =>
        client.prefetchQuery({
          queryKey: queryKeys.kepalaDesa.trenDataPosyandu(period),
          queryFn: () => unwrapFetchResult(fetchTrenDataPosyandu(period)),
        }),
      () =>
        client.prefetchQuery({
          queryKey: queryKeys.kepalaDesa.statistikDataDesa(period),
          queryFn: () => unwrapFetchResult(fetchStatistikDataDesa(period)),
        }),
      () =>
        client.prefetchQuery({
          queryKey: queryKeys.kepalaDesa.anakCakupanDilayani(period),
          queryFn: () => unwrapFetchResult(fetchAnakCakupanDilayani(period)),
        }),
      () =>
        client.prefetchQuery({
          queryKey: queryKeys.kepalaDesa.statistikSkdn(period),
          queryFn: () => unwrapFetchResult(fetchStatistikSkdn(period)),
        }),
      () =>
        client.prefetchQuery({
          queryKey: queryKeys.kepalaDesa.durasiKerjaPosyandu(period),
          queryFn: () => unwrapFetchResult(fetchDurasiKerjaPosyandu(period)),
        }),
      () =>
        client.prefetchQuery({
          queryKey: queryKeys.kepalaDesa.skorBebanKerjaTim(period),
          queryFn: () => unwrapFetchResult(fetchSkorBebanKerjaTim(period)),
        }),
      () =>
        client.prefetchQuery({
          queryKey: queryKeys.kepalaDesa.imunisasiKependudukan(period),
          queryFn: () => unwrapFetchResult(fetchImunisasiKependudukan(period)),
        }),
      () =>
        client.prefetchQuery({
          queryKey: queryKeys.kepalaDesa.logAktivitasKader(period),
          queryFn: () => unwrapFetchResult(fetchLogAktivitasKader(period)),
        })
    );
  }

  const isKaderRole = ['ketua kader', 'kader', 'anggota kader', 'bidan'].includes(normalizedRole);

  if (isKaderRole) {
    tasks.push(
      () =>
        client.prefetchQuery({
          queryKey: queryKeys.kader.profil(),
          queryFn: () => unwrapFetchResult(StatistikJenisPekerjaan(false)),
        }),
      () =>
        client.prefetchQuery({
          queryKey: queryKeys.kader.bebanKerja(),
          queryFn: () => unwrapFetchResult(Statistikbebankerja(false)),
        }),
      () =>
        client.prefetchQuery({
          queryKey: queryKeys.kader.statistikBulanan(),
          queryFn: () => unwrapFetchResult(StatistikBulanan(false)),
        }),
      () =>
        client.prefetchQuery({
          queryKey: queryKeys.kader.jarakTempuh(),
          queryFn: () => unwrapFetchResult(StatistikJarakTempuh(false)),
        }),
      () =>
        client.prefetchQuery({
          queryKey: queryKeys.kader.daftarBalita(),
          queryFn: () => unwrapFetchResult(Databalita()),
        })
    );
  }

  return tasks;
};

// Dipanggil setelah login berhasil dan sebelum router.replace(), supaya
// dashboard dibuka dengan cache yang sudah terisi. Pemanggilnya membatasi
// waktu tunggu (lihat PREFETCH_MAX_WAIT_MS di SigninWithPassword) agar login
// tidak tertahan kalau API lambat; sisa request yang belum selesai tetap jalan
// karena navigasinya client-side.
//
// Catatan: fungsi ini tidak pernah reject (Promise.allSettled).
export const prefetchDashboardData = async (role: string): Promise<void> => {
  if (typeof window === 'undefined') {
    return;
  }

  const client = getQueryClient();
  const tasks = buildTasks(client, role.trim().toLowerCase());

  await Promise.allSettled(tasks.map((task) => task()));

  // Tulis cache ke sessionStorage begitu semuanya selesai, supaya hasilnya
  // masih terpakai kalau prefetch sempat tuntas sebelum halaman berpindah.
  flushQueryCache(client);
};
