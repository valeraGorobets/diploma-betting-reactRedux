import React, { Component } from 'react';
import RSI from '../../Services/RSI.js';
import Chart from '../Chart';


class AnalyticsRSI extends Component {
    constructor(props) {
      super(props);
      this.bottomLevel = 30;
      this.topLevel = 70;
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
          Value: this.bottomLevel
        },
        fillAreaHeight: {
          Date: nextProps.dataForAnalytics.Date,
          Value: this.topLevel
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