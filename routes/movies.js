const Router = require("express").Router();
const {
  validateCreateMovie,
  validatedeleteMovieById,
} = require("../middlewares/validator");
const {
  getMovies,
  createMovie,
  deleteMovieById,
} = require("../controllers/movies");

Router.get("/", getMovies);
Router.post("/", validateCreateMovie, createMovie);
Router.delete("/:_id", validatedeleteMovieById, deleteMovieById);

module.exports = Router;
