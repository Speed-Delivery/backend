import { Jwt } from "jsonwebtoken";

const generateToken = (username) => {
  return Jwt.sign({ username }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};


export default generateToken;