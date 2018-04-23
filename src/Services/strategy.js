import posName from './posName.js';

class STRATEGY {
  constructor(riskManagement, ...strategies) {
    this.riskManagement = riskManagement;
    this.strategies = strategies;
  }

  simulate(array, dates, ) {
    const isPartOfStrategy = this.strategies.length === 1 ? false : true;
    for(let i = 30; i<=array.length; i++){
      let knownArray = array.slice(0, i);
      let shoulInvestArray = this.strategies.map(strategy => strategy.shouldInvest(knownArray, isPartOfStrategy))
        .filter((value, index, self) => self.indexOf(value) === index);
      let shoulInvestResult = shoulInvestArray.length === 1 ? shoulInvestArray[0] : posName.NONE;
      if(shoulInvestResult !== posName.NONE){
        if(this.riskManagement.isInvestmentPossible(knownArray, shoulInvestResult)){
          console.log(`Date: ${dates.slice(0, i).pop()}; Should Invest: ${shoulInvestResult}`)
          // console.log("INVEST")
        }
      }
    }
  }

}

export default STRATEGY;