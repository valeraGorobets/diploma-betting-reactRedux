import BOLLINGER from './BOLLINGER.js';
import posName from './posName.js';

class RiskManagement {
  constructor(allowedRisk=2) {
    this.allowedRisk = allowedRisk;
  }

  simulate(array, dates) {
    for(let i = 30; i<=array.length; i++){
      let knownArray = array.slice(0, i);
      let long = this.isInvestmentPossible(knownArray, posName.LONG);
      let short = this.isInvestmentPossible(knownArray, posName.SHORT);
      if(long){
        console.log(`Date: ${dates.slice(0, i).pop()}; Should Invest: LONG`)
      }
      if(short){
        console.log(`Date: ${dates.slice(0, i).pop()}; Should Invest: SHORT`)
      }
    }
  }

  isInvestmentPossible(prices, desiredPosition) {
    const bollinger = new BOLLINGER().count(prices);
    return this.countRiskOfInvestment(prices.pop(), desiredPosition, bollinger);
  }

  countRiskOfInvestment(price, desiredPosition, bollinger) {
    if((desiredPosition === posName.LONG && price < bollinger.lower)||
      (desiredPosition === posName.SHORT && price > bollinger.upper)){
      // console.log('out')
      return true;
    }
    const res = (bollinger.upper - price)/(price - bollinger.lower);
    // console.log(res)
    if((desiredPosition === posName.LONG && res>=this.allowedRisk)||
      (desiredPosition === posName.SHORT && Math.pow(res, -1)>=this.allowedRisk)){
      // console.log('in')
      return true;
    }
    return false;
  }

}

export default RiskManagement;