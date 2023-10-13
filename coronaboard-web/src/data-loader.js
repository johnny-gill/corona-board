const _ = require('lodash');
const countryInfo = require('../../tools/downloaded/countryInfo.json');
const { format, subDays } = require('date-fns');
const { utcToZonedTime } = require('date-fns-tz');
const ApiClient = require('./api-client');
const notice = require('../../tools/downloaded/notice.json');
const path = require('path');
const fs = require('fs-extra');

const getDataSource = async () => {
  const countryByCc = _.keyBy(countryInfo, 'cc');
  const apiClient = new ApiClient();

  const allGlobalStats = await apiClient.getAllGlobalStats();
  debugger;
  const groupedByDate = _.groupBy(allGlobalStats, 'date'); // 날짜별로 그룹화한 데이터
  const globalStats = generateGlobalStats(groupedByDate);

  /**
   * 글로벌 챠트
   * 전셰게 또는 국가별로 누적 또는 일별 데이터를 조회한다.
   */
  const globalChartDataByCc = generateGlobalChartDataByCc(groupedByDate);
  Object.keys(globalChartDataByCc).forEach((cc) => {
    const genPath = path.join(process.cwd(), `static/generated/${cc}.json`);
    fs.outputFileSync(genPath, JSON.stringify(globalChartDataByCc[cc]));
  });

  /**
   * 국내 차트
   * 국내 코로나 검사 현황 및 성별, 나이에 따른 데이터를 조회한다.
   */
  const koreaTestChartData = generateKoreaTestChartData(allGlobalStats);
  const { bySex, byAge } = apiClient.getByAgeAndBySex();
  return {
    lastUpdated: Date.now(),
    countryByCc,
    globalStats,
    notice: notice.filter((x) => !x.hidden),
    koreaTestChartData,
    koreaBySexChartData: bySex,
    koreaByAgeChartData: byAge,
  };
};

const generateKoreaTestChartData = (allGlobalStats) => {
  const krData = allGlobalStats.filter((x) => x.cc === 'KR');

  return {
    date: krData.map((x) => x.date),
    confirmedRate: krData.map((x) => x.confirmed / (x.confirmed + x.negative)),
    confirmed: krData.map((x) => x.confirmed),
    negative: krData.map((x) => x.negative),
    testing: krData.map((x) => x.testing),
  };
};

const generateGlobalChartDataByCc = (groupedByDate) => {
  const chartDataByCc = {};

  const dates = Object.keys(groupedByDate).sort();
  for (const date of dates) {
    const countriesDataForOneDay = groupedByDate[date];

    // 국가별로 차트 데이터에 저장
    for (const countryData of countriesDataForOneDay) {
      const cc = countryData.cc;

      // 해당 국가가 챠트 데이터에 없으면 새로운 객체 정의 후 추가
      if (!chartDataByCc[cc]) {
        chartDataByCc[cc] = {
          date: [],
          confirmed: [], // 해당 날짜의 확진자 수
          confirmedAcc: [], // 해당 날짜까지의 누적 확진자 수
          death: [],
          deathAcc: [],
          released: [],
          releasedAcc: [],
        };
      }

      appendToChartData(chartDataByCc[cc], countryData, date);
    }

    // 전세계 차트 데이터 저장
    if (!chartDataByCc['global']) {
      chartDataByCc['global'] = {
        date: [],
        confirmed: [],
        confirmedAcc: [],
        death: [],
        deathAcc: [],
        released: [],
        releasedAcc: [],
      };
    }

    const countryDataSum = countriesDataForOneDay.reduce(
      (sum, x) => ({
        confirmed: sum.confirmed + x.confirmed,
        death: sum.death + x.death,
        released: sum.released + (x.released || 0),
      }),
      { confirmed: 0, death: 0, released: 0 }
    );

    appendToChartData(chartDataByCc['global'], countryDataSum, date);
  }

  return chartDataByCc;
};

const appendToChartData = (chartData, countryData, date) => {
  // 누적 데이터가 아직 없는 경우
  if (chartData.date.length === 0) {
    chartData.confirmed.push(countryData.confirmed);
    chartData.death.push(countryData.death);
    chartData.released.push(countryData.released);
  } else {
    // 전일 대비 증가량
    const confirmedIncrement =
      countryData.confirmed - (_.last(chartData.confirmed) || 0); // 현재 데이터 - 마지막 데이터
    const deathIncrement = countryData.death - (_.last(chartData.death) || 0);
    const releasedIncrement =
      countryData.released - (_.last(chartData.released) || 0);

    chartData.confirmed.push(confirmedIncrement);
    chartData.death.push(deathIncrement);
    chartData.released.push(releasedIncrement);
  }

  chartData.date.push(date);
  chartData.confirmedAcc.push(countryData.confirmed);
  chartData.deathAcc.push(countryData.death);
  chartData.releasedAcc.push(countryData.released);
};

const generateGlobalStats = (groupedByDate) => {
  const now = new Date('2021-06-05');
  const timeZone = 'Asia/Seoul';
  const today = format(utcToZonedTime(now, timeZone), 'yyyy-MM-dd');
  const yesterday = format(
    utcToZonedTime(subDays(now, 1), timeZone),
    'yyyy-MM-dd'
  );

  if (!groupedByDate[today]) {
    throw new Error('Data for today is missing');
  }

  return createGlobalStatWithPrevField(
    groupedByDate[today],
    groupedByDate[yesterday]
  );
};

const createGlobalStatWithPrevField = (todayStats, yesterdayStats) => {
  const yesterdayStatsByCc = _.keyBy(yesterdayStats, 'cc');

  const globalStatWithPrev = todayStats.map((todayStat) => {
    const cc = todayStat.cc;
    const yesterdayStat = yesterdayStatsByCc[cc];

    if (yesterdayStat) {
      return {
        ...todayStat,
        confirmedPrev: yesterdayStat.confirmed || 0,
        deathPrev: yesterdayStat.death || 0,
        negativePrev: yesterdayStat.negative || 0,
        releasedPrev: yesterdayStat.released || 0,
        testedPrev: yesterdayStat.tested || 0,
        testingPrev: yesterdayStat.testing || 0,
      };
    }

    return todayStat;
  });

  return globalStatWithPrev;
};

module.exports = {
  getDataSource,
};
