class RSI {
  constructor(period) {
    this.period = period;
  }

  shouldInvest(currentPrice, data) {
  }

  calculate(data) {
    let result = new Array(this.period);
    let firstRSI = this.count(data.slice(0, this.period+1));
    result.push(firstRSI);

    for(let i = this.period + 1; i <= data.length; i++){
      const d = data.slice(i-this.period, i+1);
      const res = this.countSmoothedRSI(d);
      result.push(res);
    }
    return result;
  }

  count(data) {
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
