import createPlotlyComponent from 'react-plotly.js/factory';
const Plotly = require('plotly.js/dist/plotly-basic.min');
import { useAtomValue, useSetAtom } from 'jotai';
import {
  inTAtom,
  outTAtom,
  deltaTAtom,
  vAtom,
  poiAtom,
  plotAtom,
  plotLayoutShapeAtom,
} from '../jotai/atom';

const Plot = createPlotlyComponent(Plotly);

const PlotComponent = () => {
  const setInT = useSetAtom(inTAtom);
  const setOutT = useSetAtom(outTAtom);
  const setDeltaT = useSetAtom(deltaTAtom);
  const setV = useSetAtom(vAtom);
  const setPoi = useSetAtom(poiAtom);
  const plot = useAtomValue(plotAtom);
  const setPlotLayoutShape = useSetAtom(plotLayoutShapeAtom);

  // クリックされたとき
  const clickPlot = (data: Readonly<Plotly.PlotMouseEvent>) => {
    const curveNumber = data.points[0].curveNumber;
    const x = data.points[0].x;
    const setInOut = [setInT, setOutT][curveNumber % 2];
    const ps = curveNumber < 2 ? 'p' : 's';
    setInOut((prev) => ({ ...prev, [ps]: x }));
    const update = {
      x0: x,
      x1: x,
      visible: true,
    };
    setDeltaT(ps);
    setV(ps);
    setPoi();
    setPlotLayoutShape((prev) => {
      if (prev) {
        const newShapes = structuredClone(prev);
        Object.assign(newShapes[curveNumber], update);
        return newShapes;
      }
    });
  };

  return (
    <Plot
      data={plot.data}
      layout={plot.layout}
      config={plot.config}
      style={{ width: '60vw', aspectRatio: 3 / 2 }}
      divId='graph'
      onClick={clickPlot}
    />
  );
};

export default PlotComponent;
