const Joi = require("@hapi/joi");
const Boom = require("@hapi/boom");
const CustomError = require("../commons/error")
const constant = require("../constant");
const {joiMessage }= require("../constant");

const options =  {abortEarly: false
/*language: {
    key: '{{!label}} ',
    any: {
        required: joiMessage.required
    },
    string: {
        required: joiMessage.required,
        email: joiMessage.email,
        min: joiMessage.min,
        max: joiMessage.max,
        length: joiMessage.length,
        regex: joiMessage.regex
    }
}*/
};

const userSchema = Joi.object().keys({
  email: Joi.string().label("Email").email({
    minDomainSegments: 2
  }).trim().required(),
  password: Joi.string().label("Password").regex(/^[a-zA-Z0-9]{3,30}$/).required(),
  name: Joi.string().label("Name").min(1).max(50).required(),
  gender: Joi.string().label("Gender").valid(constant.gender),
  phoneNumber: Joi.string().label("Phone number").regex(/^[0-9]*$/).length(10).required()
});

const userUpdateSchema = Joi.object().keys({
  email: Joi.string().label("Email").email({
    minDomainSegments: 2
  }),
  password: Joi.string().label("Password").regex(/^[a-zA-Z0-9]{3,30}$/),
  name: Joi.string().label("Name").min(1).max(50),
  gender: Joi.string().label("Gender").valid(constant.gender),
  phoneNumber: Joi.string().label("Phone number jj").regex(/[0-9]+/).length(10)
});

function validate(req, res, next) {
    try {
        const validation = Joi.validate(req.body, userSchema, options);
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

function validateUpdate(req, res,next) {
    try {
        const validation = Joi.validate(req.body, userUpdateSchema, options);
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

module.exports = {
  validate,
  validateUpdate
}