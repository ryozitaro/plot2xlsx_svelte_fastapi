<script lang="ts">
	import type { PageData } from './$types';
	import Big from 'big.js';
	import ChartLine from 'lucide-svelte/icons/chart-line';
	import Details from './Details.svelte';
	import Plus from 'lucide-svelte/icons/plus';
	import Trash2 from 'lucide-svelte/icons/trash-2';
	import Save from './Save.svelte';
	import SelectNum from './SelectNum.svelte';
	import Plot from './Plot.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { cn } from '$lib/utils';
	import { userPrefersMode } from 'mode-watcher';
	import { newSheet } from './stores';
	import { displayNums } from './utils';

	export let data: PageData;

	let sheets = [newSheet()];
	let sheetIndex = 0;
	$: inputData = sheets[sheetIndex].inputData;
	$: plotData = sheets[sheetIndex].plotData;
	$: initUnitPrefix = sheets[sheetIndex].initUnitPrefix;

	// poi
	$: {
		const { p: vP, s: vS } = inputData.details.v;
		let poi: string;
		if (vP && vS) {
			try {
				const pow = Big(vP).div(vS).pow(2);
				const x = pow.minus(2);
				const y = pow.minus(1).times(2);
				poi = x.div(y).toFixed();
			} catch {
				poi = '#DIV/0!';
			}
		} else {
			poi = '';
		}
		inputData.details.poi = poi;
	}
</script>

<svelte:head>
	<title>csv2xlsx</title>
	<meta name="description" content="csvをxlsxに整形して出力" />
</svelte:head>

<header class="sticky top-0 z-50 w-full border-b border-border bg-background px-6 py-2 shadow-md">
	<div class="m-auto flex max-w-screen-2xl items-center justify-between">
		<p class="text-2xl">csv2xlsx</p>
		<div class="flex items-baseline gap-1 whitespace-nowrap">
			テーマ：
			<select class="select" bind:value={$userPrefersMode}>
				<option value="light">ライト</option>
				<option value="dark">ダーク</option>
				<option value="system">システム</option>
			</select>
		</div>
	</div>
</header>
<main class="m-4">
	<div class="mx-auto flex w-full max-w-screen-2xl gap-4">
		<!--グラフ&シート操作-->
		<div class="flex w-full flex-[3] flex-col gap-4">
			<div class="relative aspect-[3/2]">
				<Plot bind:inputData bind:plotData />
				<div
					class={cn(
						'absolute inset-0 place-content-center place-items-center gap-6 bg-border',
						plotData.data.length ? 'hidden' : 'grid'
					)}
				>
					<p class="text-2xl">P波データとS波データが選択されていません</p>
					<ChartLine size={240} />
				</div>
			</div>
			<!--SheetControl-->
			<div class="flex items-center justify-between">
				<Button
					type="button"
					size="lg"
					variant="destructive"
					disabled={sheets.length === 1}
					on:click={() => {
						sheets = sheets.filter((_, index) => index !== sheetIndex);
						if (sheets.length === sheetIndex) sheetIndex--;
					}}
				>
					<Trash2 />
					シート消去
				</Button>
				<div>
					{#each sheets as _, i}
						<button
							class="mx-3 inline-block h-6 w-6 cursor-pointer rounded-sm border-none bg-primary outline outline-4 -outline-offset-2 outline-primary hover:bg-transparent disabled:cursor-default disabled:bg-primary disabled:outline-offset-4"
							type="button"
							disabled={sheetIndex === i}
							on:click={() => (sheetIndex = i)}
						/>
					{/each}
				</div>
				<Button
					type="button"
					size="lg"
					disabled={sheets.length >= 5}
					on:click={() => {
						sheets = sheets.toSpliced(sheetIndex + 1, 0, newSheet());
						sheetIndex++;
					}}
				>
					<Plus />
					シート追加
				</Button>
			</div>
		</div>
		<!--数値などデータ入力-->
		<div class="flex flex-1 flex-col justify-between gap-4">
			<!--データ番号選択-->
			<SelectNum {data} bind:inputData bind:plotData />
			<hr />
			<!--供試体高さ-->
			<Input label="供試体高さ" bind:value={inputData.details.speHeight}>cm</Input>
			<hr />
			<!--P波入力-->
			<Details ps="p" bind:details={inputData.details} bind:initUnitPrefix />
			<hr />
			<!--S波入力-->
			<Details ps="s" bind:details={inputData.details} bind:initUnitPrefix />
			<hr />
			<!--ポアソン比-->
			<p>{'ポアソン比: ' + displayNums(inputData.details.poi)}</p>
			<hr />
			<!--A1入力-->
			<Input label="A1に入れる情報（任意）" bind:value={inputData.a1} />
			<!--ファイル名・保存ボタン-->
			<hr />
			<Save bind:sheetIndex bind:sheets />
		</div>
	</div>
</main>
