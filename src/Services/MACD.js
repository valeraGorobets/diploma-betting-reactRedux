import EMA from './EMA.js';
import posName from './posName.js';

class MACD {
  constructor(shortPeriod, longPeriod, signalPeriod) {
    this.shortPeriod = shortPeriod;
    this.longPeriod = longPeriod;
    this.signalPeriod = signalPeriod;
  }

  simulate(data, isPartOfStrategy) {
    const {Date, Close} = data;
    for(let i = 30; i<=Close.length; i++){
      let knownData = Close.slice(0, i);
      let si = this.shouldInvest(knownData, isPartOfStrategy);
      if(si !== posName.NONE){
        console.log(`Date: ${Date.slice(0, i).pop()}; Should Invest: ${si}`)
      }
    }
  }

  shouldInvest(data, isPartOfStrategy) {
    const today = this.count(data.slice(-this.longPeriod));
    const yesterday = this.count(data.slice(-this.longPeriod-1, -1));
    if((today.MACD < 0 && yesterday.HIST < 0 && today.HIST > 0) || 
      (isPartOfStrategy && today.HIST > 0)) {
      return posName.LONG;
    } else if((today.MACD > 0 && yesterday.HIST > 0 && today.HIST < 0) ||
      (isPartOfStrategy && today.HIST < 0)) {
      return posName.SHORT;
    } else {
      return posName.NONE;
    }
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
    const {Close} = data;
    const ema = new EMA(this.signalPeriod);
    const emaShort = new EMA(this.shortPeriod).calculate(Close);
    const emaLong = new EMA(this.longPeriod).calculate(Close);
    const MACD = this.difference(emaShort, emaLong);
    const SIGNAL = ema.calculate(MACD);
    const HIST = this.difference(MACD, SIGNAL);
    return {MACD, SIGNAL, HIST};
  }

  count(data) {
    const calculation = this.calculate(data.slice(-this.longPeriod));
    return {
      MACD: calculation.MACD.pop(),
      SIGNAL: calculation.SIGNAL.pop(),
      HIST: calculation.HIST.pop()
    }
  }
}

export default MACD;