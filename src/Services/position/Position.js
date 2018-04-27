import {Type, Status} from './PositionConstants.js';

class Position {
  constructor(id, type, date, priceOpened, bollingerBands) {
    this.id = id;
    this.status = Status.OPENED;
    this.type = type;
    
    this.dateCreation = date;
    this.priceOpened = priceOpened;

    this.amountOfInvestment = 0;
    this.amountOfAssets = 0;
    
    if(type === Type.LONG){  
      this.stopLoss = bollingerBands.lower;
      this.takeProfit = bollingerBands.upper;
    } else {  
      this.stopLoss = bollingerBands.upper;
      this.takeProfit = bollingerBands.lower;
    }

    this.moovedStop = 0;
    this.differenceStopFromMA = 0;
    
    this.profitInMoney = 0;
    this.profitInPercent = 0;
  }
}

export default Position;