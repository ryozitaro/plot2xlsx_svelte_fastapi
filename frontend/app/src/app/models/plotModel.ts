import { PlotParams } from 'react-plotly.js';

export const plotData: PlotParams = {
  data: [],
  layout: {
    paper_bgcolor: 'hsl(0 0% 7%)',
    plot_bgcolor: 'hsl(20 14.3% 4.1%)',
    font: {
      family: 'var(--font-sans)',
      size: 14,
      color: 'hsl(0 0% 95%)',
    },
    shapes: [],
  },
  config: { responsive: true, displayModeBar: false },
};
