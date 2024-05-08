'use client';

import Big from 'big.js';
import { useSnapshot } from 'valtio';

import { state } from '@/app/state/state';
import { BigInput, ChangeProps } from '@/components/bigInput';

export const SpeHeightInput = () => {
  const { speHeight } = useSnapshot(state).currentSheet.inputState.details;

  const handleSpeHeight = (e: ChangeProps) => {
    const speHeight = e.isBig ? Big(e.value) : e.value;
    state.currentSheet.inputState.changeSpeHeight(speHeight);
  };

  return (
    <div className='flex items-baseline gap-1 rounded-lg border bg-group p-1'>
      <p className='whitespace-nowrap px-2 text-group-foreground'>
        供試体高さ：
      </p>
      <BigInput
        value={speHeight.value}
        onChange={handleSpeHeight}
        enterKeyHint='done'
        error={!speHeight.isBig}
      />
      <p className='px-2 text-sm text-group-foreground'>[cm]</p>
    </div>
  );
};
