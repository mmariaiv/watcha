const router = require("express").Router();

const { getRandomMovies, getSpecialList } = require("../controllers/movies");
const {
	getRandomMovieValidation,
} = require("../utils/validation/getRandomMovieValidations");
const {
	getSpecialListValidation,
} = require("../utils/validation/getSpecialListValidation");

router.get("/list/", getSpecialListValidation, getSpecialList);

router.get("/:count", getRandomMovieValidation, getRandomMovies);

module.exports = router;
