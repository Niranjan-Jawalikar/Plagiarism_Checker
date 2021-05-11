const MossClient = require("moss-node-client");
let client;
const fs = require("fs");
const path = require("path");
const dirPathUploads = path.join(__dirname, "..", "uploads")
const dirPathGoogle = path.join(__dirname, "..", "google");
const fse = require("fs-extra");


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

const processMossClient = async (client) => {
    return new Promise(async (resolve, reject) => {
        try {
            const url = await client.process();
            resolve(url);
        }
        catch (e) {
            console.log(e);
            reject(e);
        }
    })

}

const fetchMossUrl = async (client, { language, comment }) => {
    const urlArray = [];
    client = new MossClient(language, "221511228");
    client.setComment(comment);
    getAllDirFiles(dirPathUploads).forEach(file => {
        client.addFile(`${dirPathUploads}/${file}`, `${file.match(/.+(?=((-\d+\.\w+)$))/g)[0]}${path.extname(file)}`)//description without space
    });
    urlArray.push([await processMossClient(client)]);
    let arr = [];
    for (file of getAllDirFiles(dirPathUploads)) {
        arr = [];
        for (fileOfGoogle of getAllDirFiles(dirPathGoogle)) {
            client = new MossClient(language, "221511228");
            client.setComment(comment);
            client.addFile(`${dirPathUploads}/${file}`, `${file.match(/.+(?=((-\d+\.\w+)$))/g)[0]}${path.extname(file)}`);
            client.addFile(`${dirPathGoogle}/${fileOfGoogle}`, `${fileOfGoogle}`)
            arr.push({ url: await processMossClient(client), userFileName: `${file.match(/.+(?=((-\d+\.\w+)$))/g)[0]}${path.extname(file)}` });
        }
        urlArray.push(arr);
    }
    fse.emptyDirSync(dirPathUploads);
    fse.emptyDirSync(dirPathGoogle);
    return urlArray;

}



module.exports = { fetchMossUrl, client };