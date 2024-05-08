'use client';

import { FilePlus, Trash2 } from 'lucide-react';
import { useSnapshot } from 'valtio';

import { state } from '@/app/state/state';
import { Button } from '@/components/ui/button';

const SelectSheet = () => {
  const { currentSheetIndex, sheets } = useSnapshot(state);
  return (
    <div>
      {Array(sheets.length)
        .fill(undefined)
        .map((_, i) => (
          <button
            className='m-3 inline-block h-6 w-6 cursor-pointer rounded-sm border-none bg-primary outline outline-4 -outline-offset-2 outline-primary hover:bg-transparent disabled:cursor-default disabled:bg-primary disabled:outline-offset-4'
            type='button'
            key={i}
            disabled={i === currentSheetIndex}
            onClick={() => state.changeSheet(i)}
          />
        ))}
    </div>
  );
};

export const SheetControl = () => {
  const { sheets } = useSnapshot(state);

  return (
    <div className='flex items-center justify-between'>
      <Button
        size='lg'
        variant='destructive'
        onClick={() => state.deleteSheet()}
        disabled={sheets.length === 1}
      >
        <Trash2 className='mr-4' />
        <b>シート消去</b>
      </Button>
      <SelectSheet />
      <Button
        className=''
        size='lg'
        onClick={() => state.addSheet()}
        disabled={sheets.length === 5}
      >
        <FilePlus className='mr-4' />
        <b>シート追加</b>
      </Button>
    </div>
  );
};
