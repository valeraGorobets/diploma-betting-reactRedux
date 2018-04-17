import React, { Component } from 'react';
import './styles.css';
import StockDataService from './../../Services/StockDataService';
import Chart from '../Chart';

export default class Main extends Component {

  constructor(props) {
    super(props);
    this.state = {
    }
    this.StockDataService = new StockDataService(30);
    this.StockDataService.requestStocksFromLocal('epam').then(response => {
      this.setState({
        Date: response.Date,
        epamCompanyData: response,
        epamScatter: {
          Name: 'Close',
          Date: response.Date,
          Values: response.Close
        }
      })
    });
    this.StockDataService.requestStocksFromLocal('apple').then(response => {
      this.setState({
        Date: response.Date,
        appleCompanyData: response,
        appleScatter: {
          Name: 'Close',
          Date: response.Date,
          Values: response.Close
        }
      })
    });
    this.StockDataService.requestStocksFromLocal('google').then(response => {
      this.setState({
        Date: response.Date,
        googleCompanyData: response,
        googleScatter: {
          Name: 'Close',
          Date: response.Date,
          Values: response.Close
        }
      })
    });
  }

  render() {
    return ( 
      <div className="container">
        <h2>React redux template</h2>
         <Chart name='Epam Systems' candlestick={this.state.epamCompanyData} scatter={this.state.epamScatter}/>
         <Chart name='Apple' candlestick={this.state.appleCompanyData} scatter={this.state.appleScatter}/>
         <Chart name='Google' candlestick={this.state.googleCompanyData} scatter={this.state.googleScatter}/>
      </div>
    );
  }
}