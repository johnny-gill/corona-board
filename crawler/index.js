const path = require('path');
const fs = require('fs');
const ApiClient = require('./api-client');
const { crawlAndUpdateDomestic } = require('./domestic-updater');
const { crawlAndUpdateGlobal } = require('./global-updater');

const main = async () => {
  const outputPath = path.join(process.cwd(), 'output');
  console.log('outputPath', outputPath);
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath);
  }

  const apiClient = new ApiClient();

  try {
    console.log('crawlAndUpdateDomestic started');
    await crawlAndUpdateDomestic(outputPath, apiClient);
  } catch (e) {
    console.error('crawlAndUpdateDomestic failed', e);
  }

  try {
    console.log('crawlAndUpdateGlobal started');
    await crawlAndUpdateGlobal(outputPath, apiClient);
  } catch (e) {
    console.error('crawlAndUpdateGlobal failed', e);
  }
};

main();
