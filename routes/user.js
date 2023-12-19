const express = require("express");
const { body } = require("express-validator");

const userController = require("../controllers/user");
const User = require("../models/user");

const router = express.Router();

router.put(
  "/signup",
  [
    body("fullName").trim().notEmpty(),
    body("email")
      .isEmail()
      .withMessage("Please enter a valid Email")
      .custom((value, req) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject(
              "Email already exist, please choose another email"
            );
          }
        });
      }),

    body("password").trim().isLength({ min: 8 }),
    body("phoneNumber").trim().notEmpty(),
  ],
  userController.signup
);

router.post("/login", userController.login);

module.exports = router;
