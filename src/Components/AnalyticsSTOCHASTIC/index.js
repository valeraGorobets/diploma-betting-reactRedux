import React, { Component } from 'react';
import STOCHASTIC from '../../Services/STOCHASTIC.js';
import Chart from '../Chart';


class AnalyticsSTOCHASTIC extends Component {
    constructor(props) {
      super(props);
      this.lowValue = 20;
      this.heightValue = 80;
      this.state = {};
    }

    componentWillReceiveProps(nextProps) {
      const stochastic = new STOCHASTIC(14, 3).calculate(nextProps.dataForAnalytics.data);
      this.setState({
        data: nextProps.dataForAnalytics.data,
        scatterSTOCHASTIC: {
          Name: 'STOCHASTIC',
          Date: nextProps.dataForAnalytics.Date,
          Values: stochastic.K
        },
        scatterD: {
          Name: 'D',
          Date: nextProps.dataForAnalytics.Date,
          Values: stochastic.D
        },
        fillAreaLow: {
          Date: nextProps.dataForAnalytics.Date,
          Value: this.lowValue
        },
        fillAreaHeight: {
          Date: nextProps.dataForAnalytics.Date,
          Value: this.heightValue
        }
      });
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