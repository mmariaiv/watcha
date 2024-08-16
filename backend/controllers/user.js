const User = require("../models/user");
const bcrypt = require("bcryptjs");
const Movie = require("../models/movies");
const NotFoundError = require("../errors/notFoundError");
const ValidationError = require("../errors/validationError");
const ConflictError = require("../errors/conflictError");

module.exports.getCurrentUser = (req, res, next) => {
	User.findById(req.user._id)
		.then((user) => {
			if (!user) {
				throw new NotFoundError("Пользователь с таким id не найден");
			} else {
				res.status(200).send({
					email: user.email,
					name: user.name,
					_id: user._id,
				});
			}
		})
		.catch((err) => {
			if (err.name === "CastError") {
				next(new ValidationError("Был передан некорректный id"));
			} else {
				next(err);
			}
		});
};

module.exports.updatePassword = (req, res, next) => {
	if (!req.body.password) {
		throw new ValidationError(
			"Переданы неккоректные данные в метод обновления пароля"
		);
	}

	bcrypt.hash(req.body.password, 10).then((hash) => {
		console.log(hash);
		console.log(req.body.password);
		User.findByIdAndUpdate(
			req.user._id,
			{ password: hash },
			{
				new: true,
				runValidators: true,
			}
		)
			.then((user) => {
				res.status(200).send({
					_id: user._id,
					name: user.name,
				});
			})
			.catch((err) => {
				if (err.name === "CastError") {
					next(new ValidationError("Переданы неккоректные данные"));
				} else if (err.name === "ValidationError") {
					next(
						new ValidationError(
							"Переданы неккоректные данные при смене информации о пользователе"
						)
					);
				} else if (err.code === 11000) {
					next(new ConflictError("Этот email уже занят"));
				} else {
					next(err);
				}
			});
	});
};

module.exports.updateUserInfo = (req, res, next) => {
	if (!req.body.name && !req.body.email) {
		throw new ValidationError(
			"Переданы неккоректные данные в методы обновления профиля пользователя"
		);
	}

	const newData = {};

	if (req.body.name) {
		const { name } = req.body;

		newData.name = name;
	}

	if (req.body.email) {
		const { email } = req.body;

		newData.email = email;
	}

	User.findByIdAndUpdate(req.user._id, newData, {
		new: true,
		runValidators: true,
	})
		.then((user) => {
			res.status(200).send({
				email: user.email,
				name: user.name,
				_id: user._id,
			});
		})
		.catch((err) => {
			if (err.name === "CastError") {
				next(new ValidationError("Переданы неккоректные данные"));
			} else if (err.name === "ValidationError") {
				next(
					new ValidationError(
						"Переданы неккоректные данные при смене информации о пользователе"
					)
				);
			} else if (err.code === 11000) {
				next(new ConflictError("Этот email уже занят"));
			} else {
				next(err);
			}
		});
};

module.exports.addMovieToFavourite = (req, res, next) => {
	const {movieId} = req.body;

	if (!movieId ) {
		throw new ValidationError(
			"Не передан id сохраняемого фильма"
		);
	}

	User.findById(req.user._id)
		.then((user) => {
			if (!user) {
				throw new NotFoundError('Пользователь не найден');
			}
			if (user.saved.includes(movieId)) {
				return res.status(400).send({message: 'Фильм уже был добавлен в избранное'});
			}

			user.saved.push(movieId);

			return user.save().then((updatedUser) => {
				res.status(200).send({
					saved: updatedUser.saved,
				});
			});
		}).catch((err) => {
			if (err.name === 'CastError') {
				next(new ValidationError('Передан неккоректный ID фильма'))
			} else {
				next(err);
			}
	})
}

module.exports.removeMovieFromFavourite = (req, res, next) => {
	const {movieId} = req.body;

	if (!movieId) {
		throw new ValidationError('Не передан id фильма');
	}

	User.findById(req.user._id)
		.then((user) => {
			if (!user) {
				throw new NotFoundError('Пользователь не найден');
			}

			if (!user.saved.includes(movieId)) {
				throw new NotFoundError('Фильм не найден в избранном')
			}

			user.saved.pull(movieId);

			return user.save().then((updatedUser) => {
				res.status(200).send({
					saved: updatedUser.saved,
				})
			})
		}).catch((err) => {
			if (err.name === 'CastError') {
				next(new ValidationError('Передан некорректный id фильма'));
			} else {
				next(err);
			}
	})
}

module.exports.getFavourites = (req, res, next) => {
	User.findById(req.user._id)
		.populate('saved')
		.then((user) => {
			if (!user) {
				throw new NotFoundError('Пользователь не найден');
			}

			res.status(200).send({
				movies: user.saved
			});
		}).catch((err) => {
			console.log(err);
			next(err);
		})
}
