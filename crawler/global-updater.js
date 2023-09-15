const path = require('path');
const fs = require('fs');
const GlobalCrawler = require('./global-crawler');
const { utcToZonedTime, format } = require('date-fns-tz');
const _ = require('lodash');

const crawlAndUpdateGlobal = async (outputPath, apiClient) => {
  let prevData = {};
  const globalStatPath = path.join(outputPath, 'global-stat.json');

  try {
    prevData = JSON.parse(fs.readFileSync(globalStatPath, 'utf-8'));
  } catch (e) {
    console.error('previous global stat not found');
  }

  const globalCrawler = new GlobalCrawler();
  const crawledDate = format(utcToZonedTime(new Date(), 'Asia/Seoul'), 'yyyy-MM-dd');
  const newData = {
    crawledDate,
    globalStat: await globalCrawler.crawlStat(),
  };

  if (_.isEqual(newData, prevData)) {
    console.log('globalStat has not changed');
    return;
  }

  fs.writeFileSync(globalStatPath, JSON.stringify(newData));

  const newGlobalStat = newData.globalStat;
  const resp = await apiClient.findAllGlobalStat();
  const oldRows = resp.result.filter((x) => x.date === crawledDate);
  const oldGlobalStat = _.keyBy(oldRows, 'cc');

  const updatedRows = findUpdatedRows(newGlobalStat, oldGlobalStat);
  if (_.isEmpty(updatedRows)) {
    console.log('No updated globalStat rows');
    return;
  }

  for (const row of updatedRows) {
    await apiClient.upsertGlobalStat({
      date: crawledDate,
      ...row,
    });
  }

  console.log('globalStat updated successfully');
};

const findUpdatedRows = (newRowsByCc, oldRowsByCc) => {
  const updatedRows = [];
  for (const cc of Object.keys(newRowsByCc)) {
    const newRow = newRowsByCc[cc];
    const oldRow = oldRowsByCc[cc];

    if (cc === 'KR' && oldRow) {
      continue;
    }

    if (isRowEqual(newRow, oldRow)) {
      continue;
    }

    updatedRows.push(newRow);
  }

  return updatedRows;
};

const isRowEqual = (newRow, prevRow) => {
  if (!prevRow) {
    return false;
  }

  const colsToCompare = [
    'confirmed',
    'death',
    'released',
    'critical',
    'tested',
  ];

  return colsToCompare.every((col) => prevRow[col] === newRow[col]);
};

module.exports = { crawlAndUpdateGlobal };
