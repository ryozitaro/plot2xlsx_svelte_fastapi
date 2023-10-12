export interface SheetParams {
  num: {
    p: string;
    s: string;
  };
  selected: {
    spe_height: number;
    init_t: {
      p: number;
      s: number;
    };
    in_t: {
      p: number;
      s: number;
    };
    out_t: {
      p: number;
      s: number;
    };
    delta_t: {
      p: number;
      s: number;
    };
    v: {
      p: number;
      s: number;
    };
    poi: number | '#DIV/0!';
  };
  a1: string;
}

export type PS = 'p' | 's';

export interface WaveData {
  time: number[];
  voltages: { [key: string]: number[] }[];
}
