const Joi = require("@hapi/joi");
const Boom = require("@hapi/boom");
const CustomError = require("../commons/error")
const constant = require("../constant");
const {joiMessage }= require("../constant");

const options =  {abortEarly: false};

const changePasswordSchema = Joi.object().keys({
  email: Joi.string().label("Email").email({
    minDomainSegments: 2
  }).trim().required(),
  newPassword: Joi.string().label("New password").regex(/^[a-zA-Z0-9]{3,30}$/).required(),
  code: Joi.string().label("Name").min(7).max(7).required()
});

function resetPasswordValidate(req, res, next) {
    try {
        const validation = Joi.validate(req.body, changePasswordSchema, options);
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

module.exports = {
  resetPasswordValidate
}