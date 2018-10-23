const express = require("express");
const router = express.Router();
const handleAsyncError = require("express-async-wrap");
const userHandler = require("../handler/user_handler");
const jwt_validation = require("../middleware/jwt_middleware");

router.post("/signup", handleAsyncError(userHandler.registerNewUser));

router.post("/login", handleAsyncError(userHandler.login));

router.post("/logout", handleAsyncError(userHandler.logout));

router.put(
  "/change_password",
  jwt_validation.required,
  handleAsyncError(userHandler.changePassword)
);

module.exports = router;
