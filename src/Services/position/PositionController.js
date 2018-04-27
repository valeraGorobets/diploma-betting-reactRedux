import Position from './Position.js';
import {Type, Status} from './PositionConstants.js';
import MA from '../indicators/MA.js';

class PositionController {
  constructor(moneyManager) {
    this.moneyManager = moneyManager;
    this.positions = [];
    this.trail = {};
    this.ma = new MA(5);
  }

  openPosition(type, date, priceOpened, bollingerBands) {
    const position = new Position(this.nextID(), type, date, priceOpened, bollingerBands);
    this.moneyManager.openPosition(position);
    this.positions.push(position);
  }

  nextID() {
    let index = 0;
    this.nextID = () => index++;
    return index++;
  }

  closePosition(position, todayDate) {
    position.status = Status.CLOSED;
    position.dateClosing = todayDate;
    this.moneyManager.closePosition(position);
  }

  checkForClosingPosition(todayDate, todayMinPrice, todayMaxPrice) {
    this.positions.filter(position => position.status === Status.OPENED)
      .forEach(position => {
        if((position.type === Type.LONG &&  position.stopLoss >= todayMinPrice) || 
          (position.type === Type.SHORT && position.stopLoss <= todayMaxPrice)) {
            this.closePosition(position, todayDate);
        }
      })
  }

  trailStopLoss(i, knownClose, todayMinPrice, todayMaxPrice, yesterdayMinPrice, yesterdayMaxPrice) {
    const stopLossFromMA = this.ma.count(knownClose);

    this.positions.filter(position => position.status === Status.OPENED)
      .forEach(position => {
        const daysNotToTrail = 2;

        switch(true) {
          case (position.moovedStop === 0):
            let trailingArray = new Array(i-2);
            trailingArray.push(position.stopLoss);
            this.trail[position.dateCreation] = trailingArray;
            break;
          case (position.moovedStop < daysNotToTrail):
            position.stopLoss = position.stopLoss;
            break;
          case (position.moovedStop === daysNotToTrail):
            position.stopLoss = position.priceOpened;
            break;
          default:
            const trailedStopLoss = stopLossFromMA - position.differenceStopFromMA;
            if(position.type === Type.LONG && todayMinPrice - yesterdayMinPrice > 0) {
              position.stopLoss = trailedStopLoss > position.stopLoss ? trailedStopLoss : position.stopLoss; 
            } else if(position.type === Type.SHORT && todayMaxPrice - yesterdayMaxPrice < 0){
              position.stopLoss = trailedStopLoss < position.stopLoss ? trailedStopLoss : position.stopLoss;
            } else {
              position.differenceStopFromMA = stopLossFromMA - position.stopLoss;
            }
        }   

        position.moovedStop ++;
        this.trail[position.dateCreation].push(position.stopLoss);
      });
  }

  closeAllPositions(today){
    this.positions.filter(position => position.status === Status.OPENED)
      .forEach(position => this.closePosition(position, today));
  }
}

export default PositionController;