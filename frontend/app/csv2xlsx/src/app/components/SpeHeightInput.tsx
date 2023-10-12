import { InputNumber, InputNumberChangeEvent } from 'primereact/inputnumber';
import { useAtom, useSetAtom } from 'jotai';
import { speHeightAtom, vAtom, poiAtom } from '../jotai/atom';

export const SpeHeightInput = () => {
  const [speHeight, setSpeHeight] = useAtom(speHeightAtom);
  const setV = useSetAtom(vAtom);
  //const poi = useSetAtom(poiAtom);

  const handleSpeHeightChange = (event: InputNumberChangeEvent) => {
    if (!event.value) return;
    setSpeHeight(event.value);
    setV('p');
    setV('s');
    //setPoi()
  };

  return (
    <div className='p-inputgroup flex-1'>
      <span className='p-inputgroup-addon'>供試体高さ：</span>
      <InputNumber
        value={speHeight}
        onChange={handleSpeHeightChange}
        required
      />
      <span className='p-inputgroup-addon'>[cm]</span>
    </div>
  );
};
