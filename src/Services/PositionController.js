import Position from './Position.js';

class PositionController {
  constructor() {
    this.posions = [];
  }

  openPosition(type, date, priceOpened, bollingerBands) {
    this.posions.push(new Position(type, date, priceOpened, bollingerBands));
  }

  trailStopLoss() {

  }


}

export default PositionController;