const fs = require("fs");
const path = require("path");
const dirPathUploads = path.join(__dirname, "..", "uploads")
const dirPathGoogle = path.join(__dirname, "..", "google");
const fse = require("fs-extra");
const { Worker } = require("worker_threads");


const getAllDirFiles = function (dirPath, arrayOfFiles) {
    files = fs.readdirSync(dirPath)

    arrayOfFiles = arrayOfFiles || []

    files.forEach(function (file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllDirFiles(dirPath + "/" + file, arrayOfFiles)
        } else {
            arrayOfFiles.push(file)
        }
    })

    return arrayOfFiles
}


const getUrls = (language, comment) => {
    return new Promise((resolve, reject) => {
        let arr = [];
        const uploadLength = getAllDirFiles(dirPathUploads).length;
        const googleLength = getAllDirFiles(dirPathGoogle).length;
        for (let i = 0; i <= uploadLength; i++)
            arr.push([]);
        const worker = new Worker(`${__dirname}/worker.js`, { workerData: { language, comment, files: getAllDirFiles(dirPathUploads), getGoogleLinks: false, dirPathUploads } })
        worker.once("message", url => arr[0].push(url))
        let workerCount = 0;
        for (const [index, file] of getAllDirFiles(dirPathUploads).entries()) {
            for (fileOfGoogle of getAllDirFiles(dirPathGoogle)) {
                const worker = new Worker(`${__dirname}/worker.js`, { workerData: { language, comment, upload: { path: `${dirPathUploads}/${file}`, description: `${file.match(/.+(?=((-\d+\.\w+)$))/g)[0]}${path.extname(file)}` }, google: { path: `${dirPathGoogle}/${fileOfGoogle}`, description: `${fileOfGoogle}` }, index, getGoogleLinks: true } });
                worker.once("message", ({ url, index, userFileName }) => {
                    workerCount++;
                    arr[index + 1].push({ url, userFileName });
                    let flag = true;
                    for (let i = 1; i <= uploadLength; i++) {
                        if (arr[i].length !== googleLength) {
                            flag = false;
                            break;
                        }
                    }
                    if (flag && arr[0].length > 0)
                        resolve(arr);
                    else if (workerCount === googleLength * uploadLength || !url)
                        reject(null);

                })
            }


        }
    })

}

const fetchMossUrl = async ({ language, comment }) => {
    let urls;
    try {
        urls = await getUrls(language, comment);
    }
    catch (e) {
        console.log(e);
        urls = null;
    }
    fse.emptyDirSync(dirPathUploads);
    fse.emptyDirSync(dirPathGoogle);
    return urls;
}



module.exports = { fetchMossUrl };