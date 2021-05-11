const mongoose = require("mongoose");
const { Schema } = mongoose;

const urlSchema = new Schema({
    url: {
        type: String,
        set: el => el.trimRight()
    },
    language: String,
    comment: String,
    searchTerm: String,
    sources: [{
        url: String,
        percentage: String,
        userFileName: String
    }],
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }

})

module.exports = mongoose.model("URL", urlSchema);