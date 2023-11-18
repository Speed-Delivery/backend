const Jwt = require("jsonwebtoken");

const generateToken = (userId, role) => {
  return Jwt.sign({ userId, role }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = generateToken; // Make sure this line is present
