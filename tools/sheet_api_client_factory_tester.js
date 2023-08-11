const SheetApiClientFactory = require('./sheet_api_client_factory');

const main = async () => {
  try {
    await SheetApiClientFactory.create();
  } catch (e) {
    console.error(e);
  }
};

main();
