const axios = require('axios');
const XLSX = require('xlsx');
const fs = require('fs');
const axiosRetry = require('axios-retry');

const instance = axios.create({
  timeout: 60000
});

axiosRetry(instance, { retries: 10 });

const dataDirectory = './data';

fs.readdir('data', (err, files) => {
  files.forEach(fileElement => {
    let count = 0;
    let responseCount = 0;
    const workbook = XLSX.readFile(dataDirectory + '/' + fileElement);
    const sheetNameList = workbook.SheetNames;
    let odsData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNameList[0]]);
    let rows = [];
    let sourceWeight = [];
    let sourceLang = [];
    odsData.forEach((odsRow, index) => {
      odsRow.lp = odsRow['L. p.'];
      if (typeof odsRow['L. p.'] !== 'undefined') {
        wikipediaOpenSearch('pl', odsRow.miasto)
          .then(({ data }) => {
            if (data[1].length > 0) {
              sourceLang[index] = 'pl';
              data[2].forEach((articleDesc, indexCurrent) => {
                if (articleDesc.includes('miasto') && articleDesc.includes(odsRow.kraj) && articleDesc.includes(odsRow.ja1) && !articleDesc.includes('film') && !articleDesc.includes('album') && !articleDesc.includes('utwór')) {
                  if (typeof sourceWeight[index] !== 'undefined') {
                    if (sourceWeight[index] > 1) {
                      rows[index] = data[1][indexCurrent];
                      sourceWeight[index] = 1;
                    }
                  } else {
                    rows[index] = data[1][indexCurrent];
                    sourceWeight[index] = 1;
                  }
                } else if (articleDesc.includes('miasto') && articleDesc.includes(odsRow.kraj.substr(0, 4)) && articleDesc.includes(odsRow.ja1) && !articleDesc.includes('film') && !articleDesc.includes('album') && !articleDesc.includes('utwór')) {
                  if (typeof sourceWeight[index] !== 'undefined') {
                    if (sourceWeight[index] > 2) {
                      rows[index] = data[1][indexCurrent];
                      sourceWeight[index] = 2;
                    }
                  } else {
                    rows[index] = data[1][indexCurrent];
                    sourceWeight[index] = 2;
                  }
                } else if (articleDesc.includes('miasto') && articleDesc.includes(odsRow.kraj) && !articleDesc.includes('film') && !articleDesc.includes('album') && !articleDesc.includes('utwór') && !articleDesc.includes('książ')) {
                  if (typeof sourceWeight[index] !== 'undefined') {
                    if (sourceWeight[index] > 3) {
                      rows[index] = data[1][indexCurrent];
                      sourceWeight[index] = 3;
                    }
                  } else {
                    sourceWeight[index] = 3;
                    rows[index] = data[1][indexCurrent];
                  }
                } else if (articleDesc.includes('miasto') && articleDesc.includes(odsRow.kraj.substr(0, 4)) && !articleDesc.includes('film') && !articleDesc.includes('album') && !articleDesc.includes('utwór') && !articleDesc.includes('książ')) {
                  if (typeof sourceWeight[index] !== 'undefined') {
                    if (sourceWeight[index] > 4) {
                      sourceWeight[index] = 4;
                      rows[index] = data[1][indexCurrent];
                    }
                  } else {
                    sourceWeight[index] = 4;
                    rows[index] = data[1][indexCurrent];
                  }
                } else if (articleDesc.includes('miasto') && !articleDesc.includes('film') && !articleDesc.includes('album') && !articleDesc.includes('utwór') && !articleDesc.includes('książ')) {
                  if (typeof sourceWeight[index] !== 'undefined') {
                    if (sourceWeight[index] > 5) {
                      sourceWeight[index] = 5;
                      rows[index] = data[1][indexCurrent];
                    }
                  } else {
                    sourceWeight[index] = 5;
                    rows[index] = data[1][indexCurrent];
                  }
                }
              });
            } else {
              console.log('article not found [pl] - ' + odsRow.miasto);
              responseCount--;
              wikipediaOpenSearch('en', odsRow.miasto)
                .then(({ data }) => {
                  if (data[1].length > 0) {
                    sourceLang[index] = 'en';
                    data[2].forEach((articleDesc, indexCurrent) => {
                      if ((articleDesc.includes('town') || articleDesc.includes('city')) && articleDesc.includes(odsRow.kraj) && articleDesc.includes(odsRow.ja1) && !articleDesc.includes('movie') && !articleDesc.includes('album') && !articleDesc.includes('song') && !articleDesc.includes('book')) {
                        if (typeof sourceWeight[index] !== 'undefined') {
                          if (sourceWeight[index] > 1) {
                            rows[index] = data[1][indexCurrent];
                            sourceWeight[index] = 1;
                          }
                        } else {
                          rows[index] = data[1][indexCurrent];
                          sourceWeight[index] = 1;
                        }
                      } else if ((articleDesc.includes('town') || articleDesc.includes('city')) && articleDesc.includes(odsRow.kraj.substr(0, 4)) && articleDesc.includes(odsRow.ja1) && !articleDesc.includes('movie') && !articleDesc.includes('album') && !articleDesc.includes('song') && !articleDesc.includes('book')) {
                        if (typeof sourceWeight[index] !== 'undefined') {
                          if (sourceWeight[index] > 2) {
                            rows[index] = data[1][indexCurrent];
                            sourceWeight[index] = 2;
                          }
                        } else {
                          rows[index] = data[1][indexCurrent];
                          sourceWeight[index] = 2;
                        }
                      } else if ((articleDesc.includes('town') || articleDesc.includes('city')) && articleDesc.includes(odsRow.kraj) && !articleDesc.includes('movie') && !articleDesc.includes('album') && !articleDesc.includes('song') && !articleDesc.includes('book')) {
                        if (typeof sourceWeight[index] !== 'undefined') {
                          if (sourceWeight[index] > 3) {
                            rows[index] = data[1][indexCurrent];
                            sourceWeight[index] = 3;
                          }
                        } else {
                          sourceWeight[index] = 3;
                          rows[index] = data[1][indexCurrent];
                        }
                      } else if ((articleDesc.includes('town') || articleDesc.includes('city')) && articleDesc.includes(odsRow.kraj.substr(0, 4)) && !articleDesc.includes('movie') && !articleDesc.includes('album') && !articleDesc.includes('song') && !articleDesc.includes('book')) {
                        if (typeof sourceWeight[index] !== 'undefined') {
                          if (sourceWeight[index] > 4) {
                            sourceWeight[index] = 4;
                            rows[index] = data[1][indexCurrent];
                          }
                        } else {
                          sourceWeight[index] = 4;
                          rows[index] = data[1][indexCurrent];
                        }
                      } else if ((articleDesc.includes('town') || articleDesc.includes('city')) && !articleDesc.includes('movie') && !articleDesc.includes('album') && !articleDesc.includes('song') && !articleDesc.includes('book')) {
                        if (typeof sourceWeight[index] !== 'undefined') {
                          if (sourceWeight[index] > 5) {
                            sourceWeight[index] = 5;
                            rows[index] = data[1][indexCurrent];
                          }
                        } else {
                          sourceWeight[index] = 5;
                          rows[index] = data[1][indexCurrent];
                        }
                      }
                    });
                  } else {
                    console.log('article not found [en] - ' + odsRow.miasto);
                  }
                  responseCount++;
                  console.log(responseCount);
                  checkIfAllRes(odsData, responseCount, rows, sourceWeight, sourceLang);
                });
            }
            responseCount++;
            console.log(responseCount);
            checkIfAllRes(odsData, responseCount, rows, sourceWeight, sourceLang);
          })
          .catch((err) => {
            console.log(err);
          })
      }
    });
  });
})

function checkIfAllRes(odsData, responseCount, rows, sourceWeight, sourceLang) {
  if (typeof odsData[responseCount] === 'undefined' || typeof odsData[responseCount]['L. p.'] === 'undefined') {
    let c = 0;
    rows.forEach((element, i) => {
      console.log(i + 1 + ' - ' + odsData[i].miasto + ' - ' + sourceLang[i] + ' - ' + element);
      c++;
    });
    console.log(c / responseCount);
  }
}

function wikipediaOpenSearch(lang, query) {
  query = encodeURIComponent(query);
  return instance.get(`https://${lang}.wikipedia.org/w/api.php?action=opensearch&search=${query}&format=json`);
}

function wikipediaParse(lang, query) {
  query = encodeURIComponent(query);
  return instance.get(`https://${lang}.wikipedia.org/w/api.php?action=parse&page=${query}&format=json&prop=wikitext`);
}