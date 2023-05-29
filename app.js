require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { errors } = require("celebrate");
const router = require("./routes/index");
const cors = require("./middlewares/cors");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const { hostDB, port } = require("./utils/config");

const { PORT, MONGO_URL, NODE_ENV } = process.env;

mongoose
  .connect(NODE_ENV === 'production' ? MONGO_URL : hostDB, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((error) => {
    console.log("Error connecting to database:", error);
  });

const app = express();
app.use(cors);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(router);

app.use(requestLogger);
app.use(errorLogger);
app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? "На сервере произошла ошибка" : message,
  });
  next();
});

app.listen(NODE_ENV === "production" ? PORT : port);
