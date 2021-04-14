const mongoose = require("mongoose");
const { Schema } = mongoose;

const URLSchema = new Schema({
    url: {
        type: String,
    },
    language: String,
    comment: String

})

module.exports = mongoose.model("URL", URLSchema);