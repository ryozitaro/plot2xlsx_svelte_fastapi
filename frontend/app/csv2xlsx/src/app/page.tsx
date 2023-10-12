'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { DataInput } from './components/DataInput';
import { SheetControl } from './components/SheetControl';
import { OverlaySpinner } from './components/OverlayLoading';

const Plot = dynamic(() => import('./components/plot'), { ssr: false });

const App = () => {
  return (
    <div>
      <div>
        <div>
          <p className='text-5xl bg-gray-500'>plot2xlsx</p>
        </div>
        {/*グラフ、データ入力*/}
        <div className='flex justify-center mx-auto columns-2 gap-8'>
          {/*グラフブロック*/}
          <div>
            <Suspense fallback={<p>読み込み中...</p>}>
              <Plot />
              {
                //<OverlaySpinner />
              }
            </Suspense>
            <SheetControl />
          </div>
          {/*データ入力ブロック*/}
          <DataInput />
        </div>
      </div>
    </div>
  );
};

export default App;
