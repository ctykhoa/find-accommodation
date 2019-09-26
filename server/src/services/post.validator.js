/*
 * @Author: Khoayenn 
 * @Date: 2019-08-23 16:22:18 
 * @Last Modified by: Khoayenn
 * @Last Modified time: 2019-08-23 16:26:10
 */
const Joi = require("@hapi/joi");
const Boom = require("@hapi/boom");
const CustomError = require("../commons/error");

const options = {
    abortEarly: false
};

const postSchema = Joi.object().keys({
    title: Joi.string().min(20).required(),
    width: Joi.number().min(0).required(),
    height: Joi.number().min(0).required(),
    mezzanine: Joi.boolean(),
    description: Joi.string(),
    price: Joi.number().required().min(0),
    address: Joi.string().required(),
    amount: Joi.number().min(0)
});

const postUpdateSchema = Joi.object().keys({
    title: Joi.string().min(20),
    width: Joi.number().min(0),
    height: Joi.number().min(0),
    mezzanine: Joi.boolean(),
    description: Joi.string(),
    price: Joi.number().min(0),
    address: Joi.string(),
    amount: Joi.number().min(0)
});

function validate(req, res, next) {
    try {
        const validation = Joi.validate(req.body, postSchema, options);
        if (validation.error) {
            const validationError = Boom.badData(validation.error).output;
            throw new CustomError({
                statusCode: validationError.statusCode,
                error: validationError.payload
            })
        }
        next();
    } catch (error) {
        error.error.message = error.error.message.replace(/\[/g, "").replace(/\]/g, "").replace(/\"/g, "'").replace(/child /g, "")
        next(error)
    }
}

function validateUpdate(req, res, next) {
    try {
        const validation = Joi.validate(req.body, postUpdateSchema, options);
        if (validation.error) {
            const validationError = Boom.badData(validation.error).output;
            throw new CustomError({
                statusCode: validationError.statusCode,
                error: validationError.payload
            })
        }
        next();
    } catch (error) {
        error.error.message = error.error.message.replace(/\[/g, "").replace(/\]/g, "").replace(/\"/g, "'").replace(/child /g, "")
        next(error)
    }
}

module.exports = {
    validate,
    validateUpdate
}