import jwt from "jsonwebtoken";
const SECRET_KEY = "123456789";
const expiresIn = "1d";

export const createToken = (payload) => {
  return jwt.sign(payload, SECRET_KEY, {
    expiresIn,
  });
};

export const verifyToken = (token) => {
  return jwt.verify(token, SECRET_KEY, (err, decode) => {
    return decode;
  });
};
