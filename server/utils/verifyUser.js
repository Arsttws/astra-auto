import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next(errorHandler(401, "Войдите в аккаунт"));
  }
  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) {
      return next(errorHandler(401, "Войдите в аккаунт"));
    }
    req.user = user;
    next();
  });
};
