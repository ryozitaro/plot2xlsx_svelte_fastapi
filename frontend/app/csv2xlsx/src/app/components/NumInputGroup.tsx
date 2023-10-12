import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { atom, useAtom, useSetAtom } from 'jotai';
import {
  numPAtom,
  numSAtom,
  plotDataAtom,
  plotLayoutAtom,
  plotSelectPAtom,
  plotSelectSAtom,
} from '../jotai/atom';
import { get, set } from 'idb-keyval';
import { useEffect, useRef, useState } from 'react';
import { PlotData, Annotations, Shape } from 'plotly.js';
import { PlotParams } from 'react-plotly.js';
import { PS, WaveData } from '../types';

const data = [
  '0002',
  '0004',
  '0006',
  '0007',
  '0008',
  '0009',
  '0010',
  '0011',
  '0012',
];

export const NumInputGroup = () => {
  const [numP, setNumP] = useAtom(numPAtom);
  const [numS, setNumS] = useAtom(numSAtom);
  const setPlotData = useSetAtom(plotDataAtom);
  const setPlotLayout = useSetAtom(plotLayoutAtom);
  const getNum = (ps: PS) => {
    return { p: numP, s: numS }[ps];
  };
  const setNum = (ps: PS, value: string) => {
    return { p: setNumP, s: setNumS }[ps](value);
  };
  const getOtherNum = (ps: PS) => {
    return { p: numS, s: numP }[ps];
  };

  // 通信エラー時などに選択値を戻すとき用
  const [lastSelectPValue, setLastSelectPValue] = useState<string>('');
  const [lastSelectSValue, setLastSelectSValue] = useState<string>('');
  const lastSelectValue = (ps: PS) => {
    return { p: lastSelectPValue, s: lastSelectSValue }[ps];
  };
  const setLastSelectValue = (ps: PS, value: string) => {
    return { p: setLastSelectPValue, s: setLastSelectSValue }[ps](value);
  };

  // PS選択番号とプロットのPS番号の比較用
  const [plotSelectP, setPlotSelectP] = useAtom(plotSelectPAtom);
  const [plotSelectS, setPlotSelectS] = useAtom(plotSelectSAtom);

  const toast = useRef<Toast>(null);
  const errorMessage = (text: string) =>
    toast.current?.show({
      severity: 'error',
      summary: 'エラー',
      detail: text,
      life: 4000,
    });

  useEffect(() => {
    const fetchAndStoreData = async (value: string, ps: PS) => {
      let data: WaveData | undefined = await get(value);
      if (!data) {
        let res: Response;
        try {
          res = await fetch(
            `http://localhost:50512/ps_dat/?wave_select=${value}`
          );
          if (!res.ok) {
            throw new Error(`データ取得エラー: ${value}`);
          }
        } catch (err: any) {
          console.error(err);
          errorMessage(err.message);
          setNum(ps, lastSelectValue(ps));
          throw err;
        }
        data = (await res.json()) as WaveData;
        await set(value, data);
      }
      return data;
    };

    const showPlot = (waveDataP: WaveData, waveDataS: WaveData) => {
      const data: PlotParams['data'] = [];

      const layout: PlotParams['layout'] = {
        annotations: [],
        shapes: [],
        paper_bgcolor: '#eee',
        clickmode: 'event',
        hovermode: 'x',
        font: { family: 'BIZ UDPGothic', size: 12, color: '#000' },
        grid: { rows: 2, columns: 2, pattern: 'independent' },
        margin: { t: 35, b: 35, l: 60, r: 20 },
        showlegend: false,
      };

      let index = 0;
      const axisNumArr: ['', '2', '3', '4'] = ['', '2', '3', '4'];
      let axisNum: '' | '2' | '3' | '4';
      for (let waveData of [waveDataP, waveDataS]) {
        for (let voltages of waveData.voltages) {
          for (const [title, values] of Object.entries(voltages)) {
            axisNum = axisNumArr[index];

            const trace: Partial<PlotData> = {
              hoverinfo: 'x',
              line: { color: 'blue' },
              type: 'scatter',
              mode: 'lines',
              x: waveData.time,
              xaxis: `x${axisNum}`,
              y: values,
              yaxis: `y${axisNum}`,
            };

            const anno: Partial<Annotations> = {
              font: { size: 16 },
              showarrow: false,
              text: title,
              x: 0.5,
              xanchor: 'center',
              xref: `x${axisNum} domain`,
              y: 1,
              yanchor: 'bottom',
              yref: `y${axisNum} domain`,
            };

            const shape: Partial<Shape> = {
              line: { color: 'red', width: 2 },
              type: 'line',
              visible: false,
              x0: NaN,
              x1: NaN,
              xref: `x${axisNum}`,
              y0: 0,
              y1: 1,
              yref: `y${axisNum} domain`,
            };

            data.push(trace);
            layout.annotations && layout.annotations.push(anno);
            layout.shapes && layout.shapes.push(shape);

            layout[`xaxis${axisNum}`] = {
              anchor: `y${axisNum}`,
              domain: index % 2 == 0 ? [0.0, 0.47] : [0.53, 1.0],
              spikecolor: 'gray',
              spikemode: 'across',
              spikethickness: 2,
              zeroline: false,
              linewidth: 1,
              linecolor: 'black',
              mirror: 'allticks',
              gridcolor: '#ddd',
              ticksuffix: 's',
            };

            layout[`yaxis${axisNum}`] = {
              anchor: `x${axisNum}`,
              domain: index < 2 ? [0.54, 1.0] : [0.0, 0.46],
              zeroline: false,
              linewidth: 1,
              linecolor: 'black',
              mirror: 'allticks',
              gridcolor: '#ddd',
              ticksuffix: 'V',
              exponentformat: 'SI',
              minexponent: 2,
            };

            index++;
          }
        }
      }
      setPlotData(data);
      setPlotLayout(layout);
    };

    const effect = async () => {
      // P及びS波が選択されていて、かつそのページのプロットのP及びS波の値と違う場合
      if (numP && numS && (numP !== plotSelectP || numS !== plotSelectS)) {
        const [waveDataP, waveDataS] = await Promise.allSettled([
          fetchAndStoreData(numP, 'p'),
          fetchAndStoreData(numS, 's'),
        ]);
        if (
          waveDataP.status === 'fulfilled' &&
          waveDataS.status === 'fulfilled'
        ) {
          showPlot(waveDataP.value, waveDataS.value);
          setPlotSelectP(numP);
          setPlotSelectS(numS);
        }
      }
    };

    effect();
  }, [numP, numS]);

  const changeNum = (value: string | null, ps: PS) => {
    const otherNum = getOtherNum(ps);
    if (!value) return;
    if (value === otherNum) {
      errorMessage('同じ値は選べません。');
    } else {
      setLastSelectValue(ps, getNum(ps));
      setNum(ps, value);
    }
  };

  return (
    <div className='flex'>
      <Toast ref={toast} />
      <div className='flex-1'>
        <Dropdown
          options={data}
          value={numP}
          placeholder={'P波データ'}
          onChange={(event) => changeNum(event.value, 'p')}
        />
      </div>
      <div className='flex-1'>
        <Dropdown
          options={data}
          value={numS}
          placeholder={'S波データ'}
          onChange={(event) => changeNum(event.value, 's')}
        />
      </div>
    </div>
  );
};
