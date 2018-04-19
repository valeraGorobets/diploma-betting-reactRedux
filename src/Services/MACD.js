import MA from './MA.js';
import EMA from './EMA.js';

class MACD {
  constructor(shortPeriod, longPeriod, signalPeriod) {
    this.shortPeriod = shortPeriod;
    this.longPeriod = longPeriod;
    this.signalPeriod = signalPeriod;
  }

  shouldInvest(currentPrice, data) {
  }

  difference(set1, set2) {
    if(set1 && set2 && set1.length !== set2.length) {
      throw new TypeError('Must be equal length');
    }
    let result = [];
    for(let i = 0; i< set1.length; i++) {
      result.push(set1[i]-set2[i]);
    }
    return result;
  }

  calculate(data) {
    const ma = new MA(this.signalPeriod);
    const emaShort = new EMA(this.shortPeriod).calculate(data);
    const emaLong = new EMA(this.longPeriod).calculate(data);
    const MACD = this.difference(emaShort, emaLong);
    const SIGNAL = ma.calculate(MACD);
    const HIST = this.difference(MACD, SIGNAL);
    return {MACD, SIGNAL, HIST};
  }

  count(data) {
    const calculation = this.calculate(data);
    return {
      MACD: calculation.MACD.pop(),
      SIGNAL: calculation.SIGNAL.pop(),
      HIST: calculation.HIST.pop()
    }
  }
}

export default MACD;