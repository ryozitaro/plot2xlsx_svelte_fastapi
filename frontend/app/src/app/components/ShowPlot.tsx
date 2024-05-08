'use client';

import Big from 'big.js';
import { LineChart } from 'lucide-react';
import Plotly from 'plotly.js-basic-dist';
import { PlotParams } from 'react-plotly.js';
import createPlotlyComponent from 'react-plotly.js/factory';
import { useSnapshot } from 'valtio';

import { state } from '@/app/state/state';

const Plot = createPlotlyComponent(Plotly);

export const ShowPlot = () => {
  const { data, layout, config } = JSON.parse(
    JSON.stringify(useSnapshot(state).currentSheet.plotState),
  ) as PlotParams;
  const isPlot = !!data.length;

  // クリックされたとき
  const clickPlot = ({ curveNumber, x }: Plotly.PlotDatum) => {
    const inOut = curveNumber % 2 ? 'outT' : 'inT';
    const ps = curveNumber < 2 ? 'p' : 's';
    inOut === 'inT'
      ? state.currentSheet.inputState.changeIn(Big(x + ''), ps)
      : state.currentSheet.inputState.changeOut(Big(x + ''), ps);
    state.currentSheet.plotState.layout.shapes![curveNumber] = {
      ...layout.shapes![curveNumber],
      x0: x,
      x1: x,
      visible: true,
    };
  };

  return (
    <div className='h-full w-full'>
      {isPlot ? (
        <Plot
          className='h-full w-full'
          data={data}
          layout={layout}
          config={config}
          onClick={(e) => clickPlot(e.points[0])}
        />
      ) : (
        <div className='grid h-full w-full place-content-center place-items-center gap-6 bg-group'>
          <p className='text-2xl'>P波データとS波データが選択されていません</p>
          <LineChart size={240} />
        </div>
      )}
    </div>
  );
};

export default ShowPlot;
