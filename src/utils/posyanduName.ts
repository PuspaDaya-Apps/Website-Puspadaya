const DEFAULT_POSYANDU_NAME_KEYS = ['nama_posyandu', 'posyandu_nama', 'posyandu'] as const;

// Angka romawi (I, II, III, IV, ...) tetap kapital penuh, mis. "Anggrek II".
const ROMAN_NUMERAL_PATTERN = /^(?=[ivxlcdm]+$)m{0,3}(cm|cd|d?c{0,3})(xc|xl|l?x{0,3})(ix|iv|v?i{0,3})$/;

// Kata Indonesia yang kebetulan cocok pola angka romawi dan tidak boleh dikapitalkan.
const ROMAN_NUMERAL_EXCEPTIONS = new Set(['di']);

const isRomanNumeral = (word: string): boolean => {
  return ROMAN_NUMERAL_PATTERN.test(word) && !ROMAN_NUMERAL_EXCEPTIONS.has(word);
};

const toTitleCase = (value: string): string => {
  return value
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) =>
      isRomanNumeral(word) ? word.toUpperCase() : word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join(' ');
};

const normalizeValue = (value: unknown, extraKeys: readonly string[] = []): unknown => {
  const targetKeys = new Set<string>([...DEFAULT_POSYANDU_NAME_KEYS, ...extraKeys]);

  const visit = (input: unknown): unknown => {
    if (Array.isArray(input)) {
      return input.map((item) => visit(item));
    }

    if (input && typeof input === 'object') {
      const result: Record<string, unknown> = { ...(input as Record<string, unknown>) };

      for (const [key, currentValue] of Object.entries(result)) {
        if (typeof currentValue === 'string' && targetKeys.has(key)) {
          result[key] = toTitleCase(currentValue);
          continue;
        }

        result[key] = visit(currentValue);
      }

      return result;
    }

    return input;
  };

  return visit(value);
};

export const normalizePosyanduNames = <T>(value: T, extraKeys: readonly string[] = []): T => {
  return normalizeValue(value, extraKeys) as T;
};
