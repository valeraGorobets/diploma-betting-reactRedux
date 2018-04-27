import React, { Component } from 'react';
import { connect } from 'react-redux';
import './styles.css';
import StockDataService from './../../Services/StockDataService';
import Chart from '../Chart';
import Analytics from '../AnalyticsSTRATEGY/';
import {initApp} from '../../Actions/index.js';

class Main extends Component {

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

    props.dispatch(initApp({
      obj: 'hello'
    }))
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

const mapStateToProps = store => {
  return {
    obj: store.obj
  }
}

export default connect(mapStateToProps)(Main)