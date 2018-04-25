import {Type, Status} from './PositionConstants.js';

class Position {
  constructor(type, date, priceOpened, bollingerBands) {
    this.status = Status.OPENED;
    this.notMoovedStop = true;
    this.type = type;
    this.dateCreation = date;
    this.priceOpened = priceOpened;
    if(type === Type.LONG){  
      this.stopLoss = bollingerBands.lower;
      this.takeProfit = bollingerBands.upper;
    } else {  
      this.stopLoss = bollingerBands.upper;
      this.takeProfit = bollingerBands.lower;
    }
  }
}

export default Position;