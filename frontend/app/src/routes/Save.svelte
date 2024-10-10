<script lang="ts">
	import Download from 'lucide-svelte/icons/download';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { convertXlsxURL } from './const';
	import type { NewSheets } from './stores';

	export let sheetIndex: number;
	export let sheets: NewSheets;

	let fileName: string | undefined = undefined;
	let saveButtonLoading = false;
	const vali = () => {
		for (let i = 0; i < sheets.length; i++) {
			const details = sheets[i].inputData.details;
			if (!details.poi) {
				sheetIndex = i;
				const error = Error(i + 1 + 'ページ目に未入力があります');
				alert(error.message);
				throw error;
			}
		}
	};
	const fetchToXlsx = async () => {
		let res: Response;
		try {
			res = await fetch(convertXlsxURL, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(sheets.map((sheet) => sheet.inputData))
			});
		} catch (e) {
			alert('通信エラーが発生しました。');
			throw e;
		}
		if (res.ok) {
			return res.blob();
		} else {
			alert('データを取得できませんでした。');
			const error = Error(`データ取得エラー: (${res.status} ${res.statusText})`);
			throw error;
		}
	};
	const handleXlsxDownload = async () => {
		saveButtonLoading = true;
		try {
			if (fileName === '' || fileName === undefined) {
				if (fileName === undefined) fileName = '';
				alert('ファイル名を入力してください');
				throw Error('no filename');
			}
			vali();
			const xlsx = await fetchToXlsx();
			const a = document.createElement('a');
			a.href = URL.createObjectURL(xlsx);
			a.download = fileName;
			a.click();
		} catch (e) {
			console.error(e);
		} finally {
			saveButtonLoading = false;
		}
	};
</script>

<div class="flex items-stretch justify-between gap-2">
	<div class="flex w-full">
		<Input label="ファイル名" bind:value={fileName}>.xlsx</Input>
	</div>
	<Button type="button" size="lg" on:click={handleXlsxDownload}>
		<Download />
		保存
	</Button>
</div>
