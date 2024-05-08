import { PlotParams } from 'react-plotly.js';
import { proxy } from 'valtio';

import { InputData } from '@/app/models/inputData';
import { plotData } from '@/app/models/plotModel';

const sheetCreator = () => {
  const inputState = new InputData();
  const plotState: PlotParams = structuredClone(plotData);
  return { inputState, plotState };
};

export class State {
  currentSheetIndex;
  sheets;
  constructor() {
    this.currentSheetIndex = 0;
    this.sheets = [sheetCreator()];
  }
  get currentSheet() {
    return this.sheets[this.currentSheetIndex];
  }
  changeSheet(i: number) {
    this.currentSheetIndex = i;
  }
  addSheet() {
    const currentSheetIndex = ++this.currentSheetIndex;
    const sheet = sheetCreator();
    this.sheets.splice(currentSheetIndex, 0, sheet);
  }
  deleteSheet() {
    this.sheets.splice(this.currentSheetIndex, 1);
    if (this.sheets.length === this.currentSheetIndex) this.currentSheetIndex--;
  }
}

export const state = proxy(new State());
