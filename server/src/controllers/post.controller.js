/*
 * @Author: Khoayenn 
 * @Date: 2019-08-13 10:58:25 
 * @Last Modified by: Khoayenn
 * @Last Modified time: 2019-08-24 01:34:41
 */
/*
 * @Author: Khoayenn 
 * @Date: 2019-08-11 15:24:49 
 * @Last Modified by: Khoayenn
 * @Last Modified time: 2019-08-13 10:58:12
 */
const Boom = require("@hapi/boom");
const isImage = require("is-image")
const urljoin = require('url-join');
const constant = require("../constant");
const Post = require("../models/post.model");
const User = require("../models/user.model")
const Rating = require("../models/rating.model")
const message = require("../constant").message;
const role = require("../constant").role;
const postOption = require("../constant").post;
const CustomResponse = require("../commons/response")
const CustomError = require("../commons/error")
const {
    paginate
} = require("../services/pagination")
const {
    getPhotoPath
} = require("../services/upload");
const SCHEME = process.env.SCHEME;
const HOST = process.env.HOST;
const PORT = process.env.PORT;


async function findPost(req, res, next, id) {
    try {
        const postId = id;
        const foundPost = await Post.findOne({
            _id: postId
        });
        if (foundPost) {
            req.post = foundPost;
            next();
        } else {
            const postNotFound = Boom.notFound(message.postNotFound).output;
            throw new CustomError({
                statusCode: postNotFound.statusCode,
                error: postNotFound.payload
            })
        }
    } catch (error) {
        next(error);
    }
}
async function createPost(req, res, next) {
    try {
        req.body.ownerId = req.user.id;
        const author = await User.findOne({
            _id: req.body.ownerId
        });
        // console.log(await getPhotoPath(req)) /// get error
        req.body.images = await getPhotoPath(req);
        console.log(req.body.images)
        if (req.body.images) {
            if (req.body.images.length > 0) {
                req.body.ownerName = author.name;
                req.body.ownerContact = author.phoneNumber;
                const newPost = new Post(req.body);
                const savedPost = await newPost.save();

                return new CustomResponse({
                    statusCode: 200,
                    result: newPost.transform()
                }).return(res);
            }
        } 
        const noChosenFileError = Boom.badData(message.noFileChosen).output;
        throw new CustomError({
            statusCode: noChosenFileError.statusCode,
            error: noChosenFileError.payload
        });
    } catch (error) {
        next(error)
    }
}

async function getPosts(req, res, next) {
    try {
        const {
            keyword,
            pageIndex,
            order,
            sortBy,
            maxPrice,
            minPrice
        } = req.query;
        let sortOption = {
            updatedAt: -1
        };
        let query = {};
        if (keyword) {
            query = {
                $or: [{
                    title: {
                        $regex: keyword,
                        $options: 'i'
                    }
                }, {
                    address: {
                        $regex: keyword,
                        $options: 'i'
                    }
                }]
            }

        }
        if (minPrice) {
            query.price = {
                $gte: minPrice
            }
            if (maxPrice) {
                query.price = {
                    $gte: minPrice,
                    $lte: maxPrice
                }
            }
        } else if (maxPrice) {
            query.price = {
                $lte: maxPrice
            }
        }

        if (sortBy) {
            if (order == 1 || order == -1) {
                sortOption = {
                    [sortBy]: order
                };
            } else {
                sortOption = {
                    [sortBy]: -1
                }
            }
        }

        const posts = await paginate(Post, query, postOption.perPage, pageIndex, sortOption)

        for (let i = 0; i < posts.docs.length; i++) {
            posts.docs[i] = posts.docs[i].transform();
        }
        new CustomResponse({
            statusCode: 200,
            result: posts
        }).return(res)

    } catch (error) {
        next(error)
    }
}

async function getPost(req, res, next) {
    try {
        const post = req.post;
        if (post) {
            new CustomResponse({
                statusCode: 200,
                result: post.transform()
            }).return(res)
        }

    } catch (error) {
        next(error)
    }
}

async function updatePost(req, res, next) {
    try {
        const post = req.post;

        if (req.user.id != post.ownerId) {
            const forbiddenError = Boom.forbidden(message.noRight).output;
            throw new CustomError({
                statusCode: forbiddenError.statusCode,
                error: forbiddenError.payload
            })
        }

        if (req.files) {
            if (req.files.length > 0) {
                req.body.images = await getPhotoPath(req);
            }
        }

        const updatedPost = await Post.findOneAndUpdate({
            _id: post._id
        }, req.body, {
            new: true
        });
        new CustomResponse({
            statusCode: 200,
            result: updatedPost.transform()
        }).return(res)

    } catch (error) {
        next(error)
    }
}

async function removePost(req, res, next) {
    try {
        const post = req.post;
        const postOwner = post.ownerId;

        if (req.user.id == postOwner || req.user.role === role[1]) {
            await Post.findOneAndDelete({
                _id: post._id
            });
            await Rating.deleteMany({
                postId: post._id
            });
            new CustomResponse({
                statusCode: 204,
                result: message.postSuccessfullyDeleted
            }).return(res)
        } else {
            const forbiddenError = Boom.forbidden(message.noRight).output;
            throw new CustomError({
                statusCode: forbiddenError.statusCode,
                error: forbiddenError.payload
            })
        }
    } catch (error) {
        next(error)
    }
}
module.exports = {
    createPost,
    getPost,
    getPosts,
    updatePost,
    removePost,
    findPost
}