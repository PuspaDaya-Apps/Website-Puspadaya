export interface CachedApiPayload<T> {
  cachedAt: number;
  data: T;
}

const CACHE_PREFIX = "puspadaya-api-cache:v1:";

const isBrowser = () => typeof window !== "undefined";

const makeCacheKey = (namespace: string, identifier: string) => `${CACHE_PREFIX}${namespace}:${identifier}`;

const stableSerialize = (value: unknown): string => {
  if (value === null || value === undefined) {
    return "";
  }

  if (Array.isArray(value)) {
    return `[${value.map((item) => stableSerialize(item)).join(",")}]`;
  }

  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>)
      .filter(([, item]) => item !== undefined && item !== null && item !== "")
      .sort(([a], [b]) => a.localeCompare(b));

    return `{${entries.map(([key, item]) => `${key}:${stableSerialize(item)}`).join(",")}}`;
  }

  return String(value);
};

export const buildApiCacheKey = (namespace: string, endpoint: string, params: unknown): string => {
  return makeCacheKey(namespace, `${endpoint}?${stableSerialize(params)}`);
};

export const readApiCache = <T>(cacheKey: string): CachedApiPayload<T> | null => {
  if (!isBrowser()) {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(cacheKey);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as CachedApiPayload<T>;
    if (!parsed || typeof parsed.cachedAt !== "number" || !("data" in parsed)) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
};

export const writeApiCache = <T>(cacheKey: string, data: T): void => {
  if (!isBrowser()) {
    return;
  }

  try {
    const payload: CachedApiPayload<T> = {
      cachedAt: Date.now(),
      data,
    };
    window.localStorage.setItem(cacheKey, JSON.stringify(payload));
  } catch (error) {
    console.warn("Gagal menyimpan cache API:", error);
  }
};

export const isApiCacheFresh = (cachedAt: number, maxAgeMs: number): boolean => {
  return Date.now() - cachedAt <= maxAgeMs;
};
