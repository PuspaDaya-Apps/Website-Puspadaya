import { dehydrate, hydrate, QueryClient } from '@tanstack/react-query';
import type { DehydratedState } from '@tanstack/react-query';
import { DASHBOARD_GC_TIME_MS } from './queryClient';

const STORAGE_KEY = 'puspadaya-react-query-cache:v1';
const WRITE_DEBOUNCE_MS = 1000;

interface PersistedQueryCache {
  savedAt: number;
  state: DehydratedState;
}

const isBrowser = () => typeof window !== 'undefined';

export const clearPersistedQueryCache = (): void => {
  if (!isBrowser()) {
    return;
  }

  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('Gagal menghapus cache React Query:', error);
  }
};

// Menulis cache apa adanya ke sessionStorage. Dipanggil debounced saat cache
// berubah, dan sekali lagi secara langsung sebelum login berpindah halaman.
export const flushQueryCache = (client: QueryClient): void => {
  if (!isBrowser()) {
    return;
  }

  try {
    const payload: PersistedQueryCache = {
      savedAt: Date.now(),
      state: dehydrate(client),
    };
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (error) {
    // Kuota penuh atau mode privat: cache di memori tetap jalan, jadi cukup
    // dicatat tanpa mengganggu render.
    console.warn('Gagal menyimpan cache React Query:', error);
  }
};

// Login memakai navigasi client-side, jadi cache di memori sudah bertahan
// sampai dashboard. Pemulihan di sini untuk kasus yang tetap memuat ulang
// halaman -- refresh manual (F5) atau membuka URL langsung -- supaya tidak
// memicu fetch ulang.
export const restoreQueryCache = (client: QueryClient): void => {
  if (!isBrowser()) {
    return;
  }

  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return;
    }

    const parsed = JSON.parse(raw) as PersistedQueryCache;

    if (!parsed || typeof parsed.savedAt !== 'number' || !parsed.state) {
      clearPersistedQueryCache();
      return;
    }

    if (Date.now() - parsed.savedAt > DASHBOARD_GC_TIME_MS) {
      clearPersistedQueryCache();
      return;
    }

    hydrate(client, parsed.state);
  } catch (error) {
    console.warn('Gagal memuat cache React Query:', error);
    clearPersistedQueryCache();
  }
};

export const startPersistingQueryCache = (client: QueryClient): (() => void) => {
  if (!isBrowser()) {
    return () => undefined;
  }

  let timer: number | null = null;

  const unsubscribe = client.getQueryCache().subscribe(() => {
    if (timer !== null) {
      window.clearTimeout(timer);
    }

    timer = window.setTimeout(() => {
      timer = null;
      flushQueryCache(client);
    }, WRITE_DEBOUNCE_MS);
  });

  return () => {
    if (timer !== null) {
      window.clearTimeout(timer);
    }

    unsubscribe();
  };
};
