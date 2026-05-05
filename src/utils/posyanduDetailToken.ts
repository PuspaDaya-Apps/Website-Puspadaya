export interface PosyanduDetailTokenPayload {
  idPosyandu: string;
  bulan: number;
  tahun: number;
  createdAt: number;
}

const STORAGE_KEY = "posyandu_detail_token_map";
const MAX_ENTRIES = 100;

const canUseStorage = () => typeof window !== "undefined" && typeof window.localStorage !== "undefined";

const readTokenMap = (): Record<string, PosyanduDetailTokenPayload> => {
  if (!canUseStorage()) {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, PosyanduDetailTokenPayload>) : {};
  } catch {
    return {};
  }
};

const writeTokenMap = (tokenMap: Record<string, PosyanduDetailTokenPayload>): void => {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tokenMap));
};

const pruneTokenMap = (tokenMap: Record<string, PosyanduDetailTokenPayload>): Record<string, PosyanduDetailTokenPayload> => {
  const entries = Object.entries(tokenMap)
    .sort((a, b) => b[1].createdAt - a[1].createdAt)
    .slice(0, MAX_ENTRIES);

  return Object.fromEntries(entries);
};

export const createPosyanduDetailToken = (payload: Omit<PosyanduDetailTokenPayload, "createdAt">): string => {
  const token =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

  if (!canUseStorage()) {
    return token;
  }

  const tokenMap = readTokenMap();
  tokenMap[token] = {
    ...payload,
    createdAt: Date.now(),
  };

  writeTokenMap(pruneTokenMap(tokenMap));
  return token;
};

export const resolvePosyanduDetailToken = (token: string): PosyanduDetailTokenPayload | null => {
  const tokenMap = readTokenMap();
  return tokenMap[token] ?? null;
};
