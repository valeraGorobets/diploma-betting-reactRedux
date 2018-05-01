import React, { Component } from 'react';
import ConfigAndAnalytics from '../ConfigAndAnalytics/';
import Analytics from '../AnalyticsSTRATEGY/';

import './styles.css';

class Main extends Component {

  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return ( 
      <div className="main_container">
        <div className="column reportSide">
          <ConfigAndAnalytics></ConfigAndAnalytics>
        </div>
        <div className="column analyticsSide">
          <Analytics></Analytics>
        </div>
      </div>
    );
  }
}

export default Main
