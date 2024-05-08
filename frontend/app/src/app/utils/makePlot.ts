import { state } from '@/app/state/state';
import { WaveData } from '@/app/types';
import { Annotations, PlotData, Shape } from 'plotly.js-basic-dist';
import { PlotParams } from 'react-plotly.js';

export const makePlot = (waveDataP: WaveData, waveDataS: WaveData) => {
  const data: PlotParams['data'] = [];

  const layout: PlotParams['layout'] = {
    annotations: [],
    shapes: [],
    paper_bgcolor: 'hsl(0 0% 96%)',
    plot_bgcolor: 'hsl(0 0% 100%)',
    clickmode: 'event',
    hovermode: 'x',
    font: {
      family: 'var(--font-sans)',
      size: 12,
      color: 'hsl(240 10% 3.9%)',
    },
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
          line: { color: '#6f90e5' },
          type: 'scattergl',
          mode: 'lines',
          x: waveData.time,
          xaxis: `x${axisNum}`,
          y: values,
          yaxis: `y${axisNum}`,
        };

        const anno: Partial<Annotations> = {
          font: { size: 18 },
          showarrow: false,
          text: title,
          x: 0.5,
          xanchor: 'center',
          // xref yref は " domain"を後ろにつけたものを本来受け入れるが、ライブラリの型がそうなってないので握りつぶしている。
          // @ts-expect-error
          xref: `x${axisNum} domain`,
          y: 1,
          yanchor: 'bottom',
          // @ts-expect-error
          yref: `y${axisNum} domain`,
        };

        const shape: Partial<Shape> = {
          line: { color: '#ff0000', width: 2 },
          type: 'line',
          visible: false,
          x0: NaN,
          x1: NaN,
          xref: `x${axisNum}`,
          y0: 0,
          y1: 1,
          // @ts-expect-error
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
          mirror: 'allticks',
          gridcolor: '#ddd',
          ticksuffix: 's',
        };

        layout[`yaxis${axisNum}`] = {
          anchor: `x${axisNum}`,
          domain: index < 2 ? [0.54, 1.0] : [0.0, 0.46],
          zeroline: false,
          linewidth: 1,
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
  state.currentSheet.plotState.data = data;
  state.currentSheet.plotState.layout = layout;
};
