const fs = require('fs');
const { google } = require('googleapis');
const readline = require('readline');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const TOKEN_PATH = 'accessToken.json';

class SheetApiClientFactory {
  static create = async () => {
    const credential = fs.readFileSync('credentials.json');
    const auth = await this._authorize(JSON.parse(credential));
  };

  static _authorize = async (credentials) => {
    const { client_id, client_secret, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    );

    if (!fs.existsSync(TOKEN_PATH)) {
      const token = await this._getNewToken(oAuth2Client);
    }
  };

  static _getNewToken = async (oAuth2Client) => {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });
    console.log('인증 URL을 여시오... : ', authUrl);

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    //const code = await new Promise
  };
}
