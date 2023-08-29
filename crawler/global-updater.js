const path = require('path');
const fs = require('fs');
const GlobalCrawler = require('./global-crawler');

const crawlAndUpdateGlobal = async (outputPath, apiClient) => {
  let prevData = {};
  const globalStatPath = path.join(outputPath, 'global-stat.json');

  try {
    prevData = JSON.parse(fs.readFileSync(globalStatPath, 'utf-8'));
  } catch (e) {
    console.error('previous global stat not found');
  }

  const globalCrawler = new GlobalCrawler();
  //await globalCrawler.crawlStat()
  
};

module.exports = { crawlAndUpdateGlobal };
