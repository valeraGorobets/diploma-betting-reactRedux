import posName from './posName.js';
import PositionController from './PositionController.js';

class STRATEGY {
  constructor(riskManagement, ...strategies) {
    this.riskManagement = riskManagement;
    this.strategies = strategies;
    this.positionController = new PositionController();
  }

  simulate(props) {
    const array = props.Close;
    const dates = props.Date;
    const arrayOfOpen = props.Open;

    const isPartOfStrategy = this.strategies.length === 1 ? false : true;
    for(let i = 30; i<=array.length; i++){
      //Actually I analize on the morning, knowing close data yesterday and beond
      let todayOpenPrice = arrayOfOpen[i];
      let knownArray = array.slice(0, i);
      let shoulInvestArray = this.strategies.map(strategy => strategy.shouldInvest(knownArray, isPartOfStrategy))
        .filter((value, index, self) => self.indexOf(value) === index);

      let shoulInvestResult = shoulInvestArray.length === 1 ? shoulInvestArray[0] : posName.NONE;
      if(shoulInvestResult !== posName.NONE){
        if(this.riskManagement.isInvestmentPossible(knownArray, shoulInvestResult)){
          // console.log(`Date: ${dates[i-1]}; Should Invest: ${shoulInvestResult}`);
          const bollingerBands = this.riskManagement.getBands(array.slice(0, i));
          this.positionController.openPosition(shoulInvestResult, dates[i], todayOpenPrice, bollingerBands);
        }
      }
    }
    console.log(this.positionController.posions);
  }

}

export default STRATEGY;