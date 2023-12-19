const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const path = require("path");

const User = require("../models/user");
const Order = require("../models/order");

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;
  User.findOne({ email: email, type: "ADMIN" })
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
      console.log(loadedUser);
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

exports.getInfo = (req, res, next) => {
  console.log("fetch");
  Order.find()
    .then((orders) => {
      const totalEarning = orders.reduce((total, e) => {
        return total + e.totalPrice;
      }, 0);
      const totalOrder = orders.length;
      User.find({ type: "USER" }).then((users) => {
        res.status(200).json({
          message: "fetched info sucessfully",
          result: {
            totalUser: users.length,
            totalEarning,
            totalOrder,
            totalBalance: totalEarning,
          },
        });
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode === 500;
      }
      next(err);
    });
};

exports.addProduct = (req, res, next) => {
  const name = req.body.name;
  const category = req.body.category;
  const long_desc = req.body.long_desc;
  const short_desc = req.body.short_desc;
  const price = req.body.price;
  const count = req.body.count;
  console.log(req.body);
  // const images = req.file.path.replace("\\", "/");
  console.log(images);
};
