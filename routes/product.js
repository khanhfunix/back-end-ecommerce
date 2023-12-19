const express = require("express");

const productController = require("../controllers/products");

const router = express.Router();

router.get("/", productController.getProducts);

router.get("/:productId", productController.getProduct);

router.get("/category/:category", productController.getProductsByCategory);

router.get("/search/:searchkey", productController.getProductsBySearchKey);

module.exports = router;
