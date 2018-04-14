import React, { Component } from 'react';
import './styles.css';
import StockDataService from './../../Services/StockDataService';

export default class Main extends Component {

  constructor(props) {
      super(props);
      this.StockDataService = new StockDataService(30);
      this.StockDataService.requestStocksFromGoogleFinance().then(data => console.log(data))
    }

  render() {
    return ( 
      <div className="container">
        <h2>React redux template</h2>
      </div>
    );
  }
}