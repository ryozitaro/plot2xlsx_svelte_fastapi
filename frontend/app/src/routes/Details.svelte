<script lang="ts">
	import Big from 'big.js';
	import { Input } from '$lib/components/ui/input';
	import { addPrefix } from './addPrefix';
	import { unitPrefixesKeys, unitPrefixes } from './unitPrefixes';
	import { displayNums } from './utils';
	import type { PS, InputData } from './types';
	import type { NewInitUnitPrefix } from './stores';

	export let ps: PS;
	export let details: InputData['details'];
	export let initUnitPrefix: NewInitUnitPrefix;

	// 初期補正値の接頭辞変更用
	$: {
		const exp = unitPrefixes[initUnitPrefix.prefix[ps]].exp;
		if (initUnitPrefix.value[ps] === '-' || initUnitPrefix.value[ps].endsWith('.')) {
			details.initT[ps] = '';
		} else {
			try {
				details.initT[ps] = Big(initUnitPrefix.value[ps] + 'e' + exp).toFixed();
			} catch {
				details.initT[ps] = '';
			}
		}
	}
	// delta
	$: {
		let delta: string;
		try {
			delta = Big(details.outT[ps]).minus(details.inT[ps]).minus(details.initT[ps]).toFixed();
		} catch {
			delta = '';
		}
		details.deltaT[ps] = delta;
	}
	// V
	$: {
		let v: string;
		const delta = details.deltaT[ps];
		try {
			v = Big(details.speHeight).div(100).div(delta).toFixed();
		} catch {
			v = delta === '0' ? '#DIV/0!' : '';
		}
		details.v[ps] = v;
	}
</script>

<div class="flex flex-col gap-4 *:whitespace-nowrap">
	<div class="flex items-baseline gap-2">
		<p class="text-xl">{ps.toUpperCase()}波</p>
		<Input label="初期補正値" bind:value={initUnitPrefix.value[ps]} />
		<select class="select max-w-24" bind:value={initUnitPrefix.prefix[ps]}>
			{#each unitPrefixesKeys as unitPrefixesKey}
				<option value={unitPrefixesKey}>{unitPrefixes[unitPrefixesKey].prefix}</option>
			{/each}
		</select>
	</div>
	<p>{'in: ' + displayNums(details.inT[ps], (str) => addPrefix(str))}</p>
	<p>{'out: ' + displayNums(details.outT[ps], (str) => addPrefix(str))}</p>
	<p>{'Δ: ' + displayNums(details.deltaT[ps], (str) => addPrefix(str))}</p>
	<p>{'V: ' + displayNums(details.v[ps], (str) => `${str} [m/s]`)}</p>
</div>
