class EMA {
  constructor(period) {
    this.period = period;
  }

  shouldInvest(currentPrice, data) {
  }

  calculate(data) {
    const k = 2/(this.period + 1);
    let emaArray = [data[0]];
    for (let i = 1; i < data.length; i++) {
      emaArray.push(data[i] * k + emaArray[i - 1] * (1 - k));
    }
    return emaArray;
  }

  count(data) {
    return this.calculate(data).pop();
  }
}

export default EMA;