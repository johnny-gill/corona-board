const fs = require('fs');
const path = require('path');

class SheetDownloader {
  constructor(apiClient) {
    this.apiClient = apiClient;
  }

  downloadToJson = async (spreadsheetId, sheetName, filePath = null) => {
    const res = await this.apiClient.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: sheetName,
    });
    const rows = res.data.values; // 2차원 배열
    if (rows.length === 0) {
      console.error('No data found on the sheet');
      return {};
    }

    const object = this._rowsToObject(rows); // 2차원 배열 -> 객체

    if (filePath) {
      const jsonText = JSON.stringify(object, null, 2); // 객체 -> 문자열 (serialize)

      const directory = path.dirname(filePath);
      if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory);
      }
      fs.writeFileSync(filePath, jsonText);
      console.log(`Written to ${filePath}`);
    }

    return object;
  };

  _rowsToObject = (rows) => {
    const headerRow = rows.slice(0, 1)[0];
    const dataRows = rows.slice(1, rows.length);

    return dataRows.map((dataRow) => {
      const item = {};
      for (let i = 0; i < headerRow.length; i++) {
        const fieldName = headerRow[i];
        const fieldValue = dataRow[i];
        item[fieldName] = fieldValue;
      }
      return item;
    });
  };
}

module.exports = SheetDownloader;
