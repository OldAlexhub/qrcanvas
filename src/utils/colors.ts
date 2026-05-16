const HEX_PATTERN = /^#([0-9a-fA-F]{6})$/;

export const isValidHexColor = (value?: string | null): value is string =>
  typeof value === 'string' && HEX_PATTERN.test(value.trim());

export const safeHexColor = (value: string | undefined | null, fallback: string): string =>
  isValidHexColor(value) ? value.trim().toUpperCase() : fallback;

const hexToRgb = (hex: string): {r: number; g: number; b: number} => {
  const clean = safeHexColor(hex, '#000000').replace('#', '');
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  };
};

const linearize = (channel: number): number => {
  const normalized = channel / 255;
  return normalized <= 0.03928
    ? normalized / 12.92
    : Math.pow((normalized + 0.055) / 1.055, 2.4);
};

export const calculateContrast = (colorA: string, colorB: string): number => {
  const a = hexToRgb(colorA);
  const b = hexToRgb(colorB);
  const lumA = 0.2126 * linearize(a.r) + 0.7152 * linearize(a.g) + 0.0722 * linearize(a.b);
  const lumB = 0.2126 * linearize(b.r) + 0.7152 * linearize(b.g) + 0.0722 * linearize(b.b);
  const brightest = Math.max(lumA, lumB);
  const darkest = Math.min(lumA, lumB);
  return Number(((brightest + 0.05) / (darkest + 0.05)).toFixed(2));
};

export const darkenHex = (hex: string, amount: number): string => {
  const rgb = hexToRgb(hex);
  const next = [rgb.r, rgb.g, rgb.b]
    .map(channel => Math.max(0, Math.min(255, Math.round(channel * (1 - amount)))))
    .map(channel => channel.toString(16).padStart(2, '0'))
    .join('');
  return `#${next}`.toUpperCase();
};

export const withAlpha = (hex: string, alpha: number): string => {
  const clean = safeHexColor(hex, '#000000');
  const clamped = Math.max(0, Math.min(1, alpha));
  const suffix = Math.round(clamped * 255)
    .toString(16)
    .padStart(2, '0');
  return `${clean}${suffix}`.toUpperCase();
};
