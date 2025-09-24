export const AUD_LOCALE = 'en-AU';

const audFormatter = new Intl.NumberFormat(AUD_LOCALE, {
  style: 'currency',
  currency: 'AUD',
  minimumFractionDigits: 0, // show $1, $1.5, not forced $1.00
  maximumFractionDigits: 2, // at most 2 decimals
});

export function formatAUD(value: number): string {
  const safeNumber = Number.isFinite(value) ? value : 0;
  return audFormatter.format(safeNumber);
}

export function parseAUDInput(
  input: string | number | null | undefined
): number {
  if (input == null) return 0;
  const text = String(input);
  // Keep digits and first dot only, cap to 2 decimals
  const normalized = text.replace(/[^\d.]/g, '');
  if (normalized === '') return 0;
  const [intPart, rawFrac] = normalized.split('.', 2);
  const fracPart = rawFrac ? rawFrac.slice(0, 2) : '';
  const recomposed = fracPart ? `${intPart}.${fracPart}` : intPart;
  const num = Number(recomposed);
  return Number.isFinite(num) ? num : 0;
}

export function clampNumber(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
