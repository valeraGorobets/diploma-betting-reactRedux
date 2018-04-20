import React, { Component } from 'react';
import RSI from '../../Services/RSI.js';
import Chart from '../Chart';


class AnalyticsRSI extends Component {
    constructor(props) {
      super(props);
      this.lowValue = 20;
      this.heightValue = 80;
      this.state = {}
    }

    componentWillReceiveProps(nextProps) {
      this.setState({
        data: nextProps.dataForAnalytics.data,
        scatterRSI14: {
          Name: 'RSI14',
          Date: nextProps.dataForAnalytics.Date,
          Values: new RSI(14).calculate(nextProps.dataForAnalytics.data.Close)
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
          <Chart name='AnalyticsRSI' scatterRSI14={this.state.scatterRSI14} fillAreaLow={this.state.fillAreaLow} fillAreaHeight={this.state.fillAreaHeight}/>
       </div>
      )
    }
}

export default AnalyticsRSI;