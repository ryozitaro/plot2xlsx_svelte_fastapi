import { SunMoon } from 'lucide-react';
import dynamic from 'next/dynamic';
import React from 'react';

import { A1Text } from '@/app/components/A1Text';
import { NumDropdown } from '@/app/components/NumDropdown';
import { Poi } from '@/app/components/Poi';
import { Save } from '@/app/components/Save';
import { SheetControl } from '@/app/components/SheetControl';
import { SpeHeightInput } from '@/app/components/SpeHeightInput';
import { BlockSpinner } from '@/app/components/Spinner';
import { WaveInfo } from '@/app/components/WaveInfo';
import { psDataURL } from '@/app/const/backendURL';
import { ReceivedWaveData } from '@/app/types';
import { Separator } from '@/components/ui/separator';

const ThemeChanger = dynamic(() => import('@/app/components/LightDarkSwitch'), {
  ssr: false,
  loading: () => (
    <SunMoon className='m-2 animate-pulse duration-1000' size={24} />
  ),
});

const ShowPlot = dynamic(() => import('@/app/components/ShowPlot'), {
  ssr: false,
  loading: () => <BlockSpinner bg />,
});

const getData = async () => {
  const res = await fetch(psDataURL);
  if (!res.ok) {
    throw Error('Failed to fetch data');
  }
  const data = (await res.json()) as ReceivedWaveData;
  return data;
};

const App = async () => {
  const data = await getData();
  return (
    <>
      <header className='sticky top-0 z-50 w-full border-b border-border bg-background px-6 py-2 text-2xl shadow-md'>
        <div className='m-auto flex max-w-screen-2xl items-center justify-between'>
          csv2xlsx
          <ThemeChanger />
        </div>
      </header>
      {/*グラフ、データ入力*/}
      <main className='m-6 grid grid-cols-1 justify-items-center gap-6 [&>*]:max-w-screen-2xl'>
        <div className='grid grid-cols-[7fr_3fr] gap-6'>
          {/*グラフ&シート操作*/}
          <div className='space-y-6'>
            <div className='aspect-[3/2]'>
              <ShowPlot />
            </div>
            <SheetControl />
          </div>
          {/*データ入力ブロック*/}
          <div className='flex flex-col justify-between gap-6'>
            <div className={'space-y-6'}>
              {/*ドロップダウン*/}
              <NumDropdown data={data} />
              {/*-供試体高さ*/}
              <SpeHeightInput />
              {/*P波入力*/}
              <WaveInfo ps='p' />
              {/*S波入力*/}
              <WaveInfo ps='s' />
              {/*ポアソン比*/}
              <Poi />
              {/*A1入力*/}
              <A1Text />
            </div>
            {/*ファイル名、保存ボタン*/}
            <Separator />
            <Save />
          </div>
        </div>
      </main>
    </>
  );
};

export default App;
