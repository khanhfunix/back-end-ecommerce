const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.signup = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("Validation Fail");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const fullName = req.body.fullName;
  const email = req.body.email;
  const password = req.body.password;
  const phoneNumber = req.body.phoneNumber;
  const type = req.body.type;
  bcrypt
    .hash(password, 12)
    .then((hashedpassword) => {
      const user = new User({
        fullName,
        email,
        password: hashedpassword,
        phoneNumber,
        type,
      });
      return user.save();
    })
    .then((result) => {
      res
        .status(201)
        .json({ message: "Creating User Successfully!!!", userId: result._id });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode === 500;
      }
      next(err);
    });
};

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        const error = new Error("Wrong email");
        error.statusCode = 401;
        throw error;
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((isEqual) => {
      console.log(isEqual, "61");
      if (!isEqual) {
        const error = new Error("Wrong password");
        error.statusCode = 401;
        throw error;
      }
      const token = jwt.sign(
        {
          email: loadedUser.email,
          userId: loadedUser._id.toString(),
        },
        "very very very secret",
        { expiresIn: "1h" }
      );
      res.status(200).json({
        token,
        userId: loadedUser._id.toString(),
        fullName: loadedUser.fullName,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode === 500;
      }
      next(err);
    });
};
