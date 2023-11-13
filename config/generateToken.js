const Jwt = require("jsonwebtoken")

const generateToken = (userId) => {
  return Jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = generateToken;