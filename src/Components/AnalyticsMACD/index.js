import React, { Component } from 'react';
import MACD from '../../Services/MACD.js';
import Chart from '../Chart';


class AnalyticsMACD extends Component {
    constructor(props) {
      super(props);
      this.state = {}
    }

    componentWillReceiveProps(nextProps) {
      const macd = new MACD(12, 26, 9);
      this.setState({
        data: nextProps.dataForAnalytics.data,
        scatterMACD: {
          Name: 'MACD',
          Date: nextProps.dataForAnalytics.Date,
          Values: macd.calculate(nextProps.dataForAnalytics.data.Close).MACD
        },
        scatterSIGNAL: {
          Name: 'SIGNAL',
          Date: nextProps.dataForAnalytics.Date,
          Values: macd.calculate(nextProps.dataForAnalytics.data.Close).SIGNAL
        },
        barHIST: {
          Name: 'HIST',
          Date: nextProps.dataForAnalytics.Date,
          Values: macd.calculate(nextProps.dataForAnalytics.data.Close).HIST
        }
      });
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