import PositionController from './position/PositionController.js';
import {Type, Status} from './position/PositionConstants.js';
import MoneyManager from './MoneyManager.js';
import store from '../Store/configureStore.js';
import { configApp} from '../Actions/index.js';

class STRATEGY {
  constructor(riskManagement, MoneyManagerParams, strategies) {
    this.riskManagement = riskManagement;
    this.MoneyManagerParams = MoneyManagerParams;
    this.strategies = strategies;
    this.probability = 0;
    this.savedPositionsFromLearning = [];
    this.moneyManager = new MoneyManager(MoneyManagerParams.startBank, MoneyManagerParams.probability, MoneyManagerParams.kellyFraction);
    this.positionController = new PositionController(this.moneyManager);
  }

  simulate(props) {
    const learningPart = this.getThird(props);
    this.invest(learningPart);

    this.moneyManager = new MoneyManager(this.MoneyManagerParams.startBank, this.probability, this.MoneyManagerParams.kellyFraction);
    this.positionController = new PositionController(this.moneyManager);

    const investmentPart = this.getRest(props);
    this.invest(investmentPart, true);
  }

  getThird(props) {
    let newObj = {};
    const length = props.Close.length;
    for (const key in props) {
      if(key === 'Name') {
        newObj['Name'] = props['Name'];
      } else {
        newObj[key] = props[key].slice(0, length/3);
      }
    }
    return newObj;
  }

  getRest(props) {
    let newObj = {};
    const length = props.Close.length;
    for (const key in props) {
      if(key === 'Name') {
        newObj['Name'] = props['Name'];
      } else {
        newObj[key] = props[key].slice(length/3);
      }
    }
    return newObj;
  }

  invest(props, investMode) {
    const {Date, Open, Close, High, Low} = props;
    const isPartOfStrategy = this.strategies.length === 1 ? false : true;

    for(let i = 30; i < Close.length; i++) {
      
      if(i % 30 === 0 && investMode) {
        const positions = this.savedPositionsFromLearning.concat(this.positionController.positions);
        this.moneyManager.setProbability(this.profitMoreThanNull(positions));
      }
      //evening;
      let knownClose = Close.slice(0, i);
      let knownLow = Low.slice(0, i);
      let knownHigh = High.slice(0, i);
      let knownDate = Date.slice(0, i);
      
      this.positionController.checkForClosingPosition (
        this.dataXdaysBefore(knownDate), 
        this.dataXdaysBefore(knownLow), 
        this.dataXdaysBefore(knownHigh)
      );
      
      this.positionController.trailStopLoss(
        i, knownClose, 
        this.dataXdaysBefore(knownLow), 
        this.dataXdaysBefore(knownHigh), 
        this.dataXdaysBefore(knownLow, 1),
        this.dataXdaysBefore(knownHigh, 1)
      );
      
      //morining
      let todayOpenPrice = Open[i];
      let shoulInvestArray = this.strategies.map(strategy => strategy.shouldInvest(knownClose, isPartOfStrategy, knownHigh, knownLow))

        shoulInvestArray = shoulInvestArray.filter((value, index, self) => self.indexOf(value) === index);

      let positionType = shoulInvestArray.length === 1 ? shoulInvestArray[0] : Type.NONE;
      if( Date[i] === '2017-03-22'){debugger;}
      if(positionType !== Type.NONE && this.riskManagement.isInvestmentPossible(knownClose, positionType)){
        const bollingerBands = this.riskManagement.getBands(Close.slice(0, i));
        this.positionController.openPosition(positionType, Date[i], todayOpenPrice, bollingerBands);
      }
    }

    this.positionController.closeAllPositions(Date.slice().pop());
    this.getReport();
  }

  getReport() {
    const positions = this.positionController.positions;
    this.savedPositionsFromLearning = positions;
    this.print(positions, 'positions');
    
    const simleView = this.simleView(positions);
    this.print(simleView, 'simleView');
    
    const profitMoreThanNull = this.profitMoreThanNull(positions) || 0;
    this.probability = profitMoreThanNull;
    this.print(profitMoreThanNull, 'profitMoreThanNull');

    const currentBank = this.moneyManager.currentBank;
    this.print(currentBank, 'currentBank');

    const trail = this.positionController.trail;
    this.print(trail, 'trail');
    store.dispatch(configApp({
      currentBank,
      positionsReport: {
        all: positions.length,
        profitable: positions.filter(pos => pos.profitInPercent > 0).length,
        zero: positions.filter(pos => pos.profitInPercent === 0).length,
        unprofitable: positions.filter(pos => pos.profitInPercent < 0).length,
      },
      profitMoreThanNull
    }));

  }

  print(what, description = '') {
    console.log(`----------`);
    console.log(description)
    console.log(what);
  }

  dataXdaysBefore(array, days = 0) {
    return array[array.length - 1 - days];
  }

  simleView(positions) {
    return positions.filter(position => position.status === Status.CLOSED)
      .map(position => {
        return {
          type: position.type,
          profitInPercent: position.profitInPercent,
          days: this.daysBetween(position.dateCreation, position.dateClosing)
        };
      });
  }

  daysBetween(date1, date2) {
    const mlsc = new Date(date2) - new Date(date1);
    return mlsc/1000/60/60/24;
  }

  profitMoreThanNull(positions) {
    return positions.filter(position => position.status === Status.CLOSED)
      .reduce((totalProfit, position) => {
        if(position.profitInPercent >= 0) {
          return totalProfit + 1;
        }
        return totalProfit
      }, 0) * 100 / positions.length;
  }
}

export default STRATEGY;