const {celebrate, Joi} = require("celebrate");
const {regexObjectId} = require("../constants");

module.exports.addMovieToFavouriteValidation = celebrate({
    body: Joi.object().keys({
        movieId: Joi.string().regex(regexObjectId).required(),
    }),
});
