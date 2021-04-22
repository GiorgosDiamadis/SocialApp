const { model, Schema } = require("mongoose");

const messageSchema = new Schema({
  sender: String,
  receiver: String,
  body: String,
  createdAt: String,
});

module.exports = model("Message", messageSchema);
