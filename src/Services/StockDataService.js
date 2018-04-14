import axios from 'axios';
import csv from 'csvtojson';

export default class StockDataService {

  constructor(period) {
    this.period = period;
  }

  requestStocksFromGoogleFinance(company = 'EPAM'): Promise<Array<any>> {
    const today = this.getDateAgo(0);
    const fromDate = this.getDateAgo(this.period);
    let stocks = [];
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