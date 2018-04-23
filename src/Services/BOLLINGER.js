import boll from 'bollinger-bands';
import posName from './posName.js';

class BOLLINGER {
  constructor(period = 20, stDeviation = 2) {
    this.period = period;
    this.stDeviation = stDeviation;
  }

  simulate(array, dates, isPartOfStrategy) {
    for(let i = 30; i<=array.length; i++){
      let knownArray = array.slice(0, i);
      let si = this.shouldInvest(knownArray, isPartOfStrategy);
      if(si !== posName.NONE){
        console.log(`Date: ${dates.slice(0, i).pop()}; Should Invest: ${si}`)
      }
    }
  }

  shouldInvest(array, isPartOfStrategy) {
    const todayPrice = array[array.length - 1];
    const yesterdayPrice = array[array.length - 2];
    const todayMA = this.count(array.slice(-this.period));
    const yesterdayMA = this.count(array.slice(-this.period-1, -1));
    if((yesterdayMA > yesterdayPrice && todayMA < todayPrice) ||
      (isPartOfStrategy && todayMA < todayPrice)) {
      return posName.LONG;
    } else if((yesterdayMA < yesterdayPrice && todayMA > todayPrice) || 
      (isPartOfStrategy && todayMA > todayPrice)) {
      return posName.SHORT;
    } else {
      return posName.NONE;
    }
  }

  calculate(array) {
    return boll(array, 20, 2);
  }

  count(array) {
    const calculation = this.calculate(array);
    return {
      upper: calculation.upper.pop(),
      mid: calculation.mid.pop(),
      lower: calculation.lower.pop()
    }
  }
}

export default BOLLINGER;