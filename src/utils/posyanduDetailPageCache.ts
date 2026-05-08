export interface PosyanduDetailPageCacheEntry<TOverview, TRingkasan, TBalita, TKader, TKinerja> {
  cachedAt: number;
  detailToken: string;
  detailContext: {
    idPosyandu: string;
    bulan: number;
    tahun: number;
  };
  activeTab?: "overview" | "balita" | "kader" | "kinerja";
  balitaPage?: number;
  kaderPage?: number;
  overviewData: TOverview | null;
  ringkasanData: TRingkasan | null;
  balitaData: TBalita | null;
  kaderData: TKader | null;
  kinerjaData: TKinerja | null;
}

const STORAGE_KEY_PREFIX = "posyandu_detail_page_cache:v1:";
const MAX_AGE_MS = 15000;

const canUseStorage = () => typeof window !== "undefined" && typeof window.localStorage !== "undefined";

export const readPosyanduDetailPageCache = <TOverview, TRingkasan, TBalita, TKader, TKinerja>(
  detailToken: string
): PosyanduDetailPageCacheEntry<TOverview, TRingkasan, TBalita, TKader, TKinerja> | null => {
  if (!canUseStorage()) {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(`${STORAGE_KEY_PREFIX}${detailToken}`);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as PosyanduDetailPageCacheEntry<
      TOverview,
      TRingkasan,
      TBalita,
      TKader,
      TKinerja
    >;

    if (!parsed?.cachedAt || Date.now() - parsed.cachedAt > MAX_AGE_MS) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
};

export const writePosyanduDetailPageCache = <TOverview, TRingkasan, TBalita, TKader, TKinerja>(
  detailToken: string,
  entry: Omit<
    PosyanduDetailPageCacheEntry<TOverview, TRingkasan, TBalita, TKader, TKinerja>,
    "cachedAt" | "detailToken"
  >
): void => {
  if (!canUseStorage()) {
    return;
  }

  try {
    window.localStorage.setItem(
      `${STORAGE_KEY_PREFIX}${detailToken}`,
      JSON.stringify({
        ...entry,
        detailToken,
        cachedAt: Date.now(),
      })
    );
  } catch {
    // Ignore storage quota or serialization issues.
  }
};

export const mergePosyanduDetailPageCache = <TOverview, TRingkasan, TBalita, TKader, TKinerja>(
  detailToken: string,
  partialEntry: Partial<
    Omit<
      PosyanduDetailPageCacheEntry<TOverview, TRingkasan, TBalita, TKader, TKinerja>,
      "cachedAt" | "detailToken"
    >
  >
): void => {
  const currentEntry = readPosyanduDetailPageCache<TOverview, TRingkasan, TBalita, TKader, TKinerja>(detailToken);

  writePosyanduDetailPageCache(detailToken, {
    detailContext: partialEntry.detailContext ?? currentEntry?.detailContext ?? {
      idPosyandu: "",
      bulan: 0,
      tahun: 0,
    },
    activeTab: partialEntry.activeTab ?? currentEntry?.activeTab,
    balitaPage: partialEntry.balitaPage ?? currentEntry?.balitaPage,
    kaderPage: partialEntry.kaderPage ?? currentEntry?.kaderPage,
    overviewData: partialEntry.overviewData ?? currentEntry?.overviewData ?? null,
    ringkasanData: partialEntry.ringkasanData ?? currentEntry?.ringkasanData ?? null,
    balitaData: partialEntry.balitaData ?? currentEntry?.balitaData ?? null,
    kaderData: partialEntry.kaderData ?? currentEntry?.kaderData ?? null,
    kinerjaData: partialEntry.kinerjaData ?? currentEntry?.kinerjaData ?? null,
  });
};
