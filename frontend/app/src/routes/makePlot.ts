import type { Annotations, BeforePlotEvent, Shape, PlotData } from 'plotly.js-basic-dist-min';
import type { WaveData } from './types';

export const makePlot = (waveDataPS: WaveData[]) => {
	const data: BeforePlotEvent['data'] = [];

	const layout: BeforePlotEvent['layout'] = {
		annotations: [],
		shapes: [],
		clickmode: 'event',
		hovermode: 'x',
		font: {
			family: 'var(--font-sans)',
			size: 12
		},
		grid: { rows: 2, columns: 2, pattern: 'independent' },
		margin: { t: 35, b: 35, l: 60, r: 20 },
		showlegend: false
	};

	let index = 0;
	const axisNumArr = ['', '2', '3', '4'] as const;
	for (const waveData of waveDataPS) {
		for (const voltObj of waveData.voltages) {
			const axisNum = axisNumArr[index];

			const trace: Partial<PlotData> = {
				hoverinfo: 'x',
				line: { color: '#6f90e5' },
				type: 'scattergl',
				mode: 'lines',
				x: waveData.time,
				xaxis: `x${axisNum}`,
				y: voltObj.voltage,
				yaxis: `y${axisNum}`
			};

			const anno: Partial<Annotations> = {
				font: { size: 18 },
				showarrow: false,
				text: voltObj.name,
				x: 0.5,
				xanchor: 'center',
				xref: `x${axisNum} domain`,
				y: 1,
				yanchor: 'bottom',
				yref: `y${axisNum} domain`
			};

			const shape: Partial<Shape> = {
				line: { color: '#f00', width: 2 },
				type: 'line',
				visible: false,
				x0: NaN,
				x1: NaN,
				xref: `x${axisNum}`,
				y0: 0,
				y1: 1,
				yref: `y${axisNum} domain`
			};

			data.push(trace);
			layout.annotations!.push(anno);
			layout.shapes!.push(shape);

			layout[`xaxis${axisNum}`] = {
				anchor: `y${axisNum}`,
				domain: index % 2 == 0 ? [0.0, 0.47] : [0.53, 1.0],
				spikecolor: 'gray',
				spikemode: 'across',
				spikethickness: 2,
				zeroline: false,
				linewidth: 1,
				mirror: 'allticks',
				gridcolor: '#888',
				ticksuffix: 's'
			};

			layout[`yaxis${axisNum}`] = {
				anchor: `x${axisNum}`,
				domain: index < 2 ? [0.54, 1.0] : [0.0, 0.46],
				zeroline: false,
				linewidth: 1,
				mirror: 'allticks',
				gridcolor: '#888',
				ticksuffix: 'V',
				exponentformat: 'SI',
				minexponent: 2
			};

			index++;
		}
	}
	return { data, layout };
};

export const changeLayoutTheme = (mode: 'light' | 'dark', layout: BeforePlotEvent['layout']) => {
	const paper_bgcolor = mode === 'light' ? 'hsl(0 0% 96%)' : 'hsl(0 0% 7%)';
	const plot_bgcolor = mode === 'light' ? 'hsl(0 0% 100%)' : 'hsl(20 14.3% 4.1%)';
	const color = mode === 'light' ? 'hsl(240 10% 3.9%)' : 'hsl(0 0% 95%)';
	const gridcolor = mode === 'light' ? '#ddd' : '#222';
	layout = {
		...layout,
		paper_bgcolor,
		plot_bgcolor,
		font: {
			...layout.font,
			color
		},
		xaxis: {
			...layout.xaxis,
			gridcolor
		},
		xaxis2: {
			...layout.xaxis2,
			gridcolor
		},
		xaxis3: {
			...layout.xaxis3,
			gridcolor
		},
		xaxis4: {
			...layout.xaxis4,
			gridcolor
		},
		yaxis: {
			...layout.yaxis,
			gridcolor
		},
		yaxis2: {
			...layout.yaxis2,
			gridcolor
		},
		yaxis3: {
			...layout.yaxis3,
			gridcolor
		},
		yaxis4: {
			...layout.yaxis4,
			gridcolor
		}
	};
	return layout;
};
