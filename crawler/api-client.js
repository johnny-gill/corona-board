const { default: axios } = require('axios');

class ApiClient {
  constructor() {
    const client = axios.create({
      baseURL: process.env.CB_API_BASE_URL || 'http://localhost:8080',
    });

    client.interceptors.response.use((resp) => {
      console.log('resp', resp);
      return resp.data;
    });

    this.client = client;
  }

  async upsertGlobalStat(data) {
    return await this.client.post('global-stats', data);
  }

  async upsertKeyValue(key, value) {
    return await this.client.post('key-value', {
      key,
      value,
    });
  }
}

module.exports = ApiClient;
