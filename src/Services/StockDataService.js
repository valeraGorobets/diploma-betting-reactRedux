import axios from 'axios';

export default class StockDataService {

  constructor(period) {
    this.period = period;
  }

  requestStocksFromLocal(company = 'epam') {
    let data = require(`./company/${company}.json`).slice(-this.period);
    data = this.transformDataForChart(data);
    data.Name = company;
    return new Promise((resolve, reject) => {
      resolve(data);
    });
  }
  
  transformDataForChart(data) {
    const obj = {
      Date: [],
      Open: [],
      Close: [],
      High: [],
      Low: []
    };
    data.forEach(day => {
      for (const key in obj) {
        obj[key].push(day[key]);
      }
    });
    return obj;
  }

  requestStocksFromGoogleFinance(company = 'EPAM'): Promise<Array<any>> {
    const today = this.getDateAgo(0);
    const fromDate = this.getDateAgo(this.period);
    return new Promise((resolve, reject) => {
      axios.get(`https://www.quandl.com/api/v1/datasets/WIKI/${company}.csv?column=4&sort_order=asc&trim_start=${fromDate}&trim_end=${today}`)
        .then(function (response) {
          console.log(response);
        })
        // .on('csv', (csvRow) => {
        //   stocks.push(csvRow);
        // })
        // .on('done', () => {
        //   resolve(stocks);
        // })
    });
  }

  getDateAgo(period) {
    var today = new Date()
    today.setDate(new Date().getDate() - period)
    return today.toISOString().slice(0, 10);
  }
}