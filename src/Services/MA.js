import posName from './posName.js';
class MA {
  constructor(period = 9) {
    this.period = period;
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
    const todayPrice = data[data.length - 1];
    const yesterdayPrice = data[data.length - 2];
    const todayMA = this.count(data.slice(-this.period));
    const yesterdayMA = this.count(data.slice(-this.period-1, -1));
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

  calculate(data) {
    const {Close} = data;
    let result = new Array(this.period-1);
    for(let i = this.period; i <= Close.length; i++){
      const d = Close.slice(i-this.period, i);
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