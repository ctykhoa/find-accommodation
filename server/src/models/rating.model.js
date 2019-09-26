/*
 * @Author: Khoayenn 
 * @Date: 2019-08-12 17:40:06 
 * @Last Modified by: Khoayenn
 * @Last Modified time: 2019-08-23 12:52:27
 */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const urljoin = require('url-join');
const User = require("./user.model");
const Post = require("./post.model");
const SCHEME = process.env.SCHEME;
const HOST = process.env.HOST;
const PORT = process.env.PORT;

const ratingSchema = new Schema({
    postId: {
        type: Schema.Types.ObjectId,
        ref: Post,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: User,
        required: true
    },
    star: {
        type: Number,
        required: true
    },
    images: [{
        type: String,
        trim: true,
        required: true
    }],
    review: {
        type: String
    }

}, {
    timestamps: true
});

function imagePaths(images) {
    let paths = [];
    for (let i = 0; i < images.length; i++) {
        paths[i] = urljoin(SCHEME + HOST + ":" + PORT, images[i])
    }
    return paths;
}

ratingSchema.methods.transform = function () {
    return {
        star: this.star,
        review: this.review,
        images: imagePaths(this.images)
    }
}

const Rating = mongoose.model("Rating", ratingSchema);

module.exports = Rating;