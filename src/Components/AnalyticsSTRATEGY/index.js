import React, { Component } from 'react';
import MA from '../../Services/MA';
import BOLLINGER from '../../Services/BOLLINGER';
import RiskManagement from '../../Services/riskManagement';
import Chart from '../Chart';
import Strategy from '../../Services/Strategy.js';

class AnalyticsSTRATEGY extends Component {
    constructor(props) {
      super(props);
      this.state = {};
    }

    componentWillReceiveProps(nextProps) {
      const props = nextProps.companyData;
      const ma5 = new MA(5);
      const ma9 = new MA(9);
      const bollingerResults = new BOLLINGER().calculate(props.Close);

      const riskManagement = new RiskManagement();
      
      this.setState({
        data: props,
        scatterMA5: {
          Name: 'MA5',
          Date: props.Date,
          Values: ma5.calculate(props.Close)
        },
        scatterMA9: {
          Name: 'MA9',
          Date: props.Date,
          Values: ma9.calculate(props.Close)
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
      new Strategy(riskManagement, ma5, ma9).simulate(props.Close, props.Date);
    }

    render() {
      return ( 
       <div>
          <Chart name='AnalyticsSTRATEGY' 
            candlestick={this.state.data}
            scatterMA5={this.state.scatterMA5}
            scatterMA9={this.state.scatterMA9}
            fillAreaLow={this.state.scatterBOLLINGERBottom}
            fillAreaHeight={this.state.scatterBOLLINGERTop}
          />
        </div>
      )
    }
}

export default AnalyticsSTRATEGY;