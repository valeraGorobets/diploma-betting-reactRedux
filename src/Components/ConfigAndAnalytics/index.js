import React, { Component } from 'react';
import store from '../../Store/configureStore.js';
import {initApp, configApp} from '../../Actions/index.js';
import {Button, Row, Input, option} from 'react-materialize';

import MA from '../../Services/indicators/MA.js';
import MACD from '../../Services/indicators/MACD.js';
import RSI from '../../Services/indicators/RSI.js';
import STOCHASTIC from '../../Services/indicators/STOCHASTIC.js';
import StockDataService from '../../Services/StockDataService';

import './styles.css';

const indicators = {
  'MA(5)': new MA(5),
  'MA(9)': new MA(9),
  'MA(14)': new MA(14),
  'RSI': new RSI(14),
  'MACD': new MACD(12, 26, 9),
  'STOCHASTIC': new STOCHASTIC(14)
}

export default class ConfigAndAnalytics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      companyName: 'apple',
      manualMode: false
    }

    this.initApp();
    this.selectedCheckboxes = new Set();
    this.StockDataService = new StockDataService(300);

    this.handleCompanyChange = this.handleCompanyChange.bind(this);
    this.toggleManualMode = this.toggleManualMode.bind(this);
    this.toggleCheckbox = this.toggleCheckbox.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  initApp(){
    store.dispatch(initApp({
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
      Strategies: [],
    }));
  }

  handleCompanyChange(event) {
    this.setState({companyName: event.target.value});
  }

  toggleManualMode(event) {
    this.setState(prevState => ({
      manualMode: !prevState.manualMode
    }));
  }

  toggleCheckbox(event) {
    const value = event.target.value;
    if (this.selectedCheckboxes.has(indicators[value])) {
      this.selectedCheckboxes.delete(indicators[value]);
    } else {
      this.selectedCheckboxes.add(indicators[value]);
    }
  }

  handleFormSubmit(event) {
    event.preventDefault();
    this.StockDataService.requestStocksFromLocal(this.state.companyName).then(response => {
      this.setState({
        companyName: this.state.companyName,
        companyData: response,
        scatter: {
          Name: 'Close',
          Date: response.Date,
          Values: response.Close
        }
      });
      store.dispatch(configApp({
        Date: response.Date,
        companyName: this.state.companyName,
        companyData: response,
        Strategies: [...this.selectedCheckboxes] 
      }));
      console.log(store.getState())
    })
  }

  render() {
    return (
      <div className="form">
        <Row>
          <Input s={8} type='select' label='Materialize Select' icon='copyright' value={this.state.companyName} onChange={this.handleCompanyChange}>
            <option value='apple'>Apple</option>
            <option value='epam'>EPAM</option>
            <option value='google'>Google</option>
          </Input>
          <div className="switch">
            <label>
              Auto
              <input type="checkbox" onChange={this.toggleManualMode}/>
              <span className="lever"></span>
              Manual
            </label>
          </div>
          <Button waves='light' onClick={this.handleFormSubmit}>Run!</Button>
        </Row>
        {this.state.manualMode && (
          <Row>
            {Object.keys(indicators).map((indicator) => 
              <Input
              type="checkbox"
              label={indicator}
              value={indicator}
              onChange={this.toggleCheckbox}
              key={indicator} />
            )}
          </Row>
        )}
      </div>
    );
  }
}
