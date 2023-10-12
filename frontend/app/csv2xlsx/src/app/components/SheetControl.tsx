import { Button } from 'primereact/button';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
  sheetIndexAtom,
  sheetArrAtom,
  plotArrAtom,
  sheetLengthAtom,
  plotSelectPSArrAtom,
} from '../jotai/atom';
import { sheetModel } from '../models/sheetModel';
import { plotModel } from '../models/plotModel';

export const SheetControl = () => {
  const [sheetIndex, setSheetIndex] = useAtom(sheetIndexAtom);
  const setSheetArr = useSetAtom(sheetArrAtom);
  const setPlotArr = useSetAtom(plotArrAtom);
  const sheetLength = useAtomValue(sheetLengthAtom);
  const setPlotSelectPSArr = useSetAtom(plotSelectPSArrAtom);

  const addSheet = () => {
    setSheetIndex((prev) => prev + 1);
    setSheetArr((prev) => {
      const newArr = structuredClone(prev);
      newArr.splice(sheetIndex + 1, 0, structuredClone(sheetModel));
      return newArr;
    });
    setPlotArr((prev) => {
      const newArr = structuredClone(prev);
      newArr.splice(sheetIndex + 1, 0, structuredClone(plotModel));
      return newArr;
    });
    setPlotSelectPSArr((prev) => {
      const newArr = structuredClone(prev);
      newArr.splice(sheetIndex + 1, 0, structuredClone(sheetModel.num));
      return newArr;
    });
  };

  const deleteSheet = () => {
    if (sheetLength === sheetIndex + 1) setSheetIndex((prev) => prev - 1);
    setSheetArr((prev) => {
      const newArr = structuredClone(prev);
      newArr.splice(sheetIndex, 1);
      return newArr;
    });
    setPlotArr((prev) => {
      const newArr = structuredClone(prev);
      newArr.splice(sheetIndex, 1);
      return newArr;
    });
    setPlotSelectPSArr((prev) => {
      const newArr = structuredClone(prev);
      newArr.splice(sheetIndex, 1);
      return newArr;
    });
  };

  return (
    <div className='flex justify-between items-center'>
      <Button
        size='large'
        color='#ff0000'
        onClick={deleteSheet}
        disabled={sheetLength === 1 ? true : false}
      >
        シート消去
      </Button>
      <div>
        {Array(sheetLength)
          .fill(null)
          .map((_, n) => (
            <button
              className='indicator'
              type='button'
              key={n}
              disabled={n === sheetIndex}
              onClick={() => setSheetIndex(n)}
            ></button>
          ))}
      </div>
      <Button
        size='large'
        color='#0000ff'
        onClick={addSheet}
        disabled={sheetLength === 5 ? true : false}
      >
        シート追加
      </Button>
    </div>
  );
};
