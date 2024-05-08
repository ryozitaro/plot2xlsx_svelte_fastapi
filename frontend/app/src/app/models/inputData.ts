import Big from 'big.js';

import { UnitPrefixesKeys, unitPrefixes } from '@/app/const/unitPrefixes';
import { PS, PSParams } from '@/app/types';

export class InputValue {
  readonly value;
  readonly isBig;
  constructor(value: Big.Big | string) {
    this.value = value instanceof Big ? value.toFixed() : value;
    this.isBig = value instanceof Big;
  }
  toJSON() {
    return this.value;
  }
}

export class InputValueUnit {
  readonly isBig;
  readonly prefix;
  readonly inputValue;
  constructor(inputValue: Big.Big | string, prefix: UnitPrefixesKeys) {
    this.isBig = inputValue instanceof Big;
    this.prefix = prefix;
    this.inputValue =
      inputValue instanceof Big ? inputValue.toFixed() : inputValue;
  }
  get value() {
    return Big(10)
      .pow(unitPrefixes[this.prefix].exp)
      .times(this.inputValue)
      .toFixed();
  }
  toJSON() {
    return this.value;
  }
}

export class InputData {
  private readonly empty;
  readonly num: PSParams<string>;
  readonly details: {
    speHeight: InputValue;
    initT: PSParams<InputValueUnit>;
    inT: PSParams<InputValue>;
    outT: PSParams<InputValue>;
    deltaT: PSParams<InputValue>;
    v: PSParams<InputValue>;
    poi: InputValue;
  };
  a1: string;
  constructor() {
    this.empty = '---';
    this.num = { p: '', s: '' };
    this.details = {
      speHeight: new InputValue(Big(10)),
      initT: {
        p: new InputValueUnit(Big(0), 'none'),
        s: new InputValueUnit(Big(0), 'none'),
      },
      inT: {
        p: new InputValue(this.empty),
        s: new InputValue(this.empty),
      },
      outT: {
        p: new InputValue(this.empty),
        s: new InputValue(this.empty),
      },
      deltaT: {
        p: new InputValue(this.empty),
        s: new InputValue(this.empty),
      },
      v: {
        p: new InputValue(this.empty),
        s: new InputValue(this.empty),
      },
      poi: new InputValue(this.empty),
    };
    this.a1 = '';
  }

  private toJSON() {
    return { num: this.num, details: this.details, a1: this.a1 };
  }
  resetDetails() {
    this.details.speHeight = new InputValue(Big(10));
    this.details.initT.p = new InputValueUnit(Big(0), 'none');
    this.details.initT.s = new InputValueUnit(Big(0), 'none');
    this.details.inT.p = new InputValue(this.empty);
    this.details.inT.s = new InputValue(this.empty);
    this.details.outT.p = new InputValue(this.empty);
    this.details.outT.s = new InputValue(this.empty);
    this.calc('p');
    this.calc('s');
  }
  private calcDelta(ps: PS) {
    const initT = this.details.initT[ps];
    const inT = this.details.inT[ps];
    const outT = this.details.outT[ps];
    this.details.deltaT[ps] =
      initT.isBig && inT.isBig && outT.isBig
        ? new InputValue(Big(outT.value).minus(inT.value).minus(initT.value))
        : new InputValue(this.empty);
  }
  private calcV(ps?: PS) {
    const { speHeight } = this.details;
    if (speHeight.isBig) {
      const psArr: PS[] = ps ? [ps] : ['p', 's'];
      for (const ps of psArr) {
        const delta = this.details.deltaT[ps];
        let v: InputValue;
        if (delta.isBig) {
          try {
            v = new InputValue(Big(speHeight.value).div(100).div(delta.value));
          } catch {
            v = new InputValue('#DIV/0!');
          }
        } else {
          v = new InputValue(this.empty);
        }
        this.details.v[ps] = v;
      }
    }
  }
  private calcPoi() {
    const { p: vP, s: vS } = this.details.v;
    if (vP.isBig && vS.isBig) {
      try {
        const pow = Big(vP.value).div(vS.value).pow(2);
        const x = pow.minus(2);
        const y = pow.minus(1).times(2);
        this.details.poi = new InputValue(x.div(y));
      } catch {
        this.details.poi = new InputValue('#DIV/0!');
      }
    } else {
      this.details.poi = new InputValue(this.empty);
    }
  }
  private calc(ps?: PS) {
    ps && this.calcDelta(ps);
    this.calcV(ps);
    this.calcPoi();
  }
  changeSpeHeight(v: Big.Big | string) {
    this.details.speHeight = new InputValue(v);
    this.calc();
  }
  changeInit(v: Big.Big | string, prefix: UnitPrefixesKeys, ps: PS) {
    this.details.initT[ps] = new InputValueUnit(v, prefix);
    this.calc(ps);
  }
  changeIn(v: Big.Big | string, ps: PS) {
    this.details.inT[ps] = new InputValue(v);
    this.calc(ps);
  }
  changeOut(v: Big.Big | string, ps: PS) {
    this.details.outT[ps] = new InputValue(v);
    this.calc(ps);
  }
  changeA1(v: string) {
    this.a1 = v;
  }
}
