const Router = require("express").Router();
const { validateUpdateUser } = require("../middlewares/validator");
const { updateUser, getUserMe } = require("../controllers/users");

Router.get("/me", getUserMe);
Router.patch("/me", validateUpdateUser, updateUser);

module.exports = Router;
