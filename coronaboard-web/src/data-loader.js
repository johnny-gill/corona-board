const _ = require('lodash');
const countryInfo = require('../../tools/downloaded/countryInfo.json');
const { format, subDays } = require('date-fns');
const { utcToZonedTime } = require('date-fns-tz');
const ApiClient = require('./api-client');
const notice = require('../../tools/downloaded/notice.json');

const getDataSource = async () => {
  const countryByCc = _.keyBy(countryInfo, 'cc');
  const apiClient = new ApiClient();

  const allGlobalStats = await apiClient.getAllGlobalStats();
  const groupedByDate = _.groupBy(allGlobalStats, 'date'); // 날짜별로 그룹화한 데이터
  const globalStats = generateGlobalStats(groupedByDate);

  return {
    lastUpdated: Date.now(),
    countryByCc,
    globalStats,
    notice: notice.filter(x => !x.hidden)
  };
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
