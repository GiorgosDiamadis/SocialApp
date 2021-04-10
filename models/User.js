const { model, Schema, Mongoose } = require("mongoose");

const userSchema = new Schema({
  username: String,
  password: String,
  email: String,
  createdAt: String,
  born: String,
  livesIn: String,
  isFrom: String,
  graduatedAt: String,
  friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

module.exports = model("User", userSchema);
