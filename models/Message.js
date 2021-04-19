const { model, Schema } = require("mongoose");

const messageSchema = new Schema({
  from: String,
  to: String,
  body: String,
  createdAt: String,
});

module.exports = model("Message", messageSchema);
