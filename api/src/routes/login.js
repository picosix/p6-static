const jwt = require("jsonwebtoken");
const util = require("util");

const { auth } = require("../settings");
const sign = util.promisify(jwt.sign);

module.exports = async (req, res, next) => {
  const { username, password } = req.body;

  if (auth.username !== username || auth.password !== password) {
    return res.status(400).send();
  }

  const token = await sign(
    {
      data: { username }
    },
    auth.secreteKey,
    { expiresIn: "120d" }
  );
  return res.json({ token });
};
