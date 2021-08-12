const jwt = require("express-jwt");
const secret = require("../../config/jwt").secret;

function getTokenFromCookie(req) {
  let token = null;
  if (req && req.cookies) token = req.cookies[jwt];
  return token;
}

module.exports = {
  required: jwt({
    secret: secret,
    userProperty: "user",
    getToken: getTokenFromCookie,
    algorithms: ["HS256"]
  })
};
