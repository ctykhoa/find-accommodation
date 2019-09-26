/*
 * @Author: Khoayenn 
 * @Date: 2019-08-11 15:26:51 
 * @Last Modified by: Khoayenn
 * @Last Modified time: 2019-08-13 17:03:34
 */
const Boom = require("@hapi/boom");
const urljoin = require('url-join');
const isImage = require("is-image")
const User = require("../models/user.model");
const Rating = require("../models/rating.model");
const Post = require("../models/post.model");
const ValidToken = require("../models/validtoken.model");
const CustomResponse = require("../commons/response")
const CustomError = require("../commons/error")
const message = require("../constant").message

//admin su dung user la req.foundUser de xu li
//user du dung req.user (lay tu token) de xu li


async function deactivateUser(req, res, next) {
    try {
        const user = req.foundUser;
        if (user) {
            user.isActive = !user.isActive;
            await user.save()
            res.send(user)
        } else {
            throw new Error();
        }
    } catch (error) {
        next(error)
    }
}

async function removeUser(req, res, next) {
    try {
        const user = req.foundUser;
        if (user) {
            const deletedUser = await User.findOneAndDelete({
                _id: user._id
            });
            if (!deletedUser) {
                throw new Error();
            } else {

                //tim va xoa nhung token/post cua user do
                const deletedTokens = await ValidToken.deleteMany({
                    userId: user._id
                });
                const deletedPosts = await Post.deleteMany({
                    ownerId: user._id
                });
                const deletedRatings = await Rating.deleteMany({
                    userId: user._id
                });
                console.log("Deleted user: " + deletedUser.email);
                console.log(deletedPosts);
                console.log(deletedTokens);
                console.log(deletedRatings);
                new CustomResponse({
                    statusCode: 204,
                    result: message.accountSuccessDeleted
                }).return(res);
            }
        } else {
            throw new Error();
        }

    } catch (error) {
        next(error)
    }
}

module.exports = {
    deactivateUser,
    removeUser
}