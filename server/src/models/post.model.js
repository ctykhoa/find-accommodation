/*
 * @Author: Khoayenn 
 * @Date: 2019-08-12 17:40:23 
 * @Last Modified by: Khoayenn
 * @Last Modified time: 2019-08-23 16:25:39
 */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const urljoin = require("url-join");
const User = require("./user.model");
const SCHEME = process.env.SCHEME;
const HOST = process.env.HOST;
const PORT = process.env.PORT;


const postSchema = new Schema({
    ownerId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    ownerContact: {
        type: String
    },
    ownerName: {
        type: String
    },
    title: {
        type: String,
        required: true
    },
    width: {
        type: Number,
        required: true
    },
    height: {
        type: Number,
        required: true
    },
    mezzanine: {
        type: Boolean,
        required: true,
        default: false
    },
    images: [{
        type: String,
        required: true
    }],
    price: {
        type: Number,
        min: 0,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true,
        default: 1
    },
    otherContacts: {
        type: String
    },
    description: {
        type: String
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    }

}, {
    timestamps: true
})

function imagePaths(images){
    let paths= [];
    for(let i = 0 ; i<images.length; i++){
        paths[i] = urljoin(SCHEME + HOST + ":" + PORT, images[i])
    }
    return paths;
}
postSchema.methods.transform = function () {
    return {
        title: this.title,
        owner: this.ownerName,
        ownerContact: this.ownerContact,
        roomId: this._id,
        width: this.width + "m",
        height: this.height + "m",
        mezzanine: this.mezzanine,
        images: imagePaths(this.images),
        price: this.price+ " VND",
        address: this.address,
        amount: this.amount + " room(s)",
        otherContacts: this.otherContacts,
        description: this.description,
        rating: this.rating,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt

    }
}


const Post = mongoose.model('Post', postSchema);
module.exports = Post