/*
 * @Author: Khoayenn 
 * @Date: 2019-08-11 15:26:38 
 * @Last Modified by: Khoayenn
 * @Last Modified time: 2019-08-24 11:24:51
 */
const User = require("../models/user.model");
const Boom = require("@hapi/boom");
const authService = require("../services/auth.service");
const ValidToken = require("../models/validtoken.model");
const CustomResponse = require("../commons/response");
const CustomError = require("../commons/error");
const message = require("../constant").message;

async function login(req, res, next) {
    try {
        const {
            email,
            password
        } = req.body;
        const foundUser = await User.findOne({
            email: email
        });
        if (foundUser) {
            if (foundUser.comparePassword(password)) {
                console.log("auth :   " + foundUser._id + foundUser.email + foundUser.role)
                const token= authService.createToken(foundUser._id, foundUser.email, foundUser.role)
                const newToken = new ValidToken({userId: foundUser._id, token: token});
                await newToken.save();
                new CustomResponse({
                    statusCode: 200,
                    result: {
                        name: foundUser.name,
                        token: token
                    }
                }).return(res);
            } else {
                const unauthorizedError =Boom.unauthorized(message.wrongPassword).output
                throw new CustomError({
                    statusCode: unauthorizedError.statusCode,
                    error: unauthorizedError.payload
                });
            }
        } else {
            const userNotFound = Boom.notFound(message.userNotFound).output
            throw new CustomError({
                statusCode: userNotFound.statusCode,
                error: userNotFound.payload
            })
        };
    } catch (err) {
        next(err)
    }
}

async function logout(req, res, next) {
    try {
        // const token = new InvalidToken({token: req.headers.authorization});
        // await token.save();
        await ValidToken.findOneAndDelete({token: req.headers.authorization})
        new CustomResponse({
            statusCode: 200,
            result: message.successfullyLogout
        }).return(res);
    } catch (err) {
        next(err);
    }
}

async function destroyAllToken(req, res, next) {
    try {
        const userId = req.user.id;
        await ValidToken.deleteMany({userId: userId})
        new CustomResponse({
            statusCode: 200,
            result: message.removeTokens
        }).return(res);
    } catch (err) {
        next(err);
    }
}

module.exports = {
    login,
    logout,
    destroyAllToken
};