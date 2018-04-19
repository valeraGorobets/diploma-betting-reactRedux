import React, { Component } from 'react';
import './styles.css';
import StockDataService from './../../Services/StockDataService';
// import Chart from '../Chart';
import AnalyticsMA from '../AnalyticsMA';
// import AnalyticsMACD from '../AnalyticsMACD';

export default class Main extends Component {

  constructor(props) {
    super(props);
    this.state = {
    }
    this.StockDataService = new StockDataService(150);
    // this.StockDataService.requestStocksFromLocal('epam').then(response => {
    //   this.setState({
    //     Date: response.Date,
    //     epamCompanyData: response,
    //     epamScatter: {
    //       Name: 'Close',
    //       Date: response.Date,
    //       Values: response.Close
    //     }
    //   })
    // });
    // this.StockDataService.requestStocksFromLocal('apple').then(response => {
    //   this.setState({
    //     Date: response.Date,
    //     appleCompanyData: response,
    //     appleScatter: {
    //       Name: 'Close',
    //       Date: response.Date,
    //       Values: response.Close
    //     }
    //   })
    // });
    this.StockDataService.requestStocksFromLocal('google').then(response => {
      this.setState({
        Date: response.Date,
        companyData: response,
        scatter: {
          Name: 'Close',
          Date: response.Date,
          Values: response.Close
        },
        dataForAnalytics: {Date: response.Date, data: response}
      })
    });
  }

         // <Chart name='google' candlestick={this.state.companyData} scatter={this.state.scatter}/>
  render() {
    return ( 
      <div className="container">
         <AnalyticsMA dataForAnalytics={this.state.dataForAnalytics}></AnalyticsMA>
      </div>
    );
  }
}