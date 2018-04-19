import React, { Component } from 'react';
import MA from '../../Services/MA.js';
import Chart from '../Chart';

class AnalyticsMA extends Component {
    constructor(props) {
      super(props);
      this.state = {}
    }

    componentWillReceiveProps(nextProps) {
      this.setState({
        data: nextProps.dataForAnalytics.data,
        scatterMA5: {
          Name: 'MA5',
          Date: nextProps.dataForAnalytics.Date,
          Values: new MA(5).calculate(nextProps.dataForAnalytics.data.Close)
        },
        scatterMA21: {
          Name: 'MA21',
          Date: nextProps.dataForAnalytics.Date,
          Values: new MA(21).calculate(nextProps.dataForAnalytics.data.Close)
        }
      });
    }

    render() {
      return ( 
       <div>
          <Chart name='AnalyticsMA' candlestick={this.state.data} scatterMA5={this.state.scatterMA5} scatterMA21={this.state.scatterMA21}/>
       </div>
      )
    }
}

export default AnalyticsMA;