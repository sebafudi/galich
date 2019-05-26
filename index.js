const axios = require('axios');
const XLSX = require('xlsx');
const fs = require('fs');
const axiosRetry = require('axios-retry');

const lpField = 'L. p.';

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
      odsRow.lp = odsRow[lpField];
      if (typeof odsRow[lpField] !== 'undefined') {
        wikipediaOpenSearch('pl', odsRow.miasto)
          .then(({ data }) => {
            if (data[1].length > 0) {
              sourceLang[index] = 'pl';
              data[2].forEach((articleDesc, indexCurrent) => {
                if ((articleDesc.includes('miasto') || articleDesc.includes('miejscowość')) && articleDesc.includes(odsRow.kraj) && articleDesc.includes(odsRow.ja1) && !articleDesc.includes('film') && !articleDesc.includes('album') && !articleDesc.includes('utwór')) {
                  if (typeof sourceWeight[index] !== 'undefined') {
                    if (sourceWeight[index] > 0) {
                      rows[index] = data[1][indexCurrent];
                      sourceWeight[index] = 0;
                    }
                  } else {
                    rows[index] = data[1][indexCurrent]; 
                    sourceWeight[index] = 0;
                  }
                } else if ((articleDesc.includes('miasto') || articleDesc.includes('miejscowość')) && articleDesc.includes(odsRow.kraj.substr(0, 4)) && articleDesc.includes(odsRow.ja1) && !articleDesc.includes('film') && !articleDesc.includes('album') && !articleDesc.includes('utwór')) {
                  if (typeof sourceWeight[index] !== 'undefined') {
                    if (sourceWeight[index] > 1) {
                      rows[index] = data[1][indexCurrent];
                      sourceWeight[index] = 1;
                    }
                  } else {
                    rows[index] = data[1][indexCurrent];
                    sourceWeight[index] = 1;
                  }
                } else if ((articleDesc.includes('miasto') || articleDesc.includes('miejscowość')) && articleDesc.includes(odsRow.kraj) && !articleDesc.includes('film') && !articleDesc.includes('album') && !articleDesc.includes('utwór') && !articleDesc.includes('książ')) {
                  if (typeof sourceWeight[index] !== 'undefined') {
                    if (sourceWeight[index] > 2) {
                      rows[index] = data[1][indexCurrent];
                      sourceWeight[index] = 2;
                    }
                  } else {
                    sourceWeight[index] = 2;
                    rows[index] = data[1][indexCurrent];
                  }
                } else if ((articleDesc.includes('miasto') || articleDesc.includes('miejscowość')) && articleDesc.includes(odsRow.kraj.substr(0, 4)) && !articleDesc.includes('film') && !articleDesc.includes('album') && !articleDesc.includes('utwór') && !articleDesc.includes('książ')) {
                  if (typeof sourceWeight[index] !== 'undefined') {
                    if (sourceWeight[index] > 3) {
                      sourceWeight[index] = 3;
                      rows[index] = data[1][indexCurrent];
                    }
                  } else {
                    sourceWeight[index] = 3;
                    rows[index] = data[1][indexCurrent];
                  }
                } else if ((articleDesc.includes('miasto') || articleDesc.includes('miejscowość')) && !articleDesc.includes('film') && !articleDesc.includes('album') && !articleDesc.includes('utwór') && !articleDesc.includes('książ')) {
                  if (typeof sourceWeight[index] !== 'undefined') {
                    if (sourceWeight[index] > 4) {
                      sourceWeight[index] = 4;
                      rows[index] = data[1][indexCurrent];
                    }
                  } else {
                    sourceWeight[index] = 4;
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
                          if (sourceWeight[index] > 0) {
                            rows[index] = data[1][indexCurrent];
                            sourceWeight[index] = 0;
                          }
                        } else {
                          rows[index] = data[1][indexCurrent];
                          sourceWeight[index] = 0;
                        }
                      } else if ((articleDesc.includes('town') || articleDesc.includes('city')) && articleDesc.includes(odsRow.kraj.substr(0, 4)) && articleDesc.includes(odsRow.ja1) && !articleDesc.includes('movie') && !articleDesc.includes('album') && !articleDesc.includes('song') && !articleDesc.includes('book')) {
                        if (typeof sourceWeight[index] !== 'undefined') {
                          if (sourceWeight[index] > 1) {
                            rows[index] = data[1][indexCurrent];
                            sourceWeight[index] = 1;
                          }
                        } else {
                          rows[index] = data[1][indexCurrent];
                          sourceWeight[index] = 1;
                        }
                      } else if ((articleDesc.includes('town') || articleDesc.includes('city')) && articleDesc.includes(odsRow.kraj) && !articleDesc.includes('movie') && !articleDesc.includes('album') && !articleDesc.includes('song') && !articleDesc.includes('book')) {
                        if (typeof sourceWeight[index] !== 'undefined') {
                          if (sourceWeight[index] > 2) {
                            rows[index] = data[1][indexCurrent];
                            sourceWeight[index] = 2;
                          }
                        } else {
                          sourceWeight[index] = 2;
                          rows[index] = data[1][indexCurrent];
                        }
                      } else if ((articleDesc.includes('town') || articleDesc.includes('city')) && articleDesc.includes(odsRow.kraj.substr(0, 4)) && !articleDesc.includes('movie') && !articleDesc.includes('album') && !articleDesc.includes('song') && !articleDesc.includes('book')) {
                        if (typeof sourceWeight[index] !== 'undefined') {
                          if (sourceWeight[index] > 3) {
                            sourceWeight[index] = 3;
                            rows[index] = data[1][indexCurrent];
                          }
                        } else {
                          sourceWeight[index] = 3;
                          rows[index] = data[1][indexCurrent];
                        }
                      } else if ((articleDesc.includes('town') || articleDesc.includes('city')) && !articleDesc.includes('movie') && !articleDesc.includes('album') && !articleDesc.includes('song') && !articleDesc.includes('book')) {
                        if (typeof sourceWeight[index] !== 'undefined') {
                          if (sourceWeight[index] > 4) {
                            sourceWeight[index] = 4;
                            rows[index] = data[1][indexCurrent];
                          }
                        } else {
                          sourceWeight[index] = 4;
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


String.prototype.replaceAll = function (search, replacement) {
  var target = this;
  return target.replace(new RegExp(search, 'g'), replacement);
};

let res = [];

const regEx = {
  pl: {
    ll: new RegExp('\\|liczba ludności\\s*= ([ok\\d\\s\\.\\,&nbsp;tys]*)'),
    lld: new RegExp('\\|rok\\s*= ([\\d\\s\\.\\,&nbsp;]*)'),
    p: new RegExp('\\|powierzchnia\\s*= ([\\d\\s\\.\\,&nbsp;]*)'),
    pm: new RegExp('\\|prawa miejskie\\s*= ([\\d\\s\\.\\,&nbsp;]*)'),
    dz: new RegExp('\\|data założenia\\s*= ([\\d\\s\\.\\,&nbsp;]*)'),
    mnpm: new RegExp('\\|wysokość\\s*= ([\\d\\s\\.\\,&nbsp;]*)'),
  },
  en: {
    ll: new RegExp('\\|population_total\\s*= ([ok\\d\\s\\.\\,&nbsp;tys]*)'),
    lld: new RegExp('\\|population_as_of\\s*= ([\\d\\s\\.\\,&nbsp;]*)'),
    p: new RegExp('\\|area_total_km2\\s*= ([\\d\\s\\.\\,&nbsp;]*)'),
    pm: new RegExp('\\|established_date3\\s*= ([\\d\\s\\.\\,&nbsp;]*)'),
    dz: new RegExp('\\|established_date\\s*= ([\\d\\s\\.\\,&nbsp;]*)'),
    mnpm: new RegExp('\\|elevation_m\\s*= ([\\d\\s\\.\\,&nbsp;]*)'),
  }
}

function checkIfAllRes(odsData, responseCount, rows, sourceWeight, sourceLang) {
  if (typeof odsData[responseCount] === 'undefined' || typeof odsData[responseCount][lpField] === 'undefined') {
    let c = 0;
    let flag1 = [];
    let flag2 = [];
    /*

      1: 0 - 4 => sourceWeight
      2: 0 - 1 => name is not equal wikipedia tittle

    */
    rows.forEach((element, i) => {
      // console.log(i + 1 + ' - ' + odsData[i].miasto + ' - ' + sourceLang[i] + ' - ' + element);
      flag1[i] = String(sourceWeight[i]);
      wikipediaParse(sourceLang[i], element)
        .then(({ data }) => {
          data.parse.wikitext = data.parse.wikitext['*'];
          // console.log(data.parse.wikitext);
          if (sourceLang[i] === 'pl') {
            regExpLL = regEx.pl.ll;
            regExpLLD = regEx.pl.lld;
            regExpP = regEx.pl.p;
            regExpPM = regEx.pl.pm;
            regExpDZ = regEx.pl.dz;
            regExpMNPM = regEx.pl.mnpm;
          } else if (sourceLang[i] === 'en') {
            regExpLL = regEx.en.ll;
            regExpLLD = regEx.en.lld;
            regExpP = regEx.en.p;
            regExpPM = regEx.en.pm;
            regExpDZ = regEx.en.dz;
            regExpMNPM = regEx.en.mnpm;
          }
          let ll = regExpLL.exec(data.parse.wikitext);
          let lld = regExpLLD.exec(data.parse.wikitext);
          let p = regExpP.exec(data.parse.wikitext);
          let pm = regExpPM.exec(data.parse.wikitext);
          let dz = regExpDZ.exec(data.parse.wikitext);
          let mnpm = regExpMNPM.exec(data.parse.wikitext);
          const natxt = '';
          ll = (ll === null || ll[1].trim() === '' ? natxt : ll[1].trim());
          lld = (lld === null || lld[1].trim() === '' ? natxt : lld[1].trim());
          p = (p === null || p[1].trim() === '' ? natxt : p[1].trim());
          pm = (pm === null || pm[1].trim() === '' ? natxt : pm[1].trim());
          dz = (dz === null || dz[1].trim() === '' ? natxt : dz[1].trim());
          mnpm = (mnpm === null || mnpm[1].trim() === '' ? natxt : mnpm[1].trim());
          zrodlo = `https://${sourceLang[i]}.wikipedia.org/wiki/${element.replaceAll(' ', '_')}`;
          // console.log(i + '. ' + element + ': Liczba ludności: ' + (ll === natxt ? ll : formatPopulationCount(ll)) + ', Liczba ludności rok: ' + (lld === natxt ? lld : formatPopulationYear(lld)) + ', Powierzchnia: ' + p + ', Data założenia: ' + (pm == natxt ? dz : pm));
          xd = ';';
          // res[i] = [];
          res[i] = { p, ll: (ll === natxt ? ll : formatPopulationCount(ll)), lld: (lld === natxt ? lld : formatPopulationYear(lld)), mnpm, dz, pm, zrodlo, f1: flag1[i]};
          // console.log(p + ll);
          // console.log(res[i].p !== '' && res[i].ll !== '');
          if (res[i].p === '' || res[i].ll === '' || res[i].lld === '' || res[i].mnpm === '' || res[i].dz === '' || res[i].pm === '' || res[i].zrodlo === '') {
            // console.log(odsData[i]);
            // console.log(res[i]);
            if (sourceLang[i] === 'pl') {
              res[i].addLang === 'en';
              wikipediaLangLink('pl', element, 'en')
                .then(({ data }) => {
                  let pageId = Object.keys(data.query.pages)[0];
                  if (typeof data.query.pages[pageId].langlinks !== 'undefined') {
                    // console.log(data.query.pages[pageId].langlinks[0]['*']);
                    // element = data.query.pages[pageId]
                    let newLangName = data.query.pages[pageId].langlinks[0]['*'];
                    wikipediaParse('en', newLangName)
                      .then(({ data }) => {
                        data.parse.wikitext = data.parse.wikitext['*'];
                        regExpLL = regEx.en.ll;
                        regExpLLD = regEx.en.lld;
                        regExpP = regEx.en.p;
                        regExpPM = regEx.en.pm;
                        regExpDZ = regEx.en.dz;
                        regExpMNPM = regEx.en.mnpm;
                        let ll = regExpLL.exec(data.parse.wikitext);
                        let lld = regExpLLD.exec(data.parse.wikitext);
                        let p = regExpP.exec(data.parse.wikitext);
                        let pm = regExpPM.exec(data.parse.wikitext);
                        let dz = regExpDZ.exec(data.parse.wikitext);
                        let mnpm = regExpMNPM.exec(data.parse.wikitext);
                        // res[i].ll = (typeof res[i].ll === '') ? ll : res[i].ll;
                        llUsed = false;
                        if (ll !== null) {
                          if (ll[0].trim() !== '') {
                            if (res[i].ll === '') {
                              res[i].ll = ll[1].trim();
                              llUsed = true;
                            }
                          }
                        }
                        lldUsed = false;
                        if (lld !== null) {
                          if (lld[0].trim() !== '') {
                            if (res[i].lld === '') {
                              res[i].lld = lld[1].trim();
                              lldUsed = true;
                            }
                          }
                        }
                        pUsed = false;
                        if (p !== null) {
                          if (p[0].trim() !== '') {
                            if (res[i].p === '') {
                              res[i].p = p[1].trim();
                              pUsed = true;
                            }
                          }
                        }
                        pmUsed = false;
                        if (pm !== null) {
                          if (pm[0].trim() !== '') {
                            if (res[i].pm === '') {
                              res[i].pm = pm[1].trim();
                              pmUsed = true;
                            }
                          }
                        }
                        dzUsed = false;
                        if (dz !== null) {
                          if (dz[0].trim() !== '') {
                            if (res[i].dz === '') {
                              res[i].dz = dz[1].trim();
                              dzUsed = true;
                            }
                          }
                        }
                        mnpmUsed = false;
                        if (mnpm !== null) {
                          if (mnpm[0].trim() !== '') {
                            if (res[i].mnpm === '') {
                              res[i].mnpm = mnpm[1].trim();
                              mnpmUsed = true;
                            }
                          }
                        }
                        if (llUsed || lldUsed || pUsed || pmUsed || dzUsed || dzUsed || mnpmUsed) {
                          res[i].zrodlo += `, https://en.wikipedia.org/wiki/${newLangName.replaceAll(' ', '_')}`;
                        }
                      });
                  }
                });
            } else if (sourceLang[i] === 'en') {
              res[i].addLang === 'pl';
              wikipediaLangLink('en', element, 'pl')
                .then(({ data }) => {
                  let pageId = Object.keys(data.query.pages)[0];
                  if (typeof data.query.pages[pageId].langlinks !== 'undefined') {
                    // console.log(data.query.pages[pageId].langlinks[0]['*']);
                    // element = data.query.pages[pageId]
                    let newLangName = data.query.pages[pageId].langlinks[0]['*'];
                    wikipediaParse('en', newLangName)
                      .then(({ data }) => {
                        data.parse.wikitext = data.parse.wikitext['*'];
                        regExpLL = regEx.pl.ll;
                        regExpLLD = regEx.pl.lld;
                        regExpP = regEx.pl.p;
                        regExpPM = regEx.pl.pm;
                        regExpDZ = regEx.pl.dz;
                        regExpMNPM = regEx.pl.mnpm;
                        let ll = regExpLL.exec(data.parse.wikitext);
                        let lld = regExpLLD.exec(data.parse.wikitext);
                        let p = regExpP.exec(data.parse.wikitext);
                        let pm = regExpPM.exec(data.parse.wikitext);
                        let dz = regExpDZ.exec(data.parse.wikitext);
                        let mnpm = regExpMNPM.exec(data.parse.wikitext);
                        // res[i].ll = (typeof res[i].ll === '') ? ll : res[i].ll;
                        llUsed = false;
                        if (ll !== null) {
                          if (ll[0].trim() !== '') {
                            if (res[i].ll === '') {
                              res[i].ll = formatPopulationCount(ll[1].trim());
                              llUsed = true;
                            }
                          }
                        }
                        lldUsed = false;
                        if (lld !== null) {
                          if (lld[0].trim() !== '') {
                            if (res[i].lld === '') {
                              res[i].lld = formatPopulationYear(lld[1]);
                              lldUsed = true;
                            }
                          }
                        }
                        pUsed = false;
                        if (p !== null) {
                          if (p[0].trim() !== '') {
                            if (res[i].p === '') {
                              res[i].p = p[1].trim();
                              pUsed = true;
                            }
                          }
                        }
                        pmUsed = false;
                        if (pm !== null) {
                          if (pm[0].trim() !== '') {
                            if (res[i].pm === '') {
                              res[i].pm = pm[1].trim();
                              pmUsed = true;
                            }
                          }
                        }
                        dzUsed = false;
                        if (dz !== null) {
                          if (dz[0].trim() !== '') {
                            if (res[i].dz === '') {
                              res[i].dz = dz[1].trim();
                              dzUsed = true;
                            }
                          }
                        }
                        mnpmUsed = false;
                        if (mnpm !== null) {
                          if (mnpm[0].trim() !== '') {
                            if (res[i].mnpm === '') {
                              res[i].mnpm = mnpm[1].trim();
                              mnpmUsed = true;
                            }
                          }
                        }
                        if (llUsed || lldUsed || pUsed || pmUsed || dzUsed || dzUsed || mnpmUsed) {
                          res[i].zrodlo += `, https://pl.wikipedia.org/wiki/${newLangName.replaceAll(' ', '_')}`;
                        }
                      });
                  }
                });
            }
          }
          // res[i].p = p;
        });
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

async function wikipediaLangLink(lang, query, newLang) {
  query = encodeURIComponent(query);
  return instance.get(`https://${lang}.wikipedia.org/w/api.php?action=query&format=json&prop=langlinks&titles=${query}&lllang=${newLang}`);
}

function formatPopulationCount(txt) {
  txt = txt.trim();
  txt = txt.replaceAll('&nbsp;', '');
  txt = txt.replaceAll(' ', '');
  txt = txt.replaceAll('ok.', '');
  txt = txt.replaceAll('ok', '');
  txt = txt.replaceAll('\\.', '');
  if (txt.includes('tys')) {
    txt = txt.replaceAll('tys', '');
    txt = txt.replaceAll(',', '.');
    txt = String(parseInt(txt * 1000));
  } 
  txt = txt.replaceAll('&', '');
  txt = txt.replaceAll('n', '');
  txt = txt.replaceAll('b', '');
  txt = txt.replaceAll('s', '');
  txt = txt.replaceAll('b', '');
  return txt;
}

function formatBasic(txt) {
  txt = txt.replaceAll('&', '');
  txt = txt.replaceAll('n', '');
  txt = txt.replaceAll('b', '');
  txt = txt.replaceAll('s', '');
  txt = txt.replaceAll('b', '');
  txt = txt.replaceAll(',', '');
  txt = txt.replaceAll(' ', '');
  txt = txt.replaceAll('\\.', ',');
  txt = txt.replaceAll(';', '');
  return txt;
}

function formatPopulationYear(txt) {
  txt = txt.trim();
  txt = (new RegExp('(\\d\\d\\d\\d)')).exec(txt);
  return txt[0];
}


const express = require('express')
const app = express()
const port = 3000


app.get('/', function (req, resp) {
  let str = '';
  let errorsCount = 0;
  for (let i = 0; i <= 1200; i++) {
    if (typeof res[i] === 'undefined') {
      str += ';;;;;;;;<br />';
      errorsCount++;
    } else {
    str += `${formatBasic(res[i].p)};${formatBasic(res[i].ll)};${formatBasic(res[i].lld)};${formatBasic(res[i].mnpm)};${formatBasic(res[i].dz)};${formatBasic(res[i].pm)};${res[i].zrodlo};;${res[i].f1}<br />`;
    }
  }
  console.log(`GET - ERR: ${errorsCount}`);
  resp.send(str)
})

app.listen(port, () => console.log(`App listening on port ${port}!`))