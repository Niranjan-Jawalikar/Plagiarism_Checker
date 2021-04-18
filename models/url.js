const mongoose = require("mongoose");
const { Schema } = mongoose;

const urlSchema = new Schema({
    url: {
        type: String,
        set: el => el.trimRight()
    },
    language: String,
    comment: String,
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }

})

module.exports = mongoose.model("URL", urlSchema);