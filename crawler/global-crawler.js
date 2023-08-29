const _ = require('lodash');
const axios = require('axios');
const cheerio = require('cheerio');
const countryInfo = require('../tools/downloaded/countryInfo.json'); // 바로 역직렬화

class GlobalCrawler {
  constructor() {
    this.client = axios.create({
      header: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
      },
    });

    this.countryMapping = _.chain(countryInfo)
      .keyBy('worldometer_title')
      .mapValues('cc')
      .value();
  }

  async crawlStat() {
    const url =
      'https://yjiq150.github.io/coronaboard-crawling-sample/clone/worldometer/';
    const resp = await this.client.get(url);
    const $ = cheerio.load(resp.data);

    return this._extractStatByCountry($);
  }

  _extractStatByCountry($) {
    const colNames = $('#main_table_countries_today thead tr th')
      .toArray()
      .map((th) => $(th).text().trim());

    const rows = $('#main_table_countries_today tbody tr')
      .toArray()
      .map((tr) => {
        return $(tr)
          .find('td')
          .toArray()
          .map((td) => $(td).text().trim());
      });

    if (!rows.length) {
      throw new Error(
        'Country rows not found. Site layout may have been changed.'
      );
    }

    const colNameToFieldMapping = {
      'Country,Other': 'title',
      TotalCases: 'confirmed',
      TotalDeath: 'death',
      TotalRecovered: 'released',
      TotalTests: 'tested',
    };

    const normalizedData = rows
      .map((row) => {
        const countryStat = {};
        for (let i = 0; i < colNames.length; i++) {
          const colName = colNames[i];
          const fieldName = colNameToFieldMapping[colName];

          if (!fieldName) {
            continue;
          }

          if (fieldName === 'title') {
            countryStat[fieldName] = row[i];
          } else {
            countryStat[fieldName] = this._normalize(row[i]);
          }
        }
        return countryStat;
      })
      .filter((countryStat) => this.countryMapping[countryStat.title]) //countryInfo.json에 없는 나라는 제외(대륙 같은 데이터)
      .map((countryStat) => ({
        ...countryStat,
        cc: this.countryMapping[countryStat.title],
      }));

    return _.keyBy(normalizedData, 'cc');
  }

  _normalize(numberText) {
    return parseInt(numberText.replace(/[\s,]*/g, '')) || 0;
  }
}

module.exports = GlobalCrawler;
