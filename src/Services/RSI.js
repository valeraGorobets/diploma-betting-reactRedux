import posName from './posName.js';
class RSI {
  constructor(period = 14, bottomLevel = 20, topLevel = 80) {
    this.period = period;
    this.bottomLevel = bottomLevel;
    this.topLevel = topLevel;
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
    const today = this.count(data);
    const yesterday = this.count(data.slice(0, data.length - 1));
    if((yesterday < this.bottomLevel && today > this.bottomLevel) || 
      (isPartOfStrategy && today < this.bottomLevel)) {
      return posName.LONG;
    } else if((yesterday > this.topLevel && today < this.topLevel)|| 
      (isPartOfStrategy && today > this.topLevel)) {
      return posName.SHORT;
    } else {
      return posName.NONE;
    }
  }

  calculate(data) {
    let result = new Array(this.period);
    let firstRSI = this.countInitRSI(data.slice(0, this.period+1));
    result.push(firstRSI);

    for(let i = this.period + 1; i <= data.length; i++){
      const d = data.slice(i-this.period, i+1);
      const res = this.countSmoothedRSI(d);
      result.push(res);
    }
    return result;
  }

  count(data) {
    return this.calculate(data)[data.length-1];
  }

  countInitRSI(data) {
    let sumGain = 0;
    let sumLoss = 0;
    for (let i = 1; i <= this.period-1; i++) {
      const difference = data[i] - data[i - 1];
      if (difference >= 0) {
        sumGain += difference;
      } else {
        sumLoss -= difference;
      }
    }

    this.avSumGain = sumGain / (this.period - 1);
    this.avSumLoss = sumLoss / (this.period - 1);
    return 100 - (100 / (1 + this.avSumGain/this.avSumLoss));
  }

  countSmoothedRSI(data) {
    let sumGain = 0;
    let sumLoss = 0;
    const difference = data[data.length - 1] - data[data.length - 2];
    if (difference >= 0) {
      sumGain += difference;
    } else {
      sumLoss -= difference;
    }

    this.avSumGain = (this.avSumGain*(this.period-1) + sumGain)/this.period;
    this.avSumLoss = (this.avSumLoss*(this.period-1) + sumLoss)/this.period;
    return 100 - (100 / (1 + this.avSumGain/this.avSumLoss));
  }
}

export default RSI;
