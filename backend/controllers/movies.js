const Movie = require("../models/movies");
const NotFoundError = require("../errors/notFoundError");
const ValidationError = require("../errors/validationError");
const ForbiddenAccessError = require("../errors/forbiddenAccessError");
const { query } = require("express");

module.exports.getRandomMovies = (req, res, next) => {
	Movie.aggregate([{ $sample: { size: req.params.count } }])
		.then((movies) => {
			if (!movies) {
				throw new NotFoundError("Возникла ошибка с поиском списка");
			} else {
				console.log(movies.length);
				res.send({ data: movies });
			}
		})
		.catch((err) => {
			if (err.name === "CastError") {
				next(new ValidationError("Передан фильм с некорректным id"));
			} else {
				next(err);
			}
		})
		.catch((err) => {
			console.log(err, "ошибка с базой");
			next(err);
		});
};

module.exports.getSpecialList = (req, res, next) => {
	const queryParams = req.query;
	const genresKeyName = `genres.name`;
	const countryKeyName = `country.name`;

	const matchStage = {
		$match: {
		},
		$sample: { size: 20 }
	}

	if (queryParams.country) {
		const countryList = queryParams.country.split(",");
		countryList.forEach((country) => {
			matchStage.$match[countryKeyName] = country;
		})
		delete queryParams.country;
}

	if (queryParams.genres) {
		const genresList = queryParams.genres.split(",");
		genresList.forEach((genre) => {
			matchStage.$match[genresKeyName] = genre;
		})
		delete queryParams.genres;
	}

	Object.assign(matchStage.$match, queryParams);

	const resultArray = Object.keys(matchStage).map((key) => ({
		[key]: matchStage[key],
	}));
	Movie.aggregate( resultArray ).then((result) => {
		res.send({ message: result });
	})
		.catch((err) => {
			console.log(err);
			next(err);
	})
};


