const _ = require('lodash');
const { default: axios } = require('axios');
const { Cheerio } = require('cheerio');

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
    const $ = Cheerio.load(resp.data);

    return {
      basicStats: this._extractBasicStats($),
      byAge: this._extractBy($, '확진자 성별 현황'),
      bySex: this._extractBy($, '확진자 연령별 현황'),
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

  _extractBy($, title) {
    const rowEls = $(`h5.s_title_in3:contains(${title})`)
      .parent()
      .parent()
      .next()
      .find('table tbody tr');
  }

  _normalize(numberText) {
    const matches = /[0-9,]+/.exec(numberText);
    const absValue = matches[0];
    return parseInt(absValue.replace(/[\s,]*/g, ''));
  }
}

module.exports = DomesticCrawler;
