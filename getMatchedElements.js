const axios = require("axios");
const cheerio = require("cheerio");
const { fetchMossUrl, client } = require("./Moss");
const puppeteer = require("puppeteer");

const getMatchedElements = async (foundURL) => {
    return new Promise(async (resolve, reject) => {
        // const url = await fetchMossUrl(client, foundURL);
        // foundURL.url = url;
        // await foundURL.save()
        // "http://moss.stanford.edu/results/3/4901221730198/"
        const response = await axios.get("http://moss.stanford.edu/results/3/4901221730198/");
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
                    percentage: el.children[0].data.match(/\d+%/g),
                    fileName: el.children[0].data.match(/.+(?=(\(\d*%\)))/g)
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
            resolve({ textArr, matchedPercentage, matchedObjects, match: true, comment })
        }
        reject({ match: false, comment })
    })
}

module.exports = getMatchedElements