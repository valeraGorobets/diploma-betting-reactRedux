import React, { Component } from 'react';
import MACD from '../../Services/MACD.js';
import Chart from '../Chart';


class AnalyticsMACD extends Component {
    constructor(props) {
      super(props);
      this.state = {}
    }

    componentWillReceiveProps(nextProps) {
      const props = nextProps.companyData;
      const macd = new MACD(12, 26, 9);
      const macdResult = macd.calculate(props.Close);
      this.setState({
        data: props,
        scatterMACD: {
          Name: 'MACD',
          Date: props.Date,
          Values: macdResult.MACD
        },
        scatterSIGNAL: {
          Name: 'SIGNAL',
          Date: props.Date,
          Values: macdResult.SIGNAL
        },
        barHIST: {
          Name: 'HIST',
          Date: props.Date,
          Values: macdResult.HIST
        }
      });
      macd.simulate(props.Close, props.Date, true);
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