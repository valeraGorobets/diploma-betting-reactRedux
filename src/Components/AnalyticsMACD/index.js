import React, { Component } from 'react';
import MACD from '../../Services/MACD.js';
import Chart from '../Chart';


class AnalyticsMACD extends Component {
    constructor(props) {
      super(props);
      this.state = {}
    }

    componentWillReceiveProps(nextProps) {
      const macdResult = new MACD(12, 26, 9).calculate(nextProps.dataForAnalytics.data);
      this.setState({
        data: nextProps.dataForAnalytics.data,
        scatterMACD: {
          Name: 'MACD',
          Date: nextProps.dataForAnalytics.Date,
          Values: macdResult.MACD
        },
        scatterSIGNAL: {
          Name: 'SIGNAL',
          Date: nextProps.dataForAnalytics.Date,
          Values: macdResult.SIGNAL
        },
        barHIST: {
          Name: 'HIST',
          Date: nextProps.dataForAnalytics.Date,
          Values: macdResult.HIST
        }
      });
      macd.simulate(nextProps.dataForAnalytics.data, true)
    }

    render() {
      return ( 
        <div>
          <Chart name='AnalyticsMACD' scatterMACD={this.state.scatterMACD} scatterSIGNAL={this.state.scatterSIGNAL} barHIST={this.state.barHIST}/>
        </div>
      )
    }
}

export default AnalyticsMACD;