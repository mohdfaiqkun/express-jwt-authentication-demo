const User = require("../src/model/user");
const status = require("http-status");

// Signup handler
async function registerNewUser(req, res) {
  var user = new User();

  user.username = req.body.user.username;
  user.email = req.body.user.email;
  user.setPassword(req.body.user.password);

  await user.save();
  return res.json({ user: { username: user.username, email: user.email } });
}

//Login handler
async function login(req, res) {
  const email = req.body.user.email;
  const password = req.body.user.password;

  let user = await User.findOne({ email: email });

  if (!user || !user.validPassword(password)) {
    return res.status(status.UNAUTHORIZED).json({
      error: { message: "email or password is invalid" }
    });
  }

  const token = user.generateJWT();
  // TODO: we should also set "secure" option to true in the cookie, if our service supports HTTPS
  res.cookie("jwt", token, {
    httpOnly: true,
    sameSite: true
  });

  return res.json({
    user: { username: user.username, email: user.email }
  });
}

async function changePassword(req, res) {
  const userId = req.user.userid;
  const user = await User.findById(userId);

  const newUserProfile = req.body.user;
  try {
    if (newUserProfile.password) {
      user.setPassword(newUserProfile.password);
    }

    await user.save();
    return res.json({ status: "done" });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
}

async function logout(req, res) {
  res.clearCookie("jwt");
  res.json({ status: "done" });
}

module.exports = {
  registerNewUser,
  login,
  logout,
  changePassword
};
