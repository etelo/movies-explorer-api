const Router = require("express").Router();
const NotFoundError = require("../errors/not-found-error");

const auth = require("../middlewares/auth");

const userRouter = require("./users");
const moviesRouter = require("./movies");

const { validateSignUp, validateSignIn } = require("../middlewares/validator");

const { login, createUser } = require("../controllers/users");

Router.post("/signup", validateSignUp, createUser);
Router.post("/signin", validateSignIn, login);
Router.use(auth);

Router.use("/users", userRouter);
Router.use("/movies", moviesRouter);

Router.use("*", (req, res, next) => {
  next(new NotFoundError("Такая страница не существует"));
});

module.exports = Router;
