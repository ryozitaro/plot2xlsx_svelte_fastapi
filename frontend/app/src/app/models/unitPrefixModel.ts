import { PS, PSParams } from '@/app/types';

export const unitPrefixes = {
  none: { exp: 0, unit: '[s]' },
  milli: { exp: -3, unit: '[ms]' },
  micro: { exp: -6, unit: '[µs]' },
  nano: { exp: -9, unit: '[ns]' },
};

export type Prefix = keyof typeof unitPrefixes;

export class UnitPrefix {
  constructor(public readonly value: Prefix) {}
  get getUnitPrefixObj() {
    return unitPrefixes[this.value];
  }
}

export class UnitPrefixData implements PSParams<UnitPrefix> {
  p;
  s;
  constructor() {
    this.p = new UnitPrefix('none');
    this.s = new UnitPrefix('none');
  }
  changeUnitPrefix(value: Prefix, ps: PS) {
    this[ps] = new UnitPrefix(value);
  }
}
