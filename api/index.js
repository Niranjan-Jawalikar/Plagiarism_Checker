const axios = require("axios");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const dirPath = path.join(__dirname, "..", "google");

const getText = async (page, cssSelector) => {
    return new Promise(async (resolve, reject) => {
        await page.waitForSelector(cssSelector);
        try {
            const code = await page.$$eval(cssSelector, elements => elements.map(el => el.innerText));
            resolve(code);
        }
        catch (e) {
            reject(e);
        }
    })
}

const getExtensionAndName = (language) => {
    switch (language) {
        case "c":
            return {
                extension: ".c",
                name: "C"
            }
        case "cc":
            return {
                extension: ".cpp",
                name: "C++"
            }
        case "java":
            return {
                extension: ".java",
                name: "Java"
            }
        case "python":
            return {
                extension: ".py",
                name: "Python3"
            }
        case "javascript":
            return {
                extension: ".js",
                name: "Javascript"
            }
        case "csharp":
            return {
                extension: ".cs",
                name: "C#"
            }
    }
}

const getSource = async (searchTerm, language) => {
    return new Promise(async (resolve, reject) => {
        const sourceArray = [];
        try {
            const { data } = await axios.get(`https://www.googleapis.com/customsearch/v1?key=AIzaSyD3fJCcq8cFglnxF7kZTQ5hY46eL5FL8iQ&cx=bf86f70809529d285&q=${encodeURIComponent(searchTerm)}`);
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            let code;
            for (item of data.items) {
                // const myPage = await axios.get("https://www.geeksforgeeks.org/c-program-to-check-whether-a-number-is-prime-or-not/");
                // let $ = cheerio.load(myPage.data);
                // const code = $(".code-container code:not(.comments)").text();
                await page.goto(item.link);
                if (item.displayLink === "www.programiz.com") {
                    code = await getText(page, "code.hljs");
                }
                else if (item.displayLink === "www.tutorialspoint.com") {
                    code = await getText(page, ".prettyprint")
                }
                else if (item.displayLink === "www.geeksforgeeks.org") {
                    const buttons = await page.$$("div.responsive-tabs-wrapper li.responsive-tabs__list__item");
                    for (button of buttons) {
                        const buttonText = await page.evaluate(el => el.textContent, button);
                        if (buttonText === getExtensionAndName(language).name) //change class name acc to input
                            await button.click();
                    }
                    const cssSelector = await page.evaluate(async () => document.querySelectorAll("div.responsive-tabs__panel--active").length > 0 ? "div.responsive-tabs__panel--active" : "div.code-container")
                    code = await getText(page, cssSelector);
                }
                else if (item.displayLink === "www.javatpoint.com") {
                    code = await getText(page, ".codeblock");
                }
                // console.log(code);
                for (const [index, value] of code.entries()) {
                    const fileName = `${dirPath}/${item.cacheId}${index}${getExtensionAndName(language).extension}`;
                    fs.writeFileSync(fileName, value, { flag: "w+" });
                    sourceArray.push({ fileName: `${item.cacheId}${index}${getExtensionAndName(language).extension}`, sourceUrl: item.link });
                }
                break;
            }
            browser.close();
            resolve(sourceArray);
        }
        catch (e) {
            reject(e);
        }
    })

}

module.exports = getSource;