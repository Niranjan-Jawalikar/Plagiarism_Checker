const mongoose = require("mongoose");
const { Schema } = mongoose;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    username: String,
    password: String,
    urls: [{
        type: Schema.Types.ObjectId,
        ref: "URL"
    }]
})
userSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("User", userSchema);