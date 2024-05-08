'use client';

import { Download, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { snapshot } from 'valtio';

import { convertXlsxURL } from '@/app/const/backendURL';
import { State, state } from '@/app/state/state';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

export const Save = () => {
  const [fileName, setFileName] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const toXlsx = async (sheets: State['sheets']) => {
    try {
      const res = await fetch(convertXlsxURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sheets.map((sheet) => sheet.inputState)),
      });
      if (!res.ok) {
        toast({
          title: 'エラー',
          description: 'データを取得できませんでした。',
          variant: 'destructive',
        });
        const error = Error(
          `データ取得エラー: (${res.status} ${res.statusText})`,
        );
        throw error;
      }
      return res.blob();
    } catch (e) {
      toast({
        title: 'エラー',
        description: '通信エラーが発生しました。',
        variant: 'destructive',
      });
      throw e;
    }
  };

  const vali = (sheets: State['sheets']) => {
    for (let i = 0; i < sheets.length; i++) {
      const details = sheets[i].inputState.details;
      if (!details.poi.isBig) {
        state.currentSheetIndex = i;
        const error = Error(i + 1 + 'ページ目に未入力があります');
        toast({
          title: 'エラー',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }
    }
  };

  const handleXlsxDownload = async () => {
    setIsLoading(true);
    try {
      const { sheets } = snapshot(state);
      if (fileName === '' || fileName === undefined) {
        if (fileName === undefined) setFileName('');
        toast({
          description: 'ファイル名を入力してください',
          variant: 'destructive',
        });
        throw Error('no filename');
      }
      vali(sheets as State['sheets']);
      const xlsx = await toXlsx(sheets as State['sheets']);
      const a = document.createElement('a');
      a.href = window.URL.createObjectURL(xlsx);
      a.download = fileName;
      a.click();
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex items-stretch justify-between'>
      <div className='flex items-baseline gap-1 rounded-lg border bg-group p-1'>
        <Input
          className='h-full'
          placeholder='ファイル名'
          onBlur={(e) => setFileName(e.target.value)}
          onChange={(e) => setFileName(e.target.value)}
          error={fileName === ''}
        />
        <span className='px-2 text-group-foreground'>.xlsx</span>
      </div>
      <Button size='lg' onClick={handleXlsxDownload} disabled={isLoading}>
        {isLoading ? (
          <Loader2 className='mr-4 animate-spin' />
        ) : (
          <Download className='mr-4' />
        )}
        <b>保存</b>
      </Button>
    </div>
  );
};
