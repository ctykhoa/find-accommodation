const Joi = require("@hapi/joi");
Joi.objectId = require('joi-objectid')(Joi);
const Boom = require("@hapi/boom");
const CustomError = require("../commons/error")
const constant = require("../constant");

const options = {abortEarly: false};

const ratingSchema = Joi.object().keys({
    star: Joi.number().min(0).max(5).required(),
    review: Joi.string().required()

});

const ratingUpdateSchema = Joi.object().keys({
    star: Joi.number().min(0).max(5),
    review: Joi.string()
});

function validate(req, res, next){
    try {
        const validation = Joi.validate(req.body, ratingSchema, options);
        if (validation.error) {
            const validationError =  Boom.badData(validation.error).output;
            throw new CustomError({
                statusCode: validationError.statusCode,
                error: validationError.payload
            })
        }
        next();                                 
    } catch (error) {
        error.error.message= error.error.message.replace(/\[/g, "").replace(/\]/g, "").replace(/\"/g, "'").replace(/child /g, "")
        next(error)
    }
}

function validateUpdate(req, res, next){
    try {
        const validation = Joi.validate(req.body, ratingUpdateSchema, options);
        if (validation.error) {
            const validationError = Boom.badData(validation.error).output;
            throw new CustomError({
                statusCode: validationError.statusCode,
                error: validationError.payload
            })
        }
        next();                                 
    } catch (error) {
        error.error.message= error.error.message.replace(/\[/g, "").replace(/\]/g, "").replace(/\"/g, "'").replace(/child /g, "")
        next(error)
    }
}

module.exports = { validate , validateUpdate}