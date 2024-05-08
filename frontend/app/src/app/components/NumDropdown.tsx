'use client';

import { useSnapshot } from 'valtio';

import { state } from '@/app/state/state';
import { PS, ReceivedWaveData } from '@/app/types';
import { makePlot } from '@/app/utils/makePlot';
import { NumSelect } from '@/components/NumSelect';
import { useToast } from '@/components/ui/use-toast';

export const NumDropdown = ({ data }: { data: ReceivedWaveData }) => {
  const { num } = useSnapshot(state).currentSheet.inputState;
  const { toast } = useToast();

  const nums = Object.keys(data);

  const getOtherNum = (ps: PS) => {
    return ps === 'p' ? num.s : num.p;
  };

  const handleDropdownNumChange = (value: string, ps: PS) => {
    if (value === getOtherNum(ps)) {
      toast({
        title: 'エラー',
        description: '同じ値は選べません',
        variant: 'destructive',
      });
      return;
    }
    state.currentSheet.inputState.num[ps] = value;
    if (getOtherNum(ps) === '') return;
    // valueからnumP(S)Valueとする
    const [numPValue, numSValue] = ps === 'p' ? [value, num.s] : [num.p, value];
    const waveDataP = data[numPValue];
    const waveDataS = data[numSValue];
    state.currentSheet.inputState.resetDetails();
    makePlot(waveDataP, waveDataS);
  };

  return (
    <div className='flex gap-2'>
      <NumSelect
        options={nums}
        placeholder='P波データ'
        value={num.p}
        onValueChange={(value) => handleDropdownNumChange(value, 'p')}
      />
      <NumSelect
        options={nums}
        placeholder='S波データ'
        value={num.s}
        onValueChange={(value) => handleDropdownNumChange(value, 's')}
      />
    </div>
  );
};

export default NumDropdown;
