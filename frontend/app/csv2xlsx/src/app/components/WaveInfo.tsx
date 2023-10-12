import { InputNumber, InputNumberChangeEvent } from 'primereact/inputnumber';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
  initTAtom,
  inTAtom,
  outTAtom,
  deltaTAtom,
  vAtom,
  poiAtom,
} from '../jotai/atom';
import { PS } from '../types';

export const WaveInfo = ({ ps }: { ps: PS }) => {
  const PS = ps.toUpperCase(),
    [initT, setInitT] = useAtom(initTAtom),
    inT = useAtomValue(inTAtom),
    outT = useAtomValue(outTAtom),
    [deltaT, setDeltaT] = useAtom(deltaTAtom),
    [v, setV] = useAtom(vAtom),
    setPoi = useSetAtom(poiAtom);

  const handleChangeInit = (event: InputNumberChangeEvent) => {
    if (!event.value) return;
    setInitT((prev) => ({ ...prev, [ps]: event.value }));
    setDeltaT(ps);
    setV(ps);
    setPoi();
  };

  return (
    <>
      <div className='p-inputgroup flex-1'>
        <span className='p-inputgroup-addon'>{PS + '波初期補正値：'}</span>
        <InputNumber value={initT[ps]} onChange={handleChangeInit} required />
        <span className='p-inputgroup-addon'>[s]</span>
      </div>
      <br />
      <p>
        {PS} in t: {inT[ps]}
      </p>
      <p>
        {PS} out t: {outT[ps]}
      </p>
      <p>
        {PS} Δt: {deltaT[ps]}
      </p>
      <p>
        {PS} V: {v[ps]}
      </p>
    </>
  );
};
