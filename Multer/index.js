const multer = require("multer");
const path = require("path");


const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, callback) => {
        callback(null, `${file.originalname.match(/\S+(?=(\.\w+)$)/gm)[0]}-${Date.now()}${path.extname(file.originalname)}`)
    }
})

const fileFilter = (req, file, callback) => {
    if (path.extname(file.originalname) !== `.${req.body.language}`) {
        req.fileValidationError = "Invalid File Extension";
        return callback(new Error("Invalid File Extension"), false)
    }
    callback(null, true);
}

module.exports = multer({ storage, fileFilter }).array("files", 10);