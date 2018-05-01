import React, { Component } from 'react';
import { connect } from 'react-redux';
import BOLLINGER from '../../Services/indicators/BOLLINGER';
import RiskManagement from '../../Services/RiskManagement';
import Strategy from '../../Services/Strategy.js';
import Chart from '../Chart';
import store from '../../Store/configureStore.js';

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

    this.setState({
      data: companyData,
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
          fillAreaLow={this.state.scatterBOLLINGERBottom}
          fillAreaHeight={this.state.scatterBOLLINGERTop}
        />
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