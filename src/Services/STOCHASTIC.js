import MA from './MA.js';
import posName from './posName.js';

class STOCHASTIC {
  constructor(kPeriod = 14, dPeriod = 3, smooth = 1, bottomLevel = 20, topLevel = 80) {
    this.kPeriod = kPeriod;
    this.dPeriod = dPeriod;
    this.smooth = smooth;
    this.bottomLevel = bottomLevel;
    this.topLevel = topLevel;
  }

  simulate(array, highPricesArray, lowPricesArray, dates, isPartOfStrategy) {
    for(let i = 30; i<=array.length; i++){
      let knownArray = array.slice(0, i);
      let knownHighPricesArray = highPricesArray.slice(0, i);
      let knownLowPricesArray = lowPricesArray.slice(0, i);
      let si = this.shouldInvest(knownArray, knownHighPricesArray, knownLowPricesArray, isPartOfStrategy);
      if(si !== posName.NONE){
        console.log(`Date: ${dates.slice(0, i).pop()}; Should Invest: ${si}`)
      }
    }
  }

  shouldInvest(array, highPricesArray, lowPricesArray, isPartOfStrategy) {
    const todayStoch = this.count(array, highPricesArray, lowPricesArray);
    array.pop();
    highPricesArray.pop();
    lowPricesArray.pop();
    const yesterdayStoch = this.count(array, highPricesArray, lowPricesArray);
    if((yesterdayStoch.K < this.bottomLevel && todayStoch.K > this.bottomLevel) || 
      (isPartOfStrategy && todayStoch.K > todayStoch.D)) {
      return posName.LONG;
    } else if((yesterdayStoch.K > this.topLevel && todayStoch.K < this.topLevel)|| 
      (isPartOfStrategy && todayStoch.K < todayStoch.D)) {
      return posName.SHORT;
    } else {
      return posName.NONE;
    }
  }

  calculate(array, highPricesArray, lowPricesArray) {
    let K = new Array(this.kPeriod-1);
    let D = new Array(this.kPeriod-1);
    for(let i = this.kPeriod; i <= array.length; i++){
      const highPrices = highPricesArray.slice(i-this.kPeriod, i);
      const lowPrices = lowPricesArray.slice(i-this.kPeriod, i);
      const currentPrice = array.slice(i-this.kPeriod, i).pop();
      const res = this.countStochastic(highPrices, lowPrices, currentPrice);
      K.push(res);
    }
    K = new MA(this.smooth).calculate(K);
    D = D.concat(new MA(this.dPeriod).calculate(K.slice(this.kPeriod-1)));
    return {K, D};
  }

  count(array, highPricesArray, lowPricesArray) {
    const {K,D} = this.calculate(array, highPricesArray, lowPricesArray);
    return {
      K: K[K.length-1],
      D: D[D.length-1],
    }
  }

  countStochastic(highPrices, lowPrices, currentPrice) {
    highPrices = highPrices.slice(-this.kPeriod);
    lowPrices = lowPrices.slice(-this.kPeriod);
    const highestPrice = Math.max(...highPrices); 
    const lowestPrice = Math.min(...lowPrices);
    return 100 * (currentPrice - lowestPrice) / (highestPrice - lowestPrice);
  }
}

export default STOCHASTIC;