const { celebrate, Joi } = require("celebrate");

module.exports.getSpecialListValidation = celebrate({
	query: Joi.object({
		genres: Joi.string().optional(),
		serial: Joi.boolean().optional(),
		ratingKinopoisk: Joi.number().optional().min(0).max(10),
		country: Joi.string().optional(),
		year: Joi.number().optional(),
		ageRating: Joi.number().optional(),
	}),
});
