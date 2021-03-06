import React, { Component } from 'react';
import Plot from 'react-plotly.js';

class Chart extends Component {
    constructor(props) {
      super(props);
      this.state = {
        data: [],
        layout: {
          width: 1300,
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
              fixedrange: false
          }
        }
      }
    }

    getNextColor() {
      let index = 0;
      const availableColors = [ 'blue','MediumVioletRed', 'LightSalmon', 'DarkMagenta',  'Chartreuse'];
      this.getNextColor = function () {
        if(index === availableColors.length){
          index = 0;
        }
        return availableColors[index++];
      }
      return availableColors[index++];
    }

    componentWillReceiveProps(nextProps) {
      let newDataArray = [];
      let customLayout = {};
      for (const attr in nextProps) {
        if (!nextProps[attr]) {
            return;
        }
        let config = {};
        customLayout['title'] = nextProps.name;
        if (attr.startsWith('candlestick')) {
            const { Name, Date, Open, Close, High, Low } = nextProps[attr];
            config = {
	            name: Name,
	            x: Date,
	            close: Close,
	            decreasing: {line: {color: 'red'}},
	            high: High,
	            increasing: {line: {color: 'green'}},
	            line: {color: 'rgba(31,119,180,1)'},
	            low: Low,
	            open: Open,
	            type: 'candlestick',
	            xaxis: 'x',
              yaxis: 'y'
          	}
        } else if (attr.startsWith('scatter')) {
          const { Name, Date, Values } = nextProps[attr];
          config = {
            name: Name,
            x: Date,
            y: Values,
            type: 'scatter',
            mode: 'lines+points',
            marker: { color: `${this.getNextColor()}` }
          }
        } else if (attr.startsWith('bar')) {
          const { Name, Date, Values } = nextProps[attr];
          config = {
            name: Name,
            x: Date,
            y: Values,
            type: 'bar'
          }
        } else if (attr.startsWith('pie')) {
          const { Name, Labels,  Values } = nextProps[attr];
          config = {
            name: Name,
            labels: Labels,
            values: Values,
            type: 'pie',
            marker: {
              colors: ['#1DE9B6', '#CDDC39', '#FF7043']
            }
          }
          customLayout = {
            height: 350,
            width: 450,
            showlegend: true
          }
        } else if(attr.startsWith('fillAreaLow')){
          const { Name,  Date, Values, showlegend } = nextProps[attr];
          config = {
            name: Name,
            x: Date,
            y: Values,
            type: 'scatter'
          }
          if(!showlegend){
            config.showlegend = false;
            config.hoverinfo = 'none';
          }
        }
        else if(attr.startsWith('fillAreaHeight')){
          const { Name, Date, Values, showlegend } = nextProps[attr];
          config = {
            name: Name,
            x: Date,
            y: Values,
            fill: 'tonexty',
            fillcolor: 'rgba(147,112,219,0.3)',
            type: 'scatter'
          }
          if(!showlegend){
            config.showlegend = false;
            config.hoverinfo = 'none';
          }
        }
        newDataArray.push(config);
      }

      this.setState({
        data: newDataArray,
        layout: Object.assign(this.state.layout, customLayout)
      });
      customLayout = {}
    }

    render() {
      return (
        <div>
          {(this.state.data.length && (
            <Plot data={this.state.data} layout={this.state.layout}/>
          )) || (<h2>No Data</h2>)}
        </div>
      )
    }
}

export default Chart;
