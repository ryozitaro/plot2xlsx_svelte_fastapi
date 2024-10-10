<script lang="ts">
	import type { Props, InputEvents } from './index.js';
	import { cn } from '$lib/utils.js';

	type $$Props = Props;
	type $$Events = InputEvents;

	let className: $$Props['class'] = undefined;
	export let value: $$Props['value'] = undefined;
	export { className as class };
	export let label: $$Props['label'] = undefined;

	// Workaround for https://github.com/sveltejs/svelte/issues/9305
	// Fixed in Svelte 5, but not backported to 4.x.
	export let readonly: $$Props['readonly'] = undefined;

	let child = Object.keys($$slots).length !== 0;
</script>

<label class="relative flex h-11 w-full">
	<input
		class={cn(
			'peer block w-full appearance-none border-2 border-border bg-background p-3 text-sm text-foreground focus:border-ring focus:outline-none focus:ring-0',
			child ? 'rounded-s-md' : 'rounded-md',
			className
		)}
		placeholder=""
		bind:value
		{readonly}
		on:blur
		on:change
		on:click
		on:focus
		on:focusin
		on:focusout
		on:keydown
		on:keypress
		on:keyup
		on:mouseover
		on:mouseenter
		on:mouseleave
		on:mousemove
		on:paste
		on:input
		on:wheel|passive
		{...$$restProps}
	/>
	{#if label}
		<div
			class="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-background px-1 text-xs text-muted-foreground transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs peer-focus:text-foreground"
		>
			{label}
		</div>
	{/if}
	{#if child}
		<div
			class="flex items-center border-2 border-s-0 border-border bg-background px-3 text-sm text-foreground last:rounded-e-md peer-focus:border-ring peer-focus:outline-none peer-focus:ring-0"
		>
			<slot />
		</div>
	{/if}
</label>
