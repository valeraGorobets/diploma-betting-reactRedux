import MA from './MA.js';

class STOCHASTIC {
  constructor(kPeriod = 14, dPeriod = 3) {
    this.kPeriod = kPeriod;
    this.dPeriod = dPeriod;
  }

  shouldInvest(currentPrice, data) {
  }

  calculate(data) {
    const {High, Low, Close} = data;
    let K = new Array(this.kPeriod-1);
    let D = new Array(this.kPeriod-1);
    for(let i = this.kPeriod; i <= Close.length; i++){
      const highPrices = High.slice(i-this.kPeriod, i);
      const lowPrices = Low.slice(i-this.kPeriod, i);
      const currentPrice = Close.slice(i-this.kPeriod, i).pop();
      const res = this.count(highPrices, lowPrices, currentPrice);
      K.push(res);
    }
    D = D.concat(new MA(this.dPeriod).calculate(K.slice(this.kPeriod-1)));
    return {K, D};
  }

  count(highPrices, lowPrices, currentPrice) {
    highPrices = highPrices.slice(-this.kPeriod);
    lowPrices = lowPrices.slice(-this.kPeriod);
    const highestPrice = Math.max(...highPrices); 
    const lowestPrice = Math.min(...lowPrices);
    return 100 * (currentPrice - lowestPrice) / (highestPrice - lowestPrice);
  }
}

export default STOCHASTIC;