import { atom } from 'jotai';
import { sheetModel } from '../models/sheetModel';
import { plotModel } from '../models/plotModel';
import { focusAtom } from 'jotai-optics';
import { SheetParams } from '../types';
import BigNumber from 'bignumber.js';
import { PlotParams } from 'react-plotly.js';

// インデックス
export const sheetIndexAtom = atom(0);

// プロットデータ
export const plotArrAtom = atom([structuredClone(plotModel)]);

export const plotAtom = atom(
  (get) => get(plotArrAtom)[get(sheetIndexAtom)],
  (get, set, newPlot: PlotParams) =>
    set(plotArrAtom, (prev) => {
      const newArr = structuredClone(prev);
      newArr[get(sheetIndexAtom)] = newPlot;
      return newArr;
    })
);

export const plotDataAtom = focusAtom(plotAtom, (optic) => optic.prop('data'));
export const plotLayoutAtom = focusAtom(plotAtom, (optic) =>
  optic.prop('layout')
);
export const plotLayoutShapeAtom = focusAtom(plotLayoutAtom, (optic) =>
  optic.prop('shapes')
);

// NumInputGroupの中のuseEffectでのPS選択番号とプロットのPS番号の比較用
export const plotSelectPSArrAtom = atom([structuredClone(sheetModel.num)]);
export const plotSelectPSAtom = atom(
  (get) => get(plotSelectPSArrAtom)[get(sheetIndexAtom)],
  (get, set, newSelectPS: SheetParams['num']) =>
    set(plotSelectPSArrAtom, (prev) => {
      const newArr = structuredClone(prev);
      newArr[get(sheetIndexAtom)] = newSelectPS;
      return newArr;
    })
);
export const plotSelectPAtom = focusAtom(plotSelectPSAtom, (optic) =>
  optic.prop('p')
);
export const plotSelectSAtom = focusAtom(plotSelectPSAtom, (optic) =>
  optic.prop('s')
);

// シートデータ
export const sheetArrAtom = atom([structuredClone(sheetModel)]);

export const sheetLengthAtom = atom((get) => get(sheetArrAtom).length);

export const sheetAtom = atom(
  (get) => get(sheetArrAtom)[get(sheetIndexAtom)],
  (get, set, newSheet: SheetParams) =>
    set(sheetArrAtom, (prev) => {
      const newArr = structuredClone(prev);
      newArr[get(sheetIndexAtom)] = newSheet;
      return newArr;
    })
);

export const numAtom = focusAtom(sheetAtom, (optic) => optic.prop('num'));
export const numPAtom = focusAtom(numAtom, (optic) => optic.prop('p'));
export const numSAtom = focusAtom(numAtom, (optic) => optic.prop('s'));

export const selectedAtom = focusAtom(sheetAtom, (optic) =>
  optic.prop('selected')
);

export const speHeightAtom = focusAtom(selectedAtom, (optic) =>
  optic.prop('spe_height')
);
export const initTAtom = focusAtom(selectedAtom, (optic) =>
  optic.prop('init_t')
);
export const inTAtom = focusAtom(selectedAtom, (optic) => optic.prop('in_t'));
export const outTAtom = focusAtom(selectedAtom, (optic) => optic.prop('out_t'));
export const deltaTAtom = atom(
  (get) => get(selectedAtom).delta_t,
  (get, set, ps: 'p' | 's') =>
    set(selectedAtom, (prev) => {
      const initT = get(initTAtom)[ps],
        inT = get(inTAtom)[ps],
        outT = get(outTAtom)[ps],
        deltaT = +BigNumber(outT).minus(inT).minus(initT);
      return { ...prev, delta_t: { ...prev.delta_t, [ps]: deltaT } };
    })
);
export const vAtom = atom(
  (get) => get(selectedAtom).v,
  (get, set, ps: 'p' | 's') =>
    set(selectedAtom, (prev) => {
      const speHeight = get(speHeightAtom),
        deltaT = get(deltaTAtom)[ps];
      if (!Number.isNaN(speHeight) && !Number.isNaN(deltaT)) {
        const v = +BigNumber(BigNumber(speHeight).div(100)).div(deltaT);
        return { ...prev, v: { ...prev.v, [ps]: v } };
      } else {
        return { ...prev };
      }
    })
);
export const poiAtom = atom(
  (get) => get(selectedAtom).poi,
  (get, set) =>
    set(selectedAtom, (prev) => {
      const vPS = get(vAtom);
      if (!Number.isNaN(vPS.p) && !Number.isNaN(vPS.s)) {
        const pow = Math.pow(vPS.p / vPS.s, 2),
          calc = +BigNumber(BigNumber(pow).minus(2)).div(
            BigNumber(pow).minus(1).times(2)
          ),
          poi = Math.abs(calc) !== Infinity ? calc : '#DIV/0!';
        return { ...prev, poi: poi };
      } else {
        return { ...prev };
      }
    })
);

export const a1Atom = focusAtom(sheetAtom, (optic) => optic.prop('a1'));
