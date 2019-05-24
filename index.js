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
    let sourceWeight = [];
    (async () => {
      odsData.forEach((odsRow, index) => {
        odsRow.lp = odsRow['L. p.'];
        if (typeof odsRow.lp !== 'undefined') {
          wikipediaOpenSearch('pl', odsRow.miasto)
            .then(({ data }) => {
              data[2].forEach((articleDesc, indexCurrent) => {
                if (articleDesc.includes('miasto') && articleDesc.includes(odsRow.kraj) && articleDesc.includes(odsRow.ja1) && !articleDesc.includes('film') && !articleDesc.includes('album') && !articleDesc.includes('utwór')) {
                  count++;
                  if (typeof sourceWeight[index] !== 'undefined') {
                    if (sourceWeight[index] > 1) {
                      rows[index] = data[1][indexCurrent];
                      sourceWeight[index] = 1;
                    }
                  } else {
                    count++;
                    rows[index] = data[1][indexCurrent];
                    sourceWeight[index] = 1;
                  }
                } else if (articleDesc.includes('miasto') && articleDesc.includes(odsRow.kraj) && !articleDesc.includes('film') && !articleDesc.includes('album') && !articleDesc.includes('utwór')) {
                  if (typeof sourceWeight[index] !== 'undefined') {
                    if (sourceWeight[index] > 2) {
                      rows[index] = data[1][indexCurrent];
                      sourceWeight[index] = 2;
                    }
                  } else {
                    count++;
                    sourceWeight[index] = 2;
                    rows[index] = data[1][indexCurrent];
                  }
                } else if (articleDesc.includes('miasto') && !articleDesc.includes('film') && !articleDesc.includes('album') && !articleDesc.includes('utwór')) {
                  count++;
                  if (typeof sourceWeight[index] !== 'undefined') {
                    if (sourceWeight[index] > 3) {
                      sourceWeight[index] = 3;
                      rows[index] = data[1][indexCurrent];
                    }
                  } else {
                    count++;
                    sourceWeight[index] = 3;
                    rows[index] = data[1][indexCurrent];
                  }
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