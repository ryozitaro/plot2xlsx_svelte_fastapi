import type { BeforePlotEvent } from 'plotly.js-basic-dist-min';
import type { InputData, PSPair } from './types';
import type { UnitPrefixesKeys } from './unitPrefixes';

const newPair = (initial: string) => {
	return {
		p: initial,
		s: initial
	};
};

export const newInOut = () => {
	return {
		inT: newPair(''),
		outT: newPair('')
	};
};

const newDetails = () => {
	return {
		...newInOut(),
		speHeight: '10',
		initT: newPair('0'),
		deltaT: newPair(''),
		v: newPair(''),
		poi: ''
	};
};

const newInputData = (): InputData => {
	return {
		num: newPair(''),
		details: newDetails(),
		a1: ''
	};
};

const newPlot = (): BeforePlotEvent => {
	return {
		data: [],
		layout: {
			paper_bgcolor: 'hsl(0 0% 7%)',
			plot_bgcolor: 'hsl(20 14.3% 4.1%)',
			font: {
				family: 'var(--font-sans)',
				size: 14,
				color: 'hsl(0 0% 95%)'
			},
			shapes: []
		},
		config: { responsive: true, displayModeBar: false }
	};
};

export type NewInitUnitPrefix = {
	value: PSPair<string>;
	prefix: PSPair<UnitPrefixesKeys>;
};

export const newInitUnitPrefix = (): NewInitUnitPrefix => {
	return { value: { p: '0', s: '0' }, prefix: { p: 'none', s: 'none' } };
};

export const newSheet = () => {
	return {
		inputData: newInputData(),
		plotData: newPlot(),
		initUnitPrefix: newInitUnitPrefix()
	};
};

export type NewSheets = ReturnType<typeof newSheet>[];
