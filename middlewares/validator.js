const { celebrate, Joi } = require("celebrate");
const validator = require("validator");
// eslint-disable-next-line no-unused-vars
const { ObjectId } = require("mongoose").Types;

exports.validateSignUp = celebrate({
  body: Joi.object().keys({
    email: Joi.string()
      .required()
      .custom((value, helpers) => {
        if (validator.isEmail(value)) {
          return value;
        }
        return helpers.message("Невалидный email");
      })
      .messages({
        "any.required": 'Поле "email" должно быть заполнено',
      }),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
  }),
});

exports.validateSignIn = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required().min(2),
    password: Joi.string().required().min(2),
  }),
});

exports.validateUpdate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email().min(2),
  }),
});

exports.validatedeleteMovieById = celebrate({
  params: Joi.object().keys({
    _id: Joi.string().required().hex().length(24),
  }),
});

exports.validateCreateMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().min(1),
    director: Joi.string().required().min(1),
    duration: Joi.number().required().min(1),
    year: Joi.string().required().min(1),
    description: Joi.string().required().min(1),
    image: Joi.string()
      .required()
      .custom((value, helpers) => {
        if (validator.isURL(value)) {
          return value;
        }
        return helpers.message("Поле изображения заполнено некорректно");
      }),
    trailerLink: Joi.string()
      .required()
      .custom((value, helpers) => {
        if (validator.isURL(value)) {
          return value;
        }
        return helpers.message(
          "Поле trailerLink изображения заполнено некорректно"
        );
      }),
    thumbnail: Joi.string()
      .required()
      .custom((value, helpers) => {
        if (validator.isURL(value)) {
          return value;
        }
        return helpers.message(
          "Поле thumbnail изображения заполнено некорректно"
        );
      }),
    nameRU: Joi.string().required().min(1),
    nameEN: Joi.string().required().min(1),
    movieId: Joi.number().required().min(1),
  }),
});

exports.validateUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email().min(2),
  }),
});
exports.validateSignUp = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().min(2),
    password: Joi.string().required().min(2),
    name: Joi.string().required().min(2).max(30),
  }),
});

exports.validateSignIn = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().min(2),
    password: Joi.string().required().min(2),
  }),
});
