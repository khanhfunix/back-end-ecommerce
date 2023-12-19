const express = require("express");
const { body } = require("express-validator");

const orderControllers = require("../controllers/order");
const isAuth = require("../middlewares/is-auth");

const router = express.Router();

router.put(
  "/create",
  [
    body("fullName").trim().notEmpty(),
    body("email").isEmail().normalizeEmail(),
    body("phoneNumber").trim().notEmpty(),
    body("address").trim().notEmpty(),
    body("cart").isArray({ min: 1 }),
  ],
  isAuth,
  orderControllers.createOrder
);

router.get("/", orderControllers.getOrders);
router.get("/:orderId", orderControllers.getOrder);

module.exports = router;
