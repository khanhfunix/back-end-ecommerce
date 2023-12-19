const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    fullName: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    phoneNumber: {
      type: String,
      require: true,
    },
    address: {
      type: String,
      require: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    cart: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          require: true,
        },
        name: { type: String, require: true },
        image: { type: String, require: true },
        price: { type: Number, require: true },
        quantity: { type: Number, require: true },
        totalPrice: { type: Number, require: true },
      },
    ],
    totalPrice: {
      type: Number,
      require: true,
    },
    delivery: { type: String, require: true },
    status: { type: String, require: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
