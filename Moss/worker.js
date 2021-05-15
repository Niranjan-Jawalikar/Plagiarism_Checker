const { parentPort, workerData } = require("worker_threads");
const MossClient = require("moss-node-client");
const path = require("path");

const getGoogleLinks = async ({ language, comment, google, upload, index }) => {
    try {
        const client = new MossClient(language, "221511228");
        client.setComment(comment);
        client.addFile(upload.path, upload.description);
        client.addFile(google.path, google.description);
        const url = await client.process();
        parentPort.postMessage({ url, index, userFileName: upload.description });
        process.exit();
    }
    catch (e) {
        console.log(e);
    }


}

const getFileLink = async ({ language, comment, files, dirPathUploads }) => {
    try {
        const client = new MossClient(language, "221511228");
        client.setComment(comment);
        for (const file of files)
            client.addFile(`${dirPathUploads}/${file}`, `${file.match(/.+(?=((-\d+\.\w+)$))/g)[0]}${path.extname(file)}`)
        parentPort.postMessage(await client.process());
        process.exit();
    }
    catch (e) {
        console.log(e);
    }
}

if (workerData.getGoogleLinks)
    getGoogleLinks(workerData);
else
    getFileLink(workerData);