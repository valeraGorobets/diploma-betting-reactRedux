import posName from './posName.js';
class MA {
  constructor(period = 9) {
    this.period = period;
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
    const amountOnUndefindes = array.findIndex(el => Number(el));
    array = array.filter(Number);
    let result = new Array(amountOnUndefindes + this.period-1);
    for(let i = this.period; i <= array.length; i++){
      const d = array.slice(i-this.period, i);
      const res = this.count(d);
      result.push(res);
    }
    return result;
  }

  count(array) {
    return array.slice(-this.period).reduce((total, value) => total + value) / this.period;
  }
}

export default MA;