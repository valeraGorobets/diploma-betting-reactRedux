import EMA from './EMA.js';
import {Type} from '../position/PositionConstants.js';

class MACD {
  constructor(shortPeriod = 12, longPeriod = 26, signalPeriod = 9) {
    this.shortPeriod = shortPeriod;
    this.longPeriod = longPeriod;
    this.signalPeriod = signalPeriod;
  }

  simulate(array, dates, isPartOfStrategy) {
    for(let i = 30; i<=array.length; i++){
      let knownArray = array.slice(0, i);
      let si = this.shouldInvest(knownArray, isPartOfStrategy);
      if(si !== Type.NONE){
        console.log(`Date: ${dates.slice(0, i).pop()}; Should Invest: ${si}`)
      }
    }
  }

  shouldInvest(array, isPartOfStrategy) {
    const today = this.count(array.slice(-this.longPeriod));
    const yesterday = this.count(array.slice(-this.longPeriod-1, -1));
    if((today.MACD < 0 && yesterday.HIST < 0 && today.HIST > 0) || 
      (isPartOfStrategy && today.HIST > 0)) {
      return Type.LONG;
    } else if((today.MACD > 0 && yesterday.HIST > 0 && today.HIST < 0) ||
      (isPartOfStrategy && today.HIST < 0)) {
      return Type.SHORT;
    } else {
      return Type.NONE;
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

  calculate(array) {
    const ema = new EMA(this.signalPeriod);
    const emaShort = new EMA(this.shortPeriod).calculate(array);
    const emaLong = new EMA(this.longPeriod).calculate(array);
    const MACD = this.difference(emaShort, emaLong);
    const SIGNAL = ema.calculate(MACD);
    const HIST = this.difference(MACD, SIGNAL);
    return {MACD, SIGNAL, HIST};
  }

  count(array) {
    const calculation = this.calculate(array.slice(-this.longPeriod));
    return {
      MACD: calculation.MACD.pop(),
      SIGNAL: calculation.SIGNAL.pop(),
      HIST: calculation.HIST.pop()
    }
  }
}

export default MACD;