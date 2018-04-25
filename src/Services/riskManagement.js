import BOLLINGER from './indicators/BOLLINGER.js';
import {Type} from './position/PositionConstants.js';

class RiskManagement {
  constructor(allowedRisk = 2) {
    this.allowedRisk = allowedRisk;
  }

  simulate(array, dates) {
    for(let i = 30; i<=array.length; i++){
      let knownArray = array.slice(0, i);
      let long = this.isInvestmentPossible(knownArray, Type.LONG);
      let short = this.isInvestmentPossible(knownArray, Type.SHORT);
      if(long){
        console.log(`Date: ${dates.slice(0, i).pop()}; Should Invest: LONG`)
      }
      if(short){
        console.log(`Date: ${dates.slice(0, i).pop()}; Should Invest: SHORT`)
      }
    }
  }

  isInvestmentPossible(prices, desiredPosition) {
    const bollinger = this.getBands(prices.slice());
    return this.countRiskOfInvestment(prices[prices.length - 1], desiredPosition, bollinger);
  }

  countRiskOfInvestment(price, desiredPosition, bollinger) {
    if((desiredPosition === Type.LONG && price < bollinger.lower)||
      (desiredPosition === Type.SHORT && price > bollinger.upper)){
      // console.log('out')
      return true;
    }
    const res = (bollinger.upper - price)/(price - bollinger.lower);
    // console.log(res)
    if((desiredPosition === Type.LONG && res>=this.allowedRisk)||
      (desiredPosition === Type.SHORT && Math.pow(res, -1)>=this.allowedRisk)){
      // console.log('in')
      return true;
    }
    return false;
  }

  getBands(prices) {
    return new BOLLINGER().count(prices);
  }

}

export default RiskManagement;