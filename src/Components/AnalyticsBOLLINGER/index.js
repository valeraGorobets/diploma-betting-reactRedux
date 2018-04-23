import React, { Component } from 'react';
import BOLLINGER from '../../Services/BOLLINGER';
import Chart from '../Chart';
import riskManagement from '../../Services/riskManagement.js';

class AnalyticsBOLLINGER extends Component {
    constructor(props) {
      super(props);
      this.kPeriod = 14;
      this.dPeriod = 3;
      this.smooth = 3;
      this.lowValue = 20;
      this.heightValue = 80;
      this.state = {};
    }

    componentWillReceiveProps(nextProps) {
      const props = nextProps.companyData;
      const bollinger = new BOLLINGER();
      const bollingerResults = bollinger.calculate(props.Close);
      this.setState({
        data: props,
        scatterBOLLINGERTop: {
          Name: 'B_Upper',
          Date: props.Date,
          Values: bollingerResults.upper,
          showlegend: true
        },
        scatterBOLLINGERMid: {
          Name: 'B_MID',
          Date: props.Date,
          Values: bollingerResults.mid
        },
        scatterBOLLINGERBottom: {
          Name: 'B_Lower',
          Date: props.Date,
          Values: bollingerResults.lower,
          showlegend: true
        }
      });
      new riskManagement(2).simulate(props.Close, props.Date);
      // bollinger.simulate(props.Close, props.High, props.Low, props.Date, false);
    }

    render() {
      return ( 
       <div>
          <Chart name='AnalyticsBOLLINGER' 
            candlestick={this.state.data} 
            fillAreaLow={this.state.scatterBOLLINGERBottom}
            fillAreaHeight={this.state.scatterBOLLINGERTop}
            scatterMID={this.state.scatterBOLLINGERMid}
          />
       </div>
      )
    }
}

export default AnalyticsBOLLINGER;