class MA {
  constructor(period) {
    this.period = period;
  }

  shouldInvest(currentPrice, data) {
  }

  calculate(data) {
    let result = new Array(this.period-1);
    for(let i = this.period; i <= data.length; i++){
      const d = data.slice(i-this.period, i);
      const res = this.count(d);
      result.push(res);
    }
    return result;
  }

  count(data) {
    return data.slice(-this.period).reduce((total, value) => total + value) / this.period;
  }
}

export default MA;