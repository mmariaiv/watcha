const Movie = require("../models/movies");
const NotFoundError = require("../errors/notFoundError");
const ValidationError = require("../errors/validationError");
const ForbiddenAccessError = require("../errors/forbiddenAccessError");
const axios = require("axios");
const { urlList } = require("../utils/constants");
const { KINO_TOKEN } = process.env;

const fetchDataFromKinopoisk = async (params) => {
	try {
		const response = await axios.get(
			`https://api.kinopoisk.dev/v1.4/movie?${params}`,
			{
				headers: {
					"x-api-key": KINO_TOKEN,
				},
			}
		);
		return response.data;
	} catch (err) {
		console.log(err, "проблема с внешним запросом");
		throw err;
	}
};

const fetchAndSavePeriodically = async () => {
	while (true) {
		console.log("fetchAndSave");
		try {
			urlList.forEach(async (url) => {
				console.log(url);
				const data = await fetchDataFromKinopoisk(url);
				Array.from(data.docs).map((movie) => {
					const existingMovie = Movie.findOne({ kinopoiskId: movie.id });

					if (existingMovie) {
						console.log("movie already exists", movie.name);
					} else {
						console.log(movie.name);

					}
					Movie.create({
						kinopoiskId: movie.id,
						country: movie.countries,
						duration: movie.isSeries ? movie.seriesLength : movie.movieLength,
						year: movie.year,
						description: movie.description,
						shortDescription: movie.shortDescription,
						image: movie.poster?.url,
						thumbnail: movie.poster?.previewUrl,
						nameRU: movie.name,
						nameEN: movie.alternativeName || movie.enName,
						serial: movie.isSeries,
						ratingKinopoisk: movie.rating.kp,
						genres: movie.genres,
						ageRating: movie.ageRating,
					}).catch((e) => {
						if (e.code === 11000) {
							console.log("film already exists", movie.name);
						} else {
							console.log("error new:", e, movie.name);
						}
					});
				});
			});
		} catch (err) {
			console.log(err, "error in fetching");
			throw err;
		}

		await new Promise((resolve) => setTimeout(resolve, 24 * 60 * 60 * 1000));
	}
};

module.exports = {
	fetchAndSavePeriodically,
};
