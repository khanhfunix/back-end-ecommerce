const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
    },
    images: [
      {
        type: String,
        require: true,
      },
    ],
    category: {
      type: String,
      require: true,
    },
    long_desc: {
      type: String,
      require: true,
    },
    short_desc: {
      type: String,
      require: true,
    },
    price: {
      type: String,
      require: true,
    },
    count: {
      type: Number,
      require: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
