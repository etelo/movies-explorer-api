const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

const NotFoundError = require("../errors/not-found-error");
const ValidationError = require("../errors/validation-error");
const СonflictError = require("../errors/сonflict-error");

const { JWT_SECRET, NODE_ENV } = process.env;

// POST /signin # проверяет переданные в теле почту и пароль # и возвращает JWT
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === "production" ? JWT_SECRET : "JWT_SECRET",
        {
          expiresIn: "7d",
        }
      );
      res.send({ token });
    })
    .catch(next);
};

// POST /signup # создаёт пользователя с переданными в теле # email, password и name
module.exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => {
      User.create({
        name,
        email,
        password: hash,
      })
        .then(
          (newUser) =>
            res.status(201).send({
              message: "Регистрация прошла успешно!",
              _id: newUser._id,
              email: newUser.email,
            })
          // eslint-disable-next-line function-paren-newline
        )
        .catch((err) => {
          if (err.code === 11000) {
            next(
              new СonflictError(
                "Пользователь с таким email уже существует в базе данных"
              )
            );
            return;
          }
          if (err.name === "ValidationError") {
            next(
              new ValidationError(
                `${Object.values(err.errors)
                  .map((error) => error.message)
                  .join(", ")}`
              )
            );
            return;
          }
          next(err);
        });
    })
    .catch(next);
};

// GET /users/me  # возвращает информацию о пользователе (email и имя)
module.exports.getUserMe = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        const error = new NotFoundError(
          `Пользователь по указанному _id:${userId} не найден.`
        );
        next(error);
      }
      res.status(200).send({ name: user.name, email: user.email });
    })
    .catch(next);
};

// PATCH /users/me  # обновляет информацию о пользователе (email и имя)
module.exports.updateUser = async (req, res, next) => {
  const { name, email } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        next(
          new NotFoundError(`Пользователь с указанным _id:${userId} не найден.`)
        );
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(
          new ValidationError(
            `${Object.values(err.errors)
              .map((error) => error.message)
              .join(", ")}`
          )
        );
      } else if (err.code === 11000) {
        next(
          new СonflictError(
            `Пользователь с указанным email (${email}) уже зарегистрирован, пожалуйста, выберите другой email.`
          )
        );
      }
      next(err);
    });
};
