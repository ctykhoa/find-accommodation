/*
 * @Author: Khoayenn 
 * @Date: 2019-08-13 12:09:36 
 * @Last Modified by: Khoayenn
 * @Last Modified time: 2019-08-23 12:32:10
 */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const urljoin = require("url-join");
const constant = require("../constant");
const Post = require("./post.model")
const InvalidToken = require("./validtoken.model")
const SCHEME = process.env.SCHEME;
const HOST = process.env.HOST;
const PORT = process.env.PORT;


const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    phoneNumber: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        trim: true
    },
    gender: {
        type: String,
        enum: constant.gender
    },
    personalCode: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        default: "user",
        enum: constant.role,
        required: true
    }

}, {
    timestamps: true
});

userSchema.pre("save", function (next) {
    if (this.isModified("password") || this.isNew) {
        this.password = this.hashPassword();
    }
    return next();
});

userSchema.methods.hashPassword = function () {
    return bcrypt.hashSync(this.password, 10);
};

userSchema.methods.avatarURI =function(){
    if(this.avatar){
        return urljoin(SCHEME + HOST + ":" + PORT, this.avatar);
    }
    else return;
}
userSchema.methods.transform = function () {
    return {
        name: this.name,
        avatar: this.avatarURI(),
        gender: this.gender,
        email: this.email,
        active: this.isActive,
        verified: this.isVerified
    }
}

userSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

const user = mongoose.model("user", userSchema);
module.exports = user;