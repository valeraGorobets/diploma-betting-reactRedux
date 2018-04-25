import React, { Component } from 'react';
import MA from '../../Services/indicators/MA.js';
import Chart from '../Chart';

class AnalyticsMA extends Component {
    constructor(props) {
      super(props);
      this.MALength = 21;
      this.state = {};
    }

    componentWillReceiveProps(nextProps) {
      const ma = new MA(this.MALength);
      this.setState({
        data: nextProps.companyData,
        scatterMA21: {
          Name: 'MA21',
          Date: nextProps.companyData.Date,
          Values: ma.calculate(nextProps.companyData.Close)
        }
      });
      ma.simulate(nextProps.companyData.Close, nextProps.companyData.Date, true)
    }

    render() {
      return ( 
       <div>
          <Chart name='AnalyticsMA' candlestick={this.state.data} scatterMA21={this.state.scatterMA21}/>
       </div>
      )
    }
}

export default AnalyticsMA;