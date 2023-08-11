const fs = require('fs');
const { google } = require('googleapis');
const readline = require('readline');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const TOKEN_PATH = 'accessToken.json';

class SheetApiClientFactory {
  static create = async () => {
    const credential = fs.readFileSync('credentials.json');
    const auth = await this._authorize(JSON.parse(credential));
    return google.sheets({ version: 'v4', auth });
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
      oAuth2Client.setCredentials(token);

      fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
      return oAuth2Client;
    }

    const token = JSON.parse(fs.readFileSync(TOKEN_PATH));
    oAuth2Client.setCredentials(token);
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

    const code = await new Promise((resolve) => {
      rl.question('인증 코드를 넣으시오... : ', (code) => resolve(code));
    });

    rl.close();

    const res = await oAuth2Client.getToken(code);
    return res.tokens;
  };
}

module.exports = SheetApiClientFactory;
