import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { InputText } from 'primereact/inputtext';
import { useAtom, useAtomValue } from 'jotai';
import { WaveInfo } from '../components/WaveInfo';
import { poiAtom, a1Atom } from '../jotai/atom';
import { NumInputGroup } from './NumInputGroup';
import { SpeHeightInput } from './SpeHeightInput';

export const DataInput = () => {
  const poi = useAtomValue(poiAtom);
  const [a1, setA1] = useAtom(a1Atom);

  return (
    <div>
      {/*ドロップダウン*/}
      <NumInputGroup />
      {/*-供試体高さ*/}
      <SpeHeightInput />
      {/*P波入力*/}
      <WaveInfo ps='p' />
      {/*S波入力*/}
      <WaveInfo ps='s' />
      {/*ポアソン比*/}
      <div>ポアソン比: {poi}</div>
      {/*A1入力*/}
      <InputText
        placeholder='シートのA1に入れる情報'
        value={a1}
        onChange={(event) => setA1(event.target.value)}
      />
      <Divider />
      {/*ファイル名、保存ボタン*/}
      <div className='flex'>
        <div className='flex-1 p-inputgroup'>
          <InputText placeholder='ファイル名' required />
          <span className='p-inputgroup-addon'>.xlsx</span>
        </div>
        <Button size='large' color='#ff0000'>
          保存
        </Button>
      </div>
    </div>
  );
};
