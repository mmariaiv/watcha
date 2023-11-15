const { celebrate, Joi } = require("celebrate");

module.exports.changePasswordValidation = celebrate({
	body: Joi.object().keys({
		password: Joi.string().required().min(8),
	}),
});
