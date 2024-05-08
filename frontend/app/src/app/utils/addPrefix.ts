import Big from 'big.js';

import { unitPrefixes, unitPrefixesKeys } from '@/app/const/unitPrefixes';

export const addPrefix = (bigString: string) => {
  const [realNum, exp] = Big(bigString)
    .toExponential()
    .split('e')
    .map((v) => +v);
  if (realNum === 0) {
    return `${realNum} [s]`;
  } else {
    let i = -1;
    for (const key of unitPrefixesKeys) {
      i++;
      if (exp >= unitPrefixes[key].exp) break;
    }
    const expPrefix = unitPrefixes[unitPrefixesKeys[i]];
    const newExp = exp - expPrefix.exp;
    return `${Big(realNum + 'e' + newExp).toFixed()} ${expPrefix.unit}`;
  }
};
