const mongoose = require("mongoose");
const { regexLinkValidation } = require("../utils/constants");

const movieSchema = new mongoose.Schema({
	kinopoiskId: {
		type: Number,
		required: true,
		unique: true,
	},
	country: {
		type: Array,
	},
	duration: {
		type: Number,
	},
	year: {
		type: String,
		required: true,
	},
	description: {
		type: String,
	},
	shortDescription: {
		type: String,
	},
	image: {
		type: String,
		validate: {
			validator: (v) => regexLinkValidation.test(v),
			message: (props) => `${props.value} - данная ссылка некорректна`,
		},
	},
	thumbnail: {
		type: String,
		validate: {
			validator: (v) => regexLinkValidation.test(v),
			message: (props) => `${props.value} - данная ссылка некорректна`,
		},
	},
	nameRU: {
		type: String,
		required: true,
	},
	nameEN: {
		type: String,
	},
	serial: {
		type: Boolean,
		required: true,
	},
	ratingKinopoisk: {
		type: Number,
		required: true,
	},
	genres: {
		type: Array,
		required: true,
	},
});

module.exports = mongoose.model("movie", movieSchema);
