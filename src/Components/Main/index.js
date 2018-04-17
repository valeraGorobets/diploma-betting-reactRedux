import React, { Component } from 'react';
import './styles.css';
import StockDataService from './../../Services/StockDataService';
import Chart from '../Chart';

export default class Main extends Component {

  constructor(props) {
    super(props);
    this.state = {
      companyData: [],
      scatter: []
    }
    this.StockDataService = new StockDataService(30);
    this.StockDataService.requestStocksFromLocal('epam').then(response => {
      this.setState({
        Date: response.Date,
        companyData: response,
        scatter: {
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
         <Chart candlestick={this.state.companyData} scatter={this.state.scatter}/>
      </div>
    );
  }
}