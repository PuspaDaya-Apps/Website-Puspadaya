export interface PageStateCacheEntry<T> {
  cachedAt: number;
  data: T;
}

const CACHE_PREFIX = "puspadaya-page-cache:v1:";
const DEFAULT_MAX_AGE_MS = 15000;

const canUseStorage = () => typeof window !== "undefined" && typeof window.localStorage !== "undefined";

export const buildPageStateCacheKey = (routeKey: string, scope: string): string => {
  return `${CACHE_PREFIX}${routeKey}:${scope}`;
};

export const readPageStateCache = <T>(
  cacheKey: string,
  maxAgeMs: number = DEFAULT_MAX_AGE_MS
): PageStateCacheEntry<T> | null => {
  if (!canUseStorage()) {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(cacheKey);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as PageStateCacheEntry<T>;
    if (!parsed || typeof parsed.cachedAt !== "number" || !("data" in parsed)) {
      return null;
    }

    if (Date.now() - parsed.cachedAt > maxAgeMs) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
};

export const writePageStateCache = <T>(cacheKey: string, data: T): void => {
  if (!canUseStorage()) {
    return;
  }

  try {
    const payload: PageStateCacheEntry<T> = {
      cachedAt: Date.now(),
      data,
    };

    window.localStorage.setItem(cacheKey, JSON.stringify(payload));
  } catch {
    // Ignore storage failures.
  }
};
