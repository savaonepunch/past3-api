const Joi = require('joi');

const registerValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string().alphanum().min(3).max(30).required(),

        password: Joi.string().min(6).required(),

        email: Joi.string().min(3).required().email(),
    });

    return schema.validate(data);
};

const loginValidation = (data) => {
    const schema = Joi.object({

        password: Joi.string().min(6).required(),

        email: Joi.string().min(3).required().email(),
    });

    return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;