import React, { Component } from 'react';
import MA from '../../Services/indicators/MA';
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
      const ma9 = new MA(9);
      const bollingerResults = new BOLLINGER().calculate(props.Close);

      const riskManagement = new RiskManagement();
      const strategy = new Strategy(riskManagement, ma5, ma9)
      strategy.simulate(props);
      this.setState({
        data: props,
        scatterMA5:{
          Name: 'MA5',
          Date: props.Date,
          Values: ma5.calculate(props.Close)
        },
        scatterMA9:{
          Name: 'MA9',
          Date: props.Date,
          Values: ma9.calculate(props.Close)
        },
        scatterTRAIL1:{
          Name: 'TRAIL',
          Date: props.Date,
          Values: strategy.trail['2017-11-13']
        },
        scatterTRAIL2:{
          Name: 'TRAIL',
          Date: props.Date,
          Values: strategy.trail['2017-11-14']
        },
        scatterTRAIL3:{
          Name: 'TRAIL',
          Date: props.Date,
          Values: strategy.trail['2017-11-15']
        },
        scatterTRAIL4:{
          Name: 'TRAIL',
          Date: props.Date,
          Values: strategy.trail['2017-12-27']
        },
        scatterTRAIL5:{
          Name: 'TRAIL',
          Date: props.Date,
          Values: strategy.trail['2018-02-02']
        },
        scatterTRAIL6:{
          Name: 'TRAIL',
          Date: props.Date,
          Values: strategy.trail['2018-02-15']
        },
        scatterTRAIL7:{
          Name: 'TRAIL',
          Date: props.Date,
          Values: strategy.trail['2018-04-05']
        },
        scatterTRAIL8:{
          Name: 'TRAIL',
          Date: props.Date,
          Values: strategy.trail['2018-04-06']
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
            scatterMA9={this.state.scatterMA9}
            scatterTRAIL1={this.state.scatterTRAIL1}
            scatterTRAIL2={this.state.scatterTRAIL2}
            scatterTRAIL3={this.state.scatterTRAIL3}
            scatterTRAIL4={this.state.scatterTRAIL4}
            scatterTRAIL5={this.state.scatterTRAIL5}
            scatterTRAIL6={this.state.scatterTRAIL6}
            scatterTRAIL7={this.state.scatterTRAIL7}
            scatterTRAIL8={this.state.scatterTRAIL8}
            fillAreaLow={this.state.scatterBOLLINGERBottom}
            fillAreaHeight={this.state.scatterBOLLINGERTop}
          />
        </div>
      )
    }
}

export default AnalyticsSTRATEGY;