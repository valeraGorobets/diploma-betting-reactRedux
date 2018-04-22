import React, { Component } from 'react';
import STOCHASTIC from '../../Services/STOCHASTIC.js';
import Chart from '../Chart';

class AnalyticsSTOCHASTIC extends Component {
    constructor(props) {
      super(props);
      this.kPeriod = 14;
      this.dPeriod = 3;
      this.smooth = 3;
      this.lowValue = 20;
      this.heightValue = 80;
      this.state = {};
    }

    componentWillReceiveProps(nextProps) {
      const props = nextProps.companyData;
      const stochastic = new STOCHASTIC(this.kPeriod, this.dPeriod, this.smooth, this.lowValue, this.heightValue);
      const stochasticResults = stochastic.calculate(props.Close, props.High, props.Low);
      this.setState({
        data: props.data,
        scatterSTOCHASTIC: {
          Name: 'STOCHASTIC',
          Date: props.Date,
          Values: stochasticResults.K
        },
        scatterD: {
          Name: 'D',
          Date: props.Date,
          Values: stochasticResults.D
        },
        fillAreaLow: {
          Date: props.Date,
          Value: this.lowValue
        },
        fillAreaHeight: {
          Date: props.Date,
          Value: this.heightValue
        }
      });
      stochastic.simulate(props.Close, props.High, props.Low, props.Date, false);
    }

    render() {
      return ( 
       <div>
          <Chart name='AnalyticsSTOCHASTIC' scatterSTOCHASTIC={this.state.scatterSTOCHASTIC} scatterD={this.state.scatterD} fillAreaLow={this.state.fillAreaLow} fillAreaHeight={this.state.fillAreaHeight}/>
       </div>
      )
    }
}

export default AnalyticsSTOCHASTIC;