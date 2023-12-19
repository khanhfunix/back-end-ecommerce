const path = require("path");
const fs = require("fs");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const helmet = require("helmet");
const compression = require("compression");

const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");
const adminRoutes = require("./routes/admin");

const User = require("./models/user");

const { config } = require("dotenv");
config();

const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@learndb.vrphnut.mongodb.net/${process.env.MONGO_DEFAULT_DATA}`;

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4());
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(cors());
app.use(bodyParser.json());
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("images")
);

app.use("/user", userRoutes);
app.use("/product", productRoutes);
app.use("/order", orderRoutes);
app.use("/admin", adminRoutes);

app.use(helmet());
app.use(compression());

app.use((error, req, res) => {
  const statusCode = error.statusCode || 404;
  const message = error.message || "Not Found";
  const data = error.data || "";
  console.log(error.message, "error Handling");
  res.status(statusCode).json({ message: message, data: data });
});

const adminUser = "admin@test.com";
const chatUser = "chat@test.com";
mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    User.find().then((users) => {
      const haveAdmin = users.find((user) => {
        return user.email === adminUser;
      });
      const haveChat = users.find((user) => {
        return user.email === chatUser;
      });

      if (!haveAdmin) {
        bcrypt.hash(adminUser, 12).then((hashedPassword) => {
          const newAdminUser = new User({
            name: "admin",
            email: adminUser,
            password: hashedPassword,
            type: "ADMIN",
            phoneNumber: "00000000",
            fullName: "admin",
          });
          newAdminUser.save();
        });
      }
      if (!haveChat) {
        bcrypt.hash(chatUser, 12).then((hashedPassword) => {
          const newChatUser = new User({
            name: "chat",
            email: chatUser,
            password: hashedPassword,
            type: "CHAT",
            phoneNumber: "00000000",
            fullName: "chat",
          });
          newChatUser.save();
        });
      }
      app.listen(process.env.PORT || 5000);
    });
  })
  .catch((err) => console.log(err));
