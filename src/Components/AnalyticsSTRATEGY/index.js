import React, { Component } from 'react';
import MA from '../../Services/indicators/MA';
import MACD from '../../Services/indicators/MACD';
import BOLLINGER from '../../Services/indicators/BOLLINGER';
import RiskManagement from '../../Services/RiskManagement';
import Strategy from '../../Services/Strategy.js';
import Chart from '../Chart';

class AnalyticsSTRATEGY extends Component {
    constructor(props) {
      super(props);
      this.state = {};
    }

    componentWillReceiveProps(nextProps) {
      const props = nextProps.companyData;
      const ma5 = new MA(5);
      const macd = new MACD(12, 26, 9);
      const bollingerResults = new BOLLINGER().calculate(props.Close);

      const riskManagement = new RiskManagement(1);
      const strategy = new Strategy(riskManagement, ma5, macd);
      strategy.simulate(props);

      this.setState({
        data: props,
        scatterMA5:{
          Name: 'ma5',
          Date: props.Date,
          Values: ma5.calculate(props.Close)
        },
        scatterMACD:{
          Name: 'macd',
          Date: props.Date,
          Values: macd.calculate(props.Close).MACD
        },
        scatterSIGNAL:{
          Name: 'SIGNAL',
          Date: props.Date,
          Values: macd.calculate(props.Close).SIGNAL
        },
        barHIST:{
          Name: 'HIST',
          Date: props.Date,
          Values: macd.calculate(props.Close).HIST
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
            fillAreaLow={this.state.scatterBOLLINGERBottom}
            fillAreaHeight={this.state.scatterBOLLINGERTop}
          />
          <Chart name='AnalyticsSTRATEGY' 
            scatterMACD={this.state.scatterMACD}
            scatterSIGNAL={this.state.scatterSIGNAL}
            barHIST={this.state.barHIST}
          />
        </div>
      )
    }
}

export default AnalyticsSTRATEGY;