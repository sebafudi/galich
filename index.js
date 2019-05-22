const axios = require('axios');
const XLSX = require('xlsx');
const fs = require('fs');
const axiosRetry = require('axios-retry');

axiosRetry(axios, { retries: 3 });

const dataDirectory = './data';

fs.readdir('data', (err, files) => {
  files.forEach(fileElement => {
    let count = 0;
    let responseCount = 0;
    const workbook = XLSX.readFile(dataDirectory + '/' + fileElement);
    const sheetNameList = workbook.SheetNames;
    const odsData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNameList[0]]);
    let rows = [];
    (async () => {
      odsData.forEach((odsRow, index) => {
        odsRow.lp = odsRow['L. p.'];
        if (typeof odsRow.lp !== 'undefined') {
          // wikipediaOpenSearch('pl', 'Zapopan')
          wikipediaOpenSearch('pl', odsRow.miasto)
            .then(({ data }) => {
              data[2].forEach((articleDesc, indexCurrent) => {
                // console.log(articleDesc);
                if (articleDesc.includes('miasto') && articleDesc.includes(odsRow.kraj) && articleDesc.includes(odsRow.ja1) && !articleDesc.includes('film')) {
                  count++;
                  rows[index] = data[1][indexCurrent];
                  console.log(rows[index]);
                } else if (articleDesc.includes('miasto') && articleDesc.includes(odsRow.kraj) && !articleDesc.includes(odsRow.ja1) && !articleDesc.includes('film')) {
                  count++;
                  rows[index] = data[1][indexCurrent];
                  console.log(rows[index]);
                } else if (articleDesc.includes('miasto') && !articleDesc.includes('film') && !articleDesc.includes(odsRow.ja1) && !articleDesc.includes(odsRow.kraj)) {
                  count++;
                  rows[index] = data[1][indexCurrent];
                  console.log(rows[index]);
                }
              });
              responseCount++;
              console.log(responseCount);
              if (responseCount === 1200) {
                let c = 0;
                rows.forEach((element, i) => {
                  console.log(i + 1 + ' - ' + odsData[i].miasto + ' - ' + element);
                  c++;
                });
                console.log(c / 1200);
              }
            })
            .catch((err) => {
              console.log(err);
            })
        }
      });
    })();
  });
})

async function wikipediaOpenSearch(lang, query) {
  query = encodeURIComponent(query);
  return axios.get(`https://${lang}.wikipedia.org/w/api.php?action=opensearch&search=${query}&format=json`);
}

async function wikipediaParse(lang, query) {
  query = encodeURIComponent(query);
  return axios.get(`https://${lang}.wikipedia.org/w/api.php?action=parse&page=${query}&format=json&prop=wikitext`);
}