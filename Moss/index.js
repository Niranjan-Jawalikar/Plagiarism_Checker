const MossClient = require("moss-node-client");
let client;
const fs = require("fs");
const path = require("path");
const dirPath = path.join(__dirname, "..", "uploads")
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

const fetchMossUrl = async (client, { language, comment }) => {
    client = new MossClient(language, "221511228");
    client.setComment(comment);
    getAllDirFiles(dirPath).forEach(file => {
        client.addFile(`${dirPath}/${file}`, `${file.match(/.+(?=((-\d+\.\w+)$))/g)[0]}${path.extname(file)}`)//description without space
    });

    try {
        const url = await client.process();
        return url;
    }
    catch (e) {
        console.log(e);
    }
    finally {
        fse.emptyDirSync(dirPath)
    }
}



module.exports = { fetchMossUrl, client };