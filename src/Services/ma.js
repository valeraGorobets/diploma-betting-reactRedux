import indicator from './indicator';

class MA {
  constructor(period) {
    this.period = period;
  }

  shouldInvest(currentPrice, data) {
  }

  countMA(data) {
    return data.reduce((total, value) => total + value)/data.length;
  }
}