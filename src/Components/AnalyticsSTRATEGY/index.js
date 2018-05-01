import React, { Component } from 'react';
import { connect } from 'react-redux';
import BOLLINGER from '../../Services/indicators/BOLLINGER';
import RiskManagement from '../../Services/RiskManagement';
import Strategy from '../../Services/Strategy.js';
import Chart from '../Chart';
import store from '../../Store/configureStore.js';
import STOCHASTIC from '../../Services/indicators/STOCHASTIC.js'
import MA from '../../Services/indicators/MA.js'

class AnalyticsSTRATEGY extends Component {
  constructor(props) {
    super(props);
    this.state = {
      savedState: {
        Strategies: []
      }
    };
    store.subscribe(() => this.run(store.getState()));
    this.run();
  }

  run(state) {
    if(!state || this.sameState(state)){
      return;
    }
    const {companyData, BOLLINGERParams, AllowedRisk, MoneyManagerParams, Strategies} = state;
    const bollingerResults = new BOLLINGER(BOLLINGERParams.period, BOLLINGERParams.stDeviation).calculate(companyData.Close);

    const riskManagement = new RiskManagement(AllowedRisk);
    const strategy = new Strategy(riskManagement, MoneyManagerParams, Strategies);
    strategy.simulate(companyData);

      const stochastic = new STOCHASTIC(this.kPeriod, this.dPeriod, this.smooth, this.bottomLevel, this.topLevel);
      const stochasticResults = stochastic.calculate(companyData.Close, companyData.High, companyData.Low);
    this.setState({
      data: companyData,
     scatterSTOCHASTIC: {
          Name: 'STOCHASTIC',
          Date: companyData.Date,
          Values: stochasticResults.K
        },
        scatterD: {
          Name: 'D',
          Date: companyData.Date,
          Values: stochasticResults.D
        },
        fillAreaLow: {
          Date: companyData.Date,
          Values: new Array(companyData.Date.length).fill(20)
        },
        fillAreaHeight: {
          Date: companyData.Date,
          Values: new Array(companyData.Date.length).fill(80)
        },
      scatterMA5: {
          Name: 'MA5',
          Date: companyData.Date,
          Values: new MA(5).calculate(companyData.Close)
        },
      scatterBOLLINGERTop: {
        Name: 'B_Upper',
        Date: companyData.Date,
        Values: bollingerResults.upper,
        showlegend: true
      },
      scatterBOLLINGERBottom: {
        Name: 'B_Lower',
        Date: companyData.Date,
        Values: bollingerResults.lower,
        showlegend: true
      }
    });
  }

  sameState(newState) {
    if(this.state.savedState.companyName === newState.companyName &&
      this.equalArrays(this.state.savedState.Strategies, newState.Strategies)){
      return true;
    } else {
      this.setState({
        savedState: Object.assign({}, newState)
      });
    }
    return false;
  }

  equalArrays(array1, array2) {
    return array1.length === array2.length && array1.every((v,i)=> v === array2[i])
  }

  render() {
    return ( 
     <div>
        <Chart name='AnalyticsSTRATEGY' 
          candlestick={this.state.data}
          scatterMA5={this.state.scatterMA5}
          fillAreaLow={this.state.scatterBOLLINGERBottom}
          fillAreaHeight={this.state.scatterBOLLINGERTop}
        />
        <Chart name='AnalyticsSTOCHASTIC'
          scatterSTOCHASTIC={this.state.scatterSTOCHASTIC}
          scatterD={this.state.scatterD}
          fillAreaLow={this.state.fillAreaLow}
          fillAreaHeight={this.state.fillAreaHeight}/>
      </div>
    )
  }
}
const mapStateTocompanyData = store => {
  return {
    obj: store.obj
  }
}


export default connect(mapStateTocompanyData)(AnalyticsSTRATEGY)
      // scattertrail: {
      //   Name: 'TRAIL',
      //   Date: companyData.Date,
      //   Values: strategy.positionController.trail['2017-03-22'],
      // },