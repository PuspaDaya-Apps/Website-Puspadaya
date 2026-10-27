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

// Login tidak boleh tertahan lama hanya karena prefetch. Setelah batas ini
// tercapai, navigasi tetap jalan dan sisa permintaan diselesaikan oleh hook di
// dashboard seperti biasa.
const PREFETCH_TIMEOUT_MS = 2500;

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

// Dipanggil setelah login berhasil dan sebelum pindah ke dashboard, supaya
// dashboard dibuka dengan data yang sudah ada di cache.
export const prefetchDashboardData = async (role: string): Promise<void> => {
  if (typeof window === 'undefined') {
    return;
  }

  const client = getQueryClient();
  const tasks = buildTasks(client, role.trim().toLowerCase());

  const allSettled = Promise.allSettled(tasks.map((task) => task()));
  const timeout = new Promise<void>((resolve) => {
    window.setTimeout(resolve, PREFETCH_TIMEOUT_MS);
  });

  await Promise.race([allSettled, timeout]);

  // Login berpindah halaman dengan location.replace(), jadi cache harus sudah
  // tertulis sebelum navigasi -- tidak ada waktu untuk penulisan debounced.
  flushQueryCache(client);
};
