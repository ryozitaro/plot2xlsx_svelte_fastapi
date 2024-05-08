'use client';

import Big from 'big.js';
import { useSnapshot } from 'valtio';

import {
  unitPrefixes,
  unitPrefixesKeys,
  UnitPrefixesKeys,
} from '@/app/const/unitPrefixes';
import { InputValue } from '@/app/models/inputData';
import { state } from '@/app/state/state';
import { PS } from '@/app/types';
import { addPrefix } from '@/app/utils/addPrefix';
import { NumSelect } from '@/components/NumSelect';
import { BigInput } from '@/components/bigInput';
import { cn } from '@/lib/utils';

type InfoProps = {
  ps: PS;
  infoType: 'inT' | 'outT' | 'deltaT' | 'v';
  explain: string;
};

// NumSelect用に接頭辞オブジェクトの配列を作る
const unitArr = (() => {
  let arr = [];
  for (const key of unitPrefixesKeys) {
    arr.push({ label: unitPrefixes[key].unit, value: key });
  }
  return arr;
})();

const InitInfo = ({ ps }: Pick<InfoProps, 'ps'>) => {
  const { initT } = useSnapshot(state).currentSheet.inputState.details;

  const handleChangeInit = (
    inputValue: string,
    isBig: boolean,
    prefix: UnitPrefixesKeys,
  ) => {
    const init = isBig ? Big(inputValue) : inputValue;
    state.currentSheet.inputState.changeInit(init, prefix, ps);
  };

  return (
    <div className='flex items-baseline gap-1 rounded-lg border bg-group p-1'>
      <span className='whitespace-nowrap px-2 text-group-foreground'>
        {ps.toUpperCase() + '波初期補正値：'}
      </span>
      <BigInput
        value={initT[ps].inputValue}
        onChange={(e) => handleChangeInit(e.value, e.isBig, initT[ps].prefix)}
        enterKeyHint='done'
        error={!initT[ps].isBig}
      />
      <NumSelect
        className='w-36'
        options={unitArr}
        value={initT[ps].prefix}
        onValueChange={(v) =>
          handleChangeInit(
            initT[ps].inputValue,
            initT[ps].isBig,
            v as UnitPrefixesKeys,
          )
        }
      />
    </div>
  );
};

const Info = ({ ps, infoType, explain }: InfoProps) => {
  const data = useSnapshot(state).currentSheet.inputState.details[infoType];
  // データ種類に合わせて表示を変える
  const show = (v: InputValue) => {
    if (!v.isBig) return v.value;
    if (infoType === 'v') {
      return v.value + ' [m/s]';
    } else {
      return addPrefix(v.value);
    }
  };

  return (
    <p className='ml-3'>
      {`${ps.toUpperCase()} ${explain}: `}
      <span className={cn(!data[ps].isBig && 'text-muted-foreground')}>
        {show(data[ps])}
      </span>
    </p>
  );
};

export const WaveInfo = ({ ps }: Pick<InfoProps, 'ps'>) => {
  return (
    <div className='space-y-2'>
      <InitInfo ps={ps} />
      <Info ps={ps} infoType='inT' explain='in time' />
      <Info ps={ps} infoType='outT' explain='out time' />
      <Info ps={ps} infoType='deltaT' explain='Δ time' />
      <Info ps={ps} infoType='v' explain='V' />
    </div>
  );
};
