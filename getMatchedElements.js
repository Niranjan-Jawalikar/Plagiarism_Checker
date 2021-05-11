const axios = require("axios");
const cheerio = require("cheerio");
const { fetchMossUrl, client } = require("./Moss");
const puppeteer = require("puppeteer");

const getMatchedPercentage = ($) => {
    return new Promise((resolve, reject) => {
        if ($("table tbody tr:nth-of-type(2) td:first-of-type a")[0]) {

            const links = $("table tbody tr:nth-of-type(2) td a")
            resolve({
                percentage: links[0].children[0].data.match(/\d+%/g)[0],
                fileName: links[1].children[0].data.match(/.+(?=(\(\d*%\)))/g)[0].trimRight()
            });
        }
        reject(null);
    })

}

const getMatchedElements = async (foundURLObj, sourceArray) => {
    return new Promise(async (resolve, reject) => {
        let fileUrl;
        if (!foundURLObj.url) {
            url = await fetchMossUrl(client, foundURLObj);
            fileUrl = url[0][0];
            foundURLObj.url = url[0][0];
            const matchedPercentageArray = [];
            let arr = [];
            for (let i = 1; i < url.length; i++) {
                arr = [];
                for (sourceUrl of url[i]) {
                    const { data } = await axios.get(sourceUrl.url);
                    let $ = cheerio.load(data);
                    try {
                        arr.push({ ...await getMatchedPercentage($), userFileName: sourceUrl.userFileName });
                    }
                    catch (e) {
                        console.log(e);
                        continue;
                    }
                }
                if (arr.length > 0)
                    matchedPercentageArray.push(arr);
            }
            const maxMathcedPercentageObjArray = [];
            for (const matchedPercentage of matchedPercentageArray) {
                maxMathcedPercentageObjArray.push(matchedPercentage.reduce((acc, curr) => Math.max(acc.percentage.replace('%', ''), curr.percentage.replace('%', '')) === acc.percentage.replace('%', '') ? acc : curr));
            }
            const sourceObjArray = [];
            for (const maxMathcedPercentageObj of maxMathcedPercentageObjArray)
                sourceObjArray.push({ percentage: maxMathcedPercentageObj.percentage, url: sourceArray.find(el => el.fileName === maxMathcedPercentageObj.fileName).sourceUrl, userFileName: maxMathcedPercentageObj.userFileName });
            foundURLObj.sources.push(...sourceObjArray);
            await foundURLObj.save()
        }
        else
            fileUrl = foundURLObj.url;
        // "http://moss.stanford.edu/results/3/4901221730198/"
        const response = await axios.get(fileUrl);
        let $ = cheerio.load(response.data);
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        let textArr = [];
        let matchedObjects = [];
        let matchedPercentage = [];
        const comment = $("p:nth-of-type(3)").text();
        if ($("table tbody tr:nth-of-type(2) td:first-of-type a")[0]) {
            const detailsUrl = $("table tbody tr:nth-of-type(2) td:first-of-type a")[0].attribs.href;
            for (el of $("table tbody tr:nth-of-type(2) td a"))
                matchedPercentage.push({
                    percentage: el.children[0].data.match(/\d+%/g)[0],
                    fileName: el.children[0].data.match(/.+(?=(\(\d*%\)))/g)[0].trimRight()
                })
            await page.goto(detailsUrl);
            await page.waitForSelector("frameset");
            const frames = await page.frames().filter(frame => frame.name() === "0" || frame.name() === "1")
            for (frame of frames) {
                const content = await frame.content()
                $ = cheerio.load(content);
                const text = $("pre").text();
                textArr.push(text.split("\n").map(line => line.replace(/\s/g, "&nbsp;")));
                matchedObjects.push([...$("font")].map((font, i) => { return { color: font.attribs.color, text: font.children[1].data.split("\n").map(line => line.replace(/\s/g, "&nbsp;")) } }))

            }
            let a = 0; b = 0, count = 0;
            for (let i = 0; i < textArr.length; i++) {
                for (let k = 0; k < matchedObjects[i].length; k++) {
                    for (let j = 0; j < textArr[i].length; j++) {
                        let len = matchedObjects[i][k].text.length
                        if (a === 0 && b === 0)
                            b = len - 2
                        if (matchedObjects[i][k].text[a] === textArr[i][j] && matchedObjects[i][k].text[b] === textArr[i][j + b]) {
                            for (let n = 0; n < len - 1; n++) {
                                a++;
                                b--;
                                if (matchedObjects[i][k].text[a] === textArr[i][j + a] && matchedObjects[i][k].text[b] === textArr[i][j + b]) {
                                    if (a === b || a === b + 1) {
                                        matchedObjects[i][k].startIndex = j;
                                        matchedObjects[i][k].endIndex = j + matchedObjects[i][k].text.length - 2;
                                        a = 0; b = 0;
                                        break;
                                    }
                                    continue;

                                }
                                else {
                                    a = 0; b = 0;
                                    break;

                                }
                            }
                        }

                    }
                    a = 0; b = 0;
                }
            }
            resolve({ textArr, matchedPercentage, matchedObjects, match: true, comment, sources: foundURLObj.sources });
        }
        reject({ match: false, comment, sources: foundURLObj.sources });
    })
}

module.exports = getMatchedElements