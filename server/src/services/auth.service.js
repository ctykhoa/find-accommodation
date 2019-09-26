const jwt = require("jsonwebtoken");
const User = require("../models/user.model")
const CustomError = require("../commons/error")
const Boom = require("@hapi/boom")
const ValidToken = require("../models/validtoken.model")
const message = require("../constant").message
const role = require("../constant").role
const PRIVATE_KEY = process.env.PRIVATE_KEY;

function createToken(id, email, role) {
    const payload = {
        id: id,
        email: email,
        role: role
    };
    if (role === role[1]) {
        return jwt.sign(payload, PRIVATE_KEY);
    }
    const options = {
        expiresIn: "72h"
    }
    return jwt.sign(payload, PRIVATE_KEY, options);
}
async function isAdmin(req, res, next) {
    try {
        const token = req.headers.authorization;
        const validToken = await ValidToken.findOne({
            token: token
        });
        if (!validToken) {
            const invalidToken = Boom.unauthorized(message.invalidToken).output;
            throw new CustomError({
                statusCode: invalidToken.statusCode,
                error: invalidToken.payload
            })
        }
        const decodedPayload = await jwt.verify(token, PRIVATE_KEY, function (err, payload) {
            if (err) {
                const invalidToken = Boom.unauthorized(message.invalidToken).output;
                throw new CustomError({
                    statusCode: invalidToken.statusCode,
                    error: invalidToken.payload
                })
            } else {
                const {
                    id,
                    email,
                    role: userRole
                } = payload;
                ``
                if (userRole === role[1]) {
                    return next();
                } else {
                    const forbidden = Boom.forbidden(message.noRight).output;
                    throw new CustomError({
                        statusCode: forbidden.statusCode,
                        error: forbidden.payload
                    })
                }
            }
        })
    } catch (error) {
        next(error)
    }

}

async function checkAuth(req, res, next) {
    try {
        const token = req.headers.authorization;
        const validToken = await ValidToken.findOne({
            token: token
        });
        if (!validToken) {
            const invalidToken = Boom.unauthorized(message.invalidToken).output;
            throw new CustomError({
                statusCode: invalidToken.statusCode,
                error: invalidToken.payload
            })
        }

        /* Su dung callback function*/
        const decodedPayload = await jwt.verify(token, PRIVATE_KEY, async function (err, payload) {
            if (err) {
                const invalidToken = Boom.unauthorized(message.invalidToken).output;
                throw new CustomError({
                    statusCode: invalidToken.statusCode,
                    error: invalidToken.payload
                })
            } else {
                const { id, email, role } = payload;
                req.user = { id, role, email }; // luu thong tin user lay tu token

                const user = await User.findOne({ _id: id });
                if (!user) {
                    const userNotFound = Boom.notFound(message.userNotFound);
                    throw new CustomError({
                        statusCode: userNotFound.statusCode,
                        error: userNotFound.payload
                    })
                } else if (user) {
                    if (user.isActive && user.isVerified) {
                        return next();
                    }
                }

                const forbidden = Boom.forbidden(message.deactiveAccount).output;
                throw new CustomError({
                    statusCode: forbidden.statusCode,
                    error: forbidden.payload
                })
            }
        });
    } catch (error) {
        next(error)
    }
}



module.exports = {
    createToken,
    checkAuth,
    isAdmin
};