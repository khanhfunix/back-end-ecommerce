const { validationResult } = require("express-validator");
const nodemailer = require("nodemailer");

const Order = require("../models/order");
const User = require("../models/user");
const Product = require("../models/product");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "khanhlnfx20736@funix.edu.vn",
    pass: "Chacchanfc123",
  },
});

exports.createOrder = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("Validation fail");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const fullName = req.body.fullName;
  const email = req.body.email;
  const phoneNumber = req.body.phoneNumber;
  const address = req.body.address;
  const user = req.body.userId;
  const cart = req.body.cart;
  const totalPrice = req.body.totalPrice;

  const order = new Order({
    fullName,
    email,
    phoneNumber,
    address,
    user,
    cart,
    totalPrice,
    status: "Waiting for pay",
    delivery: "Waiting for progressing",
  });
  order
    .save()
    .then((order) => {
      for (let i = 0; i < order.cart.length; i++) {
        Product.findById(order.cart[i].productId).then((product) => {
          product.count = product.count - order.cart[i].quantity;
          product.save();
        });
      }
      User.findById(user)
        .then((user) => {
          user.orders.push(order._id);
          return user.save();
        })
        .then((result) => {
          return transporter.sendMail(
            {
              from: "khanhtest.code@gmail.com",
              to: order.email,
              subject: "E-Commerce placed order",
              html: `  <h1>Congragulation ${order.fullName}</h1>
              <p>Phone: ${order.phoneNumber}</p>
              <p>Address: ${order.address}</p>
              <table>
              <tr>
              <th>Product</th>
              <th>Image</th>
              <th>Quantity</th>
              <th>Price</th>
              </tr>
              ${order.cart.map((e) => {
                return `<tr key=${e._id}>
                    <td>${e.name}</td>
                    <td>
                      <img src=${e.image} width="50"></img>
                    </td>
                    <td>${e.quantity}</td>
                    <td>${e.price.toLocaleString("de-DE")} VND</td>
                  </tr>`;
              })}
              </table>
              <h2>Total Price : </h2>
              <h2>${order.totalPrice.toLocaleString("de-DE")} VND</h2>
              <style>
              th, td {
                padding: 15px;
                text-align: left;
              };
              th {
                background-color: #04AA6D;
                color: white;
              };
              tr:nth-child(even) {background-color: #f2f2f2;}
              </style>`,
            },
            (error, info) => {
              if (error) {
                console.log(error);
              } else {
                console.log("Email sent: " + info.response);
              }
            }
          );
        })
        .then((result) => {
          res
            .status(201)
            .json({ message: "Placing Order Successfully!!!", result: order });
        });
    })

    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getOrders = (req, res, next) => {
  Order.find()
    .then((orders) => {
      res.status(200).json({
        message: "Fetched orders sucessfully!",
        result: orders,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getOrder = (req, res, next) => {
  const orderId = req.params.orderId;
  Order.findById(orderId)
    .then((order) => {
      res
        .status(200)
        .json({ message: "Fetched order sucessfully!", result: order });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
