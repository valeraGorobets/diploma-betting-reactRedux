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
    this.state = {};
    store.subscribe(() => this.run(store.getState()))
    this.run();
  }

  run(state) {
    if(!state){
      return;
    }
    const {companyData, BOLLINGERParams, AllowedRisk, MoneyManagerParams, Strategies} = state;
    const bollingerResults = new BOLLINGER(BOLLINGERParams.period, BOLLINGERParams.stDeviation).calculate(companyData.Close);

    const riskManagement = new RiskManagement(AllowedRisk);
    const strategy = new Strategy(riskManagement, MoneyManagerParams, Strategies);
    strategy.simulate(companyData);

    this.setState({
      data: companyData,
      scattertrail:{
        Name: 'trail',
        Date: companyData.Date,
        Values: strategy.positionController.trail['2017-12-06']
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

  render() {
    return ( 
     <div>
        <Chart name='AnalyticsSTRATEGY' 
          candlestick={this.state.data}
          scattertrail={this.state.scattertrail}
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