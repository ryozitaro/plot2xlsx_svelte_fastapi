<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { numDataURL } from './const';
	import { makePlot } from './makePlot';
	import { newInOut } from './stores';
	import type { BeforePlotEvent } from 'plotly.js-basic-dist-min';
	import type { PageData } from './$types';
	import type { InputData, WaveData } from './types';

	export let data: PageData;
	export let inputData: InputData;
	export let plotData: BeforePlotEvent;

	const fetchToJson = async (selectNum: string): Promise<WaveData> => {
		const url = new URL(numDataURL, location.href);
		url.searchParams.set('num', selectNum);
		let res: Response;
		try {
			res = await fetch(url);
		} catch (error) {
			console.error('エラー発生：', error);
			throw error;
		}
		if (res.ok) {
			return res.json();
		} else {
			console.error('response.ok:', res.ok);
			console.error('esponse.status:', res.status);
			console.error('esponse.statusText:', res.statusText);
			throw new Error(res.statusText);
		}
	};
	const handleGetSelectNumData = async () => {
		const all = await Promise.all([fetchToJson(inputData.num.p), fetchToJson(inputData.num.s)]);
		const { data, layout } = makePlot(all);
		plotData.data = data;
		plotData.layout = layout;
		inputData.details = { ...inputData.details, ...newInOut() };
	};
</script>

<div class="flex w-full justify-between gap-2">
	<select class="select" bind:value={inputData.num.p}>
		<option hidden value="">P波を入力</option>
		{#each data.nums as num}
			<option value={num} disabled={num === inputData.num.s}>{num}</option>
		{/each}
	</select>
	<select class="select" bind:value={inputData.num.s}>
		<option hidden value="">S波を入力</option>
		{#each data.nums as num}
			<option value={num} disabled={num === inputData.num.p}>{num}</option>
		{/each}
	</select>
	<Button
		type="button"
		size="lg"
		disabled={inputData.num.p === '' || inputData.num.s === ''}
		on:click={handleGetSelectNumData}>取得</Button
	>
</div>
