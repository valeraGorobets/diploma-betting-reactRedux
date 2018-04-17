import React, { Component } from 'react';
import Plot from 'react-plotly.js';

class Chart extends Component {
    constructor(props) {
        super(props);
        this.state = {
          data: [],
          layout: {
              dragmode: 'zoom',
              margin: {
                  r: 10,
                  t: 25,
                  b: 40,
                  l: 60
              },
              showlegend: false,
              xaxis: {
                  autorange: true,
                  type: 'date'
              },
              yaxis: {
                  autorange: true,
                  type: 'linear'
              }
          }
        }
    }

    componentWillReceiveProps (nextProps) {
      let newDataArray = [];
      if(!nextProps){
        return;
      }
      for(const chart in nextProps) {
        let config = {};
          if(chart === 'candlestick'){
            const { Date, Open, Close, High, Low, Name} = nextProps[chart];
            config = {
              name: Name,
              x: Date,
              close: Close,
              decreasing: { line: { color: 'red' } },
              high: High,
              increasing: { line: { color: 'green' } },
              line: { color: 'rgba(31,119,180,1)' },
              low: Low,
              open: Open,
              type: 'candlestick',
              xaxis: 'x',
              yaxis: 'y'
            }
          } else if(chart === 'scatter'){
            const { Date, Values, Name} = nextProps[chart];
            config = {
              x: Date,
              y: Values,
              type: 'scatter',
              mode: 'lines+points',
              marker: {color: 'blue'},
              name: Name
            }
          }
          newDataArray.push(config);
      }
      this.setState({
        data: newDataArray
      });
    }

    render() {
        return ( 
          <Plot data = {this.state.data} layout = {this.state.layout}/>
        )
    }
}

export default Chart;