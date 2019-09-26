const Boom = require("@hapi/boom");
const CustomError = require("./error");
const message = require("../constant").message;

function validateId(req, res, next, id) {
    try {
        if (!id.match(/^[0-9a-fA-F]{24}$/)) { //invalid Object Id
            const invalidId = Boom.badRequest(message.invalidObjectId).output;
            throw new CustomError({statusCode:  invalidId.statusCode, error: invalidId.payload})
        }
        else{
            next();
        }
    } catch (error) {
        const invalidId = Boom.badRequest(message.invalidObjectId).output;
        throw new CustomError({statusCode:  invalidId.statusCode, error: invalidId.payload})
    }
}

module.exports = {
    validateId
}