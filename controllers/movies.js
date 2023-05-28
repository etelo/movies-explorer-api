/* eslint-disable max-len */
const Movie = require("../models/movie");
const NotFoundError = require("../errors/not-found-error");
const ForbiddenError = require("../errors/forbidden-error");
const ValidationError = require("../errors/validation-error");

// GET /movies # возвращает все сохранённые текущим  пользователем фильмы
module.exports.getMovies = async (req, res, next) => {
  // console.log({ owner: req.user._id });
  Movie.find({ owner: req.user._id })
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch(next);
};

// POST /movies # создаёт фильм с переданными в теле # country, director, duration, year, description, image, trailer, nameRU, nameEN и thumbnail, movieId
module.exports.createMovie = async (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  // console.log("request.body: ", request.body);
  const owner = req.user._id;

  return Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner,
  })
    .then((movie) => res.status(201).send(movie))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(
          new ValidationError(
            "Переданы некорректные данные при создании карточки фильма."
          )
        );
        return;
      }
      next(err);
    });
};

// DELETE /movies/_id # удаляет сохранённый фильм по id
module.exports.deleteMovieById = async (req, res, next) => {
  const { _id } = req.params;
  const ownerId = req.user._id;

  Movie.findById(_id)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError(`Фильм с указанным id:${_id} не найдена`);
      }
      if (movie.owner.toString() !== ownerId) {
        throw new ForbiddenError("Чужая карточка фильма не может быть удалена");
      }

      return movie;
    })
    .then((movie) => {
      Movie.deleteOne({ _id: movie._id }).then(() => {
        res.status(200).send({ message: "Фильм удален" });
      });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(
          new ValidationError(
            "Переданы некорректные данные для удаления карточки фильма."
          )
        );
        return;
      }
      next(err);
    });
};
