const express = require("express");

const adminControllers = require("../controllers/admin");
const { body } = require("express-validator");
const isAuth = require("../middlewares/is-auth");

const router = express.Router();

router.post(
  "/login",

  adminControllers.login
);

router.get("/info", isAuth, adminControllers.getInfo);

router.put("/add-product", isAuth, adminControllers.addProduct);

module.exports = router;
