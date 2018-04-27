import React, { Component } from 'react';
import { connect } from 'react-redux';
import MA from '../../Services/indicators/MA';
import BOLLINGER from '../../Services/indicators/BOLLINGER';
import RiskManagement from '../../Services/RiskManagement';
import Strategy from '../../Services/Strategy.js';
import Chart from '../Chart';
import store from '../../Store/configureStore.js';

class AnalyticsSTRATEGY extends Component {
    constructor(props) {
      super(props);
      this.state = {};
      store.subscribe(() => console.log(store.getState()))
    }

    componentWillReceiveProps(nextProps) {
      console.log(store.getState());
      const props = nextProps.companyData;
      const ma5 = new MA(5);
      const bollingerResults = new BOLLINGER().calculate(props.Close);

      const riskManagement = new RiskManagement();
      const strategy = new Strategy(riskManagement, ma5);
      strategy.simulate(props);

      this.setState({
        data: props,
        scatterMA5:{
          Name: 'ma5',
          Date: props.Date,
          Values: ma5.calculate(props.Close)
        },
        scattertrail:{
          Name: 'trail',
          Date: props.Date,
          Values: strategy.positionController.trail['2018-04-04']
        },
        scatterBOLLINGERTop: {
          Name: 'B_Upper',
          Date: props.Date,
          Values: bollingerResults.upper,
          showlegend: true
        },
        scatterBOLLINGERBottom: {
          Name: 'B_Lower',
          Date: props.Date,
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
            scatterMA5={this.state.scatterMA5}
            scattertrail={this.state.scattertrail}
            fillAreaLow={this.state.scatterBOLLINGERBottom}
            fillAreaHeight={this.state.scatterBOLLINGERTop}
          />
        </div>
      )
    }
}
const mapStateToProps = store => {
  return {
    obj: store.obj
  }
}


export default connect(mapStateToProps)(AnalyticsSTRATEGY)