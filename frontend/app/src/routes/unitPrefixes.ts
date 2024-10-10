export const unitPrefixesKeys = ['none', 'milli', 'micro', 'nano'] as const;

export type UnitPrefixesKeys = (typeof unitPrefixesKeys)[number];

type UnitPrefixValues = {
	exp: number;
	prefix: string;
};

export const unitPrefixes: Readonly<Record<UnitPrefixesKeys, Readonly<UnitPrefixValues>>> = {
	none: { exp: 0, prefix: '[s]' },
	milli: { exp: -3, prefix: '[ms]' },
	micro: { exp: -6, prefix: '[μs]' },
	nano: { exp: -9, prefix: '[ns]' }
};
