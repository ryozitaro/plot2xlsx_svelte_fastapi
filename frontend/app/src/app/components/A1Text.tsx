'use client';

import { useSnapshot } from 'valtio';

import { state } from '@/app/state/state';
import { Input } from '@/components/ui/input';

export const A1Text = () => {
  const { a1 } = useSnapshot(state).currentSheet.inputState;
  return (
    <div>
      <Input
        className='w-full'
        placeholder='シートのA1に入れる情報（任意）'
        value={a1}
        onChange={(e) =>
          state.currentSheet.inputState.changeA1(e.currentTarget.value)
        }
      />
    </div>
  );
};
