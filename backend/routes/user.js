const router = require("express").Router();
const { getCurrentUser, updateUserInfo, updatePassword, addMovieToFavourite, removeMovieFromFavourite, getFavourites} = require("../controllers/user");
const { changePasswordValidation } = require("../utils/validation/changePasswordValidation");
const {
	createUserValidation,
} = require("../utils/validation/createUserValidation");
const {addMovieToFavouriteValidation} = require("../utils/validation/addMovieToFavouriteValidation");

router.get("/me", getCurrentUser);

router.get("/me/favourites", getFavourites);

router.patch("/me/password", changePasswordValidation, updatePassword);

router.patch("/me", createUserValidation, updateUserInfo);

router.post('/me/favourites', addMovieToFavouriteValidation, addMovieToFavourite);

router.delete('/me/favourites', addMovieToFavouriteValidation, removeMovieFromFavourite);

module.exports = router;
