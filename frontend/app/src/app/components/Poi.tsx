'use client';

import { useSnapshot } from 'valtio';

import { state } from '@/app/state/state';
import { cn } from '@/lib/utils';

export const Poi = () => {
  const { poi } = useSnapshot(state).currentSheet.inputState.details;

  return (
    <div>
      ポアソン比:{' '}
      <span className={cn(!poi.isBig && 'text-muted-foreground')}>
        {poi.value}
      </span>
    </div>
  );
};
