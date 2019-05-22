const axios = require('axios');
const XLSX = require('xlsx');
const fs = require('fs');

const dataDirectory = './data';

fs.readdir('data', (err, files) => {
  files.forEach(fileElement => {
    const workbook = XLSX.readFile(dataDirectory + '/' + fileElement);
    const sheetNameList = workbook.SheetNames;
    const odsData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNameList[0]]);
    odsData.forEach(element => {
      console.log(element.miasto);
    });
  });
})