/*
 * @Author: Khoayenn 
 * @Date: 2019-08-12 17:57:06 
 * @Last Modified by: Khoayenn
 * @Last Modified time: 2019-08-24 01:53:47
 */
const Rating = require("../models/rating.model");
const Boom = require("@hapi/boom");
const CustomResponse = require("../commons/response")
const CustomError = require("../commons/error");
const message = require("../constant").message
const role = require("../constant").role
const { paginate } = require("../services/pagination")
const ratingOption = require("../constant").rating;
const { getPhotoPath } = require("../services/upload");

async function findRating(req, res, next, id) {
    try {
        const foundRating = await Rating.findOne({
            _id: id
        });
        if (foundRating) {
            req.rating = foundRating;
            next();
        } else {
            const ratingNotFound = Boom.notFound(message.ratingNotFound).output;
            throw new CustomError({
                statusCode: ratingNotFound.statusCode,
                error: ratingNotFound.payload
            })
        }
    } catch (error) {
        next(error)
    }
}
async function getRatings(req, res, next) {
    try {
        const {
            pageIndex,
            order,
            sortBy
        } = req.query;
        let sortOption = {
            updatedAt: -1
        };
        let query = {};
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
        const ratings = await paginate(Rating, query, ratingOption.perPage, pageIndex, sortOption)

        for (let i = 0; i < ratings.docs.length; i++) {
            ratings.docs[i] = ratings.docs[i].transform();
        }
        new CustomResponse({
            statusCode: 200,
            result: ratings
        }).return(res)

    } catch (error) {
        next(error)
    }
}

async function createRating(req, res, next) {
    try {
        req.body.userId = req.user.id;
        req.body.postId = req.post._id;
        req.body.images = await getPhotoPath(req);
        if(req.body.images){
            if (req.body.images.length === 0) {
                const noChosenFileError = Boom.badData(message.noFileChosen).output;
                throw new CustomError({
                    statusCode: noChosenFileError.statusCode,
                    error: noChosenFileError.payload
                });
            }
        }
        else{
            const noChosenFileError = Boom.badData(message.noFileChosen).output;
                throw new CustomError({
                    statusCode: noChosenFileError.statusCode,
                    error: noChosenFileError.payload
                });
        }
        const newRating = new Rating(req.body);
        const savedRating = await newRating.save();

        const ratingNumber = await Rating.find({
            postId: savedRating.postId
        }).countDocuments();

        if (ratingNumber === 1) {
            req.post.rating = savedRating.star;
            await req.post.save();
        }
        else{
            const ratingList = await Rating.find({
                postId: savedRating.postId
            });
            let sumRating=0
            for(let i=0; i < ratingList.length; i++){
                sumRating += ratingList[i].star;
            }
            req.post.rating = sumRating/ratingList.length;
            await req.post.save();

        }
        new CustomResponse({
            statusCode: 200,
            result: newRating.transform()
        }).return(res);

    } catch (error) {
        next(error)
    }
}

async function updateRating(req, res, next) {
    try {

        if (req.user.id != req.rating.userId) {
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

        const updatedRating = await Rating.findByIdAndUpdate({
            _id: req.rating._id
        }, req.body, {
            new: true
        });
        new CustomResponse({
            statusCode: 200,
            result: updatedRating.transform()
        }).return(res)

    } catch (error) {
        next(error)
    }
}

async function removeRating(req, res, next) {
    try {
        if (req.user.id == req.rating.userId || req.user.role === role[1]) {
            await Rating.findOneAndDelete({
                _id: req.rating._id
            });
            new CustomResponse({
                statusCode: 204,
                result: message.ratingSuccessfullyDeleted
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
    findRating,
    getRatings,
    createRating,
    updateRating,
    removeRating
}