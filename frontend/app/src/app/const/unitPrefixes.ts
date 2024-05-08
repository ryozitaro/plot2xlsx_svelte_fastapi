export const unitPrefixesKeys = ['none', 'milli', 'micro', 'nano'] as const;

export type UnitPrefixesKeys = (typeof unitPrefixesKeys)[number];

export const unitPrefixes: Record<
  UnitPrefixesKeys,
  { exp: number; unit: string }
> = {
  none: { exp: 0, unit: '[s]' },
  milli: { exp: -3, unit: '[ms]' },
  micro: { exp: -6, unit: '[μs]' },
  nano: { exp: -9, unit: '[ns]' },
} as const;
