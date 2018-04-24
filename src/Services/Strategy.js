import posName from './posName.js';
import PositionController from './PositionController.js';

class STRATEGY {
  constructor(riskManagement, ...strategies) {
    this.riskManagement = riskManagement;
    this.strategies = strategies;
    this.positionController = new PositionController();
    this.trail = {};
  }

  simulate(props) {
    const {Date, Open, Close, High, Low} = props;

    const isPartOfStrategy = this.strategies.length === 1 ? false : true;
    for(let i = 30; i<=Close.length; i++){
      //evening;
      let knownClose = Close.slice(0, i);
      let knownLow = Low.slice(0, i);
      let knownHigh = High.slice(0, i);
      let knownDate = Date.slice(0, i);
      this.positionController.checkForClosingPosition(knownLow[knownLow.length - 1], knownHigh[knownHigh.length - 1], knownDate[knownDate.length - 1]);
      this.positionController.trailStopLoss(i, knownClose[knownClose.length - 1], knownClose[knownClose.length - 2]);
      
      //morining
      let todayOpenPrice = Open[i];
      let shoulInvestArray = this.strategies.map(strategy => strategy.shouldInvest(knownClose, isPartOfStrategy))
        .filter((value, index, self) => self.indexOf(value) === index);

      let shoulInvestResult = shoulInvestArray.length === 1 ? shoulInvestArray[0] : posName.NONE;
      if(shoulInvestResult !== posName.NONE){
        if(this.riskManagement.isInvestmentPossible(knownClose, shoulInvestResult)){
          const bollingerBands = this.riskManagement.getBands(Close.slice(0, i));
          this.positionController.openPosition(shoulInvestResult, Date[i], todayOpenPrice, bollingerBands);
        }
      }
    }
    // console.log(this.positionController.positions);
    this.trail = this.positionController.trail;
    // console.log(this.positionController.trail);
  }

}

export default STRATEGY;