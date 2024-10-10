<script lang="ts">
	import type PlotlyType from 'plotly.js-basic-dist-min';
	import type { BeforePlotEvent, PlotDatum, PlotlyHTMLElement } from 'plotly.js-basic-dist-min';
	import { changeLayoutTheme } from './makePlot';
	import type { InputData } from './types';
	import { mode } from 'mode-watcher';
	import Big from 'big.js';
	import { onMount } from 'svelte';

	export let inputData: InputData;
	export let plotData: BeforePlotEvent;

	let plotDiv: HTMLDivElement;
	let Plotly: typeof PlotlyType;
	$: Plotly && Plotly.react(plotDiv, plotData.data, plotData.layout, plotData.config);
	$: {
		const layout = changeLayoutTheme($mode!, plotData.layout);
		plotData.layout = layout;
	}
	onMount(async () => {
		Plotly = await import('plotly.js-basic-dist-min');
		Plotly.newPlot(plotDiv, plotData.data, plotData.layout, plotData.config);
		// PlotlyとSvelteとTypeScriptの折り合いをつけるための型アサーション
		const plotlyDiv = plotDiv as unknown as PlotlyHTMLElement;
		plotlyDiv.on('plotly_click', (data) => clickPlot(data.points[0]));
	});

	const clickPlot = ({ curveNumber, x }: PlotDatum) => {
		const inOut = curveNumber % 2 ? 'outT' : 'inT';
		const ps = curveNumber < 2 ? 'p' : 's';
		inOut === 'inT'
			? (inputData.details.inT[ps] = Big(String(x)).toFixed())
			: (inputData.details.outT[ps] = Big(String(x)).toFixed());
		plotData.layout.shapes![curveNumber] = {
			...plotData.layout.shapes![curveNumber],
			x0: x,
			x1: x,
			visible: true
		};
	};
</script>

<div bind:this={plotDiv} class="h-full w-full"></div>
