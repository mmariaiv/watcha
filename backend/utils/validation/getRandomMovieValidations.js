const { celebrate, Joi } = require("celebrate");

module.exports.getRandomMovieValidation = celebrate({
	params: {
		count: Joi.number().required(),
	},
});
