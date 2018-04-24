import posName from './posName.js';

class Position {
  constructor(type, date, priceOpened, bollingerBands) {
    this.status = 'OPENED';
    this.type = type;
    this.dateCreation = date;
    this.priceOpened = priceOpened;
    if(type === posName.LONG){  
      this.stopLoss = bollingerBands.lower;
      this.takeProfit = bollingerBands.upper;
    } else {  
      this.stopLoss = bollingerBands.upper;
      this.takeProfit = bollingerBands.lower;
    }
  }
}

export default Position;