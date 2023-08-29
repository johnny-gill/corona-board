const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const DomesticCrawler = require('./domestic-crawler');
const { utcToZonedTime, format } = require('date-fns-tz');

const crawlAndUpdateDomestic = async (outputPath, apiClient) => {
  let prevData = {};
  const domesticStatPath = path.join(outputPath, 'domestic-stat.json');
  
  try {
    prevData = JSON.parse(fs.readFileSync(domesticStatPath, 'utf-8'));
  } catch (e) {
    console.error('previous domestic stat not found');
  }

  const domesticCrawler = new DomesticCrawler();

  const now = new Date();
  const timeZone = 'Asia/Seoul';
  const crawledDate = format(utcToZonedTime(now, timeZone), 'yyyy-MM-dd');

  const newData = {
    crawledDate,
    domesticStat: await domesticCrawler.crawlStat(),
  };

  if (_.isEqual(newData, prevData)) {
    console.log('domesticStat has not changed');
    return;
  }

  fs.writeFileSync(domesticStatPath, JSON.stringify(newData));

  const { released, death, confirmed, negative, tested, testing } =
    newData.domesticStat.basicStats;

  await apiClient.upsertGlobalStat({
    cc: 'KR',
    date: crawledDate,
    released,
    death,
    confirmed,
    negative,
    tested,
    testing,
  });

  const { byAge, bySex } = newData.domesticStat;
  const value = JSON.stringify({ byAge, bySex });
  await apiClient.upsertKeyValue('byAgeAndSex', value);
};

module.exports = { crawlAndUpdateDomestic };
