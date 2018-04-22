import posName from './posName.js';
class RSI {
  constructor(period = 14, bottomLevel = 20, topLevel = 80) {
    this.period = period;
    this.bottomLevel = bottomLevel;
    this.topLevel = topLevel;
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
    const todayRSI = this.count(array);
    const yesterdayRSI = this.count(array.slice(0, array.length - 1));
    if((yesterdayRSI < this.bottomLevel && todayRSI > this.bottomLevel) || 
      (isPartOfStrategy && todayRSI < this.bottomLevel)) {
      return posName.LONG;
    } else if((yesterdayRSI > this.topLevel && todayRSI < this.topLevel)|| 
      (isPartOfStrategy && todayRSI > this.topLevel)) {
      return posName.SHORT;
    } else {
      return posName.NONE;
    }
  }

  calculate(array) {
    let result = new Array(this.period);
    let firstRSI = this.countInitRSI(array.slice(0, this.period+1));
    result.push(firstRSI);

    for(let i = this.period + 1; i <= array.length; i++){
      const d = array.slice(i-this.period, i+1);
      const res = this.countSmoothedRSI(d);
      result.push(res);
    }
    return result;
  }

  count(array) {
    return this.calculate(array)[array.length-1];
  }

  countInitRSI(array) {
    let sumGain = 0;
    let sumLoss = 0;
    for (let i = 1; i <= this.period-1; i++) {
      const difference = array[i] - array[i - 1];
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

  countSmoothedRSI(array) {
    let sumGain = 0;
    let sumLoss = 0;
    const difference = array[array.length - 1] - array[array.length - 2];
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
