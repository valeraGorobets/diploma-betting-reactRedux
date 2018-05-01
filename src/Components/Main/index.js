import React, { Component } from 'react';
import store from '../../Store/configureStore.js';
import {initApp} from '../../Actions/index.js';
import StockDataService from './../../Services/StockDataService';
import Chart from '../Chart';
import Analytics from '../AnalyticsSTRATEGY/';
import MA from '../../Services/indicators/MA.js';
import RSI from '../../Services/indicators/RSI.js';
import STOCHASTIC from '../../Services/indicators/STOCHASTIC.js';
import './styles.css';

class Main extends Component {

  constructor(props) {
    super(props);
    this.state = {}
    this.StockDataService = new StockDataService(300);

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
      
      store.dispatch(initApp({
        companyData: response,  
        BOLLINGERParams: { 
          period: 14,
          stDeviation: 2
        },
        AllowedRisk: 2,
        MoneyManagerParams: {
          startBank: 1000,
          propability: 0.8,
          kellyFraction: 1
        },
        Strategies: [new STOCHASTIC(14,3,1,20,80)],
      }));
    });
  }

  render() {
    return ( 
      <div className="container">
         <Chart name='google' candlestick={this.state.companyData} />
         <Analytics></Analytics>
      </div>
    );
  }
}

export default Main