import React, { Component } from 'react';
import './styles.css';
import StockDataService from './../../Services/StockDataService';
import Chart from '../Chart';
import Analytics from '../AnalyticsSTRATEGY/';

export default class Main extends Component {

  constructor(props) {
    super(props);
    this.state = {}
    this.StockDataService = new StockDataService(350);

    this.StockDataService.requestStocksFromLocal('google').then(response => {
      this.setState({
        Date: response.Date,
        companyData: response,
        scatter: {
          Name: 'Close',
          Date: response.Date,
          Values: response.Close
        }
      });
    });
  }

  render() {
    return ( 
      <div className="container">
         <Chart name='google' candlestick={this.state.companyData} />
         <Analytics companyData={this.state.companyData}></Analytics>
      </div>
    );
  }
}