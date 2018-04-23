import React, { Component } from 'react';
import RSI from '../../Services/RSI.js';
import Chart from '../Chart';


class AnalyticsRSI extends Component {
    constructor(props) {
      super(props);
      this.RSILength = 14;
      this.bottomLevel = 30;
      this.topLevel = 70;
      this.state = {}
    }

    componentWillReceiveProps(nextProps) {
      const props = nextProps.companyData;
      const rsi = new RSI(this.RSILength);
      this.setState({
        data: props,
        scatterRSI14: {
          Name: 'RSI14',
          Date: props.Date,
          Values: rsi.calculate(props.Close)
        },
        fillAreaLow: {
          Date: props.Date,
          Values: new Array(props.Date.length).fill(this.bottomLevel)
        },
        fillAreaHeight: {
          Date: props.Date,
          Values: new Array(props.Date.length).fill(this.topLevel)
        }
      });
      rsi.simulate(props.Close, props.Date, true);
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