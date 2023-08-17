const _ = require('lodash');
const countryInfo = require('../tools/downloaded/countryInfo.json');

const getDataSource = async () => {
  const countryByCc = _.keyBy(countryInfo, 'cc');

  return { countryByCc };
};

module.exports = {
  getDataSource,
};
