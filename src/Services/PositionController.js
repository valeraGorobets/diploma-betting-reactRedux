import Position from './Position.js';
import posName from './posName.js';

class PositionController {
  constructor() {
    this.positions = [];
    this.trail = {};
  }

  openPosition(type, date, priceOpened, bollingerBands) {
    if(date === '2018-02-02') {
      // debugger;
    }
    this.positions.push(new Position(type, date, priceOpened, bollingerBands));
  }

  checkForClosingPosition(todayMinPrice, todayMaxPrice, todayDate) {
    this.positions.filter(position => position.status === 'OPENED')
      .forEach(position => {
        if((position.type === posName.LONG &&  position.stopLoss >= todayMinPrice) || 
          (position.type === posName.SHORT && position.stopLoss <= todayMaxPrice)) {
            position.status = 'CLOSED';
            position.dateClosing = todayDate;
            position.profit = position.stopLoss - position.priceOpened;
        }
      })
  }

  trailStopLoss(i, currentPrice, yesterdayPrice) {
    const deltaPrice = currentPrice - yesterdayPrice;
    this.positions.filter(position => position.status === 'OPENED')
      .forEach(position => {
        if(position.notMoovedStop){
          let ss = new Array(i-1);
          ss.push(position.stopLoss);
          this.trail[position.dateCreation] = ss;
        }
         
        if((position.type === posName.LONG && deltaPrice > 0) || 
          (position.type === posName.SHORT && deltaPrice < 0)) {
          position.stopLoss += deltaPrice;
        }
        if(position.notMoovedStop) {
          position.notMoovedStop = false;
          position.stopLoss = position.priceOpened;
        }

        this.trail[position.dateCreation].push(position.stopLoss);
       
      });
  }


}

export default PositionController;