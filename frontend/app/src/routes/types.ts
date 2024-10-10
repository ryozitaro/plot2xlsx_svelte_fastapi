export type WaveData = {
	time: number[];
	voltages: {
		name: string;
		voltage: number[];
	}[];
};

export type PS = 'p' | 's';

export type PSPair<T> = {
	p: T;
	s: T;
};

export type InputData = {
	num: PSPair<string>;
	details: {
		speHeight: string;
		initT: PSPair<string>;
		inT: PSPair<string>;
		outT: PSPair<string>;
		deltaT: PSPair<string>;
		v: PSPair<string>;
		poi: string;
	};
	a1: string;
};
