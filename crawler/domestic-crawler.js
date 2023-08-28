const _ = require('lodash');
const { default: axios } = require('axios');
const cheerio = require('cheerio');

class DomesticCrawler {
  constructor() {
    this.client = axios.create({
      header: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
      },
    });
  }

  async crawlStat() {
    const url =
      'https://yjiq150.github.io/coronaboard-crawling-sample/clone/ncov/';
    const resp = await this.client.get(url);
    const $ = cheerio.load(resp.data);

    return {
      basicStats: this._extractBasicStats($),
      byAge: this._extractByAge($),
      bySex: this._extractBySex($),
    };
  }

  _extractBasicStats($) {
    const cellEls = $('h5.s_title_in3:contains("누적 검사현황")')
      .next()
      .find('tbody tr td');

    if (!cellEls.length) {
      throw new Error('table not found.');
    }

    const values = cellEls
      .toArray()
      .map((node) => this._normalize($(node).text()));

    // 격리해제, 사망, 확진, 음성, 검사완료, 검사중
    const [, released, death, confirmed, negative, tested, testing] = values;

    return {
      released,
      death,
      confirmed,
      negative,
      tested,
      testing,
    };
  }

  _extractBySex($) {
    const mapping = {
      남성: 'male',
      여성: 'female',
    };

    return this._extractByDataWithMapping($, mapping);
  }

  _extractByAge($) {
    const mapping = {
      '80 이상': 80,
      '70-79': 70,
      '60-69': 60,
      '50-59': 50,
      '40-49': 40,
      '30-39': 30,
      '20-29': 20,
      '10-19': 10,
      '0-9': 0,
    };

    return this._extractByDataWithMapping($, mapping);
  }

  _extractByDataWithMapping($, mapping) {
    const result = {};

    $('.data_table table tbody tr').each((i, tr) => {
      const cols = $(tr).children();
      _.forEach(mapping, (newKey, oldKey) => {
        if ($(cols.get(0)).text() === oldKey) {
          result[newKey] = {
            confirmed: this._normalize($(cols.get(1)).text()),
            death: this._normalize($(cols.get(2)).text()),
          };
        }
      });
    });

    if (_.isEmpty(result)) {
      throw new Error('data not found.');
    }

    return result;
  }

  _normalize(numberText) {
    const matches = /[0-9,]+/.exec(numberText);
    const absValue = matches[0];
    return parseInt(absValue.replace(/[\s,]*/g, ''));
  }
}

module.exports = DomesticCrawler;
