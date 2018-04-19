import React, { Component } from 'react';
import Plot from 'react-plotly.js';

class Chart extends Component {
    constructor(props) {
      super(props);
      this.state = {
        data: [],
        layout: {
          width: 1000,
          height: 600,
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

    getNextColor() {
      let index = 0;
      const availableColors = [ 'blue','MediumVioletRed', 'LightSalmon', 'DarkMagenta',  'Chartreuse'];
      this.getNextColor = function () {
        return availableColors[index++];
      }
      return availableColors[index++];
    }

    componentWillReceiveProps(nextProps) {
      let newDataArray = [];
      for (const attr in nextProps) {
        if (!nextProps[attr]) {
            return;
        }
        let config = {};
        if (attr.startsWith('candlestick')) {
            const { Date, Open, Close, High, Low, Name } = nextProps[attr];
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
        } else if (attr.startsWith('scatter')) {
          const { Date, Values, Name } = nextProps[attr];
          config = {
            x: Date,
            y: Values,
            type: 'scatter',
            mode: 'lines+points',
            marker: { color: `${this.getNextColor()}` },
            name: Name
          }
        } else if (attr.startsWith('bar')) {
          const { Date, Values, Name } = nextProps[attr];
          config = {
            x: Date,
            y: Values,
            type: 'bar',
            name: Name
          }
        }
        newDataArray.push(config);
      }
      this.setState({
        data: newDataArray,
        layout: Object.assign(this.state.layout, { title: nextProps.name })
      });
    }

    render() {
    	return ( 
    		<Plot data = { this.state.data } layout = { this.state.layout }/>
      )
    }
}

export default Chart;