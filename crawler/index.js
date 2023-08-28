const path = require('path');
const fs = require('fs');
const ApiClient = require('./api-client');
const { crawlAndUpdateDomestic } = require('./domestic-updater');


const main = async () => {
  const outputPath = path.join(process.cwd(), 'output');
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
};

main();
