import React, { Component } from 'react';
import ma from '../../Services/ma.js';
import Chart from '../Chart'


class Analytics extends Component {
    constructor(props) {
      super(props);
      this.state = {
        data: [],
        scatterMA5: {
          Name: 'MA5',
          Date: [],
          Values: []
        },
        scatterMA21: {
          Name: 'MA21',
          Date: [],
          Values: []
        }
      }
    }

    componentWillReceiveProps(nextProps) {
      this.setState({
        data: nextProps.dataForAnalytics.data,
        scatterMA5: {
          Name: 'MA5',
          Date: nextProps.dataForAnalytics.Date,
          Values: new ma(5).calculate(nextProps.dataForAnalytics.data.Close)
        },
        scatterMA21: {
          Name: 'MA21',
          Date: nextProps.dataForAnalytics.Date,
          Values: new ma(21).calculate(nextProps.dataForAnalytics.data.Close)
        }
      });
    }

    render() {
      return ( 
       <div>
          <Chart name='Analytics' candlestick={this.state.data} scatterMA5={this.state.scatterMA5} scatterMA21={this.state.scatterMA21}/>
       </div>
      )
    }
}

export default Analytics;