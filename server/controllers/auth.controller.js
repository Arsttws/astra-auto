import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    next(errorHandler(400, "Заполните все поля"));
  }
  if (req.body.password.length < 8) {
    return next(
      errorHandler(400, "Пароль должен содержать минимум 8 символов")
    );
  }
  if (req.body.password.includes(" ")) {
    return next(errorHandler(400, "Пароль не должен содержать пробелы"));
  }
  if (!req.body.password.match(/^[a-zA-Z0-9#.?!@$%^&*-]+$/)) {
    return next(errorHandler(400, "Введите корректное значение пароля"));
  }
  const hashPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({ username, email, password: hashPassword });
  try {
    await newUser.save();
    res.json("Пользователь успешно зарегестрирован");
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email === "" || password === "") {
    next(errorHandler(400, "Заполните все поля"));
  }

  try {
    const ValidUser = await User.findOne({ email });
    if (!ValidUser) {
      return next(errorHandler(404, "Неверный логин или пароль"));
    }
    const ValidPassword = bcryptjs.compareSync(password, ValidUser.password);
    if (!ValidPassword) {
      return next(errorHandler(404, "Неверный логин или пароль"));
    }

    const token = jwt.sign(
      { id: ValidUser._id, isAdmin: ValidUser.isAdmin },
      process.env.SECRET_KEY,
      { expiresIn: "15d" }
    );

    const { password: pass, ...rest } = ValidUser._doc;

    res
      .status(200)
      .cookie("access_token", token, { httpOnly: true })
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const googleAuth = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.SECRET_KEY
      );
      const { password, ...rest } = user._doc;
      res
        .status(200)
        .cookie("access_token", token, { httpOnly: true })
        .json(rest);
    } else {
      const generatedPassword =
        Math.random.toString(36).slice(-8) + Math.random.toString(36).slice(-8);
      const hashPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          name.toLowerCase().split(" ").join("") +
          Math.random().toString(9).slice(-6),
        email,
        password: hashPassword,
        profileImg: googlePhotoUrl,
      });
      await newUser.save();
      const token = jwt.sign(
        { id: newUser._id, isAdmin: newUser.isAdmin },
        process.env.SECRET_KEY
      );
      const { password, ...rest } = newUser._doc;
      res
        .status(200)
        .cookie("access_token", token, { httpOnly: true })
        .json(rest);
    }
  } catch (error) {}
};
