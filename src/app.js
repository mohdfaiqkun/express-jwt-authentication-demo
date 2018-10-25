require("dotenv").config();

const express = require("express"),
  bodyParser = require("body-parser"),
  cookieParser = require("cookie-parser"),
  cors = require("cors"),
  errorhandler = require("errorhandler"),
  status = require("http-status"),
  morgan = require("morgan"),
  logger = require("./logger");

const mongoose = require("mongoose");
const { passport } = require("./middleware/passport_middleware");

const isProduction = process.env.NODE_ENV === "production";

const app = express();

// middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(passport.initialize());

if (process.env.NODE_ENV === "development") {
  app.use(errorhandler());
}

const isMongooseConnectionProvided = process.env.NODE_ENV === "integration";

if (!isMongooseConnectionProvided) {
  mongoose.connect(process.env.MONGODB_URL);
}

// routes
const indexRouter = require("./routes/index");
const userRouter = require("./routes/user_api");

app.use("/", indexRouter);
app.use("/api/user", userRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error("Not Found");
  err.status = status.NOT_FOUND;
  next(err);
});

// default error handler

if (!isProduction) {
  // eslint-disable-next-line no-unused-vars
  app.use(function(err, req, res, next) {
    // return more information for trouble shooting if we are not running in production
    if (err.stack) {
      logger.error(err.stack);
    }

    res.status(err.status || status.INTERNAL_SERVER_ERROR);

    res.json({
      error: {
        message: err.message
      }
    });
  });
}

// eslint-disable-next-line no-unused-vars
app.use(function(err, req, res, next) {
  res.status(err.status || status.INTERNAL_SERVER_ERROR);
  res.json({
    error: {
      message: err.message
    }
  });
});

module.exports = app;
