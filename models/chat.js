const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const chatSchema = new Schema(
  {
    chatLog: [
      {
        message: {
          type: String,
          require: true,
        },
        time: {
          type: Date,
          require: true,
        },
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User",
          require: true,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", chatSchema);
