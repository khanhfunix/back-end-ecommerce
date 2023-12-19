const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      res
        .status(200)
        .json({ message: "Fetched products sucessfully!!", result: products });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode === 500;
      }
      next(err);
    });
};

exports.getProduct = (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .then((product) => {
      res
        .status(200)
        .json({ message: "Fetch product sucessfully!!", result: product });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode === 500;
      }
      next(err);
    });
};

exports.getProductsByCategory = (req, res, next) => {
  const category = req.params.category;

  Product.find({ category: category })
    .then((products) => {
      res
        .status(200)
        .json({ message: "Fetched products successfully", result: products });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode === 500;
      }
      next(err);
    });
};

exports.getProductsBySearchKey = (req, res, next) => {
  const searchKey = req.params.searchkey;

  Product.find()
    .then((products) => {
      console.log(products[0].name.toLowerCase().replace(/\s/g, "", searchKey));
      const filterProducts = products.filter((product) => {
        return product.name
          .toLowerCase()
          .replace(/\s/g, "")
          .includes(searchKey);
      });

      res.json({ message: "fetched Search!!!", result: filterProducts });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode === 500;
      }
      next(err);
    });
};
