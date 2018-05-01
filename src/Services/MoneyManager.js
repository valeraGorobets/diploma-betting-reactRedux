import {Type} from './position/PositionConstants.js';

export default class MoneyManager {
  constructor(startBank = 1000, propability = 0.5, kellyFraction = 1) {
    this.startBank = startBank;
    this.currentBank = startBank;
    this.moneyFromShort = 0;
    this.propability = this.transformPropability(propability);
    this.kellyFraction = kellyFraction;
  }

  transformPropability(propability) {
    return propability > 1 ? propability / 100 : propability;
  }

  setPropability(propability) {
    this.propability = this.transformPropability(propability);
  }

  openPosition(position) {
    if(position.type === Type.LONG){
      this.openLongPosition(position);
    } else {
      this.openShortPosition(position);
    }
  }

  openLongPosition(position) {
    const winning = position.takeProfit / position.priceOpened;
    const amountOfInvestment = this.calculateAmountOfInvestment(position , winning);
    this.currentBank -= amountOfInvestment;
  }

  openShortPosition(position) {
    const winning = position.priceOpened / position.takeProfit;
    const amountOfInvestment = this.calculateAmountOfInvestment(position , winning);
    this.moneyFromShort += amountOfInvestment;
  }

  calculateAmountOfInvestment(position, winning) {
    const bet = this.kellyBet(winning);
    const amountOfInvestment = this.currentBank * bet;
    position.amountOfInvestment = amountOfInvestment;
    position.amountOfAssets = amountOfInvestment / position.priceOpened;
    return amountOfInvestment;
  }

  closePosition(position) {
    if(position.type === Type.LONG){
      position.profitInMoney = (position.stopLoss - position.priceOpened) * position.amountOfAssets;
      position.profitInPercent = 100 * position.profitInMoney / position.priceOpened;
      this.currentBank += position.amountOfAssets * position.stopLoss;
    } else {
      position.profitInMoney = (position.priceOpened - position.stopLoss) * position.amountOfAssets;
      position.profitInPercent = 100 * position.profitInMoney / position.priceOpened;
      this.moneyFromShort -= position.amountOfAssets * position.stopLoss;
      this.currentBank += this.moneyFromShort;
      this.moneyFromShort = 0;
    }
  }

  kellyBet(b) {
    return ((this.propability * (b + 1) - 1) / b) / this.kellyFraction;
  }
}