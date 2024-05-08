export type PS = 'p' | 's';
export type PSParams<T> = { p: T; s: T };

export type WaveData = {
  time: number[];
  voltages: { [key in string]: number[] }[];
};

export type ReceivedWaveData = { [key in string]: WaveData };
