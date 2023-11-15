const router = require("express").Router();
const { getCurrentUser, updateUserInfo, updatePassword } = require("../controllers/user");
const { changePasswordValidation } = require("../utils/validation/changePasswordValidation");
const {
	createUserValidation,
} = require("../utils/validation/createUserValidation");

router.get("/me", getCurrentUser);

router.patch("/me/password", changePasswordValidation, updatePassword);

router.patch("/me", createUserValidation, updateUserInfo);

module.exports = router;
