const { model, Schema } = require("mongoose");

const userSchema = new Schema({
  username: String,
  password: String,
  email: String,
  createdAt: String,
  born: String,
  livesIn: String,
  isFrom: String,
  graduatedAt: String,
});

module.exports = model("User", userSchema);
