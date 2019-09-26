const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const User = require("./user.model");

const validTokenSchema = new Schema({
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    token: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})


const validToken = mongoose.model("validToken", validTokenSchema);
module.exports = validToken;