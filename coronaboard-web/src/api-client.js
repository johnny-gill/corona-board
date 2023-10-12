const axios = require('axios');

class ApiClient {
  constructor() {
    const client = axios.create({
      baseURL: process.env.CB_API_BASE_URL || 'http://localhost:8080',
    });

    client.interceptors.response.use((resp) => resp.data);

    this.client = client;
  }

  async getAllGlobalStats() {
    const res = await this.client.get('global-stats');
    return res.result;
  }

  async getByAgeAndBySex() {
    const res = await this.client.get('key-value/byAgeAndSex');
    return JSON.parse(res.result.value);
  }
}

module.exports = ApiClient;
