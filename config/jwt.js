require("dotenv").config();

function getJWTSigningSecret() {
  const secret = process.env.JWT_SIGNING_SECRET;
  if (!secret) {
    throw new Error("Missing secrets to sign JWT token");
  }
  return secret;
}

module.exports = {
  secret: getJWTSigningSecret()
};
